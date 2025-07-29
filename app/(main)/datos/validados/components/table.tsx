"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CoHorarioData } from "@/lib/datos/models";

// Función para detectar el tipo de contaminante a partir de los datos
const detectContaminante = (data: CoHorarioData[]) => {
  if (data.length === 0) return 'co';
  
  // Buscar la primera propiedad que comience con un contaminante conocido
  const firstItem = data[0];
  const keys = Object.keys(firstItem);
  
  for (const contaminante of ['co', 'o3', 'nox']) {
    if (keys.some(key => key.startsWith(contaminante + '_'))) {
      return contaminante;
    }
  }
  
  return 'co'; // Valor por defecto
};

// Función para crear columnas dinámicas basadas en el contaminante
const createColumns = (data: CoHorarioData[]): ColumnDef<CoHorarioData>[] => {
  const contaminante = detectContaminante(data);
  const contaminanteLabel = contaminante.toUpperCase();
  
  return [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "time",
      header: "Hora",
      cell: ({ row }) => <div>{row.getValue("time")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: `${contaminante}_centenario`,
      header: `${contaminanteLabel} Centenario`,
      cell: ({ row }) => <div>{row.getValue(`${contaminante}_centenario`)}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "minuteCount_centenario",
      header: "Minutos",
      cell: ({ row }) => <div>{row.getValue("minuteCount_centenario")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "status_centenario",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status_centenario") as string;
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === "ok"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: `${contaminante}_catalinas`,
      header: `${contaminanteLabel} Catalinas`,
      cell: ({ row }) => <div>{row.getValue(`${contaminante}_catalinas`)}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "minuteCount_catalinas",
      header: "Minutos",
      cell: ({ row }) => <div>{row.getValue("minuteCount_catalinas")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "status_catalinas",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status_catalinas") as string;
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === "ok"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: `${contaminante}_cordoba`,
      header: `${contaminanteLabel} Córdoba`,
      cell: ({ row }) => <div>{row.getValue(`${contaminante}_cordoba`)}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "minuteCount_cordoba",
      header: "Minutos",
      cell: ({ row }) => <div>{row.getValue("minuteCount_cordoba")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "status_cordoba",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status_cordoba") as string;
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === "ok"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: `${contaminante}_cifa`,
      header: `${contaminanteLabel} CIFA`,
      cell: ({ row }) => <div>{row.getValue(`${contaminante}_cifa`)}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "minuteCount_cifa",
      header: "Minutos",
      cell: ({ row }) => <div>{row.getValue("minuteCount_cifa")}</div>,
      enableSorting: false,
    },
    {
      accessorKey: "status_cifa",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status_cifa") as string;
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              status === "ok"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {status}
          </span>
        );
      },
      enableSorting: false,
    },
];
}; // Cierre de la función createColumns

interface TablaProps {
  data: CoHorarioData[];
  loading?: boolean;
}

export default function Tabla({ data, loading = false }: TablaProps) {
  // Crear columnas dinámicas basadas en el contaminante detectado
  const columns = createColumns(data);
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    // No sorting or pagination, as data comes sorted from backend
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Datos Detallados</h2>
      <div className="overflow-auto max-h-[500px] border rounded-lg w-full">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  {loading ? "Cargando datos..." : "No hay datos disponibles"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
