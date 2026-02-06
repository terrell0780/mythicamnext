import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL';

// 1. Standard Client (Safe for Browser & Server)
// Uses Anon Key. Accessible via NEXT_PUBLIC_ in browser.
export const supabase = isConfigured && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            signInWithPassword: () => Promise.resolve({ data: {}, error: { message: "Supabase not configured" } }),
            signOut: () => Promise.resolve({ error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } })
        },
        from: () => ({
            select: () => {
                const mock = Promise.resolve({ data: [], error: null });
                mock.single = () => Promise.resolve({ data: null, error: null });
                mock.order = () => mock;
                return mock;
            }
        })
    };

// 2. Admin Client (SERVER SIDE ONLY)
// Uses Service Role Key. Never exposed to browser.
const adminClient = isConfigured && supabaseServiceKey && supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export const supabaseAdmin = adminClient || {
    from: () => ({
        insert: () => Promise.resolve({ error: null }),
        select: () => {
            const mock = Promise.resolve({ data: [], error: null });
            // @ts-ignore
            mock.single = () => Promise.resolve({ data: null, error: null });
            return mock;
        }
    })
};
