import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { storage } from '@/lib/storage';

// Initialize OpenAI
// In serverless, this runs on every invocation (or reuses warm instance)
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

export async function POST(request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 });
        }

        if (!openai) {
            return NextResponse.json({ success: false, message: 'OpenAI not configured. Set OPENAI_API_KEY env var.' }, { status: 503 });
        }

        // Call OpenAI DALL-E 3
        console.log(`Generating image for: ${prompt}`);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;

        // Log to Governance/Activity
        // In a real app, you'd save this to a DB.
        // Here we update the in-memory storage (which persists only for the lifetime of the lambda container)
        // Note: This "Activity Log" feature will be flaky on Vercel Free Tier due to cold starts resetting data.
        storage.addLog('generated_image', { prompt: prompt.substring(0, 50), imageUrl });

        // We also want to update "Recent Activity" for the dashboard
        // Currently storage.js doesn't specifically expose a method to update "recentActivity" list beyond logs.
        // We can add that later if needed.

        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
