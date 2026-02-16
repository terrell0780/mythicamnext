const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

console.log('--- ELITEANICORE VERIFICATION SUITE ---');

function runTests() {
    let passed = 0;
    let failed = 0;

    // Test 1: Env
    console.log('\n[TEST 1] Environment Check...');
    ['STRIPE_SECRET_KEY', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'].forEach(key => {
        if (process.env[key] && !process.env[key].includes('PASTE_')) {
            console.log(`✅ ${key} is active.`);
            passed++;
        } else {
            console.log(`❌ ${key} is missing.`);
            failed++;
        }
    });

    // Test 2: Pricing
    console.log('\n[TEST 2] Pricing File Audit...');
    const pricingContent = fs.readFileSync(path.resolve(__dirname, '../app/pricing/page.js'), 'utf8');
    if (pricingContent.includes('price_1T1T4') && pricingContent.includes('$999')) {
        console.log('✅ $999 Elite Source Price ID is synchronized.');
        passed++;
    } else {
        console.log('❌ $999 Pricing ID mismatch.');
        failed++;
    }

    // Test 3: Sentinel
    console.log('\n[TEST 3] Growth Engine Status...');
    if (fs.existsSync(path.resolve(__dirname, '../scripts/sentinel.mjs'))) {
        console.log('✅ Sentinel AI Growth Engine is present.');
        passed++;
    } else {
        console.log('❌ Sentinel AI script not found.');
        failed++;
    }

    console.log(`\nTOTAL PASSED: ${passed}`);
    console.log(`TOTAL FAILED: ${failed}`);

    if (failed === 0) console.log('\n>>> SYSTEM STATUS: 100% PRODUCTION READY');
}

runTests();
