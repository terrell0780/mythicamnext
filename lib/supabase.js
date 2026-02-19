import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL';

// 1. Standard Client (Safe for Browser & Server)
export const supabase =
    isConfigured && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
        ? createClient(supabaseUrl, supabaseAnonKey)
        : {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                signInWithPassword: () =>
                    Promise.resolve({ data: {}, error: { message: 'Supabase not configured' } }),
            },
        };

// 2. Admin Client (Server-side only, uses Service Role Key)
const supabaseAdminConfigured = isConfigured && supabaseServiceKey && supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
export const supabaseAdmin = supabaseAdminConfigured
    ? createClient(supabaseUrl, supabaseServiceKey)
    : {
        from: () => ({
            update: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase Admin not configured' } }) }),
            select: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase Admin not configured' } }) }),
        }),
    };
