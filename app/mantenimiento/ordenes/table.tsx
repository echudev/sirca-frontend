import { AssetData } from '../../../lib/types';

export const Table = ({ data }: { data: AssetData[] }) => {
  console.log(data);
  return (
    <table className="mt-5 table-auto text-center w-full border-2 border-slate-300 shadow shadow-slate-300 bg-slate-100/50">
      <thead>
        <tr>
          <th>equipo</th>
          <th>contamintane</th>
          <th>fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-slate-300/30 border-y border-slate-400/70 ">
          <td className="py-1">
            lorem ipsum dolor sit amet consectetur adipisicing elit.
          </td>
          <td>ipsum</td>
          <td>1961</td>
        </tr>
        <tr>
          <td>amet consectetur adipisicing elit.</td>
          <td>lorem</td>
          <td>1972</td>
        </tr>
        <tr className="bg-slate-300/30 border-y border-slate-400/70">
          <td>amet consectetur adipisicing elit.</td>
          <td>consectetur</td>
          <td>1975</td>
        </tr>
      </tbody>
    </table>
  );
};
