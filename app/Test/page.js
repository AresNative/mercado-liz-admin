"use client";

import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronRight, Plus } from "lucide-react";

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

const SortableItem = ({
  id,
  depth,
  hasChildren,
  isExpanded,
  onToggle,
  onAddChild,
}) => {
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
      <button
        onClick={onAddChild}
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Add child"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

const Tree = ({ items, depth = 0, onAddChild }) => {
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
            onAddChild={() => onAddChild(item.id)}
          />
          {item.children.length > 0 && expandedItems[item.id] && (
            <div className="ml-4 border-l-2 border-gray-200 pl-2 mt-2">
              <Tree
                items={item.children}
                depth={depth + 1}
                onAddChild={onAddChild}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const addChildToItem = (items, parentId, newChild) => {
  return items.map((item) => {
    if (item.id === parentId) {
      return { ...item, children: [...item.children, newChild] };
    }
    if (item.children.length > 0) {
      return {
        ...item,
        children: addChildToItem(item.children, parentId, newChild),
      };
    }
    return item;
  });
};

export default function MenuStructureEditor() {
  const [items, setItems] = useState(initialItems);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      if (over?.id === "root-drop-area") {
        // Handle dropping into the root drop area
        setItems((prevItems) => {
          const activeItem = findItemById(prevItems, active.id);
          const newItems = removeItem(prevItems, active.id);
          return [...newItems, { ...activeItem, children: [] }];
        });
      } else {
        setItems((prevItems) => moveItem(prevItems, active.id, over?.id));
      }
    }
  };

  const handleAddChild = (parentId) => {
    const newChildId = `New Item ${Date.now()}`;
    setItems((prevItems) =>
      addChildToItem(prevItems, parentId, { id: newChildId, children: [] })
    );
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Menu Structure</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items
            .flatMap((item) => [item, ...item.children])
            .map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <Tree items={items} onAddChild={handleAddChild} />
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="p-2 border rounded bg-white shadow-md">
              {activeId}
            </div>
          ) : null}
        </DragOverlay>
        <div
          id="root-drop-area"
          className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg"
        >
          <p className="text-center text-gray-500">
            Drop here to add as a parent item
          </p>
        </div>
      </DndContext>
    </div>
  );
}
