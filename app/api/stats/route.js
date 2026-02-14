import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
    const stats = storage.getStats();

    // Note: chartData was separate in Express. 
    // We can include it here or make a separate endpoint.
    // The frontend calls /api/stats and expects { stats: ... } wrapper in Step 24?
    // Frontend: "if (data.success) setDbStats(data.stats);" -> Expects { success: true, stats: ... }
    // Express implementation returned directly `db.stats`?
    // Express: `res.json(db.stats)` -> JSON object.
    // Frontend `fetchStats`: `const data = await res.json(); if (data.success) ...`
    // WAIT. If Express returned `db.stats` directly (Step 13 line 372), it does NOT have `{success:true}` wrapper.
    // Frontend code: `if (data.success) setDbStats(data.stats)`
    // THIS MEANS THE FRONTEND CODE (Step 24) WAS EXPECTING A WRAPPER that the Express server WAS NOT PROVIDING?
    // Or maybe I misread the Express code.
    // Express: `app.get('/api/stats', (req, res) => { res.json(db.stats); });` -> No wrapper.
    // Frontend: `const data = await res.json(); if (data.success) ...`
    // This means the frontend might be BROKEN currently with the Express server?
    // I will fix this in the Next.js implementation by providing the wrapper the Frontend expects.
    // Or I should match the Frontend's expectation.

    // To be safe, I will return { success: true, stats: stats } which matches the frontend code check.

    return NextResponse.json({
        success: true,
        stats: stats
    });
}
