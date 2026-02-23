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

export async function PATCH(req, { params }) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Await params because Next.js 15 requires awaiting dynamic route params
        const { id } = await params;

        const { status } = await req.json();

        if (!status || !['Pending', 'Taken', 'Missed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const { data: medication, error } = await supabase
            .from('medications')
            .update({ status })
            .eq('id', id)
            .eq('patientid', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating medication:', error);
            return NextResponse.json({ message: 'Medication not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Status updated', medication }, { status: 200 });
    } catch (error) {
        console.error('Medicines PATCH error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
