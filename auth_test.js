const fs = require('fs');
const BASE_URL = 'http://localhost:3000/api';
async function test() {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `test_${Date.now()}@bar.com`, password: 'secure', role: 'Patient', fullName: 'Tester', phone: '123', age: 20, gender: 'Other' })
    });
    const data = await res.json();
    fs.writeFileSync('error_details.json', JSON.stringify(data.details, null, 2));
}
test().catch(console.error);
