import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableTask } from "./tasks";
import { useDroppable } from "@dnd-kit/core";

interface ColumnProps {
    status: string;
    rows: any[];
    activeTask: any;
    overColumn: any;
    statusColumns: string[];
}

export const Column: React.FC<ColumnProps> = ({ status, rows, activeTask, overColumn, statusColumns }) => {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    const filteredTasks = rows
        .filter((task: any) => task.estado === status)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const showDropArea = activeTask && activeTask.estado !== status && overColumn === status;

    const columnColorClasses = useMemo(() => {
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];
        return statusColumns.reduce((acc, status, index) => {
            const color = colors[index % colors.length];
            acc[status] = {
                border: `border-l-${color}-500`,
                bg: `bg-${color}-500`
            };
            return acc;
        }, {} as Record<string, { border: string; bg: string }>);
    }, [statusColumns]);

    const borderColorClass = columnColorClasses[status].border;
    const dotColorClass = columnColorClasses[status].bg;

    return (
        <div
            ref={setNodeRef}
            className={`min-w-80 min-h-[40rem] bg-gray-100 p-4 rounded-lg w-full border-l-4 ${borderColorClass}`}
        >
            <h3 className="font-bold mb-4 capitalize flex items-center">
                <span
                    className={`w-3 h-3 rounded-full mr-2 ${dotColorClass}`}
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
                    items={filteredTasks.map((t: any) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {filteredTasks.map((task: any) => (
                        <SortableTask
                            key={task.id}
                            task={task}
                            refetch={() => { }}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

