"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, DollarSign, Activity, CheckCircle2 } from "lucide-react";
import { getAllUsersForAdmin, type AdminUserSummary } from "@/lib/storage-utils";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        newUsersThisMonth: 0
    });
    const [recentUsers, setRecentUsers] = useState<AdminUserSummary[]>([]);

    useEffect(() => {
        // Defer state updates to avoid "synchronous setState" warning
        const timer = setTimeout(() => {
            const users = getAllUsersForAdmin();
            setRecentUsers(users.slice(0, 5)); // Get first 5 for now

            setStats({
                totalUsers: users.length,
                activeSubscriptions: 0, // Mock for now or derive
                monthlyRevenue: users.reduce((sum, u) => sum + u.revenue, 0),
                newUsersThisMonth: 0 // Mock
            });
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">Dashboard Overview</h2>
                <p className="text-sm md:text-base text-zinc-400">Welcome back, Super Admin. Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    icon={Users}
                    trend="+12% from last month"
                />
                <StatCard
                    title="Monthly Recurring Revenue"
                    value={`$${stats.monthlyRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+8% from last month"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.activeSubscriptions.toString()}
                    icon={CreditCard}
                    trend="+2 new today"
                />
                <StatCard
                    title="Platform Activity"
                    value="98%"
                    icon={Activity}
                    trend="System operational"
                />
            </div>

            {/* Recent Users Section */}
            <div className="rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-white font-heading uppercase tracking-wide">Recent Signups</h3>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">MRR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentUsers.length > 0 ? (
                                recentUsers.map((user) => (
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
                                            <span className="px-2 py-1 bg-white/5 rounded-md text-xs font-mono uppercase">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold uppercase">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-white font-mono">${user.revenue.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        No users found in storage.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden p-4 space-y-4">
                    {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                            <div key={user.id} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-3">
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
                                    <span className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-mono uppercase text-zinc-300">
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Active
                                    </span>
                                    <span className="text-white font-mono text-sm font-bold">
                                        ${user.revenue.toLocaleString()} <span className="text-zinc-500 text-[10px]">/mo</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-zinc-500 py-4">No recent users.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend }: { title: string, value: string, icon: React.ElementType, trend: string }) {
    return (
        <div className="p-6 rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">{title}</span>
                <div className="p-2 bg-white/5 rounded-lg text-zinc-300">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1 font-heading">{value}</div>
            <p className="text-xs text-zinc-500">{trend}</p>
        </div>
    );
}
