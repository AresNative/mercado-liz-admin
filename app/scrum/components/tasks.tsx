
import { Button } from "@/components/button";
import { usePutTaskStatusMutation } from "@/hooks/reducers/api";
import { useAppDispatch } from "@/hooks/selector";
import {
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
interface Task {
    key: any;
    task: any;
    refetch?: () => void;
}
export const SortableTask = ({ task, refetch }: Task) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const dispatch = useAppDispatch();
    const [putTaskStatus] = usePutTaskStatusMutation();


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
            className="bg-white p-4 mb-4 rounded-lg shadow-lg cursor-move hover:shadow-xl transition-shadow"
        >
            <ul className="flex flex-col gap-3 w-full">
                <li className="flex items-center justify-between  gap-2">
                    <span className="font-semibold text-gray-800 text-xs truncate">{task.nombre}</span>
                    <div className="flex items-center gap-2">
                        <Button
                            color="completed"
                            label="Ver"
                            onClick={() => {
                                /* dispatch(openModal({ modalName: "add-project", isOpen: true })) */
                            }}
                        />
                        <Button
                            color="error"
                            onClick={async () => {
                                await putTaskStatus({
                                    taskId: task.id,
                                    estado: 'archivado',
                                }).unwrap();
                                /*  refetch() */
                            }}
                            label="Archivar"
                        />
                    </div>
                </li>
                <li className="text-sm text-gray-600 truncate">{task.descripcion}</li>
            </ul>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <span
                    className={`px-3 py-1 rounded-full font-medium text-center ${task.prioridad === 'alta'
                        ? 'bg-red-100 text-red-800'
                        : task.prioridad === 'media'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                >
                    {task.prioridad || 'N/A'}
                </span>
                <span>{task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</span>
            </div>
        </div>
    );
};
