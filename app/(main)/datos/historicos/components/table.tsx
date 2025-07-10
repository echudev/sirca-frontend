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

const columns: ColumnDef<CoHorarioData>[] = [
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
    accessorKey: "co_centenario",
    header: "CO Centenario",
    cell: ({ row }) => <div>{row.getValue("co_centenario")}</div>,
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
    accessorKey: "co_catalinas",
    header: "CO Catalinas",
    cell: ({ row }) => <div>{row.getValue("co_catalinas")}</div>,
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
    accessorKey: "co_cordoba",
    header: "CO Córdoba",
    cell: ({ row }) => <div>{row.getValue("co_cordoba")}</div>,
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
];

interface TablaProps {
  data: CoHorarioData[];
  loading?: boolean;
}

export default function Tabla({ data, loading = false }: TablaProps) {
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
