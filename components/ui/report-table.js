"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableHeader from "../func/sortable-header";

function ReportTable({
  columns,
  paginatedData,
  isDragging,
  onSort,
  sortConfig,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border shadow-md">
      <table className="min-w-full divide-y divide-gray-300 table-auto">
        <thead className="bg-gray-200">
          <SortableContext
            items={columns}
            strategy={verticalListSortingStrategy}
          >
            <tr>
              {columns.map((column) => (
                <SortableHeader
                  key={column.id}
                  column={column}
                  isDragging={isDragging}
                  onSort={onSort}
                  sortConfig={sortConfig}
                />
              ))}
            </tr>
          </SortableContext>
        </thead>
        <tbody>
          {paginatedData.map((row, key) => (
            <tr key={key} className="border-b">
              {columns.map((column) => (
                <td
                  key={`${row.id}-${column.id}`}
                  className="px-6 py-4 text-sm whitespace-nowrap"
                >
                  {row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
