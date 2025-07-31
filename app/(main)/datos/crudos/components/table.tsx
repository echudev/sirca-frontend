interface TableProps {
  data: Record<string, string | number>[];
}

export default function Table({ data }: TableProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="overflow-x-auto p-2">
        <span className="text-gray-500">No hay datos para mostrar</span>
      </div>
    );
  }

  // Obtener las ubicaciones (columnas) dinámicamente excluyendo 'time'
  const locations = Object.keys(data[0] || {}).filter((key) => key !== "time");

  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Fecha y Hora</th>
            {locations.map((location) => (
              <th key={location} className="border px-2 py-1 capitalize">
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
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
                {locations.map((location) => (
                  <td key={location} className="border px-2 py-1 text-center">
                    {row[location] !== null && row[location] !== undefined
                      ? Number(row[location]).toFixed(3)
                      : "s/d"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
