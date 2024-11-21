"use client";
// components/SortableTable.js

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

const SortableTable = ({ data, columns }) => {
  // Estado para el orden de las columnas
  const [columnOrder, setColumnOrder] = useState(columns);

  // Configurar los sensores para Dnd-Kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Función para manejar el reordenamiento
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = columnOrder.findIndex((col) => col.id === active.id);
      const newIndex = columnOrder.findIndex((col) => col.id === over.id);

      setColumnOrder((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table>
          <thead>
            <tr>
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                {columnOrder.map((column) => (
                  <SortableItem key={column.id} id={column.id}>
                    {column.label}
                  </SortableItem>
                ))}
              </SortableContext>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columnOrder.map((column) => (
                  <td key={column.id}>{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
};

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ddd",
  };

  return (
    <th ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </th>
  );
};

// pages/index.js

const data = [
  { id: 1, name: "John Doe", age: 28, job: "Developer" },
  { id: 2, name: "Jane Smith", age: 34, job: "Designer" },
  { id: 3, name: "Mark Brown", age: 45, job: "Manager" },

  { id: 4, name: "Mark Brown2", age: 45, job: "Manager" },

  { id: 5, name: "Mark Brown3", age: 45, job: "Manager" },
];

const columns = [
  { id: "name", label: "Name", accessor: "name" },
  { id: "age", label: "Age", accessor: "age" },
  { id: "job", label: "Job", accessor: "job" },
];
export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Sortable Table</h1>
      <SortableTable data={data} columns={columns} />
    </div>
  );
}
