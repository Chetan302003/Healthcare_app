const BASE_URL = 'http://localhost:3000/api';
async function test() {
    const email = `test_${Date.now()}@bar.com`;
    // 1. Register
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'secure', role: 'Patient', fullName: 'Tester', phone: '123', age: 20, gender: 'Other' })
    });
    const data = await res.json();
    console.log("Register:", res.status, data);

    // 2. Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'secure' })
    });
    const loginData = await loginRes.json();
    const cookie = loginRes.headers.get('set-cookie')?.split(';')[0];
    console.log("Login:", loginRes.status, loginData.user?.fullName);

    // 3. Update Meds
    const medRes = await fetch(`${BASE_URL}/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
        body: JSON.stringify({ name: 'Med', dosage: '1', time: '12:00' })
    });
    const medData = await medRes.json();
    console.log("Med:", medRes.status, medData.message);
}
test().catch(console.error);
