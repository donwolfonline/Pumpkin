"use client"

import * as React from "react"
import {
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Calculator,
    Search,
    FileText,
    Users,
    LayoutDashboard
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { useRouter } from "next/navigation"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="relative w-full sm:max-w-sm cursor-pointer group"
            >
                <div className="flex h-9 w-9 sm:w-full items-center justify-center sm:justify-start rounded-xl border border-white/5 bg-white/5 sm:bg-background px-0 sm:px-3 sm:py-1 sm:pl-9 text-sm text-muted-foreground shadow-sm transition-all hover:bg-white/10 sm:hover:border-primary/20">
                    <Search className="h-4 w-4 text-zinc-500 sm:absolute sm:left-2.5 sm:top-2.5" />
                    <span className="hidden sm:inline">Search...</span>
                    <span className="hidden sm:flex absolute right-2 items-center gap-1 text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                        <span className="text-[10px]">⌘</span>K
                    </span>
                </div>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/calendar'))}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/documents'))}>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Documents</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="CRM">
                        <CommandItem onSelect={() => runCommand(() => router.push('/crm'))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Contacts</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/crm/leads'))}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>Leads</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings/profile'))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <CommandShortcut>⌘P</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings/billing'))}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <CommandShortcut>⌘B</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
