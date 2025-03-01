"use client"

import { useState, useEffect } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import type { Event } from "@/types/calendar"

interface MonthViewProps {
  currentDate: Date
  events: Event[]
}

export default function MonthView({ currentDate, events }: MonthViewProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Week starts on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    setCalendarDays(
      eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd,
      }),
    )
  }, [currentDate])

  const getDayEvents = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day))
  }

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day, index) => (
          <div key={index} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-[600px]">
        {calendarDays.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className={`min-h-[85px] border border-gray-200 dark:border-gray-700 p-1 ${
              !isSameMonth(day, currentDate)
                ? "bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600"
                : "bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-sm font-medium ${
                  isToday(day)
                    ? "h-6 w-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                    : isSameMonth(day, currentDate)
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-400 dark:text-gray-600"
                }`}
              >
                {format(day, "d")}
              </span>
            </div>
            <div className="mt-1 space-y-1 max-h-[60px] overflow-y-auto">
              {getDayEvents(day).map((event, eventIdx) => (
                <div
                  key={eventIdx}
                  className={`px-2 py-1 text-xs rounded truncate ${event.color} text-white`}
                  title={event.title}
                >
                  {format(event.start, "HH:mm")} {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

