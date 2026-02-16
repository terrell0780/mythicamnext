"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, Cpu } from "lucide-react";

const links = [
    { name: "Intelligence", href: "/" },
    { name: "Monetization", href: "/pricing" },
    { name: "About Core", href: "/about" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`glass rounded-3xl px-6 py-3 flex items-center justify-between border-white/5 shadow-2xl transition-all ${scrolled ? 'bg-surface-950/80' : 'bg-transparent border-transparent shadow-none'}`}>
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-xl bg-blue-600 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                            <Cpu className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter gradient-text">EliteAniCore</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-blue-400 ${pathname === link.href ? 'text-blue-400' : 'text-slate-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 group">
                            Connect <Rocket className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-slate-400" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-6 right-6 mt-4 transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    <div className="glass rounded-3xl p-8 space-y-6 shadow-2xl border-white/5">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block text-lg font-bold transition-colors hover:text-blue-400 ${pathname === link.href ? 'text-blue-400' : 'text-slate-400'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-white/5" />
                        <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl">
                            Initialize Connection
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
