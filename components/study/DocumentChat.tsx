'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    image?: string;
    imageMimeType?: string;
}

interface DocumentChatProps {
    resourceId: string;
    onClose: () => void;
}

export default function DocumentChat({ resourceId, onClose }: DocumentChatProps) {
    const pathname = usePathname();
    const [messages, setMessages] = useState<ChatMessage[]>([{
        id: 'welcome',
        role: 'model',
        text: 'Hi! I am your AI Study Tutor. Ask me anything about this document!'
    }]);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Store which messages have received feedback (map of messageId -> 'up' | 'down')
    const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<string, 'up' | 'down'>>({});
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSelectedImage(base64String.split(',')[1]);
            setImageMimeType(file.type);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImageMimeType(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMsg: ChatMessage = { 
            id: Date.now().toString(), 
            role: 'user', 
            text: input.trim(),
            image: selectedImage || undefined,
            imageMimeType: imageMimeType || undefined
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setSelectedImage(null);
        setImageMimeType(null);
        setIsLoading(true);

        try {
            const historyForApi = messages.map(m => ({ 
                role: m.role, 
                text: m.text,
                image: m.image,
                image_mime_type: m.imageMimeType
            }));
            
            historyForApi.push({ 
                role: 'user', 
                text: userMsg.text,
                image: userMsg.image,
                image_mime_type: userMsg.imageMimeType
            });

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

    const submitFeedback = async (messageId: string, isPositive: boolean, messageText: string) => {
        if (feedbackSubmitted[messageId]) return;

        setFeedbackSubmitted(prev => ({ ...prev, [messageId]: isPositive ? 'up' : 'down' }));

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('institution_id')
                .eq('id', user.id)
                .single();

            await supabase.from('feedback').insert({
                user_id: user.id,
                institution_id: profile?.institution_id || null,
                type: 'ai_response',
                mood: isPositive ? 4 : 1, // 4 for good, 1 for bad
                message: isPositive ? 'Helpful AI Response' : 'Unhelpful AI Response',
                context: { 
                    page: pathname, 
                    resource_id: resourceId,
                    message_preview: messageText.substring(0, 100) + (messageText.length > 100 ? '...' : '')
                },
            });
        } catch (err) {
            console.error("Failed to submit feedback", err);
            // Optionally revert UI state on failure
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden m-4 sm:m-0 animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#13ec6a]/10 flex items-center justify-center text-[#13ec6a]">
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-[#13ec6a] text-[#102217]'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-[#13ec6a] text-[#102217] rounded-tr-none'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                                }`}>
                                {msg.role === 'model' ? (
                                    <div className="prose max-w-none prose-sm dark:prose-invert prose-p:leading-relaxed prose-a:text-[#13ec6a]">
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {msg.image && (
                                            <img 
                                                src={`data:${msg.imageMimeType};base64,${msg.image}`} 
                                                alt="Uploaded attachment" 
                                                className="max-w-[200px] rounded-xl object-contain border border-[#102217]/10"
                                            />
                                        )}
                                        {msg.text && <p>{msg.text}</p>}
                                    </div>
                                )}
                            </div>
                            
                            {/* AI Response Feedback */}
                            {msg.role === 'model' && msg.id !== 'welcome' && (
                                <div className="mt-1.5 px-2 flex items-center gap-1">
                                    {feedbackSubmitted[msg.id] ? (
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                                            <span className="material-symbols-outlined text-[12px] text-[#13ec6a]">check_circle</span>
                                            Thanks for the feedback!
                                        </span>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => submitFeedback(msg.id, true, msg.text)}
                                                className="p-1 rounded-md text-slate-400 hover:text-[#13ec6a] hover:bg-[#13ec6a]/10 transition-colors"
                                                title="Helpful"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                                            </button>
                                            <button 
                                                onClick={() => submitFeedback(msg.id, false, msg.text)}
                                                className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Not Helpful"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">thumb_down</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#13ec6a] flex items-center justify-center text-[#102217] flex-shrink-0 mt-1">
                            <Bot size={16} />
                        </div>
                        <div className="px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 rounded-tl-none border border-slate-200 dark:border-slate-700">
                            <Loader2 size={18} className="animate-spin text-[#13ec6a]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3">
                
                {/* Image Preview */}
                {selectedImage && (
                    <div className="relative self-start">
                        <img 
                            src={`data:${imageMimeType};base64,${selectedImage}`} 
                            alt="Preview" 
                            className="h-16 w-auto rounded-lg object-contain border border-slate-200 dark:border-slate-700"
                        />
                        <button 
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 shadow-md hover:bg-slate-700 transition"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}

                <div className="relative flex items-end gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-12 h-12 shrink-0 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:text-[#13ec6a] hover:bg-[#13ec6a]/10 transition-colors"
                        title="Snap & Solve (Upload Image)"
                    >
                        <ImageIcon size={20} />
                    </button>
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        capture="environment"
                    />

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={selectedImage ? "Add a message about this image..." : "Snap & Solve, or ask about the document..."}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none outline-none rounded-2xl py-3.5 pl-4 pr-14 text-sm text-slate-900 dark:text-white resize-none max-h-32 min-h-[48px] focus:ring-2 focus:ring-[#13ec6a]/20 transition-all placeholder:text-slate-400"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="absolute right-1 bottom-1 w-10 h-10 rounded-xl bg-[#13ec6a] text-[#102217] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-400 transition-colors shadow-lg shadow-[#13ec6a]/20"
                    >
                        <Send size={18} className="translate-x-[1px] translate-y-[-1px]" />
                    </button>
                </div>

                <p className="text-center text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    AI can make mistakes. Verify important facts found in your document.
                </p>
            </div>
        </div>
    );
}
