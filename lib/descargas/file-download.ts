/**
 * @file Utilidades para la generación y descarga de archivos CSV y Excel.
 * @description Proporciona funciones para formatear datos crudos de la base de datos
 * en archivos descargables, aplicando reglas de negocio sobre columnas y decimales.
 * @author Ezequiel Maranda
 * @version 1.2.0
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

/**
 * Genera el listado de columnas ordenadas basándose en la configuración global (TABLE_CONFIG).
 *
 * @param data Los datos crudos obtenidos de la consulta.
 * @param integration Opcional. Tipo de promedio para determinar los sufijos de las columnas de estado.
 * @returns Array de strings con los nombres de las columnas en el orden correcto.
 */
function getOrderedColumns(data: DataRow[], integration?: string): string[] {
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

  // Si no pasaron integración, intentar inferirla basándonos en si ya hay alguna columna "_status" en los datos
  let inferIntegration = integration;
  // Este código se ejecuta solamente si no se pasó el string integration como argument en getOrderedColumns
  if (!inferIntegration) {
    const hasMinutalStatus = Array.from(allFields).some(
      (f) => f.endsWith("_status") && !f.endsWith("_k_status"),
    );
    inferIntegration = hasMinutalStatus ? "minute" : "hour";
  }

  // Generar orden de columnas basado en TABLE_CONFIG
  const orderedFields: string[] = [];
  const seen = new Set<string>();

  Object.entries(TABLE_CONFIG).forEach(([tableKey, config]) => {
    // Agregar métricas de cada tabla
    config.metrics.forEach((metric) => {
      const fieldName = metric.replace("_mean", "");
      if (!seen.has(fieldName)) {
        orderedFields.push(fieldName);
        seen.add(fieldName);
      }
    });

    // Agregar campo de status de cada tabla según el tipo de integración de la consulta
    const statusField =
      inferIntegration === "minute"
        ? `${tableKey}_status`
        : `${tableKey}_k_status`;

    if (!seen.has(statusField)) {
      orderedFields.push(statusField);
      seen.add(statusField);
    }
  });

  // Agregar cualquier campo adicional que no esté en TABLE_CONFIG
  allFields.forEach((field) => {
    if (!seen.has(field)) {
      orderedFields.push(field);
      seen.add(field);
    }
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

/**
 * Helper interno para volcar datos y aplicar estilos básicos a una hoja de ExcelJS.
 *
 * @param worksheet Instancia de la hoja de Excel.
 * @param data Datos a insertar.
 * @param columns Lista de columnas a incluir en esta hoja.
 */
function addDataToWorksheet(
  worksheet: ExcelJS.Worksheet,
  data: DataRow[],
  columns: string[],
) {
  // Agregar encabezados
  const headers = [
    "Fecha y Hora",
    ...columns.map((col) => {
      if (col === "catalinas") return "La Boca";
      return col.charAt(0).toUpperCase() + col.slice(1);
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
  data.forEach((row, _rowIndex) => {
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
          let decimals = 1;
          if (THREE_DECIMAL_COLUMNS.has(col)) {
            decimals = 3;
          } else if (TWO_DECIMAL_COLUMNS.has(col)) {
            decimals = 2;
          } else if (ONE_DECIMAL_COLUMNS.has(col)) {
            decimals = 1;
          }
          return Number(value.toFixed(decimals));
        }
        return String(value);
      }),
    ];
    worksheet.addRow(values);
  });

  // Ajustar ancho de columnas
  worksheet.getColumn(1).width = 20; // Fecha y Hora / time
  columns.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = 15;
  });
}

/**
 * Orquestador para descargar los datos en formato Excel (.xlsx).
 * Crea dos hojas: "crudos" (con estados) y "validados" (sin estados).
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

  // Obtener todas las columnas ordenadas según TABLE_CONFIG
  const allColumns = getOrderedColumns(data, integration);

  // Crear workbook
  const workbook = new ExcelJS.Workbook();

  // Primera worksheet: "crudos" con todas las columnas (incluyendo time y _k_status)
  const crudosWorksheet = workbook.addWorksheet("crudos");
  addDataToWorksheet(crudosWorksheet, data, allColumns);

  // Segunda worksheet: "validados" sin columnas que terminen en "_status" (incluye "_k_status") y sin "time"
  const validadosColumns = allColumns.filter((col) => !col.endsWith("_status"));
  const validadosWorksheet = workbook.addWorksheet("validados");
  addDataToWorksheet(validadosWorksheet, data, validadosColumns);

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
