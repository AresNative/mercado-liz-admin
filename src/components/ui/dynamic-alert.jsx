"use client";
import { useAppSelector } from "@/actions/selector";
import { useState, useEffect } from "react";
const DynamicAlert = () => {
  const selector = useAppSelector((state) => state.alertReducer);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (selector.message) {
      setVisible(true);
      // Ocultar la alerta automáticamente después de 'duration' milisegundos
      const timer = setTimeout(() => {
        setVisible(false);
      }, selector.duration);

      return () => clearTimeout(timer);
    }
  }, [selector]);

  if (!visible) return null;

  // Estilo dinámico basado en el tipo de alerta
  const alertStyles = {
    info: "bg-neutral-100 border-blue-400 text-blue-700",
    success: "bg-neutral-100 border-green-400 text-green-700",
    warning: "bg-neutral-100 border-yellow-400 text-yellow-700",
    error: "bg-neutral-100 border-red-400 text-red-700",
  };

  return (
    <div
      className={`fixed top-32 z-50 right-5 max-w-xs w-full border-l-4 p-4 rounded shadow-lg ${
        alertStyles[selector.type]
      } transition-opacity duration-300 ease-in-out`}
    >
      <p>{selector.message}</p>
    </div>
  );
};

export default DynamicAlert;