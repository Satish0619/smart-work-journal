import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import WorkLog from '@/models/WorkLog';
import { WorkLogSchema } from '@/lib/validations';

// GET /api/work-logs?date=YYYY-MM-DD  — single day log
// GET /api/work-logs?month=YYYY-MM    — dates with logs for the calendar
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const month = searchParams.get('month');

    if (date) {
      const log = await WorkLog.findOne({ date }).lean();
      if (!log) {
        return NextResponse.json({ workLog: null }, { status: 200 });
      }
      return NextResponse.json({ workLog: log }, { status: 200 });
    }

    if (month) {
      // Return only dates that have a log for the given month (YYYY-MM)
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return NextResponse.json({ error: 'Invalid month format' }, { status: 400 });
      }
      const logs = await WorkLog.find(
        { date: { $regex: `^${month}-` } },
        { date: 1, _id: 0 }
      ).lean();
      return NextResponse.json({ dates: logs.map((l) => l.date) }, { status: 200 });
    }

    return NextResponse.json({ error: 'Provide date or month query param' }, { status: 400 });
  } catch (err) {
    console.error('[GET /api/work-logs]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/work-logs — create or upsert work log for a date
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const parsed = WorkLogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { date, summary, workItems, notes } = parsed.data;

    const log = await WorkLog.findOneAndUpdate(
      { date },
      { $set: { summary, workItems, notes } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ workLog: log }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/work-logs]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
