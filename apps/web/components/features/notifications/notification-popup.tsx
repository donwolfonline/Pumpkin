"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Bell, X, Clock, User } from "lucide-react";
import { Appointment } from "@/lib/types/appointment";

interface NotificationPopupProps {
    notification: {
        id: string;
        title: string;
        message: string;
        appointment?: Appointment;
    };
    onDismiss: () => void;
    onExpand: () => void;
}

export function NotificationPopup({ notification, onDismiss, onExpand }: NotificationPopupProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleExpand = () => {
        setIsExpanded(true);
        onExpand();
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDismiss();
    };

    return (
        <div
            className={cn(
                "fixed bottom-24 right-6 z-50 transition-all duration-500 ease-out",
                isExpanded ? "w-80" : "w-14 h-14 hover:scale-110 active:scale-95 cursor-pointer"
            )}
            onClick={!isExpanded ? handleExpand : undefined}
        >
            {/* Expanded Card State */}
            {isExpanded && (
                <div className="bg-[#0c2a27]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Bell className="h-4 w-4 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Reminder</h4>
                                <p className="text-[10px] text-zinc-400">Just now</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-2">
                        <h3 className="text-sm font-bold text-white leading-tight">
                            {notification.appointment?.title || notification.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <Clock className="h-3 w-3" />
                            <span>{notification.appointment?.time}</span>
                            <span className="text-white/20">•</span>
                            <User className="h-3 w-3" />
                            <span>{notification.appointment?.client}</span>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 h-8 rounded-lg bg-primary hover:bg-primary/90 text-[10px] uppercase tracking-widest font-bold text-primary-foreground transition-colors"
                        >
                            Acknowledge
                        </button>
                    </div>
                </div>
            )}

            {/* Collapsed Circle State */}
            {!isExpanded && (
                <div className="w-full h-full rounded-full bg-primary shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center border-2 border-[#051c1c] animate-bounce">
                    <Bell className="h-6 w-6 text-[#051c1c] fill-[#051c1c]" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white border-2 border-[#051c1c]" />
                </div>
            )}
        </div>
    );
}
