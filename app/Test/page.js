// pages/index.js
"use client";
import React, { useState } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

export default function App() {
  const [columns, setColumns] = useState({
    "column-A": ["A1", "A2", "A3"],
    "column-B": ["B1", "B2", "B3"],
    "column-C": ["C1", "C2", "C3"],
  });

  const [activeItem, setActiveItem] = useState(null);

  function handleDragStart(event) {
    const { active } = event;
    setActiveItem(active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const fromColumn = findColumn(active.id);
    const toColumn = over.id.includes("column") ? over.id : findColumn(over.id);

    if (fromColumn === toColumn) {
      setColumns((prev) => ({
        ...prev,
        [fromColumn]: arrayMove(
          prev[fromColumn],
          prev[fromColumn].indexOf(active.id),
          prev[fromColumn].indexOf(over.id)
        ),
      }));
    } else {
      setColumns((prev) => {
        const updatedFrom = prev[fromColumn].filter(
          (item) => item !== active.id
        );
        const updatedTo = [...prev[toColumn], active.id];

        return {
          ...prev,
          [fromColumn]: updatedFrom,
          [toColumn]: updatedTo,
        };
      });
    }

    setActiveItem(null);
  }

  const findColumn = (id) => {
    for (const column in columns) {
      if (columns[column].includes(id)) {
        return column;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8">
        Drag & Drop Columns
      </h1>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(columns).map((columnId) => (
            <SortableContext
              key={columnId}
              items={columns[columnId]}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id={columnId}>
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-lg font-bold mb-4">{`Column ${
                    columnId.split("-")[1]
                  }`}</h2>
                  <ul className="space-y-2">
                    {columns[columnId].map((item) => (
                      <SortableItem key={item} id={item} />
                    ))}
                  </ul>
                </div>
              </Droppable>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <Item id={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// SortableItem.js
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition || undefined,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `4px solid ${getColor(id)}`,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center p-4 bg-white shadow rounded border"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="mr-2 text-gray-500 cursor-grab" />
      <span className="flex-grow font-medium">{id}</span>
    </li>
  );
}

function getColor(id) {
  if (id.startsWith("A")) return "blue";
  if (id.startsWith("B")) return "yellow";
  if (id.startsWith("C")) return "cyan";
  return "gray";
}

// Droppable.js
import { useDroppable } from "@dnd-kit/core";

function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="min-h-[200px]">
      {children}
    </div>
  );
}

function Item({ id }) {
  return (
    <div className="flex items-center p-4 bg-white shadow-lg rounded border">
      <GripVertical className="mr-2 text-gray-500" />
      <span className="font-medium">{id}</span>
    </div>
  );
}
