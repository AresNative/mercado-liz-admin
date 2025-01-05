import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTask } from "./sorteable-tasks";
import { useDroppable } from "@dnd-kit/core";
import { statusColumns } from "@/app/tareas/@user/[id]/page";
import { useMemo } from "react";

export const Column = ({ status, rows, activeTask, refetchTasks,overColumn }) => {
    const { setNodeRef } = useDroppable({
      id: status,
    });

    const filteredTasks = rows
      .filter((task) => task.estado === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const showDropArea = activeTask && activeTask.estado !== status && overColumn === status;

    const generateRandomColor = () => {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 50%)`;
    };
    const columnColors = useMemo(() => {
        return statusColumns.reduce((acc, status) => {
        acc[status] = generateRandomColor();
        return acc;
        }, {});
    }, [statusColumns]);

    return (
      <div 
        ref={setNodeRef} 
        className="min-w-80 min-h-[40rem] bg-gray-100 p-4 rounded-lg w-full"
        style={{ borderLeft: `4px solid ${columnColors[status]}` }}
      >
        <h3 className="font-bold mb-4 capitalize flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: columnColors[status] }}
          ></span>
          {status}
          <span className="ml-2 text-sm text-gray-500">
            ({filteredTasks.length})
          </span>
        </h3>
        <div className="relative">
          {showDropArea && (
            <div className="absolute top-0 left-0 right-0 border-2 border-dashed border-gray-400 rounded-lg p-4 mb-2 bg-gray-200 z-10">
              <span className="text-gray-600 font-medium">Soltar aquí</span>
            </div>
          )}
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
          
            {filteredTasks.map((task) => (
              <SortableTask key={task.id} task={task} refetch={refetchTasks} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  };