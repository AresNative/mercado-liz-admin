// components/Droppable.js
import { useDroppable } from "@dnd-kit/core";
import React from "react";

function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="min-h-full">
      {children}
    </div>
  );
}

export default React.memo(Droppable);