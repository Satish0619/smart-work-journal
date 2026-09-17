import mongoose, { Schema, Document, Model } from 'mongoose';
import { WorkItemType } from '@/types/workLog';

interface IWorkItem {
  description: string;
  type: WorkItemType;
  completed: boolean;
}

export interface IWorkLog extends Document {
  date: string;
  summary: string;
  workItems: IWorkItem[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkItemSchema = new Schema<IWorkItem>(
  {
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['development', 'defect', 'meeting', 'research', 'learning', 'other'],
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const WorkLogSchema = new Schema<IWorkLog>(
  {
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      unique: true,
    },
    summary: { type: String, default: '' },
    workItems: { type: [WorkItemSchema], default: [] },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

WorkLogSchema.index({ date: 1 }, { unique: true });

const WorkLog: Model<IWorkLog> =
  mongoose.models.WorkLog ?? mongoose.model<IWorkLog>('WorkLog', WorkLogSchema);

export default WorkLog;
