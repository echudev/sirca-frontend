import ExcelJS from "exceljs";
import type { DataRow } from "@/hooks/useFetchDescargas";
import type { FiltrosType } from "@/app/(main)/descargas/components/filters";
import {
  locationOptions,
  promedioOptions,
} from "@/app/(main)/descargas/components/filters";
import { TABLE_CONFIG } from "./config";

/**
 * Genera las columnas ordenadas según TABLE_CONFIG y presentes en los datos
 */
function getOrderedColumns(data: DataRow[]): string[] {
  if (!data || data.length === 0) return [];

  // Generar orden de columnas basado en TABLE_CONFIG
  const orderedFields: string[] = [];
  Object.entries(TABLE_CONFIG).forEach(([tableKey, config]) => {
    // Agregar métricas de cada tabla
    config.metrics.forEach((metric) => {
      const fieldName = metric.replace("_mean", "");
      if (data.some((row) => fieldName in row)) {
        orderedFields.push(fieldName);
      }
    });
    // Agregar campo de status de cada tabla
    const statusField = `${tableKey}_k_status`;
    if (data.some((row) => statusField in row)) {
      orderedFields.push(statusField);
    }
  });

  // Agregar cualquier campo adicional que no esté en TABLE_CONFIG
  const allFields = new Set<string>();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== "time" && key !== "location") {
        allFields.add(key);
      }
    });
  });

  allFields.forEach((field) => {
    if (!orderedFields.includes(field)) {
      orderedFields.push(field);
    }
  });

  return orderedFields;
}

/**
 * Genera un nombre de archivo descriptivo basado en los filtros aplicados
 */
export function generateFilename(
  filters: FiltrosType,
  extension: "csv" | "xlsx"
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
    Boolean
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
  includeTimeColumn: boolean,
  isValidatedSheet: boolean = false
) {
  // Si includeTimeColumn es true, excluir "time" de las columnas porque ya lo mostramos como primera columna
  const dataColumns = includeTimeColumn
    ? columns.filter((col) => col !== "time")
    : columns;

  // Agregar encabezados
  const headers = [
    "Fecha y Hora",
    ...dataColumns.map((col) => {
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
      includeTimeColumn ? row.time : formatDate(row.time),
      ...dataColumns.map((col) => {
        const value = row[col];
        if (value === null || value === undefined) {
          return "s/d";
        }
        if (value === "k" || value === "i") {
          return String(value).toUpperCase();
        }
        if (typeof value === "number") {
          if (isValidatedSheet) {
            // Para validados: mantener como número y aplicar formato de celda después
            return value;
          }
          // Para crudos: limitar a 1 decimal
          return Number(value.toFixed(1));
        }
        return String(value);
      }),
    ];
    const addedRow = worksheet.addRow(values);

    // Aplicar formato numérico para mostrar coma como separador decimal en "validados"
    if (isValidatedSheet) {
      dataColumns.forEach((col, index) => {
        const cell = addedRow.getCell(index + 2); // +2 porque columna 1 es Fecha y Hora
        const value = row[col];
        if (typeof value === "number") {
          // Aplicar formato numérico con coma como separador decimal
          cell.numFmt = "0.0"; // Una coma decimal
        }
      });
    }
  });

  // Ajustar ancho de columnas
  worksheet.getColumn(1).width = 20; // Fecha y Hora / time
  dataColumns.forEach((_, index) => {
    worksheet.getColumn(index + 2).width = 15;
  });
}

/**
 * Descarga los datos como archivo Excel
 */
export async function downloadAsExcel(
  data: DataRow[],
  filename: string
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
  addDataToWorksheet(crudosWorksheet, data, allColumns, true, false);

  // Segunda worksheet: "validados" sin columnas que terminen en "_k_status" y sin "time"
  const validadosColumns = allColumns.filter(
    (col) => col !== "time" && !col.endsWith("_k_status")
  );
  const validadosWorksheet = workbook.addWorksheet("validados");
  addDataToWorksheet(validadosWorksheet, data, validadosColumns, false, true);

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
