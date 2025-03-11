import { format, isSameDay, addDays } from "date-fns"
import { es } from "date-fns/locale"
import type { Event } from "../../constants/calendar"
import { Clock, Calendar } from "lucide-react"

interface AgendaViewProps {
  currentDate: Date
  events: Event[]
}

export default function AgendaView({ currentDate, events }: AgendaViewProps) {
  // Group events by day for the next 7 days
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, i))

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day)).sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  return (
    <div className="bg-background dark:bg-zinc-800 overflow-auto max-h-[600px]">
      {days.map((day, dayIdx) => {
        const dayEvents = getEventsForDay(day)
        if (dayEvents.length === 0) return null

        return (
          <div key={dayIdx} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
            <div className="sticky top-0 bg-muted dark:bg-zinc-900 px-6 py-3 font-medium text-gray-900 dark:text-white dark:text-gray-100 shadow-sm z-10">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                <span className="capitalize">{format(day, "EEEE, d 'de' MMMM", { locale: es })}</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {dayEvents.map((event, eventIdx) => (
                <div
                  key={eventIdx}
                  className="p-4 hover:bg-muted/50 dark:hover:bg-zinc-900/50 transition-colors flex cursor-pointer"
                >
                  <div className={`w-1 self-stretch rounded-full mr-4 ${event.color}`}></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white dark:text-gray-100">{event.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-200 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500 dark:text-gray-200" />
                      <span>
                        {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                      </span>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full self-center ${event.color.replace("bg-", "bg-")}`}></div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {days.every((day) => getEventsForDay(day).length === 0) && (
        <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 dark:text-gray-200 dark:text-gray-400">
          <Calendar className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-600 dark:text-white" />
          <p className="text-lg font-medium">No hay eventos programados</p>
          <p className="text-sm mt-2">Agrega un evento para comenzar</p>
          {/* <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Agregar evento
          </button> */}
        </div>
      )}
    </div>
  )
}

