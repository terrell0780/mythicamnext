import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const settings = storage.getGovernance();
    const queue = storage.getPromoQueue();

    return NextResponse.json({
        pushTo: ['coldEmail', 'blog', 'socialPost'], // Static config for now
        throttlePercent: settings.promoThrottle,
        subscriberTrigger: 'first3Subscribers',
        contentQueue: queue
    });
}
