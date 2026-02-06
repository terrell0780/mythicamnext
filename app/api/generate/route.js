import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ success: false, message: 'Prompt is required' }, { status: 400 });
        }

        console.log(`Generating image for prompt: ${prompt}`);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const imageUrl = response.data[0].url;

        // Save to Supabase
        const { error } = await supabase
            .from('generations')
            .insert([
                { prompt, image_url: imageUrl }
            ]);

        if (error) {
            console.error('Supabase Save Error:', error);
        }

        return NextResponse.json({ success: true, imageUrl });

    } catch (error) {
        console.error('AI Generation Error:', error);

        // --- FALLBACK STRATEGY: Pollinations.ai ---
        // If OpenAI fails (billing/limit/key), use Pollinations.ai to ensure the app stays "ALIVE"
        try {
            console.log('OpenAI failed. Triggering Pollinations.ai Fallback...');
            const { prompt } = await (req.clone().json().catch(() => ({})));

            // Pollinations.ai doesn't require a key and is high quality
            const fallbackUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux`;

            // Save fallback to Supabase (if possible)
            await supabase.from('generations').insert([{ prompt, image_url: fallbackUrl }]);

            return NextResponse.json({
                success: true,
                imageUrl: fallbackUrl,
                note: 'Generated via Fallback Engine'
            });
        } catch (fallbackError) {
            console.error('Final Fallback Error:', fallbackError);
            return NextResponse.json(
                { success: false, message: 'Image generation failed completely', error: error.message },
                { status: 500 }
            );
        }
    }
}
