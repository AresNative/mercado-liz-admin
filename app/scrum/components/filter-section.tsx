"use client"

import MainForm from "@/components/form/main-form"
export function FilterSection() {
    return (
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6 dark:text-neutral-100">
            <MainForm
                message_button="Aplicar Filtros"
                dataForm={[
                    {
                        type: "Flex",
                        require: false,
                        elements: [
                            {
                                name: "search",
                                type: "SEARCH",
                                label: "Busca algún dato de interés",
                                placeholder: "Buscar productos...",
                                require: false
                            },
                            {
                                name: "columnas-search",
                                type: "SELECT",
                                label: "Seleccione columna(s)...",
                                placeholder: "Seleccionar columnas",
                                require: false,
                                options: [{ label: "Nombre", value: "Nombre" }],
                                multi: false
                            },
                            {
                                name: "sucursal",
                                type: "SELECT",
                                label: "Seleccione sucursal...",
                                placeholder: "Seleccionar sucursal",
                                require: false,
                                options: [
                                    { label: "Guadalupe", value: "LIZ" },
                                    { label: "Testerazo", value: "TESTERAZO" },
                                    { label: "Palmas", value: "PALMAS" },
                                    { label: "Mayoreo", value: "MAYOREO" }
                                ],
                                multi: true
                            },
                            {
                                name: "fecha_inicial",
                                type: "DATE_RANGE",
                                label: "Fecha(s)",
                                placeholder: "Buscar por fecha...",
                                require: false,
                                multiple: true
                            }
                        ]
                    }
                ]}
                actionType="filter"
                onSuccess={(result) => console.log(result)}
            />
        </div>
    )
}

