"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableHeader from "./sortable-header";
import { Skeleton } from "@nextui-org/react";
import { useState } from "react";
import renderTableCell from "./cell";

function ReportTable({
  isLoaded,
  columns,
  paginatedData,
  isDragging,
  onSort,
  sortConfig,
}) {
const [selectedRows, setSelectedRows] = useState([]);
    
  const handleRowSelection = (rowIndex) => {
    setSelectedRows((prev) => {
      if (prev.includes(rowIndex)) {
        return prev.filter((index) => index !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };

  const dataKeys = paginatedData.length ? Object.keys(paginatedData[0]) : [];

  return (
    <div className="overflow-x-auto h-full min-h-80">
      <Skeleton isLoaded={!isLoaded} className="rounded">
        <table className="min-w-full dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-2xl">
          <thead>
            <SortableContext items={dataKeys} strategy={verticalListSortingStrategy}>
              <tr className="divide-x divide-gray-200 dark:divide-gray-700">
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedRows(checked ? paginatedData.map((_, i) => i) : []);
                      handleRowSelection(checked ? paginatedData.map((_, i) => i) : []);
                    }}
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  />
                </th>
                {columns.map((column, index) => (
                  <SortableHeader
                    key={`${column.id}-${index}`}
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
            {paginatedData.map((row, rowIndex) => {          
              return (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer divide-x divide-gray-200 dark:divide-gray-700`}
                onClick={(e) => {
                  // Evita la selección si el click se originó dentro del checkbox
                  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
                    return;
                  }
                  handleRowSelection(row.CompraID);
                }}
              >
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.CompraID)}
                    onChange={() => handleRowSelection(row.CompraID)}
                  />
                </td>
                {columns.map((column, colIndex) =>
                  renderTableCell(column, row, rowIndex, colIndex)
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </Skeleton>
    </div>
  );
}

export default ReportTable;
