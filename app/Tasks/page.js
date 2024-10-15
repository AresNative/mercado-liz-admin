"use client";
import React, { useState, forwardRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { CircleFadingPlus } from "lucide-react";

import { EyeIcon } from "@/assets/icons/eyeicon";
import { DeleteIcon } from "@/assets/icons/deleteicon";

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
  function handleDelete(item, column) {
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[column] = newColumns[column].filter((i) => i !== item);
      return newColumns;
    });
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
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Trello-Style Drag & Drop
      </h1>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Agregar Nueva Tarea</ModalHeader>
          <ModalBody>
            <Input
              fullWidth
              /* onChange={(e) => setNewTask(e.target.value)} */
              placeholder="Nueva tarea"
            />
          </ModalBody>
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
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4">
                    {`Column ${columnId.split("-")[1]}`}
                  </h2>
                  <ul className="space-y-2">
                    {columns[columnId].map((item) => (
                      <SortableItem
                        key={item}
                        id={item}
                        column={columnId}
                        handleDelete={handleDelete}
                      />
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

const Item = forwardRef(({ children, ...props }, ref) => (
  <div
    className="px-4 py-2 bg-cyan-600 text-white rounded-lg shadow cursor-pointer"
    {...props}
    ref={ref}
  >
    {children}
  </div>
));
Item.displayName = "Item";

function SortableItem({ id, column, handleDelete }) {
  const [disabled, setDisabled] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { column },
      disabled,
    });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!disabled ? listeners : {})}
    >
      <ItemWithActions
        id={id}
        setDisabled={setDisabled}
        column={column}
        handleDelete={handleDelete}
      />
    </li>
  );
}

function ItemWithActions({ id, setDisabled, column, handleDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-cyan-600 text-white rounded-lg shadow">
      <span>{id}</span>
      <div className="flex space-x-2">
        <Tooltip content="Details">
          <span
            className="text-lg text-default-400 cursor-pointer active:opacity-50"
            onClick={() => alert(`Ver detalles de: ${id}`)}
            onMouseEnter={() => setDisabled(true)}
            onMouseLeave={() => setDisabled(false)}
          >
            <EyeIcon />
          </span>
        </Tooltip>
        <Tooltip content="Delete user" color="danger">
          <span
            className="text-lg text-danger cursor-pointer active:opacity-50"
            onClick={() => handleDelete(id, column)}
            onMouseEnter={() => setDisabled(true)}
            onMouseLeave={() => setDisabled(false)}
          >
            <DeleteIcon />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

function Droppable({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-full rounded-lg transition-colors duration-300 ${
        isOver ? "bg-green-100" : "bg-gray-50"
      }`}
    >
      {children}
    </div>
  );
}
