import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongodb';
import WorkLogModel from '@/models/WorkLog';
import WorkLogClient from '@/components/work-log/WorkLog';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { WorkLog } from '@/types/workLog';
import { formatDateDisplay } from '@/lib/utils';

interface PageProps {
  params: Promise<{ date: string }>;
}

function isValidDate(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(Date.parse(str));
}

export async function generateMetadata({ params }: PageProps) {
  const { date } = await params;
  return { title: `${formatDateDisplay(date)} — Work Journal` };
}

export default async function WorkLogPage({ params }: PageProps) {
  const { date } = await params;

  if (!isValidDate(date)) notFound();

  await connectToDatabase();

  const doc = await WorkLogModel.findOne({ date }).lean();

  const workLog: WorkLog | null = doc
    ? JSON.parse(JSON.stringify(doc))
    : null;

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <Link
          href="/calendar"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
        >
          <ChevronLeft size={16} />
          Calendar
        </Link>
        <ThemeToggle />
      </header>

      <WorkLogClient date={date} initial={workLog} />
    </main>
  );
}
