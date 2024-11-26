"use client";

import { useState } from "react";

interface Concepto {
    id: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    importe: number;
    tasaIVA: number;
}

export default function GeneradorFacturasSupermercado() {
    const [emisor, setEmisor] = useState({ nombre: "Supermercado XYZ", rfc: "SUP123456ABC" });
    const [receptor, setReceptor] = useState({ nombre: "", rfc: "" });
    const [conceptos, setConceptos] = useState<Concepto[]>([]);
    const [nuevoConcepto, setNuevoConcepto] = useState<Concepto>({
        id: "",
        descripcion: "",
        cantidad: 0,
        precioUnitario: 0,
        importe: 0,
        tasaIVA: 16,
    });
    const [editingConcepto, setEditingConcepto] = useState<Concepto | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleAddConcepto = () => {
        if (!nuevoConcepto.descripcion || nuevoConcepto.cantidad <= 0 || nuevoConcepto.precioUnitario <= 0) {
            alert("Por favor, complete todos los campos del concepto correctamente.");
            return;
        }
        const importe = nuevoConcepto.cantidad * nuevoConcepto.precioUnitario;
        const newConcepto = { ...nuevoConcepto, importe, id: Date.now().toString() };
        setConceptos([...conceptos, newConcepto]);
        setNuevoConcepto({ id: "", descripcion: "", cantidad: 0, precioUnitario: 0, importe: 0, tasaIVA: 16 });
    };

    const handleRemoveConcepto = (id: string) => {
        setConceptos(conceptos.filter((concepto) => concepto.id !== id));
    };

    const handleEditConcepto = (concepto: Concepto) => {
        setEditingConcepto(concepto);
        setShowModal(true);
    };

    const handleUpdateConcepto = () => {
        if (editingConcepto) {
            const updatedConceptos = conceptos.map((c) =>
                c.id === editingConcepto.id
                    ? { ...editingConcepto, importe: editingConcepto.cantidad * editingConcepto.precioUnitario }
                    : c
            );
            setConceptos(updatedConceptos);
            setEditingConcepto(null);
            setShowModal(false);
        }
    };

    const subtotal = conceptos.reduce((sum, concepto) => sum + concepto.importe, 0);
    const iva = conceptos.reduce((sum, concepto) => sum + (concepto.importe * concepto.tasaIVA) / 100, 0);
    const total = subtotal + iva;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Generador de Facturas para Supermercado</h1>

            {/* Datos del Emisor */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Datos del Emisor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre:</label>
                        <input
                            type="text"
                            value={emisor.nombre}
                            onChange={(e) => setEmisor({ ...emisor, nombre: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">RFC:</label>
                        <input
                            type="text"
                            value={emisor.rfc}
                            onChange={(e) => setEmisor({ ...emisor, rfc: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </section>

            {/* Datos del Receptor */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Datos del Receptor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nombre:</label>
                        <input
                            type="text"
                            value={receptor.nombre}
                            onChange={(e) => setReceptor({ ...receptor, nombre: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">RFC:</label>
                        <input
                            type="text"
                            value={receptor.rfc}
                            onChange={(e) => setReceptor({ ...receptor, rfc: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </section>

            {/* Conceptos */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Conceptos</h2>
                <div>
                    {conceptos.map((concepto) => (
                        <div
                            key={concepto.id}
                            className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                        >
                            <span>{concepto.descripcion}</span>
                            <span className="text-sm text-gray-700">Cantidad: {concepto.cantidad}</span>
                            <span className="text-sm text-gray-700">Importe: ${concepto.importe.toFixed(2)}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditConcepto(concepto)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleRemoveConcepto(concepto.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-lg font-semibold mt-4">Agregar Concepto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-2">
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={nuevoConcepto.descripcion}
                        onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, descripcion: e.target.value })}
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={nuevoConcepto.cantidad || ""}
                        onChange={(e) =>
                            setNuevoConcepto({ ...nuevoConcepto, cantidad: parseFloat(e.target.value) || 0 })
                        }
                        className="p-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Precio Unitario"
                        value={nuevoConcepto.precioUnitario || ""}
                        onChange={(e) =>
                            setNuevoConcepto({ ...nuevoConcepto, precioUnitario: parseFloat(e.target.value) || 0 })
                        }
                        className="p-2 border border-gray-300 rounded"
                    />
                    <button
                        onClick={handleAddConcepto}
                        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
                    >
                        Agregar
                    </button>
                </div>
            </section>

            {/* Totales */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Totales</h2>
                <p className="mb-1">Subtotal: ${subtotal.toFixed(2)}</p>
                <p className="mb-1">IVA: ${iva.toFixed(2)}</p>
                <p className="font-bold">Total: ${total.toFixed(2)}</p>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Editar Concepto</h3>
                        <label className="block mb-2">
                            Descripción:
                            <input
                                type="text"
                                value={editingConcepto?.descripcion || ""}
                                onChange={(e) =>
                                    setEditingConcepto(
                                        editingConcepto ? { ...editingConcepto, descripcion: e.target.value } : null
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Cantidad:
                            <input
                                type="number"
                                value={editingConcepto?.cantidad || ""}
                                onChange={(e) =>
                                    setEditingConcepto(
                                        editingConcepto ? { ...editingConcepto, cantidad: parseFloat(e.target.value) || 0 } : null
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label className="block mb-2">
                            Precio Unitario:
                            <input
                                type="number"
                                value={editingConcepto?.precioUnitario || ""}
                                onChange={(e) =>
                                    setEditingConcepto(
                                        editingConcepto
                                            ? { ...editingConcepto, precioUnitario: parseFloat(e.target.value) || 0 }
                                            : null
                                    )
                                }
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleUpdateConcepto}
                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
