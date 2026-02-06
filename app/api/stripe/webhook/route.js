import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!stripe || !endpointSecret) {
        return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const userId = session.metadata.userId;
            const customerId = session.customer;
            const subscriptionId = session.subscription;

            // Update user profile in Supabase
            const { error } = await supabase
                .from('profiles')
                .update({
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    subscription_status: 'active',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (error) console.error('Supabase Webhook Error:', error);
            break;

        case 'customer.subscription.deleted':
            const sub = event.data.object;
            // Update profile as inactive
            await supabase
                .from('profiles')
                .update({ subscription_status: 'inactive' })
                .eq('stripe_subscription_id', sub.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
