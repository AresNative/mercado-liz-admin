'use client'
import { useState, useRef } from "react";
import { TriangleAlert } from "lucide-react";

export default function Alert() {
    const [open, setOpen] = useState(true);
    const dialogRef: any = useRef(null);

    const closeDialog = () => {
        setOpen(false);
        dialogRef.current?.close();
    };

    const deactivateAccount = () => {
        closeDialog();
    };

    return (
        <section className={open ? `absolute inset-x-0 top-0 z-50 h-screen flex items-center justify-center backdrop-blur-lg bg-black bg-opacity-20` : `hidden`}>
            <dialog
                ref={dialogRef}
                open={open}
                className="max-w-lg w-full rounded-lg bg-white shadow-xl p-6 z-20 backdrop-blur-lg"
            >
                <div className="flex items-start space-x-4">
                    {/* Icono */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full">
                        <TriangleAlert className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Deactivate account</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                        </p>
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
                        onClick={deactivateAccount}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-500"
                    >
                        Deactivate
                    </button>
                </div>
            </dialog>
        </section>
    );
}
