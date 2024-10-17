"use client";
import React, { useState } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CircleFadingPlus } from "lucide-react";
import SortableItem from "@/components/func/scrrol-item";
import Droppable from "@/components/ui/droppable";
import Item from "@/components/ui/item";

export default function App() {
  const [columns, setColumns] = useState({
    "column-1": ["Item 1", "Item 2"],
    "column-2": ["Item 3"],
    "column-3": [],
    "column-4": [],
  });

  const [activeItem, setActiveItem] = useState(null);

  function handleDragStart(event) {
    const { active } = event;
    const { id, data } = active;

    if (data.current && data.current.column) {
      setActiveItem({ id, from: data.current.column });
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || !activeItem) return;

    const fromColumn = activeItem.from;
    const toColumn = over.data.current?.column || over.id;

    if (fromColumn === toColumn) {
      setColumns((prev) => {
        const newColumns = { ...prev };
        const items = newColumns[fromColumn];
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        newColumns[fromColumn] = arrayMove(items, oldIndex, newIndex);
        return newColumns;
      });
    } else {
      setColumns((prev) => {
        const newColumns = { ...prev };
        newColumns[fromColumn] = newColumns[fromColumn].filter(
          (i) => i !== active.id
        );
        newColumns[toColumn] = [...newColumns[toColumn], active.id];
        return newColumns;
      });
    }

    setActiveItem(null);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8 ">
        Trello-Style Drag & Drop
      </h1>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Agregar Nueva Tarea</ModalHeader>
          <ModalBody>{/* Placeholder input for new task */}</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={onClose} color="secondary">
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Tooltip content="Agregar tarea" color="secondary">
        <Button
          className="mt-4 bg-transparent dark:hover:bg-zinc-900 hover:bg-slate-200"
          onClick={onOpen}
        >
          <CircleFadingPlus />
        </Button>
      </Tooltip>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-6">
          {Object.keys(columns).map((columnId) => (
            <SortableContext
              key={columnId}
              items={columns[columnId]}
              strategy={verticalListSortingStrategy}
            >
              <Droppable id={columnId}>
                <div className=" p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4">
                    {`Column ${columnId.split("-")[1]}`}
                  </h2>
                  <ul className="space-y-2">
                    {columns[columnId].map((item) => (
                      <SortableItem key={item} id={item} column={columnId} />
                    ))}
                  </ul>
                </div>
              </Droppable>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <Item>{activeItem.id}</Item> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
