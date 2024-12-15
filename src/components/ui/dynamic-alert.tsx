"use client";

import { openAlertReducer } from "@/reducers/alert-reducer";
import { useAppDispatch, useAppSelector } from "@/store/selector";
import { useState, useEffect } from "react";

type Alert = {
  message: string;
  type: "info" | "success" | "warning" | "error";
  id: number;
};

const DynamicAlert: React.FC = () => {
  const selector = useAppSelector((state) => state.alertReducer);
  const dispatch = useAppDispatch();
  const [alerts, setAlerts] = useState<Alert[]>([]); // Manejo de múltiples alertas

  useEffect(() => {
    if (selector.message) {
      // Agregar la nueva alerta a la cola
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { message: selector.message, type: selector.type as Alert["type"], id: Date.now() },
      ]);

      // Limpiar el estado en el reducer
      dispatch(
        openAlertReducer({
          message: "",
          type: "", //? "info" |  "success" | "warning" | "error"
        })
      );
    }
  }, [selector, dispatch]);

  const removeAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    const timers = alerts.map((alert) => {
      const timer = setTimeout(() => removeAlert(alert.id), selector.duration || 3000);
      return () => clearTimeout(timer);
    });
    return () => timers.forEach((clear) => clear());
  }, [alerts, selector.duration]);

  return (
    <div className="fixed top-32 right-5 z-50 space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`max-w-xs w-full border-l-4 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${getAlertStyles(alert.type)}`}
        >
          <p>{alert.message}</p>
        </div>
      ))}
    </div>
  );
};

const getAlertStyles = (type: Alert["type"]): string => {
  const alertStyles: Record<Alert["type"], string> = {
    info: "bg-neutral-100 border-blue-400 text-blue-700",
    success: "bg-neutral-100 border-green-400 text-green-700",
    warning: "bg-neutral-100 border-yellow-400 text-yellow-700",
    error: "bg-neutral-100 border-red-400 text-red-700",
  };

  return alertStyles[type] || "bg-neutral-100 border-gray-400 text-gray-700";
};

export default DynamicAlert;
