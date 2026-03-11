'use client';

import { useState, useEffect } from 'react';
import { subscribeToPush } from '@/lib/push';

export default function PushTestPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState('test-user-123');

    const handleSubscribe = async () => {
        setStatus('loading');
        const success = await subscribeToPush(userId);
        if (success) {
            setStatus('success');
            setMessage('Successfully subscribed! Check your Supabase hub_push_subscriptions table.');
        } else {
            setStatus('error');
            setMessage('Failed to subscribe. Check console for details.');
        }
    };

    const triggerCheck = async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/push/check-defaults');
            const data = await res.json();
            setStatus('success');
            setMessage(`Check triggered! Processed: ${data.processed}. Details: ${JSON.stringify(data.details)}`);
        } catch (err) {
            setStatus('error');
            setMessage('Failed to trigger check.');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-6 bg-gray-900 text-white rounded-xl shadow-2xl mt-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Push Notification Tester
            </h1>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-400">User ID (for testing)</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="p-2 bg-gray-800 border border-gray-700 rounded focus:border-blue-500 outline-none"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSubscribe}
                        disabled={status === 'loading'}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                    >
                        1. Subscribe Me
                    </button>

                    <button
                        onClick={triggerCheck}
                        disabled={status === 'loading'}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-all disabled:opacity-50"
                    >
                        2. Trigger "Check Defaults"
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg border ${status === 'error' ? 'bg-red-900/20 border-red-500 text-red-200' : 'bg-green-900/20 border-green-500 text-green-200'}`}>
                    {message}
                </div>
            )}

            <div className="text-sm text-gray-500 italic">
                Note: To receive a real notification, you need mock data in Supabase for this User ID:
                <ul className="list-disc ml-5 mt-2">
                    <li>Entry in `hub_study_roadmaps` with a task dated yesterday.</li>
                    <li>NO entry in `hub_study_progress` for that task (marked completed).</li>
                </ul>
            </div>
        </div>
    );
}
