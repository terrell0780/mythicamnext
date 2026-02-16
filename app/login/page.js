"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, User, Chrome, Apple } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [loginMode, setLoginMode] = useState('user'); // 'user' or 'owner'
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleOAuthLogin = async (provider) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`
                }
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || `Failed to sign in with ${provider}`);
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, pin: loginMode === 'owner' ? pin : 'GUEST_BYPASS' })
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('eliteani_session', JSON.stringify(data.user));
            router.push('/');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-6">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl z-10 mx-auto shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 selection:bg-indigo-500">
                        EliteAniCore <span className="text-indigo-500">2.0</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Autonomous Intelligence Framework</p>
                </div>

                {/* Login Mode Toggle */}
                <div className="flex p-1 bg-slate-950/50 rounded-2xl border border-white/5 mb-8">
                    <button
                        onClick={() => setLoginMode('user')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${loginMode === 'user' ? 'bg-white/10 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <User size={16} /> User Entry
                    </button>
                    <button
                        onClick={() => setLoginMode('owner')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${loginMode === 'owner' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ShieldCheck size={16} /> Owner Access
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {loginMode === 'user' ? (
                        <motion.div
                            key="user-login"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => handleOAuthLogin('google')}
                                disabled={loading}
                                className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Chrome size={20} /> Continue with Google
                            </button>
                            <button
                                onClick={() => handleOAuthLogin('apple')}
                                disabled={loading}
                                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black shadow-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                <Apple size={20} /> Continue with Apple
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                <div className="relative flex justify-center text-xs uppercase font-black"><span className="bg-slate-900/40 px-3 text-slate-600 tracking-widest leading-none">OR USE EMAIL</span></div>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="guest@example.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl font-black text-white bg-slate-800 hover:bg-slate-700 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? "Authenticating..." : "Enter Dashboard"}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="owner-login"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-5"
                        >
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Owner Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="TERRELL0780@GMAIL.COM"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-950/40 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Master PIN Code</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            placeholder="••••"
                                            className="w-full pl-12 pr-12 py-4 bg-slate-950/40 border border-white/5 rounded-2xl text-white placeholder-slate-700 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-900/40 shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? "Decrypting..." : "Unlock Master Control"}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <p className="mt-8 text-center text-slate-600 text-[10px] uppercase font-bold tracking-[0.2em]">
                    Real-time monitoring active
                </p>
            </motion.div>
        </div>
    );
}
