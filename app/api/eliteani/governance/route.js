import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const gov = storage.getGovernance();
    return NextResponse.json({ success: true, governance: gov });
}

export async function POST(req) {
    try {
        const { action, value } = await req.json();
        let result;

        switch (action) {
            case 'set_speed':
                result = storage.setAISpeed(value);
                break;
            case 'set_learning':
                result = storage.setLearningRate(value);
                break;
            case 'toggle_killswitch':
                result = storage.toggleKillSwitch(value);
                break;
            case 'set_throttle':
                result = storage.setPromoThrottle(value);
                break;
            case 'add_ad_proof':
                result = storage.addAdProof(value);
                break;
            default:
                return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true, result });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
