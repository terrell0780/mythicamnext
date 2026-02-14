import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { prompt } = await request.json();
        if (!prompt) return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 });

        // Mock Promo Generation
        const promo = `[AI Generated Promo] ${prompt}`;
        storage.addPromoToQueue(promo);

        return NextResponse.json({ success: true, promo });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
