import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { email, pin } = await request.json();
        const admin = storage.getAdmin();

        if (email.toUpperCase() === admin.email.toUpperCase() && pin === admin.pin) {
            return NextResponse.json({
                success: true,
                user: { email: admin.email, name: admin.name, isAdmin: true }
            });
        } else if (email.toUpperCase() === admin.email.toUpperCase()) {
            return NextResponse.json({
                success: false,
                message: 'Invalid Master PIN. Entry Denied.'
            }, { status: 401 });
        } else if (pin === 'GUEST_BYPASS' || !pin) {
            // Normal User Access
            return NextResponse.json({
                success: true,
                user: { email, name: email.split('@')[0], isAdmin: false }
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Access Denied.'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Control Center error. Please try again later.'
        }, { status: 500 });
    }
}
