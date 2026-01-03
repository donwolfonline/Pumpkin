"use client";

import { useEffect, useState } from "react";
import { Search, MoreVertical, Trash2, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAllUsersForAdmin, type AdminUserSummary } from "@/lib/storage-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUserSummary[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "client", plan: "seedling" });

    useEffect(() => {
        // Defer state update to avoid sync rendering warning
        setTimeout(() => setUsers(getAllUsersForAdmin()), 0);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, this would call an API. 
        // For this mock/localStorage setup, we'll simulate adding to the UI list.
        const mockNewUser: AdminUserSummary = {
            id: `new_${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role as 'admin' | 'user', // Simplified
            subscriptionTier: newUser.plan,
            revenue: newUser.plan === 'pumpkin' ? 29 : newUser.plan === 'sprout' ? 12 : 0,
            status: 'active'
        };

        setUsers([mockNewUser, ...users]);
        setIsAddUserOpen(false);
        setNewUser({ name: "", email: "", role: "client", plan: "seedling" });
        // Simulating success
        alert(`User ${mockNewUser.name} created successfully!`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">User Management</h2>
                    <p className="text-sm md:text-base text-zinc-400">Manage all registered users and their platform access.</p>
                </div>

                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#051c1c] border-white/10 text-zinc-100 sm:max-w-[425px] w-[95vw] rounded-xl">
                        <DialogHeader>
                            <DialogTitle className="text-white font-heading uppercase tracking-widest">Add New User</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Create a new user account. They will receive an email to set up their password.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="bg-white/5 border-white/10 text-white"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="bg-white/5 border-white/10 text-white"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Role</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                            <SelectItem value="client">Client</SelectItem>
                                            <SelectItem value="provider">Provider</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-300">Plan</Label>
                                    <Select
                                        value={newUser.plan}
                                        onValueChange={(val) => setNewUser({ ...newUser, plan: val })}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                            <SelectItem value="seedling">Seedling (Free)</SelectItem>
                                            <SelectItem value="sprout">Sprout ($12)</SelectItem>
                                            <SelectItem value="pumpkin">Big Pumpkin ($29)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full font-bold uppercase tracking-widest text-xs h-12 rounded-lg">Create User</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9 bg-[#0a2c28]/20 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-primary/50 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="grid gap-4 md:hidden">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="p-4 rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm uppercase shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                                        {user.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{user.name}</div>
                                        <div className="text-xs text-zinc-500">{user.email}</div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                            <Mail className="mr-2 h-4 w-4" /> Email User
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-zinc-500 block mb-1 uppercase tracking-wider text-[10px]">Role</span>
                                    <span className="font-mono text-zinc-300 uppercase">{user.role}</span>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-zinc-500 block mb-1 uppercase tracking-wider text-[10px]">Plan</span>
                                    <span className={cn(
                                        "font-bold uppercase tracking-wide",
                                        user.subscriptionTier === 'seedling' ? "text-zinc-500" : "text-primary"
                                    )}>
                                        {user.subscriptionTier}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/5">
                                <span>Joined: {new Date().toLocaleDateString()}</span>
                                <span className="flex items-center gap-1">Status: <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-zinc-500 border border-white/5 rounded-xl bg-[#0a2c28]/20">
                        No users found
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4">Subscription</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                                    {user.name.substring(0, 2)}
                                                </div>
                                                <div>
                                                    <div>{user.name}</div>
                                                    <div className="text-xs text-zinc-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-300">
                                            <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-mono uppercase">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date().toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                                user.subscriptionTier === 'seedling' ? "bg-zinc-500/10 text-zinc-500" :
                                                    "bg-primary/10 text-primary"
                                            )}>
                                                {user.subscriptionTier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                                    <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                                        <Mail className="mr-2 h-4 w-4" /> Email User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                        No users found matching &quot;{searchTerm}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
