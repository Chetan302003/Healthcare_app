'use client';

import { Home, CalendarDays, FolderOpen, Bot, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import css from './BottomNav.module.css';

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { name: 'Home', icon: Home, path: '/dashboard' },
        { name: 'Medicines', icon: CalendarDays, path: '/medicines' },
        { name: 'Wallet', icon: FolderOpen, path: '/wallet' },
        { name: 'Assistant', icon: Bot, path: '/assistant' },
        { name: 'Profile', icon: User, path: '/profile' }
    ];

    // Don't show nav on auth or onboarding pages
    const hiddenPaths = ['/', '/login', '/register'];
    if (hiddenPaths.includes(pathname)) return null;

    return (
        <div className={css.navContainer}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                    <div
                        key={item.name}
                        className={`${css.navItem} ${isActive ? css.active : ''}`}
                        onClick={() => router.push(item.path)}
                    >
                        <Icon size={24} className={css.icon} />
                        <span className={css.label}>{item.name}</span>
                    </div>
                );
            })}
        </div>
    );
}
