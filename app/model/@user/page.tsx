"use client";

import { Modal } from "@/components/modal";
import { openModalReducer } from "@/hooks/reducers/drop-down";
import { useAppDispatch } from "@/hooks/selector";
import { useEffect, useRef, useState } from "react";
import { createSwapy } from "swapy";

interface Tasks {
    [key: string]: string[];
}
export default function ScrumBoard() {
    const containerRef = useRef<HTMLElement>(null);
    const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);
    const dispatch = useAppDispatch();
    const [tasks, setTasks] = useState<Tasks>({
        "To Do": ["Tarea 1", "Tarea 2", "Tarea 3"],
        "In Progress": ["Tarea 4", "Tarea 5", "Tarea 6"],
        "Done": ["Tarea 7", "Tarea 8", "Tarea 9"]
    });

    useEffect(() => {
        if (containerRef.current) {
            swapyRef.current = createSwapy(containerRef.current, {
                animation: 'dynamic',
                /* dragOnHold: true, */
            });

            const swapy = swapyRef.current;

            swapy.onBeforeSwap(() => true);
            swapy.onSwapStart(() => console.log('Swap start'));

            swapy.onSwap((event: any) => {
                /*  const { from, to, item } = event;
                 const task = item.task;
                 // Extraer la columna a partir del slot (formato "ColumnName-index")
                 const fromColumn = from.split('-')[0];
                 const toColumn = to.split('-')[0];
 
                 // Si se arrastra a otra columna, agregar una nueva instancia (sin eliminar la original)
                 if (fromColumn !== toColumn && task) {
                     setTasks((prevTasks) => {
                         const newTasks = { ...prevTasks };
                         newTasks[toColumn] = [...newTasks[toColumn], task];
                         return newTasks;
                     });
                 } 
                 
                <uses-permission android:name="android.permission.CAMERA" />
                <uses-feature android:name="android.hardware.camera" />
                 
                */
            });
            swapy.onSwapEnd(() => console.log('Swap end'));

            return () => {
                if (swapyRef.current) {
                    swapyRef.current.destroy();
                }
            };
        }
    }, []);

    return (
        <>
            <button onClick={() => dispatch(openModalReducer({ modalName: "taskDetails", isOpen: true }))} className="p-2 bg-blue-500 text-white rounded-lg">Nueva Tarea</button>
            <Modal modalName="taskDetails" title="Detalles de la Tarea">
                <div className="grid gap-4 p-4">
                    {/* Contenido del modal */}
                </div>
            </Modal>

            <section className="container grid grid-cols-3 gap-6 mt-6" ref={containerRef}>
                {Object.keys(tasks).map((status) => (
                    <div key={status} className="p-4 border rounded-lg dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800">
                        <h3 className="text-lg font-bold mb-4">{status}</h3>
                        <ul className="min-h-[200px] flex flex-col gap-4">
                            {tasks[status].map((task, i) => (
                                <div key={`${status}-${i}`} data-swapy-slot={`${status}-${i}`}>
                                    <div data-swapy-item={task} data-task={task} className="p-4 bg-white dark:bg-zinc-700 rounded-lg shadow-md cursor-grab">
                                        <div>{task}</div>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </>
    );
}
