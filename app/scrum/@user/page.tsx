import Details from "@/components/details";
import MainForm from "@/components/form/main-form";
import DNDContext from "../components/dndContext";

import Providers from "@/hooks/provider";
import { ScrumField } from "@/utils/constants/forms/scrum";

export default function Model() {

    const statusColumns = ["pendiente", "proceso", "pruebas", "terminado"];

    return (
        <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Tableros de Scrum</h1>

            <section className="flex flex-wrap gap-4 justify-start">
                <div className="flex-grow">
                    <Details
                        title="¿Qué es un tablero de scrum?"
                        description="Un tablero de Scrum es una herramienta visual que se utiliza para gestionar el trabajo de un equipo de desarrollo de software. Se trata de una forma de organizar las tareas y los proyectos de manera que todos los miembros del equipo puedan ver el progreso y el estado de las tareas en todo momento."
                    />
                </div>

                <div className="flex-grow">
                    <Details
                        title="¿Cómo se utiliza un tablero de scrum?"
                        description="Un tablero de Scrum se compone de tres columnas: 'To Do' (por hacer - pendiente), 'In Progress' (en progreso - proceso) y 'Done' (hecho - terminado). Cada tarea se representa con una tarjeta que se mueve de una columna a otra a medida que se va completando. De esta forma, todos los miembros del equipo pueden ver en qué estado se encuentra cada tarea y cuánto queda por hacer."
                    />
                </div>
            </section>

            <Details
                title="Agregar Sprint"
                type="form"
                children={
                    <Providers>
                        <MainForm
                            message_button={'Enviar'}
                            actionType={"add-sprints"}
                            dataForm={ScrumField()}
                            aditionalData={{
                                estado: "nuevo",
                                project_id: 18
                            }}
                        />
                    </Providers>
                }
            />

            <Providers>
                <DNDContext
                    projectId="18"
                    statusColumns={statusColumns}
                />
            </Providers>
        </>
    );
}