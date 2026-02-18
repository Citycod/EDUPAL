'use client';

import BottomNav from '@/components/BottomNav';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark pb-28">
            <main className="flex-1">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
