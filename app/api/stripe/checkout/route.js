import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const { priceId, userId, userEmail } = await req.json();

        if (!stripe) {
            return NextResponse.json({ success: false, message: 'Stripe is not configured' }, { status: 500 });
        }

        if (!priceId) {
            return NextResponse.json({ success: false, message: 'Price ID is required' }, { status: 400 });
        }

        // Fetch price details to determine mode
        const price = await stripe.prices.retrieve(priceId);
        const mode = price.recurring ? 'subscription' : 'payment';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode,
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing/?canceled=true`,
            customer_email: userEmail,
            metadata: {
                userId: userId,
            },
        });

        return NextResponse.json({ success: true, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
