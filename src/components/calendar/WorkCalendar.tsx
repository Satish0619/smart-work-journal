'use client';

import { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';
import { monthKey } from '@/lib/utils';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function isoWeekday(date: Date): number {
  const d = getDay(date);
  return d === 0 ? 7 : d;
}

export default function WorkCalendar() {
  const today = new Date();
  const [current, setCurrent] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [logDates, setLogDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const year = current.getFullYear();
  const month = current.getMonth();

  useEffect(() => {
    const key = monthKey(year, month);
    let cancelled = false;

    fetch(`/api/work-logs?month=${key}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setLogDates(new Set(data.dates ?? []));
          setLoading(false);
          setError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [year, month]);

  const firstDay = startOfMonth(current);
  const lastDay = endOfMonth(current);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  const leadingBlanks = isoWeekday(firstDay) - 1;
  const cells: (Date | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goToPrev = () => setCurrent((d) => subMonths(d, 1));
  const goToNext = () => setCurrent((d) => addMonths(d, 1));
  const goToToday = () =>
    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));

  const isCurrentMonthView =
    year === today.getFullYear() && month === today.getMonth();

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Calendar card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPrev}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              {format(current, 'MMMM yyyy')}
            </h2>
            {!isCurrentMonthView && (
              <button
                onClick={goToToday}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
              >
                Back to today
              </button>
            )}
          </div>

          <button
            onClick={goToNext}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center pb-2"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        {loading ? (
          <div className="text-center py-12 text-sm text-slate-400">Loading…</div>
        ) : error ? (
          <div className="text-center py-12 text-sm text-red-500">
            Failed to load calendar data.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <div key={`blank-${i}`} className="h-10" />;
              const dateStr = format(day, 'yyyy-MM-dd');
              return (
                <CalendarDay
                  key={dateStr}
                  day={day.getDate()}
                  dateStr={dateStr}
                  isToday={isSameDay(day, today)}
                  hasLog={logDates.has(dateStr)}
                  isCurrentMonth={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
