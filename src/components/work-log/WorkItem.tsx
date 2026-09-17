'use client';

import { useState } from 'react';
import { Pencil, Trash2, CheckSquare, Square } from 'lucide-react';
import { WorkItem as WorkItemType, WORK_ITEM_TYPES } from '@/types/workLog';
import WorkItemForm from './WorkItemForm';
import { z } from 'zod';
import { WorkItemSchema } from '@/lib/validations';

type FormValues = z.infer<typeof WorkItemSchema>;

interface WorkItemProps {
  item: WorkItemType;
  onUpdate: (updated: FormValues) => void;
  onDelete: () => void;
}

export default function WorkItem({ item, onUpdate, onDelete }: WorkItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const typeLabel =
    WORK_ITEM_TYPES.find((t) => t.value === item.type)?.label ?? item.type;

  if (editing) {
    return (
      <WorkItemForm
        initial={item}
        onSave={(updated) => {
          onUpdate(updated);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (confirmDelete) {
    return (
      <div className="flex items-center justify-between py-3 gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
          Remove <span className="font-medium text-slate-700 dark:text-slate-200">&ldquo;{item.description}&rdquo;</span>?
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setConfirmDelete(false)}
            className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 py-3 group">
      <button
        onClick={() => onUpdate({ ...item, completed: !item.completed })}
        className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors"
        aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {item.completed ? (
          <CheckSquare size={18} className="text-blue-600 dark:text-blue-400" />
        ) : (
          <Square size={18} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            item.completed
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {item.description}
        </p>
        <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">{typeLabel}</span>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 rounded transition-colors"
          aria-label="Edit work item"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-1 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 rounded transition-colors"
          aria-label="Delete work item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
