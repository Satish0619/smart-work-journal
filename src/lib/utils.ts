import { format, parseISO, isValid } from 'date-fns';

export function formatDateDisplay(dateStr: string): string {
  const date = parseISO(dateStr);
  if (!isValid(date)) return dateStr;
  return format(date, 'd MMMM yyyy');
}

export function formatDayOfWeek(dateStr: string): string {
  const date = parseISO(dateStr);
  if (!isValid(date)) return '';
  return format(date, 'EEEE');
}

export function todayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}
