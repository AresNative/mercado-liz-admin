"use client";
import { useState, useEffect } from "react";

export default function ComprasComponent() {
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchCompras = async (codigo, estatus, articulo, proveedor) => {
    setLoading(true);

    try {
      // Crear un objeto con los parámetros disponibles
      const params = {};
      if (codigo) params.codigo = codigo;
      if (estatus) params.estatus = estatus;
      if (articulo) params.articulo = articulo;
      if (proveedor) params.proveedor = proveedor;

      // Agregar paginación
      params.page = page.toString();
      params.pageSize = pageSize.toString();

      // Construir la URL con los parámetros no vacíos
      const queryParams = new URLSearchParams(params);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}testQuery/compras?${queryParams}`
      );

      if (response.ok) {
        const result = await response.json();

        setData(Array.isArray(result.data) ? result.data : []);
        setTotalRecords(result.totalRecords || 0);
      } else {
        console.error("Error al obtener los datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras(); // Llama la función para cargar datos al montar el componente
  }, [page, pageSize]);

  return (
    <div>
      <h1>Lista de Compras</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Artículo</th>
                <th>Nombre</th>
                <th>Estatus</th>
                <th>Cantidad</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.Codigo}</td>
                    <td>{item.Articulo}</td>
                    <td>{item.Nombre}</td>
                    <td>{item.Estatus}</td>
                    <td>{item.Cantidad}</td>
                    <td>{item.Costo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No hay datos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <p>Total de Registros: {totalRecords}</p>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={data.length < pageSize}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
