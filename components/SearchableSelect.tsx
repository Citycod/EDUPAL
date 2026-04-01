'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
    disabled?: boolean;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    disabled = false
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtered options
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full rounded-lg text-white border border-border-accent bg-input-bg h-12 px-4 flex items-center justify-between cursor-pointer transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'
                } ${isOpen ? 'ring-2 ring-primary/50 border-primary' : ''}`}
            >
                <span className={`truncate ${!value ? 'text-white/30' : 'text-white'}`}>
                    {value || placeholder}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-200 text-white/30 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-[100] mt-1.5 w-full bg-background-dark border border-border-accent rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Search Input */}
                    <div className="p-3 border-b border-border-accent/30 bg-input-bg/50">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">
                                search
                            </span>
                            <input
                                autoFocus
                                type="text"
                                className="w-full bg-background-dark/50 border border-border-accent/50 rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={`${option}-${index}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelect(option);
                                    }}
                                    className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between group ${
                                        value === option 
                                            ? 'bg-primary/10 text-primary' 
                                            : 'text-white/80 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span className="truncate">{option}</span>
                                    {value === option && (
                                        <span className="material-symbols-outlined text-base">check</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-white/40 text-sm italic">
                                No matches found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
