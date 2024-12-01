"use client";

import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import Box from "@/components/ui/template/box";

function SortableBox({ id, height }: any) {
    const { attributes, listeners, setNodeRef, transition, isDragging } = useSortable({
        id,
    });

    const style = {
        transition,
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            <Box height={height} />
        </div>
    );
}

function DragOverlayBox({ height }: any) {
    return (
        <div style={{ height, backgroundColor: "#f0f0f0", border: "1px solid #ddd" }}>
            <Box height={height} />
        </div>
    );
}

const UserPage = () => {
    const [items, setItems] = useState([
        { id: "box-1", height: "8rem" },
        { id: "box-2", height: "8rem" },
        { id: "box-3", height: "8rem" },
        { id: "box-4", height: "8rem" },
        { id: "box-5", height: "8rem" },
        { id: "box-6", height: "8rem" },
        { id: "box-7", height: "8rem" },
        { id: "box-8", height: "8rem" },
        { id: "box-9", height: "8rem" },
        { id: "box-10", height: "8rem" },
        { id: "box-11", height: "8rem" },
        { id: "box-12", height: "8rem" },
        { id: "box-13", height: "8rem" },
    ]);

    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((prevItems) => {
                const oldIndex = prevItems.findIndex((item) => item.id === active.id);
                const newIndex = prevItems.findIndex((item) => item.id === over.id);

                return arrayMove(prevItems, oldIndex, newIndex);
            });
        }

        setActiveId(null);
    };

    return (
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {items.slice(0, 3).map((item) => (
                            <SortableBox key={item.id} id={item.id} height={item.height} />
                        ))}
                    </div>
                    <SortableBox id={items[3].id} height={items[3].height} />
                    <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                        {items.slice(4, 8).map((item) => (
                            <SortableBox key={item.id} id={item.id} height={item.height} />
                        ))}
                    </div>
                    <SortableBox id={items[8].id} height={items[8].height} />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {items.slice(9, 13).map((item) => (
                            <SortableBox key={item.id} id={item.id} height={item.height} />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId ? (
                        <DragOverlayBox height={items.find((item) => item.id === activeId)?.height} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default UserPage;
