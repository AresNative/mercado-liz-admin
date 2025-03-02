"use client";

import { Modal } from "@/components/modal";
import { openModalReducer } from "@/hooks/reducers/drop-down";
import { useAppDispatch } from "@/hooks/selector";
import { option } from "framer-motion/client";
import { Grip, MoveDown, MoveUp, Plus, Trash } from "lucide-react";
import { useEffect, useRef } from "react";
import { createSwapy } from "swapy";

export default function Postulaciones() {
    const containerRef = useRef<HTMLElement>(null);
    const swapyRef = useRef<ReturnType<typeof createSwapy>>(null);

    useEffect(() => {
        if (containerRef.current) {
            // Inicializar Swapy después de que el componente se monte
            swapyRef.current = createSwapy(containerRef.current, {
                animation: 'dynamic'
                // Opciones adicionales...
            });

            // Configurar event listeners
            const swapy = swapyRef.current;

            swapy.onBeforeSwap((event) => {
                /* console.log('beforeSwap', event); */
                return true;
            });

            /* swapy.onSwapStart((event) => {
                console.log('start', event);
            });

            swapy.onSwap((event) => {
                console.log('swap', event);
            });

            swapy.onSwapEnd((event) => {
                console.log('swap end:', event);
            }); */

            // Cleanup al desmontar el componente
            return () => {
                if (swapyRef.current) {
                    swapyRef.current.destroy();
                }
            };
        }
    }, []);
    const dispatch = useAppDispatch();
    function openModal() {
        dispatch(
            openModalReducer({ modalName: "bidView", isOpen: true })
        );
    }
    return (
        <>
            <button onClick={openModal}>Test</button>
            <Modal
                modalName="bidView"
                title="You Are Bidding On"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                </div>
            </Modal>


            <section className="container flex gap-4" ref={containerRef}>

                <ul className="h-2/4 flex flex-col p-2 border rounded-lg gap-2">
                    <div data-swapy-slot="a">
                        <div data-swapy-item="a" className="bg-yellow-400 text-white text-center size-10 rounded-lg">
                            <div>A</div>
                        </div>
                    </div>

                    <div data-swapy-slot="b">
                        <div data-swapy-item="b" className="bg-red-400 text-white text-center size-10 rounded-lg">
                            <div>B</div>
                        </div>
                    </div>

                    <div data-swapy-slot="c">
                        <div data-swapy-item="c" className="bg-green-400 text-white text-center size-10 rounded-lg">
                            <div>C</div>
                        </div>
                    </div>
                </ul>
                <ul className="h-2/4 flex flex-col p-2 border rounded-lg gap-2">
                    <div data-swapy-slot="d">
                        <div data-swapy-item="d" className="bg-yellow-400 text-white text-center size-10 rounded-lg">
                            <div>D</div>
                        </div>
                    </div>

                    <div data-swapy-slot="e">
                        <div data-swapy-item="e" className="bg-red-400 text-white text-center size-10 rounded-lg">
                            <div>E</div>
                        </div>
                    </div>

                    <div data-swapy-slot="f">
                        <div data-swapy-item="f" className="bg-green-400 text-white text-center size-10 rounded-lg">
                            <div>F</div>
                        </div>
                    </div>
                </ul>
            </section>
        </>
    );
}