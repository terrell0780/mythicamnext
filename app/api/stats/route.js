import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        console.log('Fetching stats...');

        // Safety for build-time execution
        if (!supabase) {
            return NextResponse.json({ success: true, stats: { active_users: 0, revenue_today: 0, mrr: 0, total_generations: 0 } });
        }

        const { count: genCount, error: genError } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true });

        const { count: userCount, error: userError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        const { data: siteData, error: siteError } = await supabase
            .from('site_stats')
            .select('*')
            .single();

        return NextResponse.json({
            success: true,
            stats: {
                ...(siteData || {}),
                active_users: userCount || 0,
                jobs_queued: 0,
                revenue_today: (siteData?.revenue_today) || 0,
                mrr: (siteData?.mrr) || 0,
                total_generations: genCount || 0
            }
        });
    } catch (error) {
        console.error('Fetch Stats Error:', error);
        return NextResponse.json({ success: true, stats: { active_users: 0, revenue_today: 0, mrr: 0, total_generations: 0 } });
    }
}
