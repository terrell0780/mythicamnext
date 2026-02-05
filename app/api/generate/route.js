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
        console.error('OpenAI Generation Error:', error);
        return NextResponse.json(
            { success: false, message: 'Image generation failed', error: error.message },
            { status: 500 }
        );
    }
}
