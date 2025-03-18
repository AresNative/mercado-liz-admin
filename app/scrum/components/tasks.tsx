import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePutTaskStatusMutation } from "@/hooks/reducers/api";
import { Button } from "@/components/button";
import { Task } from "../constants/types";
import { Archive, Eye } from "lucide-react";
import Badge from "@/components/badge";

interface SortableTaskProps {
    task: Task;
    refetch?: () => void;
}

const getPriorityClass = (priority: string) => {
    switch (priority) {
        case "alta":
            return "red";
        case "media":
            return "yellow";
        case "baja":
            return "blue";
        default:
            return "gray";
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
            console.log("Error archiving task:", error);
        }
    };

    const handleView = (event: React.MouseEvent): void => {
        event.stopPropagation(); // Evitar conflicto con el drag
    };

    return (
        <section className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 mb-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="cursor-move"
            >
                {/* Encabezado */}
                <div className="flex items-center justify-between">
                    <h3 className="dark:text-white font-semibold text-gray-800 text-sm truncate">
                        {task.nombre}
                    </h3>
                    <Badge
                        color={getPriorityClass(task.prioridad)}
                        text={task.prioridad || "N/A"}
                    />
                </div>

                {/* Descripción */}
                <p className="text-sm text-gray-600 dark:text-white mt-2 truncate">
                    {task.descripcion || "Sin descripción"}
                </p>


            </div>{/* Acciones */}
            <ul className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-200">
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
        </section>
    );
};
