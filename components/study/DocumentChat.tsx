'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}

interface DocumentChatProps {
    resourceId: string;
    onClose: () => void;
}

export default function DocumentChat({ resourceId, onClose }: DocumentChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: 'welcome',
        role: 'model',
        text: 'Hi! I am your AI Study Tutor. Ask me anything about this document!'
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // We only send the history formatted for the API
            const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
            // Exclude the welcome message if possible, but actually sending it is fine.
            // Let's just send the whole thing + the new user message.
            historyForApi.push({ role: 'user', text: userMsg.text });

            const res = await fetch('/api/study/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceId,
                    messages: historyForApi
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: data.reply
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err: any) {
            console.error(err);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: `*Error:* ${err.message || 'Something went wrong.'}`
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden m-4 sm:m-0 animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Bot size={22} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white">AI Tutor</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="h-10 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                    Wrap Up
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-primary text-[#102217]'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`max-w-[75%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary text-[#102217] rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                            }`}>
                            {msg.role === 'model' ? (
                                <div className="prose max-w-none prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-primary">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            ) : (
                                <p>{msg.text}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[#102217] flex-shrink-0 mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700">
                            <Loader2 size={18} className="animate-spin text-primary" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask anything about the material..."
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none outline-none rounded-2xl py-4 pl-4 pr-14 text-md text-white resize-none max-h-32 min-h-[56px] focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-primary text-[#102217] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-light transition-colors shadow-lg shadow-primary/20"
                    >
                        <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
                    </button>
                </div>
                <p className="text-center text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">
                    AI can make mistakes. Verify important facts found in your document.
                </p>
            </div>
        </div>
    );
}
