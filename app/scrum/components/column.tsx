import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Task } from '../constants/types';
import { SortableTask } from './tasks';
import { colorBorderClasses } from '@/utils/constants/colors';

interface ColumnProps {
    status: string;
    tasks: Task[];
    activeTask: Task | null;
    overColumn: string | null;
    statusColumns: string[];
}

export const Column: React.FC<ColumnProps> = ({ status, tasks, activeTask, overColumn, statusColumns }) => {
    const { setNodeRef } = useDroppable({ id: status });

    // Memoize filtered tasks to avoid re-filtering on every render
    const filteredTasks = useMemo(() =>
        tasks
            .filter((task) => task.estado === status)
            .sort((a, b) => (a.order || 0) - (b.order || 0)),
        [tasks, status]
    );

    const showDropArea = useMemo(() =>
        activeTask && activeTask.estado !== status && overColumn === status,
        [activeTask, overColumn, status]
    );

    const columnColor = useMemo(() => {
        const colors = Object.keys(colorBorderClasses);
        const colorIndex = statusColumns.indexOf(status) % colors.length;
        return colors[colorIndex];
    }, [status, statusColumns]);

    // Memoize class strings to avoid recalculating on each render
    const { borderColorClass, bgColorClass } = useMemo(() => {
        const [border, bg] = colorBorderClasses[columnColor as keyof typeof colorBorderClasses].split(' ');
        return { borderColorClass: border, bgColorClass: bg };
    }, [columnColor]);

    return (
        <div
            ref={setNodeRef}
            className={`min-w-80 w-80 min-h-[40rem] bg-white p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:shadow-lg ${borderColorClass} border-l-4`}
        >
            <h3 className={`font-bold mb-4 capitalize flex items-center text-lg ${bgColorClass} -mx-4 -mt-4 p-4 rounded-t-lg`}>
                <span className={`w-3 h-3 rounded-full mr-2 ${borderColorClass.replace('border', 'bg')}`} aria-hidden="true"></span>
                {status}
                <span className="ml-2 text-sm text-gray-600 font-normal">({filteredTasks.length})</span>
            </h3>
            <div className="relative mt-2">
                {showDropArea && (
                    <div className="absolute min-h-[35rem] top-0 left-0 right-0 border-2 border-dashed border-gray-400 rounded-lg p-4 mb-2 bg-gray-100 z-10">
                        <span className="text-gray-600 font-medium">Soltar aquí</span>
                    </div>
                )}
                <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {filteredTasks.map((task) => (
                        <SortableTask key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
