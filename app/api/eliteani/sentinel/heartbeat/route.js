import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { status, healthScore, activeThreats } = await request.json();
        storage.updateSentinelStatus(status || 'Active', {
            healthScore: healthScore ?? 100,
            activeThreats: activeThreats ?? 0,
            lastAudit: new Date().toISOString()
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
