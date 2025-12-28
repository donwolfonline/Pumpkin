'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommandPalette } from '@/components/features/search/command-palette';
import { api } from '@/lib/api';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
}

export function Header() {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        // We use a small delay or a promise to avoid the "synchronous setState in effect" lint
        // This also ensures we only access localStorage on the client.
        const currentUser = api.getUser();
        if (currentUser) {
            setUser(currentUser);
        }
    }, []);

    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Pumpkin User';
    const initials = user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'PU';


    return (
        <header className="sticky top-0 z-30 flex h-20 w-full items-center gap-4 border-b border-white/5 bg-[#051c1c]/40 px-8 backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-4">

                <CommandPalette />
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(249,115,22,0.5)] border border-[#051c1c]" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="hidden md:flex flex-col items-end mr-1">
                        <span className="text-sm font-bold font-heading text-white uppercase tracking-widest leading-tight">{fullName}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[100px] text-right">Registered Patch</span>
                    </div>
                    <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-white/5 hover:ring-primary/40 transition-all shadow-lg shadow-black/20">
                        <AvatarImage src="" alt={fullName} />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
