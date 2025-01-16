'use client';

import { useAppSelector } from "@/hooks/selector";
import { alertClasses } from "@/utils/constants/colors";
import { useState, useRef, ReactNode, useEffect } from "react";

interface AlertProps {
    message: string;
    icon: ReactNode;
    type: 'success' | 'error' | 'warning' | 'completed' | 'info';
    action?: (...args: any[]) => any;
}

export default function Alert({ message, action, type }: AlertProps) {
    const selector = useAppSelector((state) => state.dropDownReducer);
    const [open, setOpen] = useState(false);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const styles = alertClasses[type];

    useEffect(() => {
        if (selector.message) {
            setOpen(true);
            // Ocultar la alerta automáticamente después de 'duration' milisegundos
            const timer = setTimeout(() => {
                setOpen(false);
            }, selector.duration);

            return () => clearTimeout(timer);
        }
    }, [selector]);

    const closeDialog = () => {
        setOpen(false);
        dialogRef.current?.close();
    };

    const handleAction = () => {
        if (action) {
            action(); // Ejecutar la acción si está definida
        }
        setOpen(false); // Cerrar la alerta
    };
    return (
        <section
            className={
                open
                    ? "absolute inset-x-0 top-0 z-50 h-screen flex items-center justify-center backdrop-blur-lg bg-black bg-opacity-20"
                    : "hidden"
            }
        >
            <dialog
                ref={dialogRef}
                open={open}
                className="max-w-lg w-full rounded-lg bg-white shadow-xl p-6 z-20 backdrop-blur-lg"
            >
                <div className="flex items-start space-x-4">
                    {/* Icono */}
                    <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full ${styles.bg}`}
                    >
                        {selector.icon}
                    </div>
                    <div>
                        <h3 className={`text-lg font-semibold ${styles.text}`}>{selector.message}</h3>
                        <p className="mt-2 text-sm text-gray-500">{message}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    {/* Botón de Cancelar */}
                    <button
                        onClick={closeDialog}
                        className="px-4 py-2 text-sm font-semibold text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    {/* Botón de Deactivar */}
                    <button
                        onClick={handleAction}
                        className={`px-4 py-2 text-sm font-semibold ${styles.text} ${styles.bg} ring-1 ring-inset ${styles.ring} rounded-md ${styles.hover} transition-all`}
                    >
                        Deactivate
                    </button>
                </div>
            </dialog>
        </section>
    );
}
