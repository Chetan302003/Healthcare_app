import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

async function getUserId(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.userId;
    } catch (e) {
        return null;
    }
}

export async function GET(req) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { data: medications, error } = await supabase
            .from('medications')
            .select('*')
            .eq('patientid', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching medications:', error);
            return NextResponse.json({ message: 'Error fetching medications' }, { status: 500 });
        }

        return NextResponse.json({ medications: medications || [] }, { status: 200 });
    } catch (error) {
        console.error('Medicines GET error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, dosage, time } = await req.json();

        if (!name || !dosage || !time) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const { data: medication, error } = await supabase
            .from('medications')
            .insert([{
                patientid: userId,
                name,
                dosage,
                time,
                status: 'Pending'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding medication:', error);
            return NextResponse.json({ message: 'Error adding medication' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Medication added successfully', medication }, { status: 201 });
    } catch (error) {
        console.error('Medicines POST error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
