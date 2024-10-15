"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "@/components/ui/column";
import {
  Button,
  Modal,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";

const initialTasks = {
  pendientes: ["zebra", "giraffe"],
  proceso: ["fluorescent grey"],
  pruebas: ["apple", "banana"],
  terminados: [],
};

export default function ToDoPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [currentColumn, setCurrentColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  const moveTask = (fromColumn, toColumn, fromIndex, toIndex) => {
    setTasks((prev) => {
      const fromTasks = [...prev[fromColumn]];
      const [movedTask] = fromTasks.splice(fromIndex, 1);

      const toTasks = fromColumn === toColumn ? fromTasks : [...prev[toColumn]];
      toTasks.splice(toIndex, 0, movedTask);

      return {
        ...prev,
        [fromColumn]: fromTasks,
        [toColumn]: toTasks,
      };
    });
  };

  const handleAddTask = () => {
    if (newTask.trim() && currentColumn) {
      setTasks((prev) => ({
        ...prev,
        [currentColumn]: [...prev[currentColumn], newTask],
      }));
      setNewTask("");
      onClose();
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    setTasks((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([key, tasks]) => [
          key,
          tasks.filter((t) => t !== taskToDelete),
        ])
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="flex gap-6 p-6">
        {Object.keys(tasks).map((column) => (
          <Column
            key={column}
            title={column}
            tasks={tasks[column]}
            moveTask={moveTask}
            onDeleteTask={handleDeleteTask}
            onViewDetails={(task) => {
              setSelectedTask(task);
              onOpenDetails();
            }}
            onAddTask={() => {
              setCurrentColumn(column);
              onOpen();
            }}
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
    </DndProvider>
  );
}
