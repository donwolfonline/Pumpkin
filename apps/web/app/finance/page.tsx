"use client"

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Plus,
    ArrowRight,
    TrendingUp,
    TrendingDown,
    PieChart,
    History,
    TreePine,
    Banknote,
    Loader2
} from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { FinanceOverview } from '@/components/features/dashboard/finance-overview'

export default function FinanceDashboardPage() {
    const [accounts, setAccounts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [accountsData, analyticsSummary] = await Promise.all([
                    api.getFinanceAccounts(),
                    api.getAnalyticsSummary()
                ])
                setAccounts(accountsData)
                setStats(analyticsSummary)
            } catch (error) {
                console.error('Failed to load finance data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="h-[400px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight font-heading">Finance Management</h2>
                        <p className="text-muted-foreground italic text-sm">
                            Manage your Chart of Accounts, Ledger, and Expenses.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button className="rounded-xl uppercase font-bold tracking-widest text-[10px] h-10 px-6 gap-2" asChild>
                            <Link href="/finance/expenses">
                                <Plus className="h-4 w-4" />
                                Add Expense
                            </Link>
                        </Button>
                    </div>
                </div>

                <FinanceOverview data={stats} />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="rounded-3xl border-white/5 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.07] transition-all group border border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Accounting Tree</CardTitle>
                            <TreePine className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-400 mb-4">Manage your hierarchical Chart of Accounts.</p>
                            <Button variant="outline" className="w-full rounded-xl border-white/10 text-[10px] uppercase font-bold tracking-widest h-10" asChild>
                                <Link href="/finance/accounts">Open Accounts <ArrowRight className="ml-2 h-3 w-3" /></Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-white/5 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.07] transition-all group border border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">General Ledger</CardTitle>
                            <History className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-400 mb-4">Review all journal entries and transactions.</p>
                            <Button variant="outline" className="w-full rounded-xl border-white/10 text-[10px] uppercase font-bold tracking-widest h-10" asChild>
                                <Link href="/finance/ledger">View Ledger <ArrowRight className="ml-2 h-3 w-3" /></Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-white/5 bg-white/5 backdrop-blur-md overflow-hidden hover:bg-white/[0.07] transition-all group border border-white/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-400 mb-4">Track business costs and vendor payments.</p>
                            <Button variant="outline" className="w-full rounded-xl border-white/10 text-[10px] uppercase font-bold tracking-widest h-10" asChild>
                                <Link href="/finance/expenses">Manage Expenses <ArrowRight className="ml-2 h-3 w-3" /></Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="rounded-3xl border-white/5 bg-white/2 backdrop-blur-md border border-white/5 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <PieChart className="h-4 w-4 text-primary" />
                                Balance Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {accounts.filter(a => !a.parentId).map(account => (
                                    <div key={account.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/5">
                                                <Banknote className="h-3 w-3 text-zinc-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase tracking-widest">{account.name}</p>
                                                <p className="text-[10px] text-zinc-500">{account.type}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">${Number(account.balance).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-white/5 bg-white/2 backdrop-blur-md border border-white/5 overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center text-zinc-500 text-xs italic">
                                No recent financial activity to display.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    )
}
