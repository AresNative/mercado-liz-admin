"use client";

import { useEffect, useRef, useState } from "react";
import { Sortable, Plugins } from "@shopify/draggable";
import {
  Button,
  Modal,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
  Tooltip,
} from "@nextui-org/react";
import { EyeIcon } from "@/assets/icons/eyeicon";
import { DeleteIcon } from "@/assets/icons/deleteicon";
import { CircleFadingPlus } from "lucide-react";

const Classes = {
  draggable: "StackedListItem--isDraggable",
  dragging: "bg-purple-600", // Cambia el color al arrastrar
};

export default function ToDoPage() {
  const containersRef = useRef([]);
  const [tasks, setTasks] = useState({
    pendientes: ["zebra", "giraffe"],
    proceso: ["fluorescent grey"],
    enPruebas: ["apple", "banana"],
    terminados: [],
  });

  const [newTask, setNewTask] = useState("");
  const [currentColumn, setCurrentColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  let sortableInstance = useRef(null);

  const enableDrag = () => {
    containersRef.current = document.querySelectorAll(".StackedList");
    sortableInstance.current = new Sortable(containersRef.current, {
      draggable: `.${Classes.draggable}`,
      mirror: { constrainDimensions: true },
      plugins: [Plugins.ResizeMirror],
    });

    sortableInstance.current.on("drag:start", (evt) => {
      evt.data.source.classList.add(Classes.dragging);
    });

    sortableInstance.current.on("drag:stop", (evt) => {
      evt.data.source.classList.remove(Classes.dragging);

      const sourceContainer = evt.sourceContainer;
      const overContainer = evt.overContainer;

      if (!sourceContainer || !overContainer) return;

      const fromKey = sourceContainer.dataset.column;
      const toKey = overContainer.dataset.column;

      if (fromKey && toKey) {
        setTasks((prev) => {
          const oldIndex = evt.oldIndex;
          const newIndex = evt.newIndex;
          const task = prev[fromKey][oldIndex];

          const updatedSource = prev[fromKey].filter((_, i) => i !== oldIndex);
          const updatedTarget = [
            ...prev[toKey].slice(0, newIndex),
            task,
            ...prev[toKey].slice(newIndex),
          ];

          return { ...prev, [fromKey]: updatedSource, [toKey]: updatedTarget };
        });
      }
    });
  };

  const disableDrag = () => {
    if (sortableInstance.current) {
      sortableInstance.current.destroy(); // Desactiva el arrastre
    }
  };

  useEffect(() => {
    enableDrag();
    return () => disableDrag();
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => ({
        ...prev,
        [currentColumn]: [...prev[currentColumn], newTask],
      }));
      setNewTask("");
      onClose();
    }
  };

  const handleDeleteTask = (column, task) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((t) => t !== task),
    }));
  };

  const handleOpenDetails = (task) => {
    setSelectedTask(task);
    onOpenDetails();
  };

  return (
    <section className="flex gap-6 p-6">
      {Object.keys(tasks).map((column, index) => (
        <Container
          key={index}
          title={column}
          items={tasks[column]}
          onAddTask={() => {
            setCurrentColumn(column);
            onOpen();
          }}
          onDeleteTask={(task) => handleDeleteTask(column, task)}
          onViewDetails={handleOpenDetails}
          disableDrag={disableDrag}
          enableDrag={enableDrag}
        />
      ))}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Agregar Nueva Tarea</ModalHeader>
          <ModalBody>
            <Input
              fullWidth
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nueva tarea"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={handleAddTask} color="secondary">
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailsOpen} onClose={onCloseDetails}>
        <ModalContent>
          <ModalHeader>Detalles de la Tarea</ModalHeader>
          <ModalBody>
            <p>{selectedTask}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}

function Container({
  title,
  items,
  onAddTask,
  onDeleteTask,
  onViewDetails,
  disableDrag,
  enableDrag,
}) {
  const handleTooltipInteraction = (event) => {
    event.stopPropagation(); // Prevenir propagación del evento
    disableDrag(); // Deshabilitar drag temporalmente
  };

  return (
    <article className="DragList p-4 rounded-lg shadow-lg w-1/4 ">
      <header className="mb-4">
        <h3 className="text-lg font-bold capitalize">{title}</h3>
      </header>
      <ul className="StackedList space-y-4 min-h-full" data-column={title}>
        {items.map((item, index) => (
          <li
            key={index}
            className={`DragChield p-4 rounded-lg shadow-md flex justify-between items-center cursor-move ${Classes.draggable}`}
          >
            <span>{item}</span>
            <div
              className="flex space-x-2"
              onMouseEnter={disableDrag}
              onMouseLeave={enableDrag}
            >
              <Tooltip content="Details">
                <span
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  onClick={() => onViewDetails(item)}
                  onMouseEnter={handleTooltipInteraction}
                >
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Delete user" color="danger">
                <span
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                  onClick={() => onDeleteTask(item)}
                  onMouseEnter={handleTooltipInteraction}
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
      <Tooltip content="Agregar tarea" color="secondary">
        <Button
          className="mt-4 bg-transparent dark:hover:bg-zinc-900 hover:bg-slate-200"
          onClick={onAddTask}
        >
          <CircleFadingPlus />
        </Button>
      </Tooltip>
    </article>
  );
}
