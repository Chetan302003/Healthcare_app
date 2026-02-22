'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import css from './login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (err) {
            alert('Error logging in');
        }
        setLoading(false);
    };

    return (
        <div className={css.container}>
            <h1 className={css.title}>Welcome Back</h1>
            <p className={css.subtitle}>Sign in to continue</p>

            <form onSubmit={handleLogin} className={css.form}>
                <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="demo@patient.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className={css.footer}>
                <p>Don't have an account? <Link href="/register" className={css.link}>Sign Up</Link></p>
            </div>

            <div className={css.demoSection}>
                <p>Or use demo accounts:</p>
                <button className="btn btn-outline" onClick={() => { setEmail('demo@patient.com'); setPassword('demo123'); }}>Demo Patient</button>
                <div className="mb-4"></div>
                <button className="btn btn-outline" onClick={() => { setEmail('demo@doctor.com'); setPassword('demo123'); }}>Demo Doctor</button>
            </div>
        </div>
    );
}
