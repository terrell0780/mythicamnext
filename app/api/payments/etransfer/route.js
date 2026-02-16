import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { amount, toBank, toAccount, note } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
        }

        const tx = {
            id: Date.now(),
            user: toAccount || 'external',
            amount,
            type: 'etransfer',
            status: 'pending',
            toBank,
            note,
            date: new Date().toISOString()
        };

        storage.addTransaction(tx);

        return NextResponse.json({
            success: true,
            transaction: tx,
            message: 'E-Transfer initiated (mock)'
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
