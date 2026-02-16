import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { amount, accountNumber, bankName } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
        }

        const tx = {
            id: Date.now(),
            user: accountNumber || 'external',
            amount,
            type: 'payout',
            status: 'completed',
            bankName,
            date: new Date().toISOString()
        };

        storage.addTransaction(tx);

        return NextResponse.json({ success: true, transaction: tx });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
