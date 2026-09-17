'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WorkItemSchema } from '@/lib/validations';
import { WORK_ITEM_TYPES, WorkItem } from '@/types/workLog';
import { X } from 'lucide-react';

type FormValues = z.infer<typeof WorkItemSchema>;

interface WorkItemFormProps {
  initial?: Partial<WorkItem>;
  onSave: (item: FormValues) => void;
  onCancel: () => void;
}

export default function WorkItemForm({ initial, onSave, onCancel }: WorkItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(WorkItemSchema),
    defaultValues: {
      description: initial?.description ?? '',
      type: initial?.type ?? 'development',
      completed: initial?.completed ?? false,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 bg-slate-50 dark:bg-slate-900 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {initial?.description ? 'Edit Work Item' : 'Add Work Item'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
          aria-label="Cancel"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
          What did you work on?
        </label>
        <input
          {...register('description')}
          autoFocus
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Investigated defect CEUIDSS-68176"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-slate-600 dark:text-slate-300 mb-2">Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {WORK_ITEM_TYPES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                {...register('type')}
                type="radio"
                value={value}
                className="accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
        <input
          {...register('completed')}
          type="checkbox"
          className="w-4 h-4 accent-blue-600"
        />
        Completed
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {initial?.description ? 'Save Changes' : 'Add'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
