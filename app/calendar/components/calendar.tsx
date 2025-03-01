"use client"

import { useState } from "react"
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, List, Grid, Plus } from "lucide-react"
import MonthView from "./calendar/month-view"
import WeekView from "./calendar/week-view"
import DayView from "./calendar/day-view"
import AgendaView from "./calendar/agenda-view"
import type { Event } from "../constants/calendar"

// Sample events data
const events: Event[] = [
    {
        id: "1",
        title: "Reunión de equipo",
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 30),
        color: "bg-indigo-600",
    },
    {
        id: "2",
        title: "Almuerzo con cliente",
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 13, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 30),
        color: "bg-emerald-600",
    },
    {
        id: "3",
        title: "Revisión de proyecto",
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 15, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 16, 0),
        color: "bg-purple-600",
    },
    {
        id: "4",
        title: "Entrenamiento",
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 8, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 9, 30),
        color: "bg-amber-600",
    },
    {
        id: "5",
        title: "Conferencia virtual",
        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 11, 0),
        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3, 12, 30),
        color: "bg-rose-600",
    },
]

type CalendarView = "month" | "week" | "day" | "agenda"

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [view, setView] = useState<CalendarView>("month")

    const navigateToToday = () => {
        setCurrentDate(new Date())
    }

    const navigatePrevious = () => {
        switch (view) {
            case "month":
                setCurrentDate(subMonths(currentDate, 1))
                break
            case "week":
                setCurrentDate(subWeeks(currentDate, 1))
                break
            case "day":
                setCurrentDate(subDays(currentDate, 1))
                break
            case "agenda":
                setCurrentDate(subDays(currentDate, 7))
                break
        }
    }

    const navigateNext = () => {
        switch (view) {
            case "month":
                setCurrentDate(addMonths(currentDate, 1))
                break
            case "week":
                setCurrentDate(addWeeks(currentDate, 1))
                break
            case "day":
                setCurrentDate(addDays(currentDate, 1))
                break
            case "agenda":
                setCurrentDate(addDays(currentDate, 7))
                break
        }
    }

    const renderViewTitle = () => {
        switch (view) {
            case "month":
                return format(currentDate, "MMMM yyyy", { locale: es })
            case "week":
                return `Semana del ${format(currentDate, "d 'de' MMMM", { locale: es })}`

            case "day":
                return format(currentDate, "EEEE, d 'de' MMMM", { locale: es })
            case "agenda":
                return "Agenda"
        }
    }

    const renderView = () => {
        const filteredEvents = events.filter((event) => {
            // For simplicity, we're just checking if the event is on the same day
            // In a real app, you'd want to filter based on the view range
            return (
                isSameDay(event.start, currentDate) ||
                (event.start > currentDate &&
                    event.start < addDays(currentDate, view === "month" ? 31 : view === "week" ? 7 : 1))
            )
        })

        switch (view) {
            case "month":
                return <MonthView currentDate={currentDate} events={filteredEvents} />
            case "week":
                return <WeekView currentDate={currentDate} events={filteredEvents} />
            case "day":
                return <DayView currentDate={currentDate} events={filteredEvents} />
            case "agenda":
                return <AgendaView currentDate={currentDate} events={filteredEvents} />
        }
    }

    return (
        <div className="bg-background dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                    <button
                        onClick={navigatePrevious}
                        className="p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h2 className="text-xl font-semibold mx-4 text-gray-800 dark:text-gray-100 capitalize">
                        {renderViewTitle()}
                    </h2>
                    <button
                        onClick={navigateNext}
                        className="p-2 rounded-lg hover:bg-muted/60 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                        onClick={navigateToToday}
                        className="ml-4 px-4 py-2 text-sm font-medium bg-background dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-muted/50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors text-gray-700 dark:text-gray-200"
                    >
                        Hoy
                    </button>
                </div>
                <div className="flex items-center">
                    <div className="flex space-x-1 bg-muted dark:bg-gray-700 p-1 rounded-lg shadow-inner">
                        <button
                            onClick={() => setView("month")}
                            className={`p-2 rounded-md focus:outline-none transition-colors ${view === "month"
                                ? "bg-background dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-muted/70 dark:hover:bg-gray-600"
                                }`}
                            aria-label="Vista mensual"
                        >
                            <Grid className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setView("week")}
                            className={`p-2 rounded-md focus:outline-none transition-colors ${view === "week"
                                ? "bg-background dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-muted/70 dark:hover:bg-gray-600"
                                }`}
                            aria-label="Vista semanal"
                        >
                            <CalendarIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setView("day")}
                            className={`p-2 rounded-md focus:outline-none transition-colors ${view === "day"
                                ? "bg-background dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-muted/70 dark:hover:bg-gray-600"
                                }`}
                            aria-label="Vista diaria"
                        >
                            <Clock className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setView("agenda")}
                            className={`p-2 rounded-md focus:outline-none transition-colors ${view === "agenda"
                                ? "bg-background dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                : "text-gray-600 dark:text-gray-300 hover:bg-muted/70 dark:hover:bg-gray-600"
                                }`}
                            aria-label="Vista agenda"
                        >
                            <List className="h-5 w-5" />
                        </button>
                    </div>
                    <button className="ml-4 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors shadow-sm">
                        <Plus className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="calendar-container">{renderView()}</div>
        </div>
    )
}

