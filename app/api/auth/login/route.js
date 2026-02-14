import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request) {
    try {
        const { email, pin } = await request.json();
        const admin = storage.getAdmin();

        if (email === admin.email && pin === admin.pin) {
            return NextResponse.json({
                success: true,
                user: { email, name: admin.name, isAdmin: true }
            });
        } else if (email === admin.email) {
            return NextResponse.json({ success: false, message: 'Invalid PIN' }, { status: 401 });
        } else {
            // Allow any other email as a "User" for demo purposes
            return NextResponse.json({
                success: true,
                user: { email, name: email.split('@')[0], isAdmin: false }
            });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
