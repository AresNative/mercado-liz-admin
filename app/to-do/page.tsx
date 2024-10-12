'use client';

import { useEffect, useRef } from 'react';
import { Sortable, Plugins } from '@shopify/draggable';

const Classes = {
    draggable: 'StackedListItem--isDraggable ',
    notdraggable: 'StackedListItem--notDraggable',
    capacity: 'draggable-container-parent--capacity',
};

export default function MultipleContainers() {
    const containersRef = useRef<NodeListOf<HTMLUListElement> | null>(null);

    useEffect(() => {
        containersRef.current = document.querySelectorAll('.StackedList');

        if (containersRef.current.length === 0) {
            return;
        }

        const sortable: any = new Sortable(containersRef.current, {
            draggable: `.${Classes.draggable}`,
            mirror: {
                constrainDimensions: true,
            },
            plugins: [Plugins.ResizeMirror],
        });

        const containerTwoCapacity = 5;
        const containerTwoParent = sortable.containers[1].parentNode;
        let currentMediumChildren: number;
        let capacityReached: boolean;
        let lastOverContainer: HTMLElement | null = null;

        // --- Draggable events --- //
        sortable.on('drag:start', (evt: any) => {
            currentMediumChildren = sortable.getDraggableElementsForContainer(sortable.containers[1])
                .length;
            capacityReached = currentMediumChildren === containerTwoCapacity;
            lastOverContainer = evt.sourceContainer as HTMLElement;
            containerTwoParent?.classList.toggle(Classes.capacity, capacityReached);
        });

        sortable.on('sortable:sort', (evt: any) => {
            if (!capacityReached) {
                return;
            }

            const sourceIsCapacityContainer = evt.dragEvent.sourceContainer === sortable.containers[1];

            if (!sourceIsCapacityContainer && evt.dragEvent.overContainer === sortable.containers[1]) {
                evt.cancel();
            }
        });

        sortable.on('sortable:sorted', (evt: any) => {
            if (lastOverContainer === evt.dragEvent.overContainer) {
                return;
            }

            lastOverContainer = evt.dragEvent.overContainer as HTMLElement;
        });

        return () => {
            sortable.destroy();
        };
    }, []);

    return (
        <section id="MultipleContainers" className="flex gap-4 w-full p-6">

            <Container
                id='1'
                isDraggable={true}
                items={['zebra', 'giraffe', 'baboon', 'elephant', 'leopard']}
                title='Pendientes'
            />
            <Container
                id='2'
                isDraggable={true}
                items={['fluorescent grey', 'rebecca purple']}
                title='Proceso'
                subtitle='5 tareas como capacidad maxima'
                bgColor="bg-sky-400"
                textColor="text-white"
            />
            <Container
                id='3'
                isDraggable={true}
                items={['apple', 'banana', 'cucumber', 'daikon radish', 'elderberry', 'fresh thyme', 'guava']}
                title='En pruebas'
            />

            <Container
                id='4'
                isDraggable={true}
                items={[]}
                title='Terminados'
            />
        </section>
    );
}
interface ContainerProps {
    id: string;
    title: string;
    subtitle?: string;
    items: string[];
    isDraggable: boolean;
    bgColor?: string;
    textColor?: string;
}

function Container(
    {
        id,
        title,
        subtitle,
        items,
        bgColor = 'bg-gray-100',
        textColor = 'text-black'
    }:
        ContainerProps) {
    return (
        <article
            id="ContainerOne"
            className={`${bgColor} p-4 rounded-lg shadow-md min-h-full w-1/4`} >
            <header className={`${textColor}`}>
                <h3>{title}</h3>

                <p><em>{subtitle}</em></p>
            </header>
            <ul className="StackedList min-h-full min-w-full">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`StackedListItem cursor-move bg-white p-4 rounded-lg shadow-md m-4 ${index !== 2 ? Classes.draggable : 'bg-yellow-400 cursor-no-drop'}`}>
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    )
}