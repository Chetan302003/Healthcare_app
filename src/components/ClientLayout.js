'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const hiddenPaths = ['/', '/login', '/register'];
    const hideNav = hiddenPaths.includes(pathname);

    return (
        <>
            <main className={!hideNav ? "main-content" : "w-full"}>
                {children}
            </main>
            {!hideNav && <BottomNav />}
        </>
    );
}
