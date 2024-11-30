interface TableProps {
  data: any[];
}

export const Table: React.FC<TableProps> = ({ data }) => {
  let tableHeaders = Object.keys(data[0]);

  return (
    <table className="mt-5 table-auto text-center w-full border-2 border-slate-300 shadow shadow-slate-300 bg-slate-100/50">
      <thead>
        <tr className="h-10 bg-blue-200">
          {tableHeaders.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((obj, i) => {
          return (
            <tr
              key={i}
              className="odd:bg-slate-300/30 border-y border-slate-400/70 h-10"
            >
              {tableHeaders.map((header, i) => (
                <td key={i}>{obj[header]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
