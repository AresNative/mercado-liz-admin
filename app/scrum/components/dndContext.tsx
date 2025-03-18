"use client";
import React, { useEffect, useState, useCallback } from "react";
import { DndContext, DragOverlay, closestCenter, DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { usePutTaskStatusMutation, usePutTaskOrderMutation, useGetSprintsQuery, useGetTasksQuery } from "@/hooks/reducers/api";
import MainForm from "@/components/form/main-form";
import { SprintField } from "../constants/sprints";
import { Task } from "../constants/types";
import { Column } from "./column";
import Details from "@/components/details";
import { TasksField } from "../constants/tasks";

interface DNDContextProps {
    projectId: string;
    statusColumns: string[];
}

export default function DNDContext({ projectId, statusColumns }: DNDContextProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [overColumn, setOverColumn] = useState<string | null>(null);
    const [Sprint, SetSprint] = useState(projectId);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [putTaskStatus] = usePutTaskStatusMutation();
    const [putTaskOrder] = usePutTaskOrderMutation();

    const { data: sprintsData = [], isLoading: sprintsLoading, refetch: refetchSprint } = useGetSprintsQuery(projectId);
    const { data: tasksData = [], isLoading: tasksLoading, refetch: refetchTasks } = useGetTasksQuery(Sprint);

    useEffect(() => {
        if (tasksData.length > 0) {
            const filteredTasks = tasksData.filter((t: Task) => t.estado !== 'archivado');
            setTasks(filteredTasks);
        }
    }, [tasksData, refetchTasks]);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id) || null;
        setActiveTask(task);
    }, [tasks]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { over } = event;
        if (over) setOverColumn(over.id as string);
    }, []);

    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);
        setOverColumn(null);

        if (!over) return;

        const activeTask = tasks.find(t => t.id === active.id);
        if (!activeTask) return;

        const newStatus = over.id as string;
        if (!statusColumns.includes(newStatus)) {
            // Reordenar dentro de la misma columna
            if (over.data.current?.sortable) {
                const overTask = tasks.find(t => t.id === over.id);
                if (overTask && active.id !== over.id) {
                    const activeIndex = tasks.findIndex(t => t.id === active.id);
                    const overIndex = tasks.findIndex(t => t.id === over.id);

                    const tasksInSameStatus = tasks
                        .filter(t => t.estado === activeTask.estado)
                        .sort((a, b) => (a.order || 0) - (b.order || 0));

                    const newOrder = overIndex === tasksInSameStatus.length - 1
                        ? (overTask.order || 0) + 1
                        : Math.floor(((overTask.order || 0) + (tasksInSameStatus[overIndex + 1]?.order || 0)) / 2);

                    try {
                        await putTaskOrder({ taskId: active.id, order: newOrder }).unwrap();
                        setTasks(prevTasks => {
                            const newTasks = arrayMove(prevTasks, activeIndex, overIndex);
                            return newTasks.map(task =>
                                task.id === active.id
                                    ? { ...task, order: newOrder }
                                    : task
                            );
                        });
                    } catch (error) {
                        console.log('Error updating task order:', error);
                    }
                }
            }
            return;
        }

        // Validar movimiento entre columnas
        if (activeTask.estado === newStatus) {
            console.warn('Movimiento no permitido entre columnas');
            return;
        }

        try {
            await putTaskStatus({ taskId: active.id, estado: newStatus }).unwrap();
            const newOrder = 1;

            await putTaskOrder({ taskId: active.id, order: newOrder }).unwrap();

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
            console.log('Error updating task status or order:', error);
        }
    }, [tasks, statusColumns, putTaskOrder, putTaskStatus]);

    if (tasksLoading || sprintsLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <ul className="flex flex-wrap gap-4 justify-start">
                <li className="flex-grow">
                    <Details
                        title="Agregar tarea"
                        type="form"
                        children={
                            <MainForm
                                message_button={'Enviar'}
                                actionType={"add-task"}
                                dataForm={TasksField()}
                                aditionalData={{
                                    sprint_id: Sprint,
                                    estado: statusColumns[0],
                                    order: 1
                                }}
                                action={refetchTasks}
                            />
                        }
                    />
                </li>

                <li className="flex-grow">
                    <MainForm
                        message_button={'Buscar'}
                        actionType={"add-sprint"}
                        dataForm={SprintField(sprintsData)}
                        action={async (data) => {
                            SetSprint(data);
                            setTasks([])
                            await refetchTasks()
                        }}
                        valueAssign="sprint"
                    />
                </li>
            </ul>

            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex gap-4 overflow-auto p-4">
                    {statusColumns.map((status) => (
                        <Column
                            key={status}
                            status={status}
                            statusColumns={statusColumns}
                            tasks={tasks}
                            activeTask={activeTask}
                            overColumn={overColumn}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeTask && (
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded shadow opacity-80">
                            <div className="font-medium">{activeTask.nombre}</div>
                            <div className="text-sm text-gray-600 dark:text-white truncate">{activeTask.descripcion || 'Sin descripcion'}</div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </>
    );
}