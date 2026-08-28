type DataTableProps = {
  headers: string[];
  rows: string[][];
  onDelete?: (index: number) => void;
  onEdit?: (index: number) => void;
};

export default function DataTable({
  headers,
  rows,
  onDelete,
  onEdit,
}: DataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-5 py-4 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-5 py-4 text-sm text-gray-700"
                    >
                      {cellIndex === row.length - 1 &&
                      (onEdit || onDelete) ? (
                        <div className="flex gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(rowIndex)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer"
                            >
                              Edit
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(rowIndex)}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}