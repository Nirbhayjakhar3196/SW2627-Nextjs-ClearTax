import React from "react";

const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full border-collapse">
        {/* Table Header */}
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;