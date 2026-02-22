import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Medication from '@/models/Medication';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

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

        await connectToDatabase();

        const medications = await Medication.find({ patientId: userId }).sort({ date: -1 });

        return NextResponse.json({ medications }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        const { name, dosage, time } = await req.json();

        if (!name || !dosage || !time) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const medication = await Medication.create({
            patientId: userId,
            name,
            dosage,
            time,
            status: 'Pending'
        });

        return NextResponse.json({ message: 'Medication added successfully', medication }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
