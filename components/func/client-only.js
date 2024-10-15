"use client";
import { useEffect, useState } from "react";

// Este componente renderiza su contenido solo en el cliente
export default function ClientOnly({ children, ...delegated }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Indica que ya estamos en el cliente
  }, []);

  if (!hasMounted) {
    return null; // Evita renderizado del contenido en el servidor
  }

  return <div {...delegated}>{children}</div>;
}
