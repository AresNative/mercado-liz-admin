"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableHeader from "../func/sortable-header";

function ReportTable({ columns, paginatedData, isDragging }) {
  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full border-collapse border border-gray-200">
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
                />
              ))}
            </tr>
          </SortableContext>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id} className="border-b">
              {columns.map((column) => (
                <td key={`${row.id}-${column.id}`} className="p-2">
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
