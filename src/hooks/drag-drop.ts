import { Data, Status } from "@/interfaces/drag-drop";
import { useState } from "react";

export const useDragAndDrop = (initialState: Data[]) => {
  const [isDragging, setIsDragging] = useState(false);
  const [listItems, setListItems] = useState<Data[]>(initialState);

  const handleUpdateList = (id: number, status: Status) => {
    const card = listItems.find((item) => item.id === id); // Cambiar 'let' a 'const'

    if (card && card.status !== status) {
      card.status = status;
      if (Array.isArray(listItems)) {
        setListItems((prev) => [
          card!, // Asegúrate de que 'card' no sea nulo o indefinido
          ...prev.filter((item) => item.id !== id),
        ]);
      }
    }
  };

  const handleDragging = (dragging: boolean) => setIsDragging(dragging);

  return {
    isDragging,
    listItems,
    handleUpdateList,
    handleDragging,
  };
};
