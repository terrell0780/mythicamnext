import Stripe from 'stripe';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function fetchIDs() {
    console.log('Fetching Stripe IDs...');
    try {
        const products = await stripe.products.list({ limit: 10 });
        console.log('\n--- PRODUCTS FOUND ---');
        for (const prod of products.data) {
            const prices = await stripe.prices.list({ product: prod.id, active: true });
            console.log(`Product: ${prod.name} (${prod.id})`);
            prices.data.forEach(price => {
                console.log(`  - Price ID: ${price.id} (${(price.unit_amount / 100).toFixed(2)} ${price.currency})`);
            });
        }
    } catch (err) {
        console.error('Error fetching Stripe data:', err.message);
    }
}

fetchIDs();
