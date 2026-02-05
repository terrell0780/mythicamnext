"use client";

import React, { useState, useEffect } from "react";
import { Zap, X, Share2, Rocket } from "lucide-react";

export default function PromotionOverlay() {
    const [isVisible, setIsVisible] = useState(false);
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        // "Kick in" at deployment - simulate analysis delay
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    if (minimized) {
        return (
            <button
                onClick={() => setMinimized(false)}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 hover:scale-110 transition-transform animate-bounce z-50 flex items-center justify-center"
            >
                <Zap className="w-6 h-6 text-white" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="glass-card p-6 rounded-2xl max-w-sm border border-blue-500/30 shadow-2xl relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                <Rocket className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">System Alert</span>
                        </div>
                        <button
                            onClick={() => setMinimized(true)}
                            className="text-slate-400 hover:text-white transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold mb-2">Deploy Intelligence?</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                        Your orchestration logic is performing at 98% efficiency. Clone this architecture to scale your own revenue loops.
                    </p>

                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-blue-500/25">
                            Deploy Clone
                        </button>
                        <button className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition flex items-center gap-2">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
