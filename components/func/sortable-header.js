"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableHeader({ column, isDragging, onSort, sortConfig }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const handleClick = () => onSort(column.id);

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`px-6 py-3 text-left text-xs font-medium uppercase whitespace-nowrap cursor-pointer ${
        sortConfig.key === column.id ? "bg-gray-300" : ""
      }`}
    >
      {column.label}
      {sortConfig.key === column.id
        ? sortConfig.direction === "asc"
          ? " ↑"
          : " ↓"
        : null}
    </th>
  );
}

export default SortableHeader;
