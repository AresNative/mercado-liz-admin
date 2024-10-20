"use client";

function DragOverlayColumn({ column }) {
  return (
    <div className="p-2 bg-gray-100 rounded shadow-lg">{column?.label}</div>
  );
}

export default DragOverlayColumn;
