"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Clock, AlertCircle, Calculator } from "lucide-react"

interface FinanceOverviewProps {
    data?: {
        totalRevenue: number
        pendingRevenue: number
        overdueRevenue: number
        currency: string
    }
}

export function FinanceOverview({ data }: FinanceOverviewProps) {
    const totalRevenue = data?.totalRevenue || 0
    const pendingRevenue = data?.pendingRevenue || 0
    const overdueRevenue = data?.overdueRevenue || 0
    const estimatedTax = totalRevenue * 0.2

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.07] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Net Revenue</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                        <DollarSign className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-white">
                        ${totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Total paid invoices</p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.07] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pending</CardTitle>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                        <Clock className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-white">
                        ${pendingRevenue.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Sent, awaiting payment</p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.07] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Overdue</CardTitle>
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                        <AlertCircle className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-white">
                        ${overdueRevenue.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Past due date</p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden group hover:bg-white/[0.07] transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Est. Tax (20%)</CardTitle>
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                        <Calculator className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-white">
                        ${estimatedTax.toLocaleString()}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">Ready for savings</p>
                </CardContent>
            </Card>
        </div>
    )
}
