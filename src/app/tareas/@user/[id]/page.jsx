"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
} from "@dnd-kit/sortable";
import {
  useGetSprintsQuery,
  useGetTasksQuery,
  usePostCommentsMutation,
  usePostSprintsMutation,
  usePostTasksMutation,
  usePutTaskOrderMutation,
  usePutTaskStatusMutation,
} from "@/actions/reducers/api-reducer";
import { Button,Select, SelectItem, Input, AvatarGroup, Avatar } from "@nextui-org/react";
import { isEqual } from "lodash";
import ModalComponent from "@/components/ui/emerging/modal";
import SimplifiedDocEditor from "@/components/ux/doc";
import { Column } from "@/components/ux/scrum/col";

export const statusColumns = ["pendiente", "proceso", "pruebas", "terminado"];

const ScrumBoard = ({ params }) => {
  const { id } = React.use(params);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newSprintName, setNewSprintName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("media");
  const [activeTask, setActiveTask] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  const { data: sprintsData = [], isLoading: sprintsLoading, refetch: refetchSprints } = useGetSprintsQuery(id);
  const { data: tasksData = [], isLoading: tasksLoading, refetch: refetchTasks } = useGetTasksQuery(selectedSprint);

  const [postSprints] = usePostSprintsMutation();
  const [postTask] = usePostTasksMutation();
  const [putTaskStatus] = usePutTaskStatusMutation();
  const [putTaskOrder] = usePutTaskOrderMutation();
  const [postComments] = usePostCommentsMutation();

  useEffect(() => {
    if (!isEqual(tasksData, tasks)) {
      setTasks(tasksData.filter(t => t.estado !== 'archivado'));      
    }
  }, [tasksData]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(tasks.find(task => task.id === active.id));
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over && statusColumns.includes(over.id)) {
      setOverColumn(over.id);
    } else {
      setOverColumn(null);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverColumn(null);

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    const newStatus = over.id;
    
    if (!statusColumns.includes(newStatus)) {
      // Handle reordering within the same column
      if (over.data.current?.sortable) {
        const overTask = tasks.find(task => task.id === over.id);
        if (overTask && active.id !== over.id) {
          const activeIndex = tasks.findIndex(t => t.id === active.id);
          const overIndex = tasks.findIndex(t => t.id === over.id);
          
          const tasksInSameStatus = tasks
            .filter(t => t.estado === activeTask.estado)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          
          let newOrder;
          if (overIndex === tasksInSameStatus.length - 1) {
            newOrder = (overTask.order || 0) + 1;
          } else {
            const nextTask = tasksInSameStatus[overIndex + 1];
            newOrder = Math.floor(((overTask.order || 0) + (nextTask?.order || 0)) / 2);
          }

          try {
            await putTaskOrder({
              taskId: active.id,
              order: newOrder
            }).unwrap();

            setTasks(prevTasks => {
              const newTasks = arrayMove(prevTasks, activeIndex, overIndex);
              return newTasks.map(task => 
                task.id === active.id 
                  ? { ...task, order: newOrder }
                  : task
              );
            });
          } catch (error) {
            console.error('Error updating task order:', error);
          }
          finally {
            refetchTasks();
          }
        }
      }
      return;
    }

    // Validate column movement
    const isValidMove = activeTask.estado !== newStatus;

    if (!isValidMove) {
      console.warn('Movimiento no permitido entre columnas');
      return;
    }

    // Update task status and order
    try {
      await putTaskStatus({
        taskId: active.id,
        estado: newStatus
      }).unwrap();
       
      const newOrder = 1; // Set the new task to the beginning of the list

      await putTaskOrder({
        taskId: active.id,
        order: newOrder
      }).unwrap();

      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === active.id 
            ? { ...task, estado: newStatus, order: newOrder }
            : task.estado === newStatus
            ? { ...task, order: task.order + 1 }
            : task
        ).sort((a, b) => a.order - b.order)
      );
    } catch (error) {
      console.error('Error updating task status or order:', error);
    }
  };

  const handleAddSprint = async () => {
    if (newSprintName) {
      await postSprints({
        nombre: newSprintName,
        fecha_inicio: new Date().toISOString(),
        fecha_fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        estado: "nuevo",
        project_id: id
      });
      refetchSprints();
      setNewSprintName("");
    }
  };

  const handleAddTask = async () => {
    if (newTaskName && selectedSprint) {
      const maxOrder = Math.max(...tasks.map(t => t.order || 0), 0);
      await postTask({
        nombre: newTaskName,
        descripcion: newTaskDescription,
        sprint_id: selectedSprint,
        estado: statusColumns[0], // Set to the first status by default
        prioridad: newTaskPriority.currentKey,
        fecha_creacion: new Date().toISOString(),
        fecha_vencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        order: maxOrder + 1
      });
        refetchTasks();
      setNewTaskName("");
      setNewTaskDescription("");
    }
  };

  if (sprintsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  return (<>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tablero de scrum</h1>
        <ul className="flex flex-col gap-2 mb-2">
        <li className="flex items-center space-x-2">
        <Input
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
            placeholder="Nombre del Sprint"
          />
          <Button onClick={handleAddSprint}>Agregar Sprint</Button>
        </li>
        <li className="flex items-center space-x-2">
          <Select
            placeholder="Seleccionar Sprint"
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
          >
            {sprintsData.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.nombre}
              </SelectItem>
            ))}
          </Select>
          <AvatarGroup isBordered max={3}>
            {Array.from({ length: 6 }, (_, index) =>(<Avatar key={index} src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />))}
          </AvatarGroup>
        </li>
        </ul>
      {selectedSprint && (
        <div className="mb-4">
          <header>
            <h2 className="text-xl font-semibold">Tareas</h2>
          </header>
          <section>
            <ul className="space-y-4 mb-4">
              <li className="flex items-center space-x-2">
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Nombre de la tarea"
              />
              <Select
                placeholder="Prioridad"
                value={newTaskPriority}
                onSelectionChange={setNewTaskPriority}
               items={[
                        { value: "alta", label: "Alta" },
                        { value: "media", label: "Media" },
                        { value: "baja", label: "Baja" },
                    ]}
                >
                    {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
                </Select>
              </li>
              <li className="flex items-center space-x-2">
              <Input
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Descripción de la tarea"
              />
                <Button onClick={handleAddTask}>Agregar Tarea</Button>
              </li>
            </ul>
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="w-full flex gap-4 overflow-auto">
                {statusColumns.map((status) => (
                  <Column key={status} status={status} rows={tasks} activeTask={activeTask} refetchTasks={refetchTasks} overColumn={overColumn} />
                ))}
              </div>
              <DragOverlay>
                {activeTask && (
                  <div className="bg-white p-3 rounded shadow opacity-80">
                    <div className="font-medium">{activeTask.nombre}</div>
                    <div className="text-sm text-gray-600 truncate">{activeTask.descripcion}</div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </section>
        </div>
      )}
        
    </div>
  <ModalComponent
                title="Nuevo Proyecto"
                message_button="Agregar"
                functionString="add-project"
                content={<SimplifiedDocEditor />}
            />
  </>
  );
};

export default ScrumBoard;