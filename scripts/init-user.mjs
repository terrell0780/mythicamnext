import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function initUser() {
    const email = 'terrell0780@gmail.com';
    const password = 'admin1951'; // Compliant with 6+ char requirement

    console.log(`Checking if user ${email} exists in Auth...`);

    // Check if user exists in Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError.message);
        return;
    }

    let authUser = users.find(u => u.email === email);

    if (authUser) {
        console.log('User already exists in Auth. Updating password to admin1951...');
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            authUser.id,
            { password: password }
        );
        if (updateError) {
            console.error('Error updating password:', updateError.message);
        } else {
            console.log('Password updated successfully.');
        }
    } else {
        console.log('Creating new admin user in Auth...');
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true
        });

        if (createError) {
            console.error('Error creating user:', createError.message);
            return;
        }
        authUser = data.user;
        console.log('Admin user created in Auth:', authUser.id);
    }

    // --- Profile Creation ---
    console.log('Ensuring profile exists in database...');
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (profileError) {
        console.error('Error checking profile (Table might be missing!):', profileError.message);
        console.log('TIP: Make sure you have run the schema.sql in your Supabase SQL Editor.');
    } else if (!profile) {
        console.log('Creating profile entry...');
        const { error: insertError } = await supabase
            .from('profiles')
            .insert([
                { id: authUser.id, email: email, username: 'admin', tier: 'Pro', credits: 99999 }
            ]);

        if (insertError) {
            console.error('Error inserting profile:', insertError.message);
        } else {
            console.log('Profile created successfully!');
        }
    } else {
        console.log('Profile already exists.');
    }

    // --- Site Stats Verification ---
    const { data: stats, error: statsError } = await supabase.from('site_stats').select('*').eq('id', 1).maybeSingle();
    if (statsError || !stats) {
        console.log('Site stats missing or error. Attempting to initialize stats table...');
        await supabase.from('site_stats').insert([{ id: 1, active_users: 1, revenue_today: 0, mrr: 0 }]);
    } else {
        console.log('Site stats table ready.');
    }
}

initUser();
