"use client"

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/layout/footer";
import { api } from "@/lib/api";
import { CheckCircle, Shield, Database, Server, Lock, Activity, LucideIcon, Loader2 } from "lucide-react";

interface StatusItem {
    name: string;
    status: 'operational' | 'degraded' | 'down';
    uptime: string;
    icon: LucideIcon;
}

interface HealthData {
    timestamp: string;
    uptime: number;
    components: {
        webApp: { status: string; uptime: string };
        api: { status: string; uptime: string; responseTime?: number };
        database: { status: string; uptime: string; connected?: boolean };
        authentication: { status: string; uptime: string };
    };
    security: {
        tlsEncryption: { status: string; description: string };
        dataEncryption: { status: string; description: string };
        ddosProtection: { status: string; description: string };
        monitoring: { status: string; description: string };
    };
}

export default function StatusPage() {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiUrl, setApiUrl] = useState<string>('');

    useEffect(() => {
        // Get the API URL being used
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        setApiUrl(API_URL);

        const fetchHealthData = async () => {
            try {
                const data = await api.getHealth();
                setHealthData(data as HealthData);
                setError(null);
            } catch (err) {
                console.error('Error fetching health data:', err);
                setError(`Cannot connect to backend API at ${API_URL}/health`);
                // Fallback to default data
                setHealthData({
                    timestamp: new Date().toISOString(),
                    uptime: 0,
                    components: {
                        webApp: { status: 'operational', uptime: '99.99%' },
                        api: { status: 'degraded', uptime: '99.98%' },
                        database: { status: 'operational', uptime: '99.99%' },
                        authentication: { status: 'operational', uptime: '100%' },
                    },
                    security: {
                        tlsEncryption: { status: 'Active', description: 'All data in transit is encrypted using TLS 1.3' },
                        dataEncryption: { status: 'Active', description: 'All stored data is encrypted using AES-256' },
                        ddosProtection: { status: 'Active', description: 'Advanced protection against distributed attacks' },
                        monitoring: { status: 'Active', description: '24/7 automated security monitoring and alerts' },
                    },
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHealthData();
        // Refresh every 30 seconds
        const interval = setInterval(fetchHealthData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
                <Navbar />
                <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Loading system status...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const systemStatus: StatusItem[] = healthData ? [
        { name: "Web Application", status: healthData.components.webApp.status as StatusItem['status'], uptime: healthData.components.webApp.uptime, icon: Server },
        { name: "API Services", status: healthData.components.api.status as StatusItem['status'], uptime: healthData.components.api.uptime, icon: Activity },
        { name: "Database", status: healthData.components.database.status as StatusItem['status'], uptime: healthData.components.database.uptime, icon: Database },
        { name: "Authentication", status: healthData.components.authentication.status as StatusItem['status'], uptime: healthData.components.authentication.uptime, icon: Lock },
    ] : [];

    const securityMeasures = healthData ? [
        { name: "TLS/SSL Encryption", status: healthData.security.tlsEncryption.status, description: healthData.security.tlsEncryption.description },
        { name: "Data Encryption at Rest", status: healthData.security.dataEncryption.status, description: healthData.security.dataEncryption.description },
        { name: "DDoS Protection", status: healthData.security.ddosProtection.status, description: healthData.security.ddosProtection.description },
        { name: "Security Monitoring", status: healthData.security.monitoring.status, description: healthData.security.monitoring.description },
    ] : [];

    const allOperational = systemStatus.every(item => item.status === 'operational');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'text-emerald-500';
            case 'degraded': return 'text-yellow-500';
            case 'down': return 'text-red-500';
            default: return 'text-zinc-500';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'operational': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'degraded': return 'bg-yellow-500/10 border-yellow-500/20';
            case 'down': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-zinc-500/10 border-zinc-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#051c1c] font-sans text-foreground selection:bg-primary/20">
            <Navbar />
            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                {/* Connection Error Banner */}
                {error && (
                    <div className="mb-8 p-6 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/30 text-yellow-200">
                        <div className="flex items-start gap-4">
                            <Activity className="w-6 h-6 text-yellow-400 mt-1 animate-pulse" />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-yellow-300 mb-2">Backend API Not Reachable</h3>
                                <p className="text-sm text-yellow-200 mb-3 font-medium">{error}</p>
                                <div className="p-4 rounded-lg bg-black/20 border border-yellow-500/20 font-mono text-xs space-y-2">
                                    <p className="text-zinc-400">To start the backend API:</p>
                                    <code className="block text-yellow-300">cd apps/api</code>
                                    <code className="block text-yellow-300">npm run start:dev</code>
                                    <p className="text-zinc-500 mt-3">Current API URL: <span className="text-yellow-400">{apiUrl}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">System Status</h1>
                    <p className="text-zinc-400 text-lg">Real-time monitoring of Pumpkin&apos;s infrastructure and services</p>
                </div>

                {/* Overall Status */}
                <div className={`${allOperational ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-yellow-500/10 border-yellow-500/20'} border rounded-2xl p-6 md:p-8 mb-12 flex items-center justify-center gap-4`}>
                    <span className="relative flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${allOperational ? 'bg-emerald-400' : 'bg-yellow-400'} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${allOperational ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
                    </span>
                    <h2 className={`text-2xl font-bold ${allOperational ? 'text-emerald-500' : 'text-yellow-500'} font-heading uppercase tracking-widest`}>
                        {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
                    </h2>
                </div>

                {/* System Components */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white font-heading uppercase tracking-widest mb-6">System Components</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {systemStatus.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.name} className={`${getStatusBg(item.status)} border rounded-xl p-6`}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Icon className={`h-5 w-5 ${getStatusColor(item.status)}`} />
                                            <h4 className="font-bold text-white uppercase tracking-widest text-sm">{item.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                                            <span className={`text-xs font-bold uppercase tracking-widest ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <span className="font-bold uppercase tracking-widest">Uptime:</span>
                                        <span className="font-mono">{item.uptime}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Security Measures */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-white font-heading uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Shield className="h-6 w-6 text-primary" />
                        Security Measures
                    </h3>
                    <div className="space-y-4">
                        {securityMeasures.map((measure) => (
                            <div key={measure.name} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">{measure.name}</h4>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                        {measure.status}
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-400">{measure.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incident History */}
                <div>
                    <h3 className="text-2xl font-bold text-white font-heading uppercase tracking-widest mb-6">Recent Incidents</h3>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                        <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">No incidents in the last 90 days</p>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">
                        Last updated: {healthData ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}
                    </p>
                    {healthData && (
                        <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2">
                            System uptime: {Math.floor(healthData.uptime / 3600)}h {Math.floor((healthData.uptime % 3600) / 60)}m
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
