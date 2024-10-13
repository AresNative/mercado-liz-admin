"use client"
import { useEffect, useRef, useState } from 'react';
import { Sortable, Plugins } from '@shopify/draggable';
import { Button, Modal, Input, ModalHeader, ModalBody, ModalFooter, ModalContent, useDisclosure } from '@nextui-org/react';

const Classes = {
    draggable: 'StackedListItem--isDraggable ',
    notdraggable: 'StackedListItem--notDraggable',
    capacity: 'draggable-container-parent--capacity',
};

export default function MultipleContainers() {
    const containersRef = useRef<NodeListOf<HTMLUListElement> | null>(null);
    const [tasks, setTasks] = useState({
        pendientes: ['zebra', 'giraffe', 'baboon', 'elephant', 'leopard'],
        proceso: ['fluorescent grey', 'rebecca purple'],
        enPruebas: ['apple', 'banana', 'cucumber', 'daikon radish', 'elderberry', 'fresh thyme', 'guava'],
        terminados: [],
    });

    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newTask, setNewTask] = useState('');
    const [currentColumn, setCurrentColumn] = useState<string | null>(null);
    const { isOpen: isDetailsOpen, onOpen: onOpenDetails, onClose: onCloseDetails } = useDisclosure();

    useEffect(() => {
        containersRef.current = document.querySelectorAll('.StackedList');

        if (containersRef.current.length === 0) {
            return;
        }

        const sortable = new Sortable(containersRef.current, {
            draggable: `.${Classes.draggable}`,
            mirror: {
                constrainDimensions: true,
            },
            plugins: [Plugins.ResizeMirror],
        });

        sortable.on('drag:stop', (evt: any) => {
            const sourceContainer = evt.sourceContainer as HTMLUListElement;
            const overContainer = evt.overContainer as HTMLUListElement;
            const sourceIndex = evt.oldIndex;
            const overIndex = evt.newIndex;

            if (sourceContainer && overContainer && sourceIndex !== undefined && overIndex !== undefined) {
                const sourceColumnKey = sourceContainer.dataset.column;
                const overColumnKey = overContainer.dataset.column;

                if (sourceColumnKey && overColumnKey) {
                    setTasks((prev) => {
                        const task = prev[sourceColumnKey as keyof typeof tasks][sourceIndex];
                        const updatedSourceTasks = prev[sourceColumnKey as keyof typeof tasks].filter(
                            (_, index) => index !== sourceIndex
                        );
                        const updatedOverTasks = [
                            ...prev[overColumnKey as keyof typeof tasks].slice(0, overIndex),
                            task,
                            ...prev[overColumnKey as keyof typeof tasks].slice(overIndex)
                        ];

                        return {
                            ...prev,
                            [sourceColumnKey]: updatedSourceTasks,
                            [overColumnKey]: updatedOverTasks,
                        };
                    });
                }
            }
        });

        return () => {
            sortable.destroy();
        };
    }, [tasks]);

    const handleAddTask = (column: string) => {
        if (column !== 'pendientes') return;
        if (newTask.trim()) {
            setTasks((prev) => ({
                ...prev,
                [column]: [...prev[column as keyof typeof tasks], newTask],
            }));
            setNewTask('');
            onClose();
        }
    };

    const handleDeleteTask = (column: string, task: string) => {
        if (column !== 'terminados') return;
        setTasks((prev: any) => {
            const updatedColumnTasks = prev[column as keyof typeof tasks].filter((t: any) => t !== task);
            return {
                ...prev,
                [column]: updatedColumnTasks,
            };
        });
    };

    const handleOpenModal = (column: string) => {
        if (column === 'pendientes') {
            setCurrentColumn(column);
            onOpen();
        }
    };

    const handleOpenDetails = (task: string) => {
        setSelectedTask(task);
        onOpenDetails();
    };

    return (
        <section id="MultipleContainers" className="flex gap-4 w-full p-6">
            <Container
                id='1'
                isDraggable={true}
                items={tasks.pendientes}
                title='Pendientes'
                onAddTask={() => handleOpenModal('pendientes')}
                onDeleteTask={(task) => handleDeleteTask('pendientes', task)}
                onViewDetails={handleOpenDetails}
            />
            <Container
                id='2'
                isDraggable={true}
                items={tasks.proceso}
                title='Proceso'
                subtitle='5 tareas como capacidad maxima'
                bgColor="bg-sky-400"
                textColor="text-white"
                onAddTask={() => handleOpenModal('proceso')}
                onDeleteTask={(task) => handleDeleteTask('proceso', task)}
                onViewDetails={handleOpenDetails}
            />
            <Container
                id='3'
                isDraggable={true}
                items={tasks.enPruebas}
                title='En pruebas'
                onAddTask={() => handleOpenModal('enPruebas')}
                onDeleteTask={(task) => handleDeleteTask('enPruebas', task)}
                onViewDetails={handleOpenDetails}
            />
            <Container
                id='4'
                isDraggable={true}
                items={tasks.terminados}
                title='Terminados'
                onAddTask={() => handleOpenModal('terminados')}
                onDeleteTask={(task) => handleDeleteTask('terminados', task)}
                onViewDetails={handleOpenDetails}
            />

            <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>
                                <h1>
                                    Agregar nueva tarea
                                </h1>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    fullWidth
                                    size="lg"
                                    placeholder="Nueva tarea"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={() => handleAddTask(currentColumn!)}>
                                    Agregar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal backdrop="blur" isOpen={isDetailsOpen} onClose={onCloseDetails}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>
                                <h1>Detalles de la Tarea</h1>
                            </ModalHeader>
                            <ModalBody>
                                <p>{selectedTask}</p>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
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
    onAddTask: () => void;
    onDeleteTask: (task: string) => void;
    onViewDetails: (task: string) => void;
}

function Container({
    id,
    title,
    subtitle,
    items,
    bgColor = 'bg-gray-100',
    textColor = 'text-black',
    onAddTask,
    onDeleteTask,
    onViewDetails,
}: ContainerProps) {
    return (
        <article
            id={id}
            className={`${bgColor} p-4 rounded-lg shadow-md min-h-full w-1/4`}>
            <header className={`${textColor}`}>
                <h3>{title}</h3>
                <p><em>{subtitle}</em></p>
            </header>
            <ul className="StackedList min-h-full min-w-full" data-column={title.toLowerCase()}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`StackedListItem cursor-move bg-white p-4 rounded-lg shadow-md m-4 ${Classes.draggable}`}>
                        <div className="flex justify-between items-center">
                            {item}
                            <Button isIconOnly color="success" aria-label="Details" onClick={() => onViewDetails(item)} className='float-end'>details</Button>
                            {title == 'Terminados' && (
                                <Button color="danger" onClick={() => onDeleteTask(item)}>
                                    Eliminar
                                </Button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            {title.toLowerCase() === 'pendientes' && (
                <Button color="primary" className="mt-4" onClick={onAddTask}>
                    Agregar Tarea
                </Button>
            )}
        </article>
    );
}