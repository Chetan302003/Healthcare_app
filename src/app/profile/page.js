'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import css from './profile.module.css';
import { LogOut, User as UserIcon, Settings, Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchUser();
    }, [router]);

    const handleLogout = () => {
        // Simple client-side logout
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/login');
    };

    const menuItems = [
        { icon: UserIcon, label: 'Personal Information' },
        { icon: Settings, label: 'Settings' },
        { icon: Shield, label: 'Privacy & Security' },
        { icon: Bell, label: 'Notifications' },
        { icon: HelpCircle, label: 'Help & Support' },
    ];

    if (!user) return <p className="text-center mt-4">Loading...</p>;

    return (
        <div className={css.container}>
            <header className={css.header}>
                <h2>Profile</h2>
            </header>

            <div className={css.profileCard}>
                <div className={css.avatarLg}>{user.fullName?.charAt(0) || 'U'}</div>
                <h3>{user.fullName}</h3>
                <p>{user.email}</p>
                <span className={css.roleBadge}>{user.role}</span>
            </div>

            <div className={css.menuList}>
                {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className={css.menuItem}>
                            <div className={css.menuIconWrap}>
                                <Icon size={20} color="var(--primary)" />
                            </div>
                            <span className={css.menuLabel}>{item.label}</span>
                            <ChevronRight size={20} color="var(--text-muted)" />
                        </div>
                    );
                })}
            </div>

            <button className={css.logoutBtn} onClick={handleLogout}>
                <LogOut size={20} style={{ marginRight: '0.5rem' }} />
                Log Out
            </button>
        </div>
    );
}
