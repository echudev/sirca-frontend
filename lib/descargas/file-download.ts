import ExcelJS from "exceljs";
import type { DataRow } from "@/hooks/useFetchDescargas";
import type { FiltrosType } from "@/app/(main)/descargas/components/filters";
import {
  locationOptions,
  promedioOptions,
} from "@/app/(main)/descargas/components/filters";
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
 * Genera las columnas ordenadas según TABLE_CONFIG.
 * Siempre incluye todas las columnas definidas en la config, aunque no existan en los datos.
 */
function getOrderedColumns(data: DataRow[]): string[] {
  // Generar orden de columnas basado en TABLE_CONFIG (sin depender de los datos)
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
    // Agregar campo de status de cada tabla
    const statusField = `${tableKey}_k_status`;
    if (!seen.has(statusField)) {
      orderedFields.push(statusField);
      seen.add(statusField);
    }
  });

  // Agregar cualquier campo adicional que no esté en TABLE_CONFIG
  if (data && data.length > 0) {
    const allFields = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "time" && key !== "location") {
          allFields.add(key);
        }
      });
    });

    allFields.forEach((field) => {
      if (!seen.has(field)) {
        orderedFields.push(field);
        seen.add(field);
      }
    });
  }

  return orderedFields;
}

/**
 * Genera un nombre de archivo descriptivo basado en los filtros aplicados
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
 * Formatea un valor para CSV, manejando valores nulos y especiales
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
 * Formatea una fecha para mostrar en CSV/Excel
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
 * Descarga los datos como archivo CSV
 */
export function downloadAsCSV(data: DataRow[], filename: string): void {
  if (!data || data.length === 0) {
    throw new Error("No hay datos para descargar");
  }

  // Obtener todas las columnas ordenadas según TABLE_CONFIG
  const columns = getOrderedColumns(data);
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
 * Helper para agregar datos a un worksheet con estilos
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
  data.forEach((row, rowIndex) => {
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
 * Descarga los datos como archivo Excel
 */
export async function downloadAsExcel(
  data: DataRow[],
  filename: string,
): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error("No hay datos para descargar");
  }

  // Obtener todas las columnas ordenadas según TABLE_CONFIG
  const allColumns = getOrderedColumns(data);

  // Crear workbook
  const workbook = new ExcelJS.Workbook();

  // Primera worksheet: "crudos" con todas las columnas (incluyendo time y _k_status)
  const crudosWorksheet = workbook.addWorksheet("crudos");
  addDataToWorksheet(crudosWorksheet, data, allColumns);

  // Segunda worksheet: "validados" sin columnas que terminen en "_k_status" y sin "time"
  const validadosColumns = allColumns.filter(
    (col) => !col.endsWith("_k_status"),
  );
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
