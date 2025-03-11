"use client"
import Calendar from "../components/calendar"
import TableDiasHoras from "../components/table"

export default function Home() {
    return (
        <main className="min-h-screen p-4 md:p-8 ">
            <div className="max-w-7xl mx-auto flex flex-col gap-2">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white dark:text-gray-50">Calendario Interactivo</h1>
                <Calendar />

                <TableDiasHoras />
            </div>
        </main>
    )
}

