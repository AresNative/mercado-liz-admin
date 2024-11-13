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
    // Verifica si el valor es un número
    if (!isNaN(value) && /^\d+\.\d+$/.test(value)) {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    }

    // Verifica si el valor es una fecha válida
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (typeof value === "string" && dateRegex.test(value)) {
      return new Date(value).toLocaleDateString();
    }

    // Si no es ni número ni fecha, regresa el valor tal cual
    return value;
  };
  return (
    <div className="overflow-x-auto border">
      <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
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
                  className="border border-gray-300"
                />
              ))}
            </tr>
          </SortableContext>
        </thead>
        <tbody>
          {paginatedData.map((row, key) => (
            <tr key={key} className="border border-gray-200">
              {columns.map((column) => {
                const cellData = formatValue(row[column.id]);
                if (column.id === "Impuestos") {
                  // Divide los impuestos y renderiza cada uno en un <td> separado
                  return cellData.split(",").map((impuesto, i) => (
                    <td
                      key={`${row.id}-${column.id}-${i}`}
                      className={`${row.id}-${column.id}-${i} px-1 py-2 border border-gray-200 text-sm whitespace-nowrap`}
                    >
                      {impuesto.trim()}
                    </td>
                  ));
                } else {
                  return (
                    <td
                      key={`${row.id}-${column.id}`}
                      className={`${row.id}-${column.id} px-1 py-2 border border-gray-200 text-sm whitespace-nowrap`}
                    >
                      {cellData}
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
