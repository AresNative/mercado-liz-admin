"use client"

import { useState, useEffect } from "react"
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  differenceInMinutes,
} from "date-fns"
import { es } from "date-fns/locale"
import type { Event } from "../../constants/calendar"

interface WeekViewProps {
  currentDate: Date
  events: Event[]
}

export default function WeekView({ currentDate, events }: WeekViewProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const hours = Array.from({ length: 24 }, (_, i) => i)

  useEffect(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Week starts on Monday
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })

    setWeekDays(
      eachDayOfInterval({
        start: weekStart,
        end: weekEnd,
      }),
    )
  }, [currentDate])

  const getEventPosition = (event: Event, day: Date) => {
    if (!isSameDay(event.start, day)) return null

    const dayStart = setHours(setMinutes(new Date(day), 0), 0)
    const startMinutes = differenceInMinutes(event.start, dayStart)
    const durationMinutes = differenceInMinutes(event.end, event.start)

    const top = (startMinutes / 60) * 50 // 50px per hour
    const height = (durationMinutes / 60) * 50

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 overflow-auto">
      <div className="flex">
        <div className="w-16 flex-shrink-0"></div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="text-center py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {format(day, "EEE", { locale: es })}
              </div>
              <div
                className={`text-sm font-semibold ${isToday(day)
                  ? "h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto"
                  : "text-gray-900 dark:text-gray-100"
                  }`}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>
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
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} className="relative border-r border-gray-200 dark:border-gray-700">
              {hours.map((hour) => (
                <div key={hour} className="h-[50px] border-b border-gray-100 dark:border-gray-800"></div>
              ))}

              {events.map((event, eventIdx) => {
                const position = getEventPosition(event, day)
                if (!position) return null

                return (
                  <div
                    key={eventIdx}
                    className={`absolute left-0 right-0 mx-1 px-2 py-1 text-xs rounded ${event.color} text-white overflow-hidden`}
                    style={position}
                    title={event.title}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div>
                      {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

