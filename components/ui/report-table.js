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
  const formatValue = (value) => {
    if (!isNaN(value) && /^\d+\.\d+$/.test(value)) {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (typeof value === "string" && dateRegex.test(value)) {
      return new Date(value).toLocaleDateString();
    }

    return value;
  };

  const dataKeys =
    paginatedData.length > 0 ? Object.keys(paginatedData[0]) : [];

  return (
    <div className="overflow-x-auto border">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
        <thead className="bg-gray-200">
          <SortableContext
            items={dataKeys}
            strategy={verticalListSortingStrategy}
          >
            <tr>
              {dataKeys.map((key) => (
                <SortableHeader
                  key={key}
                  column={{ id: key, label: key }}
                  isDragging={isDragging}
                  onSort={onSort}
                  sortConfig={sortConfig}
                  className="border border-gray-300"
                />
              ))}
            </tr>
          </SortableContext>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border border-gray-200">
              {dataKeys.map((key, cellIndex) => {
                const value = row[key];
                if (key === "Impuestos") {
                  return value.split(",").map((impuesto, idx) => (
                    <td
                      key={`${cellIndex}-${idx}`}
                      className="px-1 py-2 border border-gray-200 text-sm whitespace-nowrap"
                    >
                      {impuesto.trim()}
                    </td>
                  ));
                } else {
                  return (
                    <td
                      key={cellIndex}
                      className="px-1 py-2 border border-gray-200 text-sm whitespace-nowrap"
                    >
                      {formatValue(value)}
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
