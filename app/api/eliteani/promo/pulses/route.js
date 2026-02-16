import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const pulses = storage.getPromoPulses();
    return NextResponse.json({ success: true, pulses });
}
