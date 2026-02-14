import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const users = storage.getUsers();
    return NextResponse.json({ success: true, users });
}
