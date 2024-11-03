// pages/index.js
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Droppable from "@/components/func/droppable";
import SortableItem from "@/components/func/sortable-item";
import Item from "@/components/ui/item";
import { Button } from "@nextui-org/react";
import { CircleFadingPlus } from "lucide-react";

export default function App() {
  // Define the fixed columns
  const columns = ["Pendientes", "Proceso", "Pruebas", "Terminados"];
  // Initialize state with empty arrays for each column
  const [itemsByColumn, setItemsByColumn] = useState({
    Pendientes: [],
    Proceso: [],
    Pruebas: [],
    Terminados: [],
  });
  const [activeId, setActiveId] = useState(null);

  // Fetch items for each column from the server on component mount
  useEffect(() => {
    // Fetch items from the server
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        // Expected data format: { itemsByColumn: { "column-A": [...], ... } }
        setItemsByColumn(data.itemsByColumn);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
      });
  }, []);

  const findColumn = useCallback(
    (id) => {
      const foundColumn = Object.keys(itemsByColumn).find((column) =>
        itemsByColumn[column].includes(id)
      );
      return foundColumn || null;
    },
    [itemsByColumn]
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) return;

      const fromColumn = findColumn(active.id);
      const toColumn = findColumn(over.id) || over.id;

      if (fromColumn && toColumn && fromColumn !== toColumn) {
        if (!itemsByColumn[toColumn]?.includes(active.id)) {
          setItemsByColumn((prev) => ({
            ...prev,
            [fromColumn]: prev[fromColumn].filter((item) => item !== active.id),
            [toColumn]: [...(prev[toColumn] || []), active.id],
          }));
        }
      }
    },
    [itemsByColumn, findColumn]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over) {
        setActiveId(null);
        return;
      }

      const fromColumn = findColumn(active.id);
      const toColumn = findColumn(over.id) || over.id;

      if (fromColumn && toColumn) {
        const fromIndex = itemsByColumn[fromColumn].indexOf(active.id);
        const toIndex = itemsByColumn[toColumn].indexOf(over.id);

        if (fromColumn === toColumn && fromIndex !== toIndex) {
          setItemsByColumn((prev) => ({
            ...prev,
            [fromColumn]: arrayMove(prev[fromColumn], fromIndex, toIndex),
          }));
        } else if (fromColumn !== toColumn) {
          // Moving item between columns
          setItemsByColumn((prev) => ({
            ...prev,
            [fromColumn]: prev[fromColumn].filter((item) => item !== active.id),
            [toColumn]: [
              ...prev[toColumn].slice(0, toIndex + 1),
              active.id,
              ...prev[toColumn].slice(toIndex + 1),
            ],
          }));
        }

        // Send API request to update item position
        fetch("/api/items/move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemId: active.id,
            fromColumnId: fromColumn,
            toColumnId: toColumn,
            newIndex:
              toIndex !== -1 ? toIndex : itemsByColumn[toColumn].length - 1,
          }),
        }).catch((err) => {
          console.error("Error moving item:", err);
        });
      }
      setActiveId(null);
    },
    [itemsByColumn, findColumn]
  );

  // Function to handle adding a new item to a column
  const handleAddItem = useCallback((columnId) => {
    const newItemId = prompt("Enter new item name:");
    if (newItemId) {
      // Update state
      setItemsByColumn((prevItems) => ({
        ...prevItems,
        [columnId]: [...prevItems[columnId], newItemId],
      }));
      // Send API request to add item
      fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          columnId,
          itemId: newItemId,
        }),
      }).catch((err) => {
        console.error("Error adding item:", err);
      });
    }
  }, []);

  // Function to handle deleting an item from a column
  const handleDeleteItem = useCallback((columnId, itemId) => {
    // Update state
    setItemsByColumn((prevItems) => ({
      ...prevItems,
      [columnId]: prevItems[columnId].filter((item) => item !== itemId),
    }));
    // Send API request to delete item
    fetch(`/api/items/${itemId}`, {
      method: "DELETE",
    }).catch((err) => {
      console.error("Error deleting item:", err);
    });
  }, []);

  return (
    <div className="min-h-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Drag & Drop Columns
        </h1>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {columns.map((columnId) => {
            return (
              <SortableContext
                key={columnId}
                items={itemsByColumn[columnId]}
                strategy={verticalListSortingStrategy}
              >
                <Droppable id={columnId}>
                  <div className="bg-white dark:bg-neutral-700 min-h-full p-4 rounded-lg shadow-md border border-gray-200 dark:border-neutral-600 flex flex-col">
                    <div className="flex justify-between items-center content-center mb-4">
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-gray-100">
                        {`${columnId}`}
                      </h2>
                      <Button
                        radius="full"
                        variant="light"
                        className="bg-transparent dark:hover:bg-zinc-900 hover:bg-slate-200"
                        onClick={() => handleAddItem(columnId)}
                      >
                        <CircleFadingPlus />
                      </Button>
                    </div>
                    <ul className="min-h-full flex flex-col flex-1 space-y-2">
                      {itemsByColumn[columnId].map((item) => (
                        <SortableItem
                          key={item}
                          id={item}
                          isDragging={activeId === item}
                          onDelete={() => handleDeleteItem(columnId, item)}
                        />
                      ))}
                      {itemsByColumn[columnId].length === 0 && (
                        <div className="text-gray-500 dark:text-gray-300">
                          Sin tareas
                        </div>
                      )}
                    </ul>
                  </div>
                </Droppable>
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>{activeId ? <Item id={activeId} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
