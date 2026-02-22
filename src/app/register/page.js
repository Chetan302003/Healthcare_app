'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './register.module.css';
import { User, Users, HeartPulse } from 'lucide-react';

export default function Register() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        fullName: '', phone: '', age: '', gender: 'Other', email: '', password: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role })
            });
            if (res.ok) {
                // Auto-login or redirect to login
                router.push('/login');
            } else {
                const data = await res.json();
                alert(data.message || 'Error registering');
            }
        } catch (err) {
            alert('Error registering');
        }
        setLoading(false);
    };

    if (step === 1) {
        return (
            <div className={css.container}>
                <div className="text-center mb-8">
                    <h1 className={css.title}>Select Your Role</h1>
                    <p className={css.subtitle}>Choose how you'll use HealthCare+</p>
                </div>

                <div className={css.roleGrid}>
                    <div className={css.roleCard} onClick={() => handleRoleSelect('Patient')}>
                        <div className={`${css.iconWrap} ${css.iconPatient}`}><User size={32} /></div>
                        <h3>Patient</h3>
                        <p>Manage your health, medicines, and medical records</p>
                    </div>

                    <div className={css.roleCard} onClick={() => handleRoleSelect('Guardian')}>
                        <div className={`${css.iconWrap} ${css.iconGuardian}`}><Users size={32} /></div>
                        <h3>Guardian</h3>
                        <p>Monitor and manage health of your loved ones</p>
                    </div>

                    <div className={css.roleCard} onClick={() => handleRoleSelect('Doctor')}>
                        <div className={`${css.iconWrap} ${css.iconDoctor}`}><HeartPulse size={32} /></div>
                        <h3>Doctor</h3>
                        <p>Monitor patients, view reports, and track progress</p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/login" className={css.link}>&larr; Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={css.container}>
            <h1 className={css.title}>Create Account</h1>
            <p className={css.subtitle}>Signing up as a {role}</p>

            <form onSubmit={handleRegister} className={css.form}>
                <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input type="text" className="input-field" required
                        value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                </div>

                <div className={css.row}>
                    <div className="input-group" style={{ flex: 1, marginRight: '1rem' }}>
                        <label className="input-label">Age</label>
                        <input type="number" className="input-field" required
                            value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="input-label">Phone</label>
                        <input type="tel" className="input-field" required
                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" className="input-field" required
                        value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input type="password" className="input-field" required minLength={6}
                        value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Sign Up'}
                </button>
            </form>

            <div className="text-center mt-4">
                <button type="button" onClick={() => setStep(1)} className={css.link} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    &larr; Change Role
                </button>
            </div>
        </div>
    );
}
