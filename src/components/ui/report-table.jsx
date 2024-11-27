"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableHeader from "./sortable-header";
import { Skeleton } from "@nextui-org/react";

function ReportTable({
    isLoaded,
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
      <div className="overflow-x-auto h-full min-h-80">
        <Skeleton isLoaded={!isLoaded} className="rounded">
        <table
          className="
                    min-w-full 
                    border-gray-500 dark:border-neutral-900
                    bg-gray-100 dark:bg-gray-900
                    rounded">
                <thead>
                <SortableContext
                    items={dataKeys}
                    strategy={verticalListSortingStrategy}
            >
                  <tr className="divide-x
                              divide-gray-200 dark:divide-gray-800">
                    {columns.map((row, index) => (
                        <SortableHeader
                          key={`${row.id}-${index}`} // Combina el id con el índice para hacerlo único
                          column={row}
                          isDragging={isDragging}
                          onSort={onSort}
                          sortConfig={sortConfig}
                          /* className="border border-gray-300" */
                        />
                    ))}
                  </tr>
                </SortableContext>
                </thead>
                <tbody >
                {paginatedData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="
                    divide-x
                    divide-gray-200 dark:divide-gray-800">
                    {columns.map((column, colIndex) => {
                        const key = column.id;
                        const value = row[key];

                        if (key === "TypoImpuestos") {
                        return value.split(",").map((impuesto, idx) => (
                            <td
                            key={`${column.id}-${rowIndex}-${idx}`} // Combina el id con el índice de fila y el índice de impuesto
                            className="px-1 py-2 text-sm whitespace-nowrap"
                            >
                            {impuesto.trim()}
                            </td>
                        ));
                        } else {
                        return (
                            <td
                            key={`${column.id}-${rowIndex}-${colIndex}`} // Combina el id de la columna con los índices de fila y columna
                            className="px-1 py-2 text-sm whitespace-nowrap"
                            >
                            {formatValue(row[column.id])}
                            </td>
                        );
                        }
                    })}
                    </tr>
                ))}
                </tbody>
            </table>
        </Skeleton>
    </div>
  );
}

export default ReportTable;