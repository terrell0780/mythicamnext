import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { percent } = await request.json();
        if (percent === undefined || percent < 0 || percent > 150) {
            return NextResponse.json({ success: false, message: 'Throttle must be 0–150' }, { status: 400 });
        }

        const newPercent = storage.setPromoThrottle(percent);
        return NextResponse.json({ success: true, throttlePercent: newPercent });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
