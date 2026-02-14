import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    return NextResponse.json(storage.getGovernance());
}

// Handle Actions (Kill Switch, Clear Logs)
export async function POST(request) {
    try {
        const body = await request.json();
        const { action } = body;

        // Toggle Kill Switch
        if (action === 'killswitch') {
            const { enabled } = body;
            const newState = storage.toggleKillSwitch(!!enabled);
            return NextResponse.json({ success: true, killSwitch: newState });
        }

        // Clear Logs
        if (action === 'clear-logs') {
            const count = storage.clearLogs();
            return NextResponse.json({ success: true, message: `Cleared ${count} log entries` });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
