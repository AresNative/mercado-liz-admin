import { useDrop } from "react-dnd";
import Task from "@/components/ui/task";

export default function Column({
  title,
  tasks,
  moveTask,
  onDeleteTask,
  onViewDetails,
  onAddTask,
}) {
  const [, drop] = useDrop({
    accept: "TASK",
    hover: (item, monitor) => {
      const draggedIndex = item.index; // Índice de la tarea arrastrada
      const targetIndex = monitor.getItem().index; // Índice de la tarea objetivo (donde se suelta)

      if (draggedIndex === targetIndex && item.column === title) return; // No hacer nada si es la misma posición

      moveTask(item.column, title, draggedIndex, targetIndex); // Mueve la tarea
      item.index = targetIndex; // Actualiza el índice de la tarea arrastrada
      item.column = title; // Actualiza la columna de la tarea arrastrada
    },
  });

  return (
    <div ref={drop} className="p-4 rounded-lg shadow-lg w-1/4">
      <header className="mb-4">
        <h3 className="text-lg font-bold capitalize">{title}</h3>
      </header>
      <ul className="StackedList space-y-2">
        {tasks.map((task, index) => (
          <Task
            key={task}
            task={task}
            column={title}
            index={index}
            onDeleteTask={onDeleteTask}
            onViewDetails={onViewDetails}
          />
        ))}
      </ul>
      <button
        className="mt-4 bg-blue-500 text-white rounded p-2"
        onClick={onAddTask}
      >
        Agregar Tarea
      </button>
    </div>
  );
}
