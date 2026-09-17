export type WorkItemType =
  | 'development'
  | 'defect'
  | 'meeting'
  | 'research'
  | 'learning'
  | 'other';

export const WORK_ITEM_TYPES: { value: WorkItemType; label: string }[] = [
  { value: 'development', label: 'Development' },
  { value: 'defect', label: 'Defect' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'research', label: 'Research' },
  { value: 'learning', label: 'Learning' },
  { value: 'other', label: 'Other' },
];

export interface WorkItem {
  _id?: string;
  description: string;
  type: WorkItemType;
  completed: boolean;
}

export interface WorkLog {
  _id: string;
  date: string;
  summary: string;
  workItems: WorkItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkLogDatesResponse {
  dates: string[];
}
