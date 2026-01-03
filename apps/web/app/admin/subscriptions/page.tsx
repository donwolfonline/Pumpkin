"use client";

import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, MoreVertical, Mail, XCircle } from "lucide-react";
import { getAllUsersForAdmin, type AdminUserSummary } from "@/lib/storage-utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminSubscriptionsPage() {
    const [subscribers, setSubscribers] = useState<AdminUserSummary[]>([]);

    useEffect(() => {
        // In a real app, we'd fetch precise subscription data. 
        // Here we reuse user data which contains subscription tier.
        const users = getAllUsersForAdmin();
        setSubscribers(users);
    }, []);

    const totalRevenue = subscribers.reduce((sum, s) => sum + s.revenue, 0);
    const paidSubscribers = subscribers.filter(s => s.subscriptionTier !== 'Free Trial').length;
    const mrr = totalRevenue; // Simple MRR approximation

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">Subscriptions & Revenue</h2>
                <p className="text-sm md:text-base text-zinc-400">Monitor financial performance and subscriber health.</p>
            </div>

            {/* Revenue Stats */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-900/40 to-emerald-900/10 border border-emerald-500/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Total Revenue</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-heading">${totalRevenue.toLocaleString()}</div>
                    <p className="text-emerald-400/60 text-xs mt-1 font-mono">+12% vs last month</p>
                </div>

                <div className="p-6 rounded-xl bg-[#0a2c28]/40 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-blue-400 font-bold uppercase text-xs tracking-wider">Paid Subscribers</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-heading">{paidSubscribers}</div>
                    <p className="text-zinc-500 text-xs mt-1">{subscribers.length > 0 ? ((paidSubscribers / subscribers.length) * 100).toFixed(1) : 0}% conversion rate</p>
                </div>

                <div className="p-6 rounded-xl bg-[#0a2c28]/40 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-orange-400 font-bold uppercase text-xs tracking-wider">Churn Rate</span>
                    </div>
                    <div className="text-3xl font-bold text-white font-heading">2.4%</div>
                    <p className="text-zinc-500 text-xs mt-1">Below industry average</p>
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white font-heading uppercase tracking-wide">Active Subscriptions</h3>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/5 text-zinc-400 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">MRR</th>
                                <th className="px-6 py-4">Renews</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div>{sub.name}</div>
                                        <div className="text-xs text-zinc-500">{sub.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("w-2 h-2 rounded-full",
                                                sub.subscriptionTier === 'pumpkin' ? 'bg-orange-500' :
                                                    sub.subscriptionTier === 'sprout' ? 'bg-emerald-500' : 'bg-zinc-500'
                                            )} />
                                            <span className="text-zinc-300 font-mono uppercase text-xs">{sub.subscriptionTier}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wide">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        ${sub.revenue}.00
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 text-xs">
                                        {new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}
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
                                                    <Mail className="mr-2 h-4 w-4" /> Email Customer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden p-4 space-y-4">
                    {subscribers.map((sub) => (
                        <div key={sub.id} className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-bold text-white">{sub.name}</div>
                                    <div className="text-xs text-zinc-500">{sub.email}</div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-[#0c2a27] border-white/10 text-zinc-200">
                                        <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                            <Mail className="mr-2 h-4 w-4" /> Email Customer
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                            <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-zinc-500 block mb-1 uppercase tracking-wider text-[10px]">Plan</span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full",
                                            sub.subscriptionTier === 'pumpkin' ? 'bg-orange-500' :
                                                sub.subscriptionTier === 'sprout' ? 'bg-emerald-500' : 'bg-zinc-500'
                                        )} />
                                        <span className="font-mono uppercase text-white">{sub.subscriptionTier}</span>
                                    </div>
                                </div>
                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-zinc-500 block mb-1 uppercase tracking-wider text-[10px]">Revenue</span>
                                    <span className="font-mono text-white font-bold">${sub.revenue}.00/mo</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/5">
                                <span className="flex items-center gap-1.5 text-green-400 font-bold uppercase tracking-wide">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active
                                </span>
                                <span>Renews: {new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
