import type { Metadata } from 'next';
import './globals.css';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';

export const metadata: Metadata = {
    title: 'EDUPAL',
    description: 'Educational platform for students',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
                <meta name="theme-color" content="#13ec6a" />
                <link rel="manifest" href="/manifest.json" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js');
                                });
                            }
                        `,
                    }}
                />
            </head>
            <body>
                <div className="mobile-app-container">
                    <div className="mobile-viewport flex flex-col min-h-[100dvh]">
                        <PwaInstallPrompt />
                        <div className="flex-1">
                            {children}
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
