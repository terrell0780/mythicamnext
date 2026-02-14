import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    // Mock transactions
    const transactions = [
        { id: 1, user: 'luna_studio', amount: 99.99, type: 'subscription', status: 'completed', date: '2026-01-04' },
        { id: 2, user: 'mike_designs', amount: 19.99, type: 'credits', status: 'completed', date: '2026-01-04' },
        { id: 3, user: 'alex_creator', amount: 29.99, type: 'subscription', status: 'completed', date: '2026-01-03' },
    ];
    return NextResponse.json({ success: true, transactions });
}
