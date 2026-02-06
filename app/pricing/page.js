"use client";

import React from "react";
import { Check, Rocket, Zap, Crown } from "lucide-react";
import Link from "next/link";

const tiers = [
    {
        name: "Starter",
        price: "$49",
        description: "Perfect for emerging projects and individual orchestrators.",
        features: ["5 Intelligence Nodes", "Basic Revenue Tracking", "Email Support", "Standard API Access"],
        icon: Zap,
        color: "text-blue-400",
        button: "Get Started",
        highlight: false
    },
    {
        name: "Business",
        price: "$199",
        description: "Scale your orchestration with advanced automation and tracking.",
        features: ["25 Intelligence Nodes", "Full Revenue Optimization", "Priority Support", "Advanced API Access", "Custom Dashboards"],
        icon: Rocket,
        color: "text-cyan-400",
        button: "Scale Now",
        highlight: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Full-scale autonomous operation for multi-vector platforms.",
        features: ["Unlimited Nodes", "Predictive Yield Analysis", "24/7 Dedicated Support", "White-label Options", "Dedicated Infrastructure"],
        icon: Crown,
        color: "text-emerald-400",
        button: "Contact Sales",
        highlight: false
    }
];

export default function Pricing() {
    const [loading, setLoading] = React.useState(false);

    const handleCheckout = async (tier) => {
        setLoading(tier.name);
        try {
            // Mock price IDs for demonstration - user should replace these
            const priceIds = {
                'Starter': 'price_starter_id',
                'Business': 'price_business_id',
                'Enterprise': 'price_enterprise_id'
            };

            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: priceIds[tier.name],
                    userId: 'user_uuid_here', // In a real app, get this from Supabase Session
                    userEmail: 'user@example.com'
                })
            });

            const data = await res.json();
            if (data.success && data.url) {
                window.location.href = data.url;
            } else {
                alert('Checkout failed: ' + (data.message || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Stripe Error: Could not initiate checkout');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-950 py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 animate-fade-in">
                    <h1 className="text-5xl font-extrabold mb-6">Monetization <span className="gradient-text">Orchestration</span></h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Sustainable pricing models designed to maximize LTV and minimize churn while scaling impact.
                    </p>
                    <div className="mt-8">
                        <Link href="/" className="text-blue-400 hover:text-blue-300 font-medium transition flex items-center justify-center gap-2">
                            ← Return to Intelligence Hub
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <div
                            key={i}
                            className={`glass-card p-10 rounded-[40px] flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.05] ${tier.highlight ? 'border-blue-500/40 bg-blue-500/5 ring-1 ring-blue-500/20' : ''}`}
                        >
                            <div className={`p-4 rounded-3xl bg-white/5 w-fit mb-8 ${tier.color}`}>
                                <tier.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-5xl font-black">{tier.price}</span>
                                {tier.price !== "Custom" && <span className="text-slate-500 font-medium">/mo</span>}
                            </div>
                            <p className="text-slate-400 mb-10 leading-relaxed">
                                {tier.description}
                            </p>

                            <ul className="w-full space-y-4 mb-10 text-left">
                                {tier.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout(tier)}
                                disabled={loading === tier.name}
                                className={`w-full py-4 rounded-2xl font-black transition-all ${tier.highlight ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                            >
                                {loading === tier.name ? 'Processing...' : tier.button}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 glass-card p-10 rounded-[40px] text-center max-w-4xl mx-auto border border-emerald-500/20 bg-emerald-500/5">
                    <h3 className="text-2xl font-bold mb-4">Autonomous Revenue Growth</h3>
                    <p className="text-slate-400">
                        Our pricing is dynamic and adapts to market liquidity and user behavior patterns to ensure maximum ROI for your organization.
                    </p>
                </div>
            </div>
        </div>
    );
}
