const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
    let output = [];
    function log(msg) {
        console.log(msg);
        output.push(msg);
    }

    log('--- STARTING COMPREHENSIVE E2E TESTS ---');

    // Generate unique user
    const email = `testuser_${Date.now()}@test.com`;
    const password = 'securepassword123';
    let jwtCookie = '';

    try {
        // 1. Register User
        log(`\n[1/6] Registering user: ${email}...`);
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'Patient', fullName: 'Automated Tester', phone: '555-0000', age: 30, gender: 'Male' })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
        log('✅ Registration successful (User ID: ' + regData.userId + ')');

        // 2. Login User
        log(`\n[2/6] Logging in...`);
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);

        jwtCookie = loginRes.headers.get('set-cookie')?.split(';')[0];
        log('✅ Login successful (Retrieved JWT Auth Cookie)');

        // 3. Add Medication
        log(`\n[3/6] Adding new medication...`);
        const medRes = await fetch(`${BASE_URL}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': jwtCookie },
            body: JSON.stringify({ name: 'Aspirin', dosage: '200mg', time: '08:00 AM' })
        });
        const medData = await medRes.json();
        if (!medRes.ok) throw new Error(`Medication addition failed: ${JSON.stringify(medData)}`);
        const medId = medData.medication.id;
        log('✅ Medication added successfully (ID: ' + medId + ')');

        // 4. Update Adherence (PATCH Medicine to 'Taken')
        log(`\n[4/6] Marking medication as 'Taken' to test adherence...`);
        const patchRes = await fetch(`${BASE_URL}/medicines/${medId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Cookie': jwtCookie },
            body: JSON.stringify({ status: 'Taken' })
        });
        const patchData = await patchRes.json();
        if (!patchRes.ok) throw new Error(`Medication patch failed: ${JSON.stringify(patchData)}`);
        log('✅ Medication marked as Taken.');

        // 5. Test Chatbot API
        log(`\n[5/6] Testing Mental Health Chatbot API...`);
        const chatRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "I am feeling extremely stressed and panicky today." })
        });
        const chatData = await chatRes.json();
        if (!chatRes.ok || !chatData.reply) throw new Error(`Chatbot failed: ${JSON.stringify(chatData)}`);
        log(`✅ Chatbot active. Reply received: "${chatData.reply}"`);

        // 6. Test Medical Records Upload (Multipart Form Data)
        log(`\n[6/6] Testing Medical Records File Upload to Supabase...`);

        // Create a dummy text file to act as the report
        const dummyContent = 'This is a mock lab report for testing purposes.';
        const blob = new Blob([dummyContent], { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', blob, 'test_lab_report.txt');
        formData.append('title', 'Annual Blood Report');
        formData.append('category', 'Lab Report');
        formData.append('doctor_name', 'Dr. AI Test');

        const uploadRes = await fetch(`${BASE_URL}/records`, {
            method: 'POST',
            headers: { 'Cookie': jwtCookie },
            body: formData
        });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
            throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
        } else {
            log('✅ Medical Record uploaded successfully! Highlights extracted: ' + JSON.stringify(uploadData.record.highlights));
        }

        log('\n--- TESTS COMPLETED SUCCESSFULLY ---');

    } catch (err) {
        log('\n❌ TEST FAILED: ' + err.message);
    } finally {
        fs.writeFileSync('test_output.json', JSON.stringify({ output }, null, 2));
    }
}

runTests();
