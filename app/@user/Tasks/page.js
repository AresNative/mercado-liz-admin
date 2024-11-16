"use client";
import { useAppDispatch } from "@/store/hooks/hooks";
import { openAlertReducer } from "@/store/reducers/alert-reducer";

export default function Home() {
  const dispatch = useAppDispatch();

  return (
    <div className="p-5">
      <h1 className="text-2xl mb-4">Ejemplo de Alerta Dinámica</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() =>
          dispatch(
            openAlertReducer({
              message: "Esto es una alerta de información",
              type: "info",
            })
          )
        }
      >
        Mostrar Alerta Info
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-3"
        onClick={() =>
          dispatch(
            openAlertReducer({
              message: "Éxito! Operación realizada",
              type: "success",
            })
          )
        }
      >
        Mostrar Alerta Éxito
      </button>

      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-3"
        onClick={() =>
          dispatch(
            openAlertReducer({
              message: "Atención! Algo necesita tu atención",
              type: "warning",
            })
          )
        }
      >
        Mostrar Alerta Advertencia
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-3"
        onClick={() =>
          dispatch(
            openAlertReducer({
              message: "Error! Algo salió mal",
              type: "error",
            })
          )
        }
      >
        Mostrar Alerta Error
      </button>
    </div>
  );
}
