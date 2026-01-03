"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, Clock, MousePointer, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data generator for "Real-time" feel
const generateTrafficData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        visitors: Math.floor(Math.random() * 50) + 10,
        signups: Math.floor(Math.random() * 5),
    }));
};

const generateBehaviorData = () => [
    { page: "/dashboard", views: 1240 },
    { page: "/crm", views: 850 },
    { page: "/invoices", views: 620 },
    { page: "/proposals", views: 480 },
    { page: "/settings", views: 120 },
];

export default function AdminAnalyticsPage() {
    const [trafficData] = useState(generateTrafficData());
    const [activeUsers, setActiveUsers] = useState(42);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveUsers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(10, prev + change);
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-zinc-100">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">Analytics & Behavior</h2>
                <p className="text-sm md:text-base text-zinc-400">Real-time platform insights and user activity tracking.</p>
            </div>

            {/* Live Stats Row */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Active Users Now
                        </CardTitle>
                        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white font-heading">{activeUsers}</div>
                        <p className="text-xs text-zinc-500 pt-1">Live across all tenants</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Avg. Session
                        </CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white font-heading">12m 30s</div>
                        <p className="text-xs text-emerald-400 flex items-center pt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +8.2% vs last week
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Bounce Rate
                        </CardTitle>
                        <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white font-heading">24.5%</div>
                        <p className="text-xs text-emerald-400 flex items-center pt-1">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -2.1% (Improv.)
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                            Click Rate
                        </CardTitle>
                        <MousePointer className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white font-heading">4.8%</div>
                        <p className="text-xs text-zinc-500 pt-1">On primary CTAs</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
                {/* Traffic Chart */}
                <Card className="col-span-1 lg:col-span-4 bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Traffic Volume (24h)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0 md:pl-2">
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="time"
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={3}
                                    />
                                    <YAxis
                                        stroke="#52525b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                        width={30}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#031111', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                        labelStyle={{ color: '#a1a1aa' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="visitors"
                                        stroke="#f97316"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorVisits)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Pages Bar Chart */}
                <Card className="col-span-1 lg:col-span-3 bg-[#0a2c28]/20 border-white/5 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Most Visited Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={generateBehaviorData()} layout="vertical" margin={{ left: 0 }}>
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="page"
                                        type="category"
                                        stroke="#a1a1aa"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        width={80}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#031111', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="views" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
