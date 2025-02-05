import React from "react";

const InfiniteCarousel = () => {
    const items = [
        { id: 1, text: "Item 1", bgColor: "bg-red-500" },
        { id: 2, text: "Item 2", bgColor: "bg-blue-500" },
        { id: 3, text: "Item 3", bgColor: "bg-green-500" },
        { id: 4, text: "Item 4", bgColor: "bg-yellow-500" },
        { id: 5, text: "Item 5", bgColor: "bg-purple-500" },
    ];

    // Duplicamos los elementos para crear el efecto infinito
    const duplicatedItems = [...items, ...items];

    return (
        <div className="relative w-full overflow-hidden">
            {/* Contenedor del carrusel */}
            <div className="flex animate-infinite-scroll">
                {duplicatedItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-64 h-40 flex items-center justify-center mx-2 ${item.bgColor} text-white text-2xl font-bold rounded-lg`}
                    >
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfiniteCarousel;