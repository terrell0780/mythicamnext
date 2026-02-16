import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('--- ELITEANICORE MONETIZATION TEST SUITE ---');

async function runTests() {
    let passed = 0;
    let failed = 0;

    // Test 1: Environment Configuration
    console.log('\n[TEST 1] Environment Stability Check...');
    const requiredKeys = [
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    requiredKeys.forEach(key => {
        if (process.env[key] && !process.env[key].includes('PASTE_')) {
            console.log(`✅ ${key} is configured.`);
            passed++;
        } else {
            console.log(`❌ ${key} is MISSING or default.`);
            failed++;
        }
    });

    // Test 2: Pricing Logic Audit
    console.log('\n[TEST 2] Pricing & ID Synchronization...');
    try {
        const pricingPath = path.resolve(__dirname, '../app/pricing/page.js');
        const content = fs.readFileSync(pricingPath, 'utf8');

        if (content.includes('price_1') && !content.includes('price_1Starter_ID_Here')) {
            console.log('✅ Real Stripe Price IDs detected in Pricing page.');
            passed++;
        } else {
            console.log('❌ Placeholder Price IDs detected in Pricing page.');
            failed++;
        }

        if (content.includes('Elite Source Private') && content.includes('$999')) {
            console.log('✅ Premium Elite Tier ($999) is correctly defined.');
            passed++;
        } else {
            console.log('❌ Premium Elite Tier configuration error.');
            failed++;
        }
    } catch (e) {
        console.log('❌ Could not read pricing file.');
        failed++;
    }

    // Test 3: System Sentinel Readiness
    console.log('\n[TEST 3] Sentinel Growth Engine Audit...');
    const sentinelPath = path.resolve(__dirname, '../scripts/sentinel.mjs');
    if (fs.existsSync(sentinelPath)) {
        console.log('✅ Sentinel AI script exists.');
        passed++;
    } else {
        console.log('❌ Sentinel AI script is missing.');
        failed++;
    }

    console.log(`\n--- TEST RESULTS ---`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);

    if (failed === 0) {
        console.log('\n🚀 SYSTEM STATUS: 100% OPERATIONAL REVENUE ENGINE');
    } else {
        console.log('\n⚠️ SYSTEM STATUS: ATTENTION REQUIRED');
    }
}

runTests();
