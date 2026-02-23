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

        const { data: records, error } = await supabase
            .from('medical_records')
            .select('*')
            .eq('patient_id', userId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching records:', error);
            return NextResponse.json({ message: 'Error fetching records' }, { status: 500 });
        }

        return NextResponse.json({ records: records || [] }, { status: 200 });
    } catch (error) {
        console.error('Records GET error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const userId = await getUserId(req);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file');
        const title = formData.get('title');
        const category = formData.get('category');
        const doctor_name = formData.get('doctor_name') || '';

        if (!file || !title || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 1. Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('reports')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) {
            console.error('Supabase Storage Error:', uploadError);
            return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('reports')
            .getPublicUrl(fileName);
        const file_url = publicUrlData.publicUrl;

        // Module 2: AI-Assisted Highlighting (Mock Data for Hackathon version based on title)
        let highlights = null;
        if (category === 'Lab Report') {
            const titleLower = title.toLowerCase();
            if (titleLower.includes('blood') || titleLower.includes('cbc')) {
                highlights = {
                    "Hemoglobin": "Low (9.2 g/dL)",
                    "WBC Count": "Normal (7.5 K/uL)",
                    "Platelets": "Normal (250 K/uL)"
                };
            } else if (titleLower.includes('sugar') || titleLower.includes('glucose') || titleLower.includes('diabetes')) {
                highlights = {
                    "Fasting Sugar": "High (145 mg/dL)",
                    "HbA1c": "Caution (6.2%)"
                };
            } else {
                highlights = {
                    "Status": "Normal ranges detected",
                    "Details": "No significant abnormalities found"
                };
            }
        }

        // 2. Insert into Database
        const { data: record, error: dbError } = await supabase
            .from('medical_records')
            .insert([{
                patient_id: userId,
                title,
                category,
                file_url,
                doctor_name,
                highlights
            }])
            .select()
            .single();

        if (dbError) {
            console.error('Error adding record to DB:', dbError);
            return NextResponse.json({ message: 'Error adding record to database' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Record added successfully', record }, { status: 201 });
    } catch (error) {
        console.error('Records POST error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
