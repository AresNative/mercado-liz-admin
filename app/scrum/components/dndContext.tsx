"use client";
import { usePutTaskStatusMutation, usePutTaskOrderMutation, useGetSprintsQuery } from "@/hooks/reducers/api";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useState } from "react";
import MainForm from "@/components/form/main-form";
import { Column } from "./column";
import { SprintField } from "../constants/sprints";

interface Context {
    pryectId: string;
    statusColumns: string[];
}
export default function DNDContext({ pryectId, statusColumns }: Context) {
    const [activeTask, setActiveTask] = useState<any>(null);
    const [overColumn, setOverColumn] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);

    const [putTaskStatus] = usePutTaskStatusMutation();
    const [putTaskOrder] = usePutTaskOrderMutation();

    const { data: sprintsData = [], isLoading: sprintsLoading, refetch: refetchSprints } = useGetSprintsQuery(pryectId);

    const handleDragStart = (event: any) => {
        const { active } = event;
        setActiveTask(tasks.find(task => task.id === active.id));
    };

    const handleDragOver = (event: any) => {
        const { over } = event;
        if (activeTask) {
            const updatedTasks = tasks.map(task => {
                if (task.id === activeTask.id) {
                    return { ...task, column: over.id };
                }
                return task;
            });
            setTasks(updatedTasks);
        }
    };

    const handleDragEnd = async (event: any) => {
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
                        /* refetchTasks(); */
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
    return (
        <>
            <MainForm
                message_button={'Buscar'}
                actionType={"add-sprint"}
                dataForm={SprintField()}
            />
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="w-full flex gap-4 overflow-auto">
                    {statusColumns.map((status) =>
                        <Column
                            key={status}
                            status={status}
                            statusColumns={statusColumns}
                            rows={tasks}
                            activeTask={activeTask}
                            overColumn={overColumn}
                        />
                    )}
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
        </>
    );
}