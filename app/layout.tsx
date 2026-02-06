import type { Metadata } from 'next';
import './globals.css';

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
        <html lang="en">
            <body>
                <div className="mobile-app-container">
                    <div className="mobile-viewport">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
