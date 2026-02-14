import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const governance = storage.getGovernance();
    const uptime = process.uptime(); // Node.js process uptime

    return NextResponse.json({
        status: 'EliteAniCore fully operational (Serverless)',
        mode: 'Next.js App Router',
        uptime,
        modules: [
            'Conversion', 'Social Proof', 'Refund Confidence',
            'Traffic Warm-Up', 'Interactive Video', 'Animation Controls',
            'Revenue & Checkout', 'Branding', 'Admin Governance', 'AI Promo Engine'
        ],
        promoThrottle: governance.promoThrottle,
        killSwitch: governance.killSwitch,
        timestamp: new Date().toISOString()
    });
}
