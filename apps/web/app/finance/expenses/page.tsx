"use client"

import { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Plus,
    Loader2,
    ArrowLeft,
    Search,
    Filter,
    Calendar,
    Receipt,
    ExternalLink,
    Tag,
    Trash2
} from 'lucide-react'
import { api, Account, Expense } from '@/lib/api'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { ExpenseDialog } from '@/components/features/finance/expense-dialog'

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const loadData = async () => {
        setIsLoading(true)
        try {
            const [expensesData, accountsData] = await Promise.all([
                api.getFinanceExpenses(),
                api.getFinanceAccountsAll()
            ])
            setExpenses(expensesData)
            setAccounts(accountsData)
        } catch (error) {
            console.error('Failed to load expense data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleLogExpense = async (data: Partial<Expense>) => {
        try {
            await api.createFinanceExpense(data)
            loadData()
        } catch (error) {
            console.error('Failed to log expense:', error)
        }
    }

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
                            <Receipt className="h-8 w-8 text-red-500" />
                            Expenses
                        </h2>
                        <p className="text-muted-foreground italic text-sm">
                            Track and categorize your business spending and vendor payments.
                        </p>
                    </div>
                    <Button
                        className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 uppercase font-bold tracking-widest text-[10px] h-10 px-6 gap-2 group backdrop-blur-md"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        Log Expense
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search expenses..."
                            className="pl-10 h-10 rounded-xl border-white/10 bg-white/5 backdrop-blur-md focus:bg-white/10 transition-colors"
                        />
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 px-4 gap-2 text-[10px] uppercase font-bold tracking-widest group">
                        <Filter className="h-3 w-3 text-zinc-500 group-hover:text-white transition-colors" />
                        Category
                    </Button>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        </div>
                    ) : expenses.length === 0 ? (
                        <Card className="rounded-3xl border-dashed border-white/10 bg-white/2 backdrop-blur-md">
                            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                                <Receipt className="h-12 w-12 text-zinc-600 mb-2" />
                                <div className="text-center space-y-1">
                                    <p className="text-white font-bold uppercase tracking-widest text-sm">No Expenses Logged</p>
                                    <p className="text-zinc-500 text-xs italic">Track your spending to get a clear view of your net revenue.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        expenses.map((expense) => (
                            <Card key={expense.id} className="rounded-3xl border-white/5 bg-white/2 backdrop-blur-md border border-white/5 overflow-hidden hover:bg-white/[0.04] transition-all group">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-white/5 text-zinc-400 group-hover:text-red-400 transition-colors">
                                            <Receipt className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-white uppercase tracking-wider">{expense.vendor || 'Unknown Vendor'}</p>
                                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 font-bold uppercase">{expense.category}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                                    <Tag className="h-3 w-3" />
                                                    {expense.paymentMethod || 'Other'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm font-mono font-bold text-white">-${Number(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{expense.currency}</p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {expense.receiptUrl && (
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/10" asChild>
                                                    <a href={expense.receiptUrl} target="_blank" rel="noreferrer">
                                                        <ExternalLink className="h-4 w-4 text-zinc-400" />
                                                    </a>
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-white/10 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <ExpenseDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                accounts={accounts}
                onSubmit={handleLogExpense}
            />
        </DashboardShell>
    )
}
