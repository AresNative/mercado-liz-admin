// components/SortableItem.js
import { DeleteIcon } from "@/assets/icons/deleteicon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip } from "@nextui-org/react";
import { GripVertical } from "lucide-react";
import React from "react";

const getColor = (id) => {
  if (id.startsWith("Pendientes")) return "blue";
  if (id.startsWith("Proceso")) return "yellow";
  if (id.startsWith("Pruebas")) return "cyan";
  return "neutral";
};

function SortableItem({ id, isDragging }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: dragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || undefined,
    zIndex: dragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1,
    borderLeft: `4px solid ${getColor(id)}`,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="min-h-15 flex items-center p-4 bg-white dark:bg-neutral-600 shadow rounded border dark:border-neutral-500"
      {...attributes}
      onClick={() => alert(`Ver detalles de: ${id}`)}
    >
      <GripVertical
        className="flex mr-2 text-neutral-500 cursor-grab dark:text-neutral-300"
        {...listeners}
      />
      <span className="flex-grow font-medium text-neutral-900 dark:text-neutral-100">
        {id}
      </span>

      <Tooltip content="Eliminar usuario" color="danger">
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Eliminar: ${id}`);
          }}
        >
          <DeleteIcon />
        </span>
      </Tooltip>
    </li>
  );
}

export default React.memo(SortableItem);
