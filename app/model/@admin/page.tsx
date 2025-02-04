"use client";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
export default function Postulaciones() {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener los datos del endpoint
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:5077/api/v2/select/combos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Filtros: [] }),
            });

            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }

            const result = await response.json();
            // Asegúrate de que los datos estén en result.data
            setData(result.Data || result.data); // Dependiendo de la estructura de la respuesta
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Postulaciones</h1>
            {data && data.map((row: any) => (
                <div key={row.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                    <p>ID: {row.id}</p>
                    <p>Nombre: {row.nombre}</p>
                    {/* <p>Correo Electrónico: {row.correo_electronico}</p> */}
                    <p>
                        Archivo:{" "}
                        {row.file?.content ? (
                            <a
                                href={`data:${row.file.contentType};base64,${Buffer.from(row.file.content)}`}
                                download={row.file.fileName || "archivo"}
                            >
                                Descargar {row.file.fileName || "archivo"}
                            </a>
                        ) : (
                            "No hay archivo"
                        )}
                    </p>
                </div>
            ))}
        </div>
    );
}