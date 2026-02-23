-- 1. Run this to ensure we can generate UUIDs easily
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Patient', 'Guardian', 'Doctor')),
    fullName TEXT NOT NULL,
    phone TEXT,
    age INTEGER,
    gender TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the Medications Table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patientId UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Taken', 'Missed')),
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS since we use a custom JWT API auth system securely instead
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE medications DISABLE ROW LEVEL SECURITY;

-- Grant API access to the Anon key so custom authentication from the server can access DB
GRANT ALL ON users TO anon;
GRANT ALL ON medications TO anon;
GRANT ALL ON users TO authenticated;
GRANT ALL ON medications TO authenticated;

-- 4. Insert Sample Database Data
-- Inserting a default Doctor and a Patient. 
-- The password for both is 'password123' (hashed via bcrypt)
INSERT INTO users (id, email, password, role, fullName, phone, age, gender) 
VALUES 
    -- Sample Doctor User
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'doctor@example.com', '$2y$10$vN0oOKh./.212fG.qN452.eR74wI7n6iQGhhN3M80Wq8jR2w6lA.W', 'Doctor', 'Dr. Smith', '1234567890', 45, 'Male'),
    -- Sample Patient User
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'patient@example.com', '$2y$10$vN0oOKh./.212fG.qN452.eR74wI7n6iQGhhN3M80Wq8jR2w6lA.W', 'Patient', 'John Doe', '0987654321', 30, 'Male')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Medications for the Patient ('patient@example.com')
INSERT INTO medications (patientId, name, dosage, time, status)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Paracetamol', '1 Pill (500mg)', '08:00', 'Taken'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Amoxicillin', '1 Capsule (250mg)', '14:00', 'Pending'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Vitamin C', '1 Tablet', '20:00', 'Pending');
