type CrudosTableRow = {
  time: string;
  centenario: number;
  cordoba: number;
  catalinas: number;
};

interface TableProps {
  data: {
    time: string;
    centenario: number;
    cordoba: number;
    catalinas: number;
  }[];
}

export default function Table({ data }: TableProps) {
  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Fecha y Hora</th>
            <th className="border px-2 py-1">Centenario</th>
            <th className="border px-2 py-1">Cordoba</th>
            <th className="border px-2 py-1">Catalinas</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data)
            ? (data as CrudosTableRow[]).map((row, idx) => {
                return (
                  <tr key={idx}>
                    <td className="border px-2 py-1 text-center">
                      {new Intl.DateTimeFormat("es-AR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "America/Argentina/Buenos_Aires",
                      }).format(new Date(row.time))}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {row.centenario
                        ? Number(row.centenario).toFixed(3)
                        : "s/d"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {row.cordoba ? Number(row.cordoba).toFixed(3) : "s/d"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {row.catalinas ? Number(row.catalinas).toFixed(3) : "s/d"}
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
    </div>
  );
}
