import { NextResponse } from 'next/server';

export async function POST(request) {
    // In a real app, use FormData and upload to Blob Storage (Vercel Blob / S3)
    return NextResponse.json({
        success: true,
        message: 'File uploaded successfully',
        url: '/uploads/mock-file.png'
    });
}
