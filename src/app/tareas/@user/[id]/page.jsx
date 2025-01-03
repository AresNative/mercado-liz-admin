"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useGetSprintsQuery,
  useGetTasksQuery,
  usePostSprintsMutation,
  usePostTasksMutation,
  usePutTaskOrderMutation,
  usePutTaskStatusMutation,
} from "@/actions/reducers/api-reducer";
import { Button, Card, CardHeader, Select, SelectItem, Input } from "@nextui-org/react";
import { isEqual } from "lodash";

const statusColumns = ["pendiente", "proceso", "pruebas", "terminado"];
  
const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const ScrumBoard = ({ params }) => {
  const { id } = React.use(params);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newSprintName, setNewSprintName] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("media");
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  const { data: sprintsData = [], isLoading: sprintsLoading } = useGetSprintsQuery(id);
  const { data: tasksData = [], isLoading: tasksLoading, refetch: refetchTasks } = useGetTasksQuery(selectedSprint);

  const [postSprints] = usePostSprintsMutation();
  const [postTask] = usePostTasksMutation();
  const [putTaskStatus] = usePutTaskStatusMutation();
  const [putTaskOrder] = usePutTaskOrderMutation();

  const columnColors = useMemo(() => {
    return statusColumns.reduce((acc, status) => {
      acc[status] = generateRandomColor();
      return acc;
    }, {});
  }, [statusColumns]);

  useEffect(() => {
    if (!isEqual(tasksData, tasks)) {
      setTasks(tasksData);
    }
  }, [tasksData]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
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
    setActiveId(null);
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

      const tasksInNewStatus = tasks.filter(t => t.estado === newStatus);
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

  const SortableTask = ({ task }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white p-3 mb-2 rounded shadow cursor-move"
      >
        <div className="font-medium">{task.nombre}</div>
        <div className="text-sm text-gray-600 truncate">{task.descripcion}</div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span className={`px-2 py-1 rounded ${
            task.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
            task.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.prioridad || 'N/A'}
          </span>
          <span>
            {task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}
          </span>
        </div>
      </div>
    );
  };

  const Column = ({ status }) => {
    const { setNodeRef } = useDroppable({
      id: status,
    });

    const filteredTasks = tasks
      .filter((task) => task.estado === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const showDropArea = activeTask && activeTask.estado !== status && overColumn === status;

    return (
      <div 
        ref={setNodeRef} 
        className="bg-gray-100 p-4 rounded-lg w-full min-h-[400px]"
        style={{ borderLeft: `4px solid ${columnColors[status]}` }}
      >
        <h3 className="font-bold mb-4 capitalize flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: columnColors[status] }}
          ></span>
          {status}
          <span className="ml-2 text-sm text-gray-500">
            ({filteredTasks.length})
          </span>
        </h3>
        <div className="relative">
          {showDropArea && (
            <div className="absolute top-0 left-0 right-0 border-2 border-dashed border-gray-400 rounded-lg p-4 mb-2 bg-gray-200 z-10">
              <span className="text-gray-600 font-medium">Soltar aquí</span>
            </div>
          )}
          <SortableContext
            items={filteredTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
              <SortableTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  };

  if (sprintsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Scrum Board</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Sprints</h2>
        <div className="flex items-center space-x-2 mb-2">
          <Input
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
            placeholder="Nombre del Sprint"
          />
          <Button onClick={handleAddSprint}>Agregar Sprint</Button>
        </div>
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
      </div>

      {selectedSprint && (
        <Card className="mb-4">
          <CardHeader>
            <h2 className="text-xl font-semibold">Tareas</h2>
          </CardHeader>
          <section className="p-4">
            <div className="space-y-4 mb-4">
              <Input
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Nombre de la tarea"
              />
              <Input
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Descripción de la tarea"
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
              <Button onClick={handleAddTask}>Agregar Tarea</Button>
            </div>
            <DndContext
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusColumns.map((status) => (
                  <Column key={status} status={status} />
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
        </Card>
      )}
    </div>
  );
};

export default ScrumBoard;

