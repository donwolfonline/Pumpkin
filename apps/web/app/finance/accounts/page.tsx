"use client"

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    ChevronRight,
    ChevronDown,
    TreePine,
    Plus,
    Loader2,
    ArrowLeft
} from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Account {
    id: string;
    code: string;
    name: string;
    type: string;
    balance: number;
    children?: Account[];
}

function AccountRow({ account, depth = 0 }: { account: Account; depth?: number }) {
    const [isExpanded, setIsExpanded] = useState(true)
    const hasChildren = account.children && account.children.length > 0

    return (
        <>
            <div
                className={cn(
                    "flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5",
                    depth > 0 && "bg-white/[0.02]"
                )}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3" style={{ paddingLeft: `${depth * 24}px` }}>
                    {hasChildren ? (
                        isExpanded ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />
                    ) : (
                        <div className="w-4" />
                    )}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded leading-none">{account.code}</span>
                        <span className="text-sm font-bold text-white uppercase tracking-wider">{account.name}</span>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-24 text-center">{account.type}</span>
                    <span className={cn(
                        "text-sm font-mono font-bold w-32 text-right",
                        Number(account.balance) < 0 ? "text-red-400" : "text-emerald-400"
                    )}>
                        ${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
            {hasChildren && isExpanded && (
                <div>
                    {account.children!.map(child => (
                        <AccountRow key={child.id} account={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </>
    )
}

export default function ChartOfAccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const data = await api.getFinanceAccounts()
                setAccounts(data)
            } catch (error) {
                console.error('Failed to load accounts:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadAccounts()
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
                            <TreePine className="h-8 w-8 text-primary" />
                            Chart of Accounts
                        </h2>
                        <p className="text-muted-foreground italic text-sm">
                            Manage your business financial structure and account categories.
                        </p>
                    </div>
                    <Button className="rounded-xl uppercase font-bold tracking-widest text-[10px] h-10 px-6 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Account
                    </Button>
                </div>

                <Card className="rounded-3xl border-white/5 bg-white/2 backdrop-blur-md border border-white/5 overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 px-4">Account Hierarchy</CardTitle>
                            <div className="flex items-center gap-8 pr-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-24 text-center">Type</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-32 text-right">Balance</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="p-12 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {accounts.map(account => (
                                    <AccountRow key={account.id} account={account} />
                                ))}
                                {accounts.length === 0 && (
                                    <div className="p-12 text-center text-zinc-500 italic text-sm">
                                        No accounts found. Start by adding one.
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
