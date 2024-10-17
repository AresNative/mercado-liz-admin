import { useDroppable } from "@dnd-kit/core";

export default function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-full rounded-lg transition-colors duration-300 ${
        isOver ? "bg-green-100" : "bg-gray-50"
      }`}
    >
      {children}
    </div>
  );
}
