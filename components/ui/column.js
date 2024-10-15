import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTask from "./draggable-task";

const Column = ({ id, tasks }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-lg w-80" id={id}>
      <h2 className="text-lg font-bold mb-2">Column {id}</h2>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <DraggableTask
            key={task.id}
            id={task.id}
            title={task.title}
            column={id}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;
