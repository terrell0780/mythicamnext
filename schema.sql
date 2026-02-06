-- Create Generations table
CREATE TABLE IF NOT EXISTS public.generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    prompt TEXT NOT NULL,
    image_url TEXT NOT NULL,
    user_id UUID, -- Link to auth.users later
    status TEXT DEFAULT 'completed'
);

-- Create Profiles/Stats table (simplified for dashboard)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    credits INTEGER DEFAULT 100,
    tier TEXT DEFAULT 'Basic',
    total_generated INTEGER DEFAULT 0,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Site Config/Stats (for the dashboard gauges)
CREATE TABLE IF NOT EXISTS public.site_stats (
    id INTEGER PRIMARY KEY DEFAULT 1,
    active_users INTEGER DEFAULT 0,
    gpu_usage INTEGER DEFAULT 0,
    jobs_queued INTEGER DEFAULT 0,
    revenue_today INTEGER DEFAULT 0,
    mrr INTEGER DEFAULT 0
);

-- Insert initial zero stats
INSERT INTO public.site_stats (id, active_users, gpu_usage, jobs_queued, revenue_today, mrr)
VALUES (1, 0, 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read of stats for now
CREATE POLICY "Public stats are readable" ON public.site_stats FOR SELECT USING (true);

-- Generations policy (read all for now, we'll tighten later)
CREATE POLICY "Generations are readable by all" ON public.generations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert a generation" ON public.generations FOR INSERT WITH CHECK (true);
