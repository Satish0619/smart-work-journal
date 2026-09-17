import WorkCalendar from '@/components/calendar/WorkCalendar';
import ThemeToggle from '@/components/ui/ThemeToggle';

export const metadata = { title: 'Work Journal' };

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Work Journal
        </h1>
        <ThemeToggle />
      </header>
      <WorkCalendar />
    </main>
  );
}
