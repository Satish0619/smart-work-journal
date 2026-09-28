export type WorkItemCategory = 'work' | 'personal';

export type WorkItemType =
  // work types
  | 'development'
  | 'defect'
  | 'meeting'
  | 'research'
  | 'learning'
  | 'other'
  // personal types
  | 'health'
  | 'errand'
  | 'family'
  | 'finance'
  | 'personal-learning'
  | 'personal-other';

export const WORK_ITEM_CATEGORIES: { value: WorkItemCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
];

export const WORK_ITEM_TYPES_BY_CATEGORY: Record<
  WorkItemCategory,
  { value: WorkItemType; label: string }[]
> = {
  work: [
    { value: 'development', label: 'Development' },
    { value: 'defect', label: 'Defect' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'research', label: 'Research' },
    { value: 'learning', label: 'Learning' },
    { value: 'other', label: 'Other' },
  ],
  personal: [
    { value: 'health', label: 'Health' },
    { value: 'errand', label: 'Errand' },
    { value: 'family', label: 'Family' },
    { value: 'finance', label: 'Finance' },
    { value: 'personal-learning', label: 'Learning' },
    { value: 'personal-other', label: 'Other' },
  ],
};

// Flat list of all types (both categories) for lookups.
export const WORK_ITEM_TYPES: { value: WorkItemType; label: string }[] = [
  ...WORK_ITEM_TYPES_BY_CATEGORY.work,
  ...WORK_ITEM_TYPES_BY_CATEGORY.personal,
];

export const DEFAULT_TYPE_BY_CATEGORY: Record<WorkItemCategory, WorkItemType> = {
  work: 'development',
  personal: 'health',
};

export interface WorkItem {
  _id?: string;
  description: string;
  category: WorkItemCategory;
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
