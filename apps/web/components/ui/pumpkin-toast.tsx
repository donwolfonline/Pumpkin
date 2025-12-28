"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Skull, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface PumpkinToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const PumpkinToastContext = createContext<PumpkinToastContextType | undefined>(undefined);

export function PumpkinToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <PumpkinToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={cn(
                            "pointer-events-auto min-w-[300px] bg-[#0c2a27]/90 backdrop-blur-xl border border-primary/30 text-white p-4 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.15)] flex items-start gap-4 animate-[magical-appear_0.6s_ease-out_forwards]",
                            "hover:border-primary/50 transition-colors"
                        )}
                        role="alert"
                    >
                        <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
                            <Skull className="h-5 w-5 animate-[pulse_3s_ease-in-out_infinite]" />
                        </div>
                        <div className="flex-1 pt-0.5">
                            <h4 className="font-heading uppercase tracking-widest text-xs text-primary font-bold mb-1">
                                {t.type === 'success' ? 'Pumpkin Patch' : 'Spooky Error'}
                            </h4>
                            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                                {t.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeToast(t.id)}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </PumpkinToastContext.Provider>
    );
}

export function usePumpkinToast() {
    const context = useContext(PumpkinToastContext);
    if (context === undefined) {
        throw new Error('usePumpkinToast must be used within a PumpkinToastProvider');
    }
    return context;
}
