'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './dashboard.module.css';
import { Bell, Search, Activity, Heart, ChevronRight, CheckCircle2, Clock, Plus, Bot } from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData.user);
                } else {
                    router.push('/login');
                    return;
                }

                const medRes = await fetch('/api/medicines');
                if (medRes.ok) {
                    const medData = await medRes.json();
                    setMedicines(medData.medications);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [router]);

    if (loading) {
        return <div className="flex justify-center items-center" style={{ minHeight: '80vh' }}><Activity className="animate-spin" color="var(--primary)" /></div>;
    }

    const totalDoses = medicines.length;
    const totalTaken = medicines.filter(m => m.status === 'Taken').length;
    const adherence = totalDoses > 0 ? Math.round((totalTaken / totalDoses) * 100) : 100;

    let riskLevel = 'Good';
    let riskColor = '#10B981';
    let riskBg = 'rgba(16, 185, 129, 0.1)';

    if (totalDoses === 0) {
        riskLevel = 'No Data';
        riskColor = '#6B7280';
        riskBg = 'rgba(107, 114, 128, 0.1)';
    } else if (adherence < 70) {
        riskLevel = 'High Risk';
        riskColor = '#EF4444';
        riskBg = 'rgba(239, 68, 68, 0.1)';
    } else if (adherence < 90) {
        riskLevel = 'Moderate';
        riskColor = '#F59E0B';
        riskBg = 'rgba(245, 158, 11, 0.1)';
    }

    const todaysMeds = medicines.slice(0, 3);
    const pendingMeds = todaysMeds.filter(m => m.status === 'Pending').length;

    return (
        <div className={css.container}>
            <header className={css.header}>
                <div className={css.userInfo}>
                    <div className={css.avatar}>{user?.fullName?.charAt(0) || 'U'}</div>
                    <div>
                        <p className={css.greeting}>Hello,</p>
                        <h2 className={css.name}>{user?.fullName || 'User'}</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className={css.iconBtn} onClick={() => router.push('/search')}><Search size={20} /></button>
                    <button className={css.iconBtn} onClick={() => router.push('/messages')}><Bell size={20} /></button>
                    <button className={css.iconBtn} onClick={() => router.push('/settings')}>Settings</button>
                    <button className={css.iconBtn} onClick={() => router.push('/notifications')}>Alerts</button>
                </div>
            </header>

            <div className={css.searchBar} onClick={() => router.push('/search')} style={{ cursor: 'pointer' }}>
                <Search size={20} className={css.searchIcon} />
                <input type="text" placeholder="Search doctor, medicines..." className={css.searchInput} readOnly style={{ pointerEvents: 'none' }} />
            </div>

            <div className={css.statsGrid}>
                <div className={css.statCard}>
                    <div className={css.statIconWrap} style={{ backgroundColor: riskBg }}><Activity size={24} color={riskColor} /></div>
                    <h3>Adherence</h3>
                    <p style={{ color: riskColor }}>{adherence}<span>%</span></p>
                </div>
                <div className={css.statCard}>
                    <div className={css.statIconWrap} style={{ backgroundColor: riskBg }}><Heart size={24} color={riskColor} /></div>
                    <h3>Risk Level</h3>
                    <p style={{ fontSize: '1.25rem', color: riskColor, marginTop: '0.5rem' }}>{riskLevel}</p>
                </div>
            </div>

            <div className={css.sectionHeader}>
                <h3>Today's Medicines</h3>
                <span className={css.badge}>{pendingMeds} Pending</span>
            </div>

            <div className={css.medList}>
                {todaysMeds.length === 0 ? (
                    <div className={css.emptyState}>No medicines for today.</div>
                ) : (
                    todaysMeds.map(med => (
                        <div key={med.id} className={css.medCard}>
                            <div className={css.medInfo}>
                                <div className={css.medTime}>{med.time}</div>
                                <div>
                                    <h4>{med.name}</h4>
                                    <p>{med.dosage}</p>
                                </div>
                            </div>
                            <div>
                                {med.status === 'Taken' ?
                                    <CheckCircle2 color="var(--success)" size={28} /> :
                                    <Clock color="var(--warning)" size={28} />
                                }
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button className={css.addBtn} style={{ flex: 1, marginTop: 0 }} onClick={() => router.push('/medicines')}>
                    <Plus size={20} /> Add Medicine
                </button>
                <button className={css.addBtn} style={{ flex: 1, marginTop: 0, backgroundColor: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }} onClick={() => router.push('/wallet')}>
                    Medical Records
                </button>
            </div>

            <button className={css.addBtn} style={{ marginTop: '10px', backgroundColor: 'var(--primary)', color: 'white', border: 'none' }} onClick={() => router.push('/assistant')}>
                <Bot size={20} /> Ask AI Assistant
            </button>

        </div>
    );
}
