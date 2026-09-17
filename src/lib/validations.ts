import { z } from 'zod';

export const WorkItemTypeSchema = z.enum([
  'development',
  'defect',
  'meeting',
  'research',
  'learning',
  'other',
]);

export const WorkItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  type: WorkItemTypeSchema,
  completed: z.boolean(),
});

export const WorkLogSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  summary: z.string().optional().default(''),
  workItems: z.array(WorkItemSchema).default([]),
  notes: z.string().optional().default(''),
});

export const UpdateWorkLogSchema = z.object({
  summary: z.string().optional(),
  workItems: z.array(WorkItemSchema).optional(),
  notes: z.string().optional(),
});

export type WorkLogInput = z.infer<typeof WorkLogSchema>;
export type UpdateWorkLogInput = z.infer<typeof UpdateWorkLogSchema>;
