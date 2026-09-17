'use client';

import { useRouter } from 'next/navigation';

interface CalendarDayProps {
  day: number | null;
  dateStr: string | null;
  isToday: boolean;
  hasLog: boolean;
  isCurrentMonth: boolean;
}

export default function CalendarDay({
  day,
  dateStr,
  isToday,
  hasLog,
  isCurrentMonth,
}: CalendarDayProps) {
  const router = useRouter();

  if (!day || !dateStr) return <div className="h-10 w-full" />;

  return (
    <button
      onClick={() => router.push(`/work-log/${dateStr}`)}
      className={`
        relative h-10 w-full flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors
        ${isCurrentMonth
          ? 'text-slate-700 dark:text-slate-200'
          : 'text-slate-300 dark:text-slate-600'}
        ${isToday
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
      `}
      aria-label={`${dateStr}${hasLog ? ', has work log' : ''}`}
    >
      {day}
      {hasLog && !isToday && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
      )}
      {hasLog && isToday && (
        <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/80" />
      )}
    </button>
  );
}
