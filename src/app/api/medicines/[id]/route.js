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

export async function PATCH(req, { params }) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();

        // Await params because Next.js 15 requires awaiting dynamic route params
        const { id } = await params;

        const { status } = await req.json();

        if (!status || !['Pending', 'Taken', 'Missed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        const medication = await Medication.findOneAndUpdate(
            { _id: id, patientId: userId },
            { status },
            { new: true }
        );

        if (!medication) {
            return NextResponse.json({ message: 'Medication not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Status updated', medication }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
