import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { email, password, role, fullName, phone, age, gender } = await req.json();

        if (!email || !password || !role || !fullName) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: user, error } = await supabase
            .from('users')
            .insert([{
                email,
                password: hashedPassword,
                role,
                fullname: fullName,
                phone,
                age,
                gender
            }])
            .select()
            .single();

        if (error) {
            console.error('Registration insertion error:', error);
            return NextResponse.json({ message: 'Error registering user', details: error }, { status: 500 });
        }

        return NextResponse.json({ message: 'User registered successfully', userId: user.id }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
