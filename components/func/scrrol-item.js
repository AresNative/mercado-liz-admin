import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import ItemWithActions from "./item-actions";

export default function SortableItem({ id, column }) {
  const [disabled, setDisabled] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { column },
      disabled,
    });

  const style = {
    transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(!disabled ? listeners : {})}
    >
      <ItemWithActions id={id} setDisabled={setDisabled} column={column} />
    </li>
  );
}
