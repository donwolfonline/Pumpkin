import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Bell, Check, X } from 'lucide-react';
import { useNotifications } from '@/components/providers/notification-provider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommandPalette } from '@/components/features/search/command-palette';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function Header() {
    const user = useUser();
    const { unreadCount, notifications, markAllAsRead, clearNotification } = useNotifications();
    const [showNotifications, setShowNotifications] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Pumpkin User';
    const initials = user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'PU';

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center gap-4 border-b border-white/5 bg-[#051c1c]/40 px-4 sm:px-8 backdrop-blur-xl relative">
            <div className="flex flex-1 items-center gap-4">
                <CommandPalette />
            </div>
            <div className="flex items-center gap-4" ref={dropdownRef}>
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "relative text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all",
                            showNotifications && "bg-white/10 text-white"
                        )}
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (unreadCount > 0 && !showNotifications) {
                                // Optional: mark read on open? Or let user do it manual
                            }
                        }}
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.5)] border border-[#051c1c] animate-pulse" />
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0c2a27]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 origin-top-right">
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[10px] uppercase font-bold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                                    >
                                        <Check className="h-3 w-3" />
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-white/5">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "p-4 hover:bg-white/5 transition-colors relative group",
                                                    !notification.read && "bg-primary/5"
                                                )}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 space-y-1">
                                                        <h4 className={cn(
                                                            "text-xs font-bold text-white",
                                                            !notification.read && "text-primary"
                                                        )}>
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-[11px] text-zinc-400 leading-snug">
                                                            {notification.message}
                                                        </p>
                                                        <span className="text-[9px] text-zinc-600 font-mono block mt-1">
                                                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => clearNotification(notification.id)}
                                                        className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                {!notification.read && (
                                                    <span className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 px-4 text-center">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                            <Bell className="h-4 w-4 text-zinc-600" />
                                        </div>
                                        <p className="text-xs text-zinc-500 font-bold">No new notifications</p>
                                        <p className="text-[10px] text-zinc-600 mt-1">You&apos;re all caught up!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="hidden md:flex flex-col items-end mr-1">
                        <span className="text-sm font-bold font-heading text-white uppercase tracking-widest leading-tight">{fullName}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[100px] text-right">Registered Patch</span>
                    </div>
                    <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/5 hover:ring-primary/40 transition-all shadow-lg shadow-black/20">
                        <AvatarImage src={user?.avatar} alt={fullName} className="object-cover" />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
