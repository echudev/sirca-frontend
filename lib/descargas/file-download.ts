/**
 * @file Utilidades para la generación y descarga de archivos CSV y Excel.
 * @description Proporciona funciones para formatear datos crudos de la base de datos
 * en archivos descargables, aplicando reglas de negocio sobre columnas y decimales.
 * @author Ezequiel Maranda
 * @version 1.3.0
 * @since 2026-03-11
 */

import ExcelJS from "exceljs";
import type { FiltrosType } from "@/app/(main)/descargas/components/filters";
import {
  locationOptions,
  promedioOptions,
} from "@/app/(main)/descargas/components/filters";
import type { DataRow } from "@/hooks/useFetchDescargas";
import { TABLE_CONFIG } from "./config";

// Listas de columnas numéricas agrupadas por cantidad de decimales
const ONE_DECIMAL_COLUMNS = new Set<string>([
  // Ejemplo: variables meteorológicas, se pueden ajustar si es necesario
  "dv",
  "vv",
  "temp",
  "hr",
  "pa",
  "uv",
  "lluvia",
  "rs",
]);

// Resto de contaminantes con 2 decimales
const TWO_DECIMAL_COLUMNS = new Set<string>([
  "no",
  "no2",
  "nox",
  "so2",
  "o3",
  "pm10",
  "pm25",
]);

// CO con 3 decimales
const THREE_DECIMAL_COLUMNS = new Set<string>(["co"]);

// Umbral de respaldo horario: 45 minutos válidos = 75% de la hora.
const MIN_K_MINUTES_PER_HOUR = 45;

// Relleno para resaltar promedios validados con respaldo insuficiente.
const LOW_COVERAGE_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFEB9C" },
};

// Mapa métrica -> tabla de origen, para ubicar el conteo de minutos válidos.
const METRIC_TO_TABLE = new Map<string, string>();
Object.entries(TABLE_CONFIG).forEach(([tableKey, config]) => {
  config.metrics.forEach((metric) => {
    METRIC_TO_TABLE.set(metric.replace("_mean", ""), tableKey);
  });
});

/**
 * Determina la integración: usa la recibida o la infiere de los campos presentes.
 * La consulta horaria trae series `_raw` y conteos `_k_status`; la minutal sólo `_status`.
 */
function resolveIntegration(data: DataRow[], integration?: string): string {
  if (integration) return integration;

  const fields = new Set<string>();
  data?.forEach((row) => {
    Object.keys(row).forEach((key) => {
      fields.add(key);
    });
  });

  const fieldList = Array.from(fields);
  if (fieldList.some((f) => f.endsWith("_k_status") || f.endsWith("_raw"))) {
    return "hour";
  }
  return fieldList.some((f) => f.endsWith("_status")) ? "minute" : "hour";
}

// Hoja de destino de las columnas: "crudos" lleva las series _raw, "validados"
// las series validadas (sólo minutos k) y "all" ambas (CSV).
type SheetVariant = "all" | "crudos" | "validados";

/**
 * Genera el listado de columnas ordenadas basándose en la configuración global (TABLE_CONFIG).
 *
 * @param data Los datos crudos obtenidos de la consulta.
 * @param integration Opcional. Tipo de promedio para determinar los sufijos de las columnas de estado.
 * @param variant Hoja de destino de las columnas.
 * @returns Array de strings con los nombres de las columnas en el orden correcto.
 */
function getOrderedColumns(
  data: DataRow[],
  integration?: string,
  variant: SheetVariant = "all",
): string[] {
  const allFields = new Set<string>();

  // Collect all fields from data first
  if (data && data.length > 0) {
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "time" && key !== "location") {
          allFields.add(key);
        }
      });
    });
  }

  const inferIntegration = resolveIntegration(data, integration);

  // Generar orden de columnas basado en TABLE_CONFIG
  const orderedFields: string[] = [];
  const seen = new Set<string>();
  // Campos que pertenecen a TABLE_CONFIG aunque no vayan en esta hoja: evita
  // que el arrastre final los agregue como "extras" en la hoja equivocada.
  const known = new Set<string>();

  const push = (field: string) => {
    if (!seen.has(field)) {
      orderedFields.push(field);
      seen.add(field);
    }
  };

  Object.entries(TABLE_CONFIG).forEach(([tableKey, config]) => {
    // Agregar métricas de cada tabla
    config.metrics.forEach((metric) => {
      const fieldName = metric.replace("_mean", "");
      const rawField = `${fieldName}_raw`;
      known.add(fieldName);
      known.add(rawField);

      if (inferIntegration === "hour") {
        if (variant !== "crudos") push(fieldName);
        if (variant !== "validados") push(rawField);
      } else {
        push(fieldName);
      }
    });

    // Agregar campos de estado de cada tabla según el tipo de integración:
    // la horaria trae los status observados y el conteo de minutos k; la
    // minutal sólo el status del minuto.
    const statusField = `${tableKey}_status`;
    const kCountField = `${tableKey}_k_status`;
    known.add(statusField);
    known.add(kCountField);

    if (variant !== "validados") {
      push(statusField);
      if (inferIntegration === "hour") {
        push(kCountField);
      }
    }
  });

  // Agregar cualquier campo adicional que no esté en TABLE_CONFIG
  allFields.forEach((field) => {
    if (seen.has(field) || known.has(field)) return;
    if (
      variant === "validados" &&
      (field.endsWith("_status") || field.endsWith("_raw"))
    ) {
      return;
    }
    push(field);
  });

  return orderedFields;
}

/**
 * Genera un nombre de archivo descriptivo basado en los filtros aplicados.
 *
 * @param filters Filtros de búsqueda (estación, fecha, integración).
 * @param extension Extensión del archivo deseada ("csv" o "xlsx").
 * @returns Nombre del archivo formateado.
 */
export function generateFilename(
  filters: FiltrosType,
  extension: "csv" | "xlsx",
): string {
  const locationLabel =
    locationOptions.find((opt) => opt.value === filters.location)?.label ||
    filters.location;
  const integrationLabel =
    promedioOptions.find((opt) => opt.value === filters.integration)?.label ||
    filters.integration;

  const locationSlug = locationLabel.toLowerCase().replace(/\s+/g, "_");
  const integrationSlug = integrationLabel.toLowerCase().replace(/\s+/g, "_");

  let dateRange = "";
  if (filters.startDate && filters.endDate) {
    const start = filters.startDate.toISOString().split("T")[0];
    const end = filters.endDate.toISOString().split("T")[0];
    dateRange = `${start}_${end}`;
  } else if (filters.startDate) {
    dateRange = filters.startDate.toISOString().split("T")[0];
  }

  const parts = ["descargas", locationSlug, integrationSlug, dateRange].filter(
    Boolean,
  );

  return `${parts.join("_")}.${extension}`;
}

/**
 * Formatea un valor individual para su correcta inclusión en una fila de CSV.
 * Maneja el escape de comillas, comas y saltos de línea según el estándar RFC 4180.
 *
 * @param value Valor crudo (número, string o nulo).
 * @returns Valor formateado como string seguro para CSV.
 */
function formatCSVValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // Si contiene comas, comillas o saltos de línea, envolver en comillas
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    // Escapar comillas dobles duplicándolas
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Formatea una fecha ISO a un formato local legible (es-AR).
 *
 * @param dateString Fecha en formato string ISO.
 * @returns Fecha y hora formateada (DD/MM/AAAA, HH:mm).
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Orquestador para descargar los datos en formato CSV.
 *
 * @param data Array de objetos con las filas de datos.
 * @param filename Nombre que tendrá el archivo descargado.
 * @param integration Opcional. Ayuda a normalizar las columnas de estado.
 */
export function downloadAsCSV(
  data: DataRow[],
  filename: string,
  integration?: string,
): void {
  if (!data || data.length === 0) {
    throw new Error("No hay datos para descargar");
  }

  // Obtener todas las columnas ordenadas según TABLE_CONFIG
  const columns = getOrderedColumns(data, integration);
  const headers = [
    "Fecha y Hora",
    ...columns.map((col) => {
      if (col === "catalinas") return "La Boca";
      return col.charAt(0).toUpperCase() + col.slice(1);
    }),
  ];

  // Crear líneas CSV
  const csvLines: string[] = [headers.map(formatCSVValue).join(",")];

  // Agregar filas de datos
  data.forEach((row) => {
    const values = [
      formatDate(row.time),
      ...columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "s/d";
        }
        if (value === "k" || value === "i") {
          return String(value).toUpperCase();
        }
        if (typeof value === "number") {
          return Number(value).toFixed(3);
        }
        return String(value);
      }),
    ];
    csvLines.push(values.map(formatCSVValue).join(","));
  });

  const csvContent = csvLines.join("\n");

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Nombre base de una columna: las series _raw heredan el de su métrica. */
function baseColumnName(col: string): string {
  return col.endsWith("_raw") ? col.slice(0, -"_raw".length) : col;
}

/**
 * Indica si el promedio validado de esa celda se construyó con menos de
 * 45 minutos con status k (75% de la hora).
 */
function hasLowKCoverage(row: DataRow, column: string): boolean {
  const tableKey = METRIC_TO_TABLE.get(column);
  if (!tableKey) return false;
  const kCount = row[`${tableKey}_k_status`];
  return (
    typeof kCount === "number" &&
    kCount < MIN_K_MINUTES_PER_HOUR &&
    typeof row[column] === "number"
  );
}

interface WorksheetOptions {
  /** Muestra las columnas _raw con el nombre base de su métrica (hoja crudos). */
  stripRawSuffix?: boolean;
  /** Resalta la celda cuando el predicado da true (hoja validados). */
  highlightCell?: (row: DataRow, column: string) => boolean;
}

/**
 * Helper interno para volcar datos y aplicar estilos básicos a una hoja de ExcelJS.
 *
 * @param worksheet Instancia de la hoja de Excel.
 * @param data Datos a insertar.
 * @param columns Lista de columnas a incluir en esta hoja.
 * @param options Ajustes de encabezados y resaltado propios de cada hoja.
 */
function addDataToWorksheet(
  worksheet: ExcelJS.Worksheet,
  data: DataRow[],
  columns: string[],
  options: WorksheetOptions = {},
) {
  // Agregar encabezados
  const headers = [
    "Fecha y Hora",
    ...columns.map((col) => {
      const name = options.stripRawSuffix ? baseColumnName(col) : col;
      if (name === "catalinas") return "La Boca";
      return name.charAt(0).toUpperCase() + name.slice(1);
    }),
  ];
  worksheet.addRow(headers);

  // Estilizar encabezados
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Agregar filas de datos
  data.forEach((row) => {
    const values: (string | number)[] = [
      formatDate(row.time),
      ...columns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "s/d";
        }
        if (value === "k" || value === "i") {
          return String(value).toUpperCase();
        }
        if (typeof value === "number") {
          // Determinar decimales según la columna
          const baseCol = baseColumnName(col);
          let decimals = 1;
          if (THREE_DECIMAL_COLUMNS.has(baseCol)) {
            decimals = 3;
          } else if (TWO_DECIMAL_COLUMNS.has(baseCol)) {
            decimals = 2;
          } else if (ONE_DECIMAL_COLUMNS.has(baseCol)) {
            decimals = 1;
          }
          return Number(value.toFixed(decimals));
        }
        return String(value);
      }),
    ];
    const excelRow = worksheet.addRow(values);

    if (options.highlightCell) {
      columns.forEach((col, index) => {
        if (options.highlightCell?.(row, col)) {
          excelRow.getCell(index + 2).fill = LOW_COVERAGE_FILL;
        }
      });
    }
  });

  // Ajustar ancho de columnas
  worksheet.getColumn(1).width = 20; // Fecha y Hora / time
  columns.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = 15;
  });
}

/**
 * Orquestador para descargar los datos en formato Excel (.xlsx).
 * Crea dos hojas: "crudos" (promedio de todos los minutos más los status
 * observados) y "validados" (promedio sólo de minutos con status k; en la
 * integración horaria se resaltan las horas con menos de 45 minutos válidos).
 *
 * @param data Array de objetos con las filas de datos.
 * @param filename Nombre que tendrá el archivo descargado.
 * @param integration Opcional. Ayuda a normalizar las columnas de estado.
 */
export async function downloadAsExcel(
  data: DataRow[],
  filename: string,
  integration?: string,
): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error("No hay datos para descargar");
  }

  const resolvedIntegration = resolveIntegration(data, integration);

  // Crear workbook
  const workbook = new ExcelJS.Workbook();

  // Primera worksheet: "crudos". En la integración horaria lleva las series
  // _raw (mostradas con su nombre base) junto a los status observados y el
  // conteo de minutos válidos de cada hora.
  const crudosColumns = getOrderedColumns(data, resolvedIntegration, "crudos");
  const crudosWorksheet = workbook.addWorksheet("crudos");
  addDataToWorksheet(crudosWorksheet, data, crudosColumns, {
    stripRawSuffix: true,
  });

  // Segunda worksheet: "validados", sin columnas de estado ni series _raw.
  const validadosColumns = getOrderedColumns(
    data,
    resolvedIntegration,
    "validados",
  );
  const validadosWorksheet = workbook.addWorksheet("validados");
  addDataToWorksheet(validadosWorksheet, data, validadosColumns, {
    highlightCell: resolvedIntegration === "hour" ? hasLowKCoverage : undefined,
  });

  // Generar buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
