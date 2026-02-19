"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Menu, Search, Users, LogOut, Home, Activity, Wand2, Palette,
  DollarSign, TrendingUp, Mail, Zap, Sun, Moon, Paintbrush, ArrowUpCircle,
  Eraser, Film, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { safeLocale } from '@/lib/format';

// ==========================
// STYLE PRESETS
// ==========================
const STYLE_PRESETS = [
  { id: 'none', label: 'No Style', icon: '✨', color: 'from-slate-600 to-slate-700', suffix: '' },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: '🌆', color: 'from-cyan-600 to-blue-700', suffix: ', cyberpunk style, neon lights, rain' },
  { id: 'ghibli', label: 'Studio Ghibli', icon: '🌸', color: 'from-green-500 to-emerald-600', suffix: ', Studio Ghibli anime style, whimsical, soft watercolor' },
  { id: 'photorealism', label: 'Photorealistic', icon: '📷', color: 'from-amber-500 to-orange-600', suffix: ', photorealistic, ultra detailed, cinematic' },
  { id: 'anime', label: 'Anime', icon: '⚡', color: 'from-pink-500 to-rose-600', suffix: ', anime style, dynamic composition' },
];

// ==========================
// GLASS CARD
// ==========================
const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-panel rounded-2xl p-6 border border-slate-700/50 ${className}`}
  >
    {children}
  </motion.div>
);

// ==========================
// IMAGE MODAL
// ==========================
const ImageModal = ({ image, onClose, onAction }) => {
  const [actionLoading, setActionLoading] = useState(null);
  if (!image) return null;

  const actions = [
    { id: 'inpaint', label: 'In-Paint', icon: Paintbrush, color: 'from-blue-600 to-cyan-600' },
    { id: 'upscale', label: 'Upscale 4x', icon: ArrowUpCircle, color: 'from-emerald-600 to-green-600' },
    { id: 'removebg', label: 'Remove BG', icon: Eraser, color: 'from-orange-600 to-amber-600' },
    { id: 'animate', label: 'Animate', icon: Film, color: 'from-purple-600 to-pink-600' },
  ];

  const handleAction = async (action) => {
    setActionLoading(action);
    await onAction(image, action);
    setActionLoading(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
          <img src={image.url} alt={image.prompt} className="w-full h-full object-cover aspect-square" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 rounded-full hover:bg-black/80 transition">
            <ChevronDown size={20} />
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-1">Studio Editor</h3>
          <p className="text-slate-400 text-sm mb-6">{image.prompt}</p>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {actions.map((a) => (
              <button
                key={a.id}
                onClick={() => handleAction(a.id)}
                disabled={actionLoading !== null}
                className={`flex items-center gap-4 p-4 rounded-xl border border-slate-700/40 hover:border-slate-500/60 bg-slate-800/50`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg`}>
                  {actionLoading === a.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <a.icon size={22} className="text-white" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">{a.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================
// PROMOTION PULSE
// ==========================
const PromotionPulse = ({ pulses }) => {
  const channels = [
    { id: 'social', label: 'Social', icon: TrendingUp, color: 'text-pink-400' },
    { id: 'seo', label: 'Search', icon: Search, color: 'text-blue-400' },
    { id: 'email', label: 'Email', icon: Mail, color: 'text-emerald-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {channels.map(c => {
        const active = pulses.includes(c.id);
        return (
          <div key={c.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 flex flex-col items-center justify-center relative">
            {active && <motion.div className={`absolute inset-0 rounded-full ${c.color} opacity-10 animate-ping`} />}
            <c.icon size={24} className={`${c.color} ${active ? 'animate-bounce' : 'opacity-40'}`} />
            <p className="text-[10px] text-slate-500 mt-1">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
};

// ==========================
// MAIN APP
// ==========================
export default function EliteAniCoreApp() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [prompt, setPrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('none');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setMounted(true);
    const s = localStorage.getItem('eliteani_session');
    if (!s) router.push('/login');
    else setUser(JSON.parse(s));
  }, [router]);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  const handleGenerate = async () => {
    if (!prompt) return;
    const preset = STYLE_PRESETS.find(p => p.id === selectedPreset);
    const enhancedPrompt = prompt + (preset?.suffix || '');
    // Call API here to generate image
    setGeneratedImages([{ url: '/placeholder.png', prompt: enhancedPrompt }, ...generatedImages]);
    setPrompt('');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950 text-slate-200">
      {/* Sidebar */}
      <aside className={`bg-slate-900 border-r border-slate-800 transition-all ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
        <div className="p-6">EliteAniCore</div>
        <nav className="flex flex-col gap-2 p-2">
          {['dashboard', 'create'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`p-2 rounded ${activeTab === tab ? 'bg-indigo-600' : ''}`}>{tab}</button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto relative">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          </div>
        )}
        {activeTab === 'create' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Create Magic</h1>
            <div className="mb-2 flex gap-2">
              {STYLE_PRESETS.map(p => (
                <button key={p.id} onClick={() => setSelectedPreset(p.id)} className={`px-2 py-1 rounded ${selectedPreset === p.id ? 'bg-indigo-500' : ''}`}>{p.label}</button>
              ))}
            </div>
            <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe your scene..." className="p-2 rounded bg-slate-800 w-full mb-2" />
            <button onClick={handleGenerate} className="px-4 py-2 bg-indigo-600 rounded">Generate</button>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {generatedImages.map((img, i) => (
                <img key={i} src={img.url} alt={img.prompt} onClick={() => setSelectedImage(img)} className="rounded cursor-pointer" />
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} onAction={async () => { }} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
