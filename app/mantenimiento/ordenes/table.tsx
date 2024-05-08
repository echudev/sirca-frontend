import { OrdenesData } from '../../../lib/types';

export const Table = ({ data }: { data: OrdenesData[] }) => {
  console.log(data);
  return (
    <table className="mt-5 table-auto text-center w-full border-2 border-slate-300 shadow shadow-slate-300 bg-slate-100/50">
      <thead>
        <tr className="h-10 bg-blue-200">
          <th>Nro Orden</th>
          <th>Equipo</th>
          <th>Estación</th>
          <th>Estado</th>
          <th>Última modificación</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((orden) => {
          return (
            <tr
              key={orden.ordenID}
              className="odd:bg-slate-300/30 border-y border-slate-400/70 h-10"
            >
              <td>{orden.ordenID}</td>
              <td>{orden.equipo}</td>
              <td>{orden.estacion}</td>
              <td>{orden.ordenEstado}</td>
              <td>{orden.ultimaModificacion}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
