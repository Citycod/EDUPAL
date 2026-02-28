'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscription';

interface DownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    resourceId: string;
    resourceTitle: string;
    filePath: string;
    userId: string;
    onDownloadSuccess?: () => void;
}

export default function DownloadModal({
    isOpen,
    onClose,
    resourceId,
    resourceTitle,
    filePath,
    userId,
    onDownloadSuccess
}: DownloadModalProps) {
    const router = useRouter();
    const { isSubscribed, downloadCredits, loading } = useSubscription();
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isFeatureEnabled = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED === 'true';

    if (!isOpen) return null;

    const handleDownload = async () => {
        setDownloading(true);
        setError(null);

        try {
            const res = await fetch('/api/resources/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, resourceId, filePath })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'PAYMENT_REQUIRED') {
                    setError('Insufficient download credits. Please upgrade to Premium or upload a file to earn credits.');
                } else {
                    setError(data.error || 'Failed to download file');
                }
                setDownloading(false);
                return;
            }

            // Successfully got the signed URL
            const link = document.createElement('a');
            link.href = data.downloadUrl;
            link.download = resourceTitle; // Optional: Force trigger download
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            if (onDownloadSuccess) onDownloadSuccess();
            onClose();

        } catch (err: any) {
            console.error('Download error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1a231f] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">

                {/* Header Graphic */}
                <div className="bg-primary/10 h-32 relative flex items-center justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-slate-700 dark:text-white transition"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="size-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border-4 border-primary/20">
                        <span className="material-symbols-outlined text-primary text-3xl">download</span>
                    </div>
                </div>

                <div className="p-6 text-center">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-2 line-clamp-2">
                        {resourceTitle}
                    </h3>

                    {loading ? (
                        <p className="text-sm text-slate-500 my-6 animate-pulse">Checking access...</p>
                    ) : (
                        <div className="my-6 space-y-4">
                            {!isFeatureEnabled ? (
                                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-sm font-bold text-green-700 dark:text-green-400">
                                    <span className="block mb-1 text-lg">🎉</span>
                                    Free Early Access Enabled
                                </div>
                            ) : isSubscribed ? (
                                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-sm font-bold text-primary">
                                    <span className="material-symbols-outlined align-middle mr-1 text-lg">verified</span>
                                    Premium Access Active
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-amber-500">toll</span>
                                        <span className="text-sm font-bold">1 Credit needed</span>
                                        <span className="text-xs text-slate-500">|</span>
                                        <span className={`text-sm font-bold ${downloadCredits > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            You have {downloadCredits}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Earn 1 credit instantly for every past question you upload!
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="text-xs text-red-500 font-bold mb-4 bg-red-50 p-2 rounded-lg">{error}</p>
                    )}

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={downloading || loading || (isFeatureEnabled && !isSubscribed && downloadCredits <= 0)}
                            className="w-full bg-primary text-background-dark font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            {downloading ? 'Preparing...' : 'Download File'}
                        </button>

                        {isFeatureEnabled && !isSubscribed && downloadCredits <= 0 && (
                            <button
                                onClick={() => router.push('/subscription')}
                                className="w-full bg-black text-white dark:bg-white dark:text-black font-black py-4 rounded-2xl hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs"
                            >
                                Upgrade to Premium
                            </button>
                        )}
                        {isFeatureEnabled && !isSubscribed && (
                            <button
                                onClick={() => router.push('/library/upload')}
                                className="w-full mt-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                            >
                                Upload a file to earn credits
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
