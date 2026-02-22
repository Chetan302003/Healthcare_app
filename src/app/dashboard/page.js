'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './dashboard.module.css';
import { Bell, Search, Activity, Heart, ChevronRight, CheckCircle2, Clock, Plus } from 'lucide-react';

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
                    // Filter only pending or taken today
                    setMedicines(medData.medications.slice(0, 3));
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

    const pendingMeds = medicines.filter(m => m.status === 'Pending').length;

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
                <button className={css.iconBtn}><Bell size={24} /></button>
            </header>

            <div className={css.searchBar}>
                <Search size={20} className={css.searchIcon} />
                <input type="text" placeholder="Search doctor, medicines..." className={css.searchInput} />
            </div>

            <div className={css.statsGrid}>
                <div className={css.statCard}>
                    <div className={`${css.statIconWrap} ${css.bgBlue}`}><Activity size={24} color="#2563EB" /></div>
                    <h3>Heart Rate</h3>
                    <p>78 <span>bpm</span></p>
                </div>
                <div className={css.statCard}>
                    <div className={`${css.statIconWrap} ${css.bgRed}`}><Heart size={24} color="#EF4444" /></div>
                    <h3>Blood Press</h3>
                    <p>120/80</p>
                </div>
            </div>

            <div className={css.sectionHeader}>
                <h3>Today's Medicines</h3>
                <span className={css.badge}>{pendingMeds} Pending</span>
            </div>

            <div className={css.medList}>
                {medicines.length === 0 ? (
                    <div className={css.emptyState}>No medicines for today.</div>
                ) : (
                    medicines.map(med => (
                        <div key={med._id} className={css.medCard}>
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

            <button className={css.addBtn} onClick={() => router.push('/medicines')}>
                <Plus size={20} /> Add Medicine
            </button>

        </div>
    );
}
