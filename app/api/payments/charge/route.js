import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { amount, source, email } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
        }

        // Mock Charge Logic
        // In production: await stripe.charges.create(...)

        // Log transaction
        const tx = {
            id: Date.now(),
            user: email || 'guest',
            amount,
            type: 'charge',
            status: 'completed',
            date: new Date().toISOString()
        };

        storage.addTransaction(tx);

        return NextResponse.json({ success: true, transaction: tx });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
