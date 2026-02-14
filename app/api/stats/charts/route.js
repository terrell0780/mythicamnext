import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const chartData = {
        // Mock chart data - in production this would come from DB aggregation
        revenue: [
            { name: 'Mon', revenue: 4000, users: 2400 },
            { name: 'Tue', revenue: 3000, users: 1398 },
            { name: 'Wed', revenue: 2000, users: 9800 },
            { name: 'Thu', revenue: 2780, users: 3908 },
            { name: 'Fri', revenue: 1890, users: 4800 },
            { name: 'Sat', revenue: 2390, users: 3800 },
            { name: 'Sun', revenue: 3490, users: 4300 },
        ],
        users: [
            { name: 'Mon', value: 120 },
            { name: 'Tue', value: 145 },
            { name: 'Wed', value: 132 },
            { name: 'Thu', value: 178 },
            { name: 'Fri', value: 195 },
            { name: 'Sat', value: 167 },
            { name: 'Sun', value: 156 }
        ]
    };

    return NextResponse.json({
        success: true,
        charts: chartData // Frontend expects data structure to match charts
    });
}
