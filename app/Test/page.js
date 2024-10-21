"use client";

import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";

// Estructura inicial
const initialItems = [
  { id: "Home", children: [] },
  {
    id: "Collections",
    children: [
      { id: "Spring", children: [] },
      { id: "Summer", children: [] },
      { id: "Fall", children: [] },
      { id: "Winter", children: [] },
    ],
  },
  {
    id: "About Us",
    children: [
      {
        id: "My Account",
        children: [
          { id: "Addresses", children: [] },
          { id: "Order History", children: [] },
        ],
      },
    ],
  },
];

// Componente de ítem sortable
const SortableItem = ({
  id,
  depth,
  isDragging,
  hasChildren,
  isExpanded,
  onToggle,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: depth * 20,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? "bg-gray-100" : "bg-white",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100 shadow-sm ${
        isOver ? "bg-gray-100" : "bg-white"
      }`}
    >
      <button
        className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        {...listeners}
        aria-label="Drag handle"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {hasChildren && (
        <button
          onClick={onToggle}
          className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}
      <div className="flex-1">{id}</div>
    </div>
  );
};

// Mover ítems y manejar la anidación
const moveItem = (items, activeId, overId) => {
  const { item: activeItem, parent: activeParent } = findItem(items, activeId);
  const { item: overItem, parent: overParent } = findItem(items, overId);

  if (!activeItem || !overItem) return items;

  // Remover ítem activo de su ubicación actual
  if (activeParent) {
    activeParent.children = activeParent.children.filter(
      (child) => child.id !== activeId
    );
  } else {
    items = items.filter((item) => item.id !== activeId);
  }

  // Añadir ítem activo como hermano del ítem sobre el que se posó
  if (overParent) {
    const index = overParent.children.findIndex((child) => child.id === overId);
    overParent.children.splice(index + 1, 0, activeItem);
  } else {
    const index = items.findIndex((item) => item.id === overId);
    items.splice(index + 1, 0, activeItem);
  }

  return [...items];
};

// Buscar ítem y su padre
const findItem = (items, id, parent = null) => {
  for (let item of items) {
    if (item.id === id) return { item, parent };
    if (item.children.length > 0) {
      const result = findItem(item.children, id, item);
      if (result.item) return result;
    }
  }
  return { item: null, parent: null };
};

// Componente recursivo para renderizar el árbol
const Tree = ({ items, depth = 0 }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="ml-4">
      {items.map((item) => (
        <div key={item.id}>
          <SortableItem
            id={item.id}
            depth={depth}
            hasChildren={item.children.length > 0}
            isExpanded={expandedItems[item.id]}
            onToggle={() => toggleExpand(item.id)}
          />
          {item.children.length > 0 && expandedItems[item.id] && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2 mt-2">
              <Tree items={item.children} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Componente principal
export default function Home() {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setItems((prevItems) => moveItem([...prevItems], active.id, over.id));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Menu Structure</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={flattenItems(items)}
          strategy={verticalListSortingStrategy}
        >
          <Tree items={items} />
        </SortableContext>
      </DndContext>
    </div>
  );
}

// Función para aplanar la estructura de ítems para el contexto
const flattenItems = (items) => {
  return items.reduce((acc, item) => {
    return acc.concat(item, flattenItems(item.children));
  }, []);
};
/* export default function Page() {
  return (
    <figure class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800">
      <img
        class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
        src="https://yt3.googleusercontent.com/2M4WpEKIJkVbLcp0_WT1fICBre9SxHJQ7x7YjGFsWC_xu81sPMORY9GT3Y-akEB4mpRgyvWwsA=s160-c-k-c0x00ffffff-no-rj"
        alt=""
        width="384"
        height="512"
      />
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p class="text-lg font-medium">
            “Tailwind CSS is the only framework that I've seen scale on large
            teams. It’s easy to customize, adapts to any design, and the build
            size is tiny.”
          </p>
        </blockquote>
        <figcaption class="font-medium">
          <div class="text-sky-500 dark:text-sky-400">Sarah Dayan</div>
          <div class="text-slate-700 dark:text-slate-500">
            Staff Engineer, Algolia
          </div>
        </figcaption>
      </div>
    </figure>
  );
} */
