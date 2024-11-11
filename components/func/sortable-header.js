import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableHeader({ column, isDragging, onSort, sortConfig }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const handleSortClick = () => onSort(column.id);

  return (
    <th
      ref={setNodeRef}
      style={style}
      {...attributes} // Atributos necesarios para drag-and-drop
      onClick={handleSortClick} // Ordenar al hacer clic en el encabezado
      className={`px-1 py-3 text-left text-xs font-medium uppercase whitespace-nowrap cursor-pointer ${
        sortConfig.key === column.id ? "bg-gray-300" : ""
      }`}
    >
      <span className="flex">
        <GripVertical
          className="flex mr-2 text-neutral-500 cursor-grab dark:text-neutral-300"
          {...listeners} // Solo se puede arrastrar al hacer clic en el icono
        />
        {column.label}
        {sortConfig.key === column.id
          ? sortConfig.direction === "asc"
            ? " ↑"
            : " ↓"
          : null}
      </span>
    </th>
  );
}

export default SortableHeader;
