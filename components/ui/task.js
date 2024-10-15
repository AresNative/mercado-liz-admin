import { useDrag } from "react-dnd";
import { EyeIcon } from "@/assets/icons/eyeicon";
import { DeleteIcon } from "@/assets/icons/deleteicon";

export default function Task({
  task,
  column,
  index,
  onDeleteTask,
  onViewDetails,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { task, column, index }, // Datos enviados durante el arrastre
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(), // Indicador si la tarea está siendo arrastrada
    }),
  });

  return (
    <li
      ref={drag}
      className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
        isDragging ? "opacity-50" : "opacity-100"
      } cursor-move`}
    >
      <span>{task}</span>
      <div className="flex space-x-2">
        <span
          className="text-lg text-default-400 cursor-pointer"
          onClick={() => onViewDetails(task)}
        >
          <EyeIcon />
        </span>
        <span
          className="text-lg text-danger cursor-pointer"
          onClick={() => onDeleteTask(task)}
        >
          <DeleteIcon />
        </span>
      </div>
    </li>
  );
}
