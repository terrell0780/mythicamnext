import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST() {
    const deployed = storage.deployPromos();
    return NextResponse.json({ success: true, message: 'All promos deployed', deployed });
}
