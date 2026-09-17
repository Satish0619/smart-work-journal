import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WorkLog from '@/models/WorkLog';
import { UpdateWorkLogSchema } from '@/lib/validations';

// PUT /api/work-logs/:id — update work log
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateWorkLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const log = await WorkLog.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    ).lean();

    if (!log) {
      return NextResponse.json({ error: 'Work log not found' }, { status: 404 });
    }

    return NextResponse.json({ workLog: log }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/work-logs/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/work-logs/:id — delete entire work log for a day
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const log = await WorkLog.findByIdAndDelete(id).lean();

    if (!log) {
      return NextResponse.json({ error: 'Work log not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/work-logs/:id]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
