import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        const { data: userRaw } = await supabase
            .from('users')
            .select('id, email, role, fullname, phone, age, gender')
            .eq('id', payload.userId)
            .maybeSingle();

        if (!userRaw) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const user = { ...userRaw, fullName: userRaw.fullname };

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}
