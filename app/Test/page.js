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

const SortableItem = ({ id, depth, hasChildren, isExpanded, onToggle }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: depth * 20,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100 shadow-sm ${
        isDragging ? "bg-gray-100" : "bg-white"
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

const moveItem = (items, activeId, overId) => {
  const activeItem = findItemById(items, activeId);
  const overItem = findItemById(items, overId);

  if (!activeItem) return items;

  // Remove the active item from its current position
  const newItems = removeItem(items, activeId);

  if (!overItem) {
    // If dropping onto blank space (root level), add to the end of the main items array
    return [...newItems, activeItem];
  }

  // Find the parent of the over item
  const { parent: overParent } = findItemWithParent(items, overId);

  if (overParent) {
    // If the over item has a parent, insert the active item as a sibling
    return insertItem(newItems, activeItem, overId, overParent.id);
  } else {
    // If the over item is at the root level, insert the active item at the root level
    const index = newItems.findIndex((item) => item.id === overId);
    return [
      ...newItems.slice(0, index + 1),
      activeItem,
      ...newItems.slice(index + 1),
    ];
  }
};

const findItemById = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children.length > 0) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findItemWithParent = (items, id, parent = null) => {
  for (const item of items) {
    if (item.id === id) return { item, parent };
    if (item.children.length > 0) {
      const result = findItemWithParent(item.children, id, item);
      if (result.item) return result;
    }
  }
  return { item: null, parent: null };
};

const removeItem = (items, id) => {
  return items.reduce((acc, item) => {
    if (item.id === id) return acc;
    const newItem = { ...item, children: removeItem(item.children, id) };
    return [...acc, newItem];
  }, []);
};

const insertItem = (items, itemToInsert, targetId, parentId) => {
  return items.map((item) => {
    if (item.id === parentId) {
      const index = item.children.findIndex((child) => child.id === targetId);
      const newChildren = [
        ...item.children.slice(0, index + 1),
        itemToInsert,
        ...item.children.slice(index + 1),
      ];
      return { ...item, children: newChildren };
    }
    if (item.children.length > 0) {
      return {
        ...item,
        children: insertItem(item.children, itemToInsert, targetId, parentId),
      };
    }
    return item;
  });
};

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

export default function MenuStructureEditor() {
  const [items, setItems] = useState(initialItems);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setItems((prevItems) => moveItem(prevItems, active.id, over?.id));
    }
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
          items={items
            .flatMap((item) => [item, ...item.children])
            .map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Tree items={items} />
        </SortableContext>
      </DndContext>
      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-center text-gray-500">
          Drop here to add as a parent item
        </p>
      </div>
    </div>
  );
}
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
