'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { WorkLog as WorkLogType, WorkItem as WorkItemType } from '@/types/workLog';
import { formatDateDisplay, formatDayOfWeek } from '@/lib/utils';
import WorkItem from './WorkItem';
import WorkItemForm from './WorkItemForm';
import { z } from 'zod';
import { WorkItemSchema } from '@/lib/validations';

type FormValues = z.infer<typeof WorkItemSchema>;
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface WorkLogProps {
  date: string;
  initial: WorkLogType | null;
}

export default function WorkLog({ date, initial }: WorkLogProps) {
  const [workItems, setWorkItems] = useState<WorkItemType[]>(initial?.workItems ?? []);

  // Track saved vs current notes to know when Save should be enabled
  const [savedNotes, setSavedNotes] = useState(initial?.notes ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const [showForm, setShowForm] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const notesDirty = notes !== savedNotes;

  const saveItems = useCallback(
    async (items: WorkItemType[], currentNotes: string) => {
      try {
        const res = await fetch('/api/work-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, workItems: items, notes: currentNotes, summary: '' }),
        });
        if (!res.ok) throw new Error('Save failed');
      } catch {
        // silent — work item changes are optimistic; notes has its own status
      }
    },
    [date]
  );

  const saveNotes = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/work-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, workItems, notes, summary: '' }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSavedNotes(notes);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [date, workItems, notes]);

  const handleAddItem = (values: FormValues) => {
    const newItems = [...workItems, values as WorkItemType];
    setWorkItems(newItems);
    setShowForm(false);
    saveItems(newItems, notes);
  };

  const handleUpdateItem = (index: number, values: FormValues) => {
    const newItems = workItems.map((item, i) =>
      i === index ? { ...item, ...values } : item
    );
    setWorkItems(newItems);
    saveItems(newItems, notes);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = workItems.filter((_, i) => i !== index);
    setWorkItems(newItems);
    saveItems(newItems, notes);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Date header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          {formatDateDisplay(date)}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5">{formatDayOfWeek(date)}</p>
      </div>

      {/* Work items card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
            {"Today's Work"}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            <Plus size={16} />
            Add Work
          </button>
        </div>

        {showForm && (
          <div className="mb-4">
            <WorkItemForm onSave={handleAddItem} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {workItems.length === 0 && !showForm ? (
          <div className="text-sm text-slate-400 dark:text-slate-500 py-8 text-center border border-dashed border-slate-200 dark:border-slate-600 rounded-xl">
            No work logged for this day.
            <br />
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Work
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {workItems.map((item, index) => (
              <WorkItem
                key={index}
                item={item}
                onUpdate={(updated) => handleUpdateItem(index, updated)}
                onDelete={() => handleDeleteItem(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Notes card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3">
          Notes
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Any notes for the day…"
        />
      </div>

      {/* Save row */}
      <div className="flex items-center gap-4">
        <button
          onClick={saveNotes}
          disabled={!notesDirty || saveStatus === 'saving'}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          {saveStatus === 'saving' ? 'Saving…' : 'Save'}
        </button>

        {saveStatus === 'saved' && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Saved
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-sm text-red-600 dark:text-red-400">
            Unable to save.{' '}
            <button onClick={saveNotes} className="underline">
              Try again
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
