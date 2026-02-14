import { NextResponse } from 'next/server';

export async function GET() {
    // Mock generations history
    const generations = [
        // In a real app, fetch from storage/DB
    ];
    return NextResponse.json({ success: true, generations });
}
