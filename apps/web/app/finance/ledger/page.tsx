"use client"

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    History,
    Plus,
    Loader2,
    ArrowLeft,
    Search,
    Filter,
    Calendar,
    FileText
} from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export default function GeneralLedgerPage() {
    const [entries, setEntries] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadLedger = async () => {
            try {
                const data = await api.getFinanceLedger()
                setEntries(data)
            } catch (error) {
                console.error('Failed to load ledger:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadLedger()
    }, [])

    return (
        <DashboardShell>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-500 mb-2">
                            <Link href="/finance" className="hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                                <ArrowLeft className="h-3 w-3" />
                                Back to Finance
                            </Link>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight font-heading flex items-center gap-3">
                            <History className="h-8 w-8 text-blue-500" />
                            General Ledger
                        </h2>
                        <p className="text-muted-foreground italic text-sm">
                            Audit all financial transactions and journal entries.
                        </p>
                    </div>
                    <Button className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 uppercase font-bold tracking-widest text-[10px] h-10 px-6 gap-2 group backdrop-blur-md">
                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        New Journal Entry
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search transactions..."
                            className="pl-10 h-10 rounded-xl border-white/10 bg-white/5 backdrop-blur-md focus:bg-white/10 transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 px-4 gap-2 text-[10px] uppercase font-bold tracking-widest group">
                        <Filter className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                        Filter
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 px-4 gap-2 text-[10px] uppercase font-bold tracking-widest group">
                        <Calendar className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                        This Month
                    </Button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        </div>
                    ) : entries.length === 0 ? (
                        <Card className="rounded-3xl border-dashed border-white/10 bg-white/2 backdrop-blur-md">
                            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                                <FileText className="h-12 w-12 text-zinc-600 mb-2" />
                                <div className="text-center space-y-1">
                                    <p className="text-white font-bold uppercase tracking-widest text-sm">No Transactions Found</p>
                                    <p className="text-zinc-500 text-xs italic">Start logging journal entries to see them here.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        entries.map((entry) => (
                            <Card key={entry.id} className="rounded-3xl border-white/5 bg-white/2 backdrop-blur-md border border-white/5 overflow-hidden hover:bg-white/[0.04] transition-all">
                                <CardHeader className="p-4 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-xl bg-white/5">
                                            <Calendar className="h-4 w-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">JE-{entry.id.slice(0, 8)}</p>
                                            <p className="text-[10px] text-zinc-500">{new Date(entry.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{entry.description}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Account</th>
                                                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-right">Debit</th>
                                                <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-right">Credit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entry.lines.map((line: any) => (
                                                <tr key={line.id} className="border-b border-white/[0.02] last:border-0">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-mono text-zinc-500 leading-none">{line.account.code}</span>
                                                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{line.account.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="text-xs font-mono font-bold text-white">
                                                            {line.type === 'DEBIT' ? `$${Number(line.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className="text-xs font-mono font-bold text-white">
                                                            {line.type === 'CREDIT' ? `$${Number(line.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </DashboardShell>
    )
}
