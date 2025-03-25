"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { type Task, type TaskStatus, updateTaskStatus, createTask, updateTask, deleteTask } from "@/app/scrum/lib/data"
import { Package, Edit, Trash2, GripVertical, User, PenSquare } from "lucide-react"
import CardResumen from "@/app/mermas/components/card-resumen"
import { Modal } from "@/components/modal"
import MainForm from "@/components/form/main-form"
import { useAppDispatch } from "@/hooks/selector"
import { closeModalReducer, openModalReducer } from "@/hooks/reducers/drop-down"

interface ScrumBoardProps {
    initialTasks: Task[]
}

const COLUMNS: { id: TaskStatus; name: string }[] = [
    { id: "backlog", name: "Backlog" },
    { id: "todo", name: "Por hacer" },
    { id: "in-progress", name: "En progreso" },
    { id: "done", name: "Completado" },
]

const PRIORITY_COLORS = {
    low: "#dcfce7", // Light green
    medium: "#fef9c3", // Light yellow
    high: "#fee2e2", // Light red
}

const PRIORITY_TEXT_COLORS = {
    low: "#166534", // Dark green
    medium: "#854d0e", // Dark yellow
    high: "#991b1b", // Dark red
}

export function ScrumBoard({ initialTasks }: ScrumBoardProps) {

    const dispatch = useAppDispatch();
    const [tasks, setTasks] = useState<Task[]>(
        initialTasks.map((task) => ({
            ...task,
            priority: task.priority || "medium",
            tags: task.tags || ["planning"],
        })),
    )
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: "",
        description: "",
        status: "backlog",
        assignee: "",
        storyPoints: 1,
        priority: "medium",
        tags: ["planning"],
    })
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [newTag, setNewTag] = useState("")
    const [draggedTask, setDraggedTask] = useState<string | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
    const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null)
    const [dragPosition, setDragPosition] = useState<"above" | "below" | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    // Ref to store the original order of tasks before dragging
    const originalTasksRef = useRef<Task[]>([])

    // Calculate total story points
    const totalStoryPoints = tasks.reduce((sum, task) => sum + task.storyPoints, 0)

    // Group tasks by status
    const tasksByStatus = COLUMNS.reduce(
        (acc, column) => {
            acc[column.id] = tasks.filter((task) => task.status === column.id)
            return acc
        },
        {} as Record<TaskStatus, Task[]>,
    )

    // Set up drag and drop event handlers
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setCreateModalOpen(false)
                setDetailsModalOpen(false)
                setEditModalOpen(false)
            }
        }

        document.addEventListener("keydown", handleEscapeKey)
        return () => {
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        // Store the original tasks order before dragging
        originalTasksRef.current = [...tasks]

        e.dataTransfer.setData("text/plain", taskId)
        setDraggedTask(taskId)

        // Set a custom drag image (optional)
        const draggedTaskElement = document.getElementById(`task-${taskId}`)
        if (draggedTaskElement) {
            const rect = draggedTaskElement.getBoundingClientRect()
            e.dataTransfer.setDragImage(draggedTaskElement, rect.width / 2, rect.height / 2)
        }

        // For better UX, set effectAllowed
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
        e.preventDefault() // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move"
        setDragOverColumn(columnId)
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault() // Prevent default to allow drop
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        // Only clear if we're leaving the column, not entering a child element
        if (!e.relatedTarget || !(e.currentTarget as Node).contains(e.relatedTarget as Node)) {
            setDragOverColumn(null)
        }
    }

    const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.preventDefault()
        e.stopPropagation()

        if (draggedTask === taskId) return

        const targetRect = e.currentTarget.getBoundingClientRect()
        const mouseY = e.clientY
        const threshold = targetRect.top + targetRect.height / 2

        setDragOverTaskId(taskId)
        setDragPosition(mouseY < threshold ? "above" : "below")
    }

    const handleTaskDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        // Only clear if we're leaving the task, not entering a child element
        if (!e.relatedTarget || !(e.currentTarget as Node).contains(e.relatedTarget as Node)) {
            setDragOverTaskId(null)
            setDragPosition(null)
        }
    }

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: TaskStatus) => {
        e.preventDefault()
        e.stopPropagation()

        setDragOverColumn(null)
        setDragOverTaskId(null)
        setDragPosition(null)

        const taskId = e.dataTransfer.getData("text/plain")
        const draggedTaskObj = tasks.find((t) => t.id === taskId)

        if (!draggedTaskObj) {
            setDraggedTask(null)
            return
        }

        // If dropping directly on a column (not on a task)
        if (draggedTaskObj.status !== columnId) {
            // Optimistically update UI
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: columnId } : task)))

            try {
                // Update on server
                await updateTaskStatus(taskId, columnId)
            } catch (error) {
                console.error("Failed to update task status:", error)
                // Revert on error
                setTasks(originalTasksRef.current)
            }
        }

        setDraggedTask(null)
    }

    const handleTaskDrop = async (e: React.DragEvent<HTMLDivElement>, targetTaskId: string) => {
        e.preventDefault()
        e.stopPropagation()

        setDragOverTaskId(null)
        setDragPosition(null)

        const taskId = e.dataTransfer.getData("text/plain")
        if (taskId === targetTaskId) {
            setDraggedTask(null)
            return
        }

        const draggedTaskObj = tasks.find((t) => t.id === taskId)
        const targetTaskObj = tasks.find((t) => t.id === targetTaskId)

        if (!draggedTaskObj || !targetTaskObj) {
            setDraggedTask(null)
            return
        }

        // Create a new array with the updated order
        const newTasks = [...tasks]

        // If moving between columns
        if (draggedTaskObj.status !== targetTaskObj.status) {
            // Update the status of the dragged task
            const updatedDraggedTask = { ...draggedTaskObj, status: targetTaskObj.status }

            // Remove the dragged task from its original position
            const filteredTasks = newTasks.filter((t) => t.id !== taskId)

            // Find the index of the target task
            const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId)

            // Insert the dragged task at the appropriate position
            const insertIndex = dragPosition === "above" ? targetIndex : targetIndex + 1
            filteredTasks.splice(insertIndex, 0, updatedDraggedTask)

            // Update the tasks state
            setTasks(filteredTasks)

            try {
                // Update on server
                await updateTaskStatus(taskId, targetTaskObj.status)
            } catch (error) {
                console.error("Failed to update task status:", error)
                // Revert on error
                setTasks(originalTasksRef.current)
            }
        } else {
            // Reordering within the same column
            // Remove the dragged task from its original position
            const filteredTasks = newTasks.filter((t) => t.id !== taskId)

            // Find the index of the target task
            const targetIndex = filteredTasks.findIndex((t) => t.id === targetTaskId)

            // Insert the dragged task at the appropriate position
            const insertIndex = dragPosition === "above" ? targetIndex : targetIndex + 1
            filteredTasks.splice(insertIndex, 0, draggedTaskObj)

            // Update the tasks state
            setTasks(filteredTasks)
        }

        setDraggedTask(null)
    }

    const handleCreateTaskSuccess = (formData: any) => {
        const newTaskData = {
            ...formData,
            tags: formData.tags || ["planning"],
            priority: formData.priority || "medium",
            storyPoints: parseInt(formData.storyPoints) || 1
        }

        setTasks((prevTasks) => [...prevTasks, newTaskData])
        setNewTask({
            title: "",
            description: "",
            status: "backlog",
            assignee: "",
            storyPoints: 1,
            priority: "medium",
            tags: ["planning"],
        })
    }

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const createdTask = await createTask(newTask as Omit<Task, "id" | "createdAt" | "updatedAt">)
            setTasks((prevTasks) => [...prevTasks, createdTask])
            setNewTask({
                title: "",
                description: "",
                status: "backlog",
                assignee: "",
                storyPoints: 1,
                priority: "medium",
                tags: ["planning"],
            })
            setCreateModalOpen(false)
        } catch (error) {
            console.error("Failed to create task:", error)
        }
    }

    const handleUpdateTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingTask) return

        try {
            const { id, createdAt, updatedAt, ...updates } = editingTask
            const updatedTask = await updateTask(id, updates)

            if (updatedTask) {
                setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)))
            }

            setEditingTask(null)
            setEditModalOpen(false)
        } catch (error) {
            console.error("Failed to update task:", error)
        }
    }

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id)
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
            setDetailsModalOpen(false)
        } catch (error) {
            console.error("Failed to delete task:", error)
        }
    }

    const openTaskDetails = (task: Task) => {
        setSelectedTask(task)
        setDetailsModalOpen(true)
    }

    const openEditTask = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingTask(task)
        setEditModalOpen(true)
    }

    const confirmDeleteTask = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (window.confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
            handleDeleteTask(id)
        }
    }

    const addTag = (taskState: "new" | "edit") => {
        if (!newTag.trim()) return

        if (taskState === "new") {
            setNewTask({
                ...newTask,
                tags: [...(newTask.tags || []), newTag.trim()],
            })
        } else if (editingTask) {
            setEditingTask({
                ...editingTask,
                tags: [...(editingTask.tags || []), newTag.trim()],
            })
        }

        setNewTag("")
    }

    const removeTag = (tag: string, taskState: "new" | "edit") => {
        if (taskState === "new") {
            setNewTask({
                ...newTask,
                tags: (newTask.tags || []).filter((t) => t !== tag),
            })
        } else if (editingTask) {
            setEditingTask({
                ...editingTask,
                tags: (editingTask.tags || []).filter((t) => t !== tag),
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <CardResumen
                icon={<Package className="text-white" />}
                title={`Actividad`}
                value={"21 pts"}
            />
            {/* Task Board */}
            <div className="flex justify-end mb-4">
                <button
                    className={`px-2 py-1 md:px-3 md:py-2 border dark:border-zinc-700 rounded-lg flex gap-1 md:gap-2 items-center transition-colors bg-indigo-500 text-white border-indigo-700'
                            hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700`}
                    onClick={() => dispatch(openModalReducer({ modalName: "createTask", isOpen: true }))}
                >
                    <span className="text-xs md:text-sm">Añadir tarea</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {COLUMNS.map((column) => (
                    <div key={column.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{column.name}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {tasksByStatus[column.id].length}
                            </span>
                        </div>
                        <div
                            id={`column-${column.id}`}
                            className={`min-h-[200px] rounded-lg border p-2 space-y-2 transition-colors ${dragOverColumn === column.id ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-gray-50"
                                }`}
                            onDragOver={(e) => handleDragOver(e, column.id)}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, column.id)}
                        >
                            {tasksByStatus[column.id].map((task) => (
                                <div
                                    key={task.id}
                                    id={`task-${task.id}`}
                                    className={`cursor-pointer rounded-md border bg-white shadow-sm hover:shadow p-3 ${draggedTask === task.id ? "opacity-50" : "opacity-100"
                                        } ${dragOverTaskId === task.id
                                            ? dragPosition === "above"
                                                ? "border-t-2 border-t-indigo-500"
                                                : "border-b-2 border-b-indigo-500"
                                            : ""
                                        }`}
                                    onClick={() => openTaskDetails(task)}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onDragOver={(e) => handleTaskDragOver(e, task.id)}
                                    onDragLeave={handleTaskDragLeave}
                                    onDrop={(e) => handleTaskDrop(e, task.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                                        <div className="flex items-center space-x-1">
                                            <button onClick={(e) => openEditTask(task, e)} className="text-gray-400 hover:text-gray-500">
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => confirmDeleteTask(task.id, e)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="cursor-grab">
                                                <GripVertical size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <p
                                        className="mt-1 text-xs text-gray-500 overflow-hidden text-ellipsis"
                                        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                                    >
                                        {task.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {task.tags &&
                                            task.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span
                                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                            style={{
                                                backgroundColor: PRIORITY_COLORS[task.priority || "medium"],
                                                color: PRIORITY_TEXT_COLORS[task.priority || "medium"],
                                            }}
                                        >
                                            {task.priority || "medium"}
                                        </span>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <User size={12} className="mr-1" />
                                            {task.assignee}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            <Modal modalName="createTask" title="Crear Nueva Tarea">
                <MainForm
                    message_button="Crear"
                    actionType="add-task"
                    dataForm={[
                        {
                            type: "INPUT",
                            name: "title",
                            label: "Título",
                            placeholder: "Ingrese el título de la tarea",
                            require: true
                        },
                        {
                            type: "TEXT_AREA",
                            name: "description",
                            label: "Descripción",
                            placeholder: "Ingrese la descripción de la tarea",
                            require: true
                        },
                        {
                            type: "INPUT",
                            name: "assignee",
                            label: "Asignado a",
                            placeholder: "Ingrese el nombre del asignado",
                            require: true
                        },
                        {
                            type: "SELECT",
                            name: "priority",
                            label: "Prioridad",
                            valueDefined: editingTask?.priority || "medium",
                            options: [
                                { value: "low", label: "Baja" },
                                { value: "medium", label: "Media" },
                                { value: "high", label: "Alta" }
                            ],
                            require: true
                        },
                        {
                            type: "TAG_INPUT",
                            name: "tags",
                            label: "Etiquetas",
                            valueDefined: editingTask?.tags || [],
                            placeholder: "Añadir etiqueta",
                            require: false
                        },
                        {
                            type: "INPUT",
                            name: "storyPoints",
                            label: "Puntos de Historia",
                            minLength: 1,
                            valueDefined: editingTask?.storyPoints || 1,
                            require: true
                        },
                        {
                            type: "SELECT",
                            name: "status",
                            label: "Estado",
                            valueDefined: editingTask?.status || "backlog",
                            options: [
                                { value: "backlog", label: "Backlog" },
                                { value: "todo", label: "Por hacer" },
                                { value: "in-progress", label: "En progreso" },
                                { value: "done", label: "Completado" }
                            ],
                            require: true
                        }
                    ]}
                    onSuccess={(result, formData) => {
                        handleCreateTaskSuccess(formData);
                        dispatch(closeModalReducer({ modalName: "createTask" }));
                    }}
                />
            </Modal>

            {/* Task Details Modal */}
            {
                detailsModalOpen && selectedTask && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            <div
                                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                                onClick={() => setDetailsModalOpen(false)}
                            ></div>
                            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>
                            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900">Detalles de la Tarea</h3>
                                            <div className="mt-4 space-y-4">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Título</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTask.title}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTask.description}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Asignado a</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTask.assignee}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Prioridad</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTask.priority || "media"}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Etiquetas</h4>
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        {selectedTask.tags &&
                                                            selectedTask.tags.map((tag, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Puntos de Historia</h4>
                                                    <p className="mt-1 text-sm text-gray-900">{selectedTask.storyPoints}</p>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                                                    <p className="mt-1 text-sm text-gray-900">
                                                        {COLUMNS.find((c) => c.id === selectedTask.status)?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTask(selectedTask)
                                            setDetailsModalOpen(false)
                                            setEditModalOpen(true)
                                        }}
                                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        <PenSquare size={16} className="mr-2" />
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTask(selectedTask.id)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-base font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Eliminar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDetailsModalOpen(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Task Modal */}
            <Modal modalName="editTask" title="Editar Tarea">
                {editingTask && (
                    <MainForm
                        message_button="Guardar"
                        dataForm={[
                            {
                                type: "INPUT",
                                name: "title",
                                label: "Título",
                                placeholder: "Ingrese el título de la tarea",
                                require: true
                            },
                            {
                                type: "TEXT_AREA",
                                name: "description",
                                label: "Descripción",
                                placeholder: "Ingrese la descripción de la tarea",
                                require: true
                            },
                            {
                                type: "INPUT",
                                name: "assignee",
                                label: "Asignado a",
                                placeholder: "Ingrese el nombre del asignado",
                                require: true
                            },
                            {
                                type: "SELECT",
                                name: "priority",
                                label: "Prioridad",
                                valueDefined: editingTask?.priority || "medium",
                                options: [
                                    { value: "low", label: "Baja" },
                                    { value: "medium", label: "Media" },
                                    { value: "high", label: "Alta" }
                                ],
                                require: true
                            },
                            {
                                type: "TAG_INPUT",
                                name: "tags",
                                label: "Etiquetas",
                                valueDefined: editingTask?.tags || [],
                                placeholder: "Añadir etiqueta",
                                require: false
                            },
                            {
                                type: "INPUT",
                                name: "storyPoints",
                                label: "Puntos de Historia",
                                minLength: 1,
                                valueDefined: editingTask?.storyPoints || 1,
                                require: true
                            },
                            {
                                type: "SELECT",
                                name: "status",
                                label: "Estado",
                                valueDefined: editingTask?.status || "backlog",
                                options: [
                                    { value: "backlog", label: "Backlog" },
                                    { value: "todo", label: "Por hacer" },
                                    { value: "in-progress", label: "En progreso" },
                                    { value: "done", label: "Completado" }
                                ],
                                require: true
                            }
                        ]/* [
                            {
                                type: "INPUT",
                                name: "title",
                                label: "Título",
                                placeholder: "Título de la tarea",
                                valueDefined: editingTask.title,
                                require: true
                            },
                            {
                                type: "TEXT_AREA",
                                name: "description",
                                label: "Descripción",
                                placeholder: "Descripción de la tarea",
                                valueDefined: editingTask.description,
                                require: true
                            },
                            {
                                type: "INPUT",
                                name: "assignee",
                                label: "Asignado a",
                                placeholder: "Nombre del asignado",
                                valueDefined: editingTask.assignee,
                                require: true
                            },
                            {
                                type: "SELECT",
                                name: "priority",
                                label: "Prioridad",
                                valueDefined: editingTask.priority,
                                options: [
                                    { value: "low", label: "Baja" },
                                    { value: "medium", label: "Media" },
                                    { value: "high", label: "Alta" }
                                ]
                            },
                            {
                                type: "TAG_INPUT",
                                name: "tags",
                                label: "Etiquetas",
                                valueDefined: editingTask.tags,
                                placeholder: "Añadir etiqueta"
                            },
                            {
                                type: "INPUT",
                                name: "storyPoints",
                                label: "Puntos de Historia",
                                minLength: 1,
                                valueDefined: editingTask.storyPoints
                            },
                            {
                                type: "SELECT",
                                name: "status",
                                label: "Estado",
                                valueDefined: editingTask.status,
                                options: [
                                    { value: "backlog", label: "Backlog" },
                                    { value: "todo", label: "Por hacer" },
                                    { value: "in-progress", label: "En progreso" },
                                    { value: "done", label: "Completado" }
                                ]
                            }
                        ] */}
                        actionType="edit-task"
                        action={() => {
                            dispatch(closeModalReducer({ modalName: "editTask" }));
                            setEditingTask(null);
                        }}
                    />
                )}
            </Modal>
        </div >
    )
}

