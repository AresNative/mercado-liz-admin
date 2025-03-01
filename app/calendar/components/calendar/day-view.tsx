import { format, isSameDay, setHours, setMinutes, differenceInMinutes } from "date-fns"
import type { Event } from "@/types/calendar"

interface DayViewProps {
  currentDate: Date
  events: Event[]
}

export default function DayView({ currentDate, events }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventPosition = (event: Event) => {
    if (!isSameDay(event.start, currentDate)) return null

    const dayStart = setHours(setMinutes(new Date(currentDate), 0), 0)
    const startMinutes = differenceInMinutes(event.start, dayStart)
    const durationMinutes = differenceInMinutes(event.end, event.start)

    const top = (startMinutes / 60) * 50 // 50px per hour
    const height = (durationMinutes / 60) * 50

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  const filteredEvents = events.filter((event) => isSameDay(event.start, currentDate))

  return (
    <div className="bg-white dark:bg-gray-800 overflow-auto">
      <div className="flex h-[600px] overflow-y-auto">
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[50px] text-xs text-right pr-2 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800"
            >
              {hour}:00
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          {hours.map((hour) => (
            <div key={hour} className="h-[50px] border-b border-gray-100 dark:border-gray-800"></div>
          ))}

          {filteredEvents.map((event, eventIdx) => {
            const position = getEventPosition(event)
            if (!position) return null

            return (
              <div
                key={eventIdx}
                className={`absolute left-0 right-0 mx-4 px-3 py-2 text-sm rounded ${event.color} text-white overflow-hidden`}
                style={position}
              >
                <div className="font-semibold">{event.title}</div>
                <div>
                  {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

