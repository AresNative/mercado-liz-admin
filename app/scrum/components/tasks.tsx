import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePutTaskStatusMutation } from "@/hooks/reducers/api";
import { Button } from "@/components/button";
import { Task } from "../constants/types";
import { Archive, Eye } from "lucide-react";

interface SortableTaskProps {
    task: Task;
    refetch?: () => void;
}

const getPriorityClass = (priority: string) => {
    switch (priority) {
        case "alta":
            return "bg-red-100 text-red-700";
        case "media":
            return "bg-yellow-100 text-yellow-700";
        case "baja":
            return "bg-green-100 text-green-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export const SortableTask: React.FC<SortableTaskProps> = ({ task, refetch }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
    });

    const [putTaskStatus] = usePutTaskStatusMutation();

    // Memoize style to prevent recalculation on every render
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleArchive = async (event: React.MouseEvent): Promise<void> => {
        event.stopPropagation(); // Evitar que el evento de arrastre se dispare
        try {
            await putTaskStatus({
                taskId: task.id,
                estado: "archivado",
            }).unwrap();
            if (refetch) refetch();
        } catch (error) {
            console.error("Error archiving task:", error);
        }
    };

    const handleView = (event: React.MouseEvent): void => {
        event.stopPropagation(); // Evitar conflicto con el drag
        console.log("Botón Ver presionado.");
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 mb-4 rounded-lg shadow-lg cursor-move hover:shadow-xl transition-shadow"
        >
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {task.nombre}
                </h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClass(task.prioridad)}`}
                >
                    {task.prioridad || "N/A"}
                </span>
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mt-2 truncate">
                {task.descripcion || "Sin descripción"}
            </p>

            {/* Acciones */}
            <ul className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">
                    {task.fecha_vencimiento
                        ? new Date(task.fecha_vencimiento).toLocaleDateString()
                        : "Sin fecha"}
                </span>
                <li className="flex gap-2">
                    {/* Botón Ver */}
                    <Button
                        color="completed"
                        label="Ver"
                        onClick={handleView}
                        disabled={isDragging}
                    >
                        <Eye />
                    </Button>
                    {/* Botón Archivar */}
                    <Button
                        color="error"
                        label="Archivar"
                        onClick={handleArchive}
                        disabled={isDragging}
                    >
                        <Archive />
                    </Button>
                </li>
            </ul>
        </div>
    );
};
