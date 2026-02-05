import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        if (!supabase) return NextResponse.json({ success: true, generations: [] });

        const { data, error } = await supabase
            .from('generations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, generations: data || [] });
    } catch (error) {
        console.error('Fetch Generations Error:', error);
        return NextResponse.json({ success: true, generations: [] });
    }
}
