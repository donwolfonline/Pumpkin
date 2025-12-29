"use client"

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Contract } from '@/lib/types/contract';
import { Plus, FileSignature, ChevronRight, FileCheck, CircleDollarSign, Clock } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getContracts, setContracts } from '@/lib/storage-utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function ContractsPage() {
    const [contracts, setContractsList] = useState<Contract[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const contractsData = getContracts();
        setContractsList(contractsData);
        setIsMounted(true);
    }, []);

    const handleCreateContract = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const newContract: Contract = {
            id: crypto.randomUUID(),
            contractNumber: `CONT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            clientId: crypto.randomUUID(),
            clientName: formData.get('clientName') as string,
            clientEmail: '',
            title: formData.get('title') as string,
            description: 'Master Services Agreement for professional services.',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'draft',
            terms: 'Full contract terms will be added here...',
            paymentSchedule: [
                {
                    id: crypto.randomUUID(),
                    description: 'Initial Deposit',
                    amount: (parseFloat(formData.get('amount') as string) || 0) * 0.5,
                    dueDate: new Date().toISOString(),
                    status: 'pending'
                }
            ],
            deliverables: [],
            totalValue: parseFloat(formData.get('amount') as string) || 0,
            signatures: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updated = [newContract, ...contracts];
        setContractsList(updated);
        setContracts(updated);
        setIsDialogOpen(false);
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Contract",
            cell: ({ row }: { row: { original: Contract } }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white uppercase tracking-widest text-[10px]">{row.original.title}</span>
                    <span className="text-zinc-500 text-[8px] uppercase tracking-widest leading-none mt-1">Ref: {row.original.contractNumber}</span>
                </div>
            )
        },
        {
            accessorKey: "clientName",
            header: () => <span className="hidden md:inline">Client</span>,
            cell: ({ row }: { row: { original: Contract } }) => (
                <span className="hidden md:inline text-zinc-300 text-xs font-medium uppercase tracking-wider">{row.original.clientName}</span>
            )
        },
        {
            accessorKey: "status",
            header: () => <span className="hidden sm:inline">Status</span>,
            cell: ({ row }: { row: { original: Contract } }) => (
                <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="default" className="rounded-full uppercase text-[8px] font-black px-3 py-1 bg-white/5 border-white/10 text-zinc-400">
                        {row.original.status}
                    </Badge>
                    {row.original.status === 'active' && <CircleDollarSign className="h-4 w-4 text-orange-500" />}
                    {row.original.status === 'signed' && <FileCheck className="h-4 w-4 text-primary" />}
                    {(row.original.status === 'draft' || row.original.status === 'pending') && <Clock className="h-4 w-4 text-zinc-600" />}
                </div>
            )
        },
        {
            accessorKey: "totalValue",
            header: "Value",
            cell: ({ row }: { row: { original: Contract } }) => (
                <span className="font-black text-[#ea580c] uppercase tracking-widest text-[10px]">
                    {formatCurrency(row.original.totalValue || 0)}
                </span>
            )
        },
        {
            id: "actions",
            cell: ({ row }: { row: { original: Contract } }) => (
                <Link href={`/contracts/${row.original.id}`}>
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-zinc-500 hover:text-white bg-white/5 rounded-xl border border-white/5">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            )
        }
    ];

    if (!isMounted) {
        return (
            <DashboardShell>
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="space-y-8">
                <PageHeader
                    title="Contracts"
                    description="Manage legally binding agreements with your clients."
                    action={{
                        label: 'New Contract',
                        icon: <Plus className="h-4 w-4" />,
                        onClick: () => setIsDialogOpen(true)
                    }}
                    breadcrumbs={[
                        { label: 'Dashboard', href: '/dashboard' },
                        { label: 'Contracts' }
                    ]}
                />

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] w-[95vw] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl px-4 sm:px-6">
                        <DialogHeader>
                            <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Issue New Agreement</DialogTitle>
                            <DialogDescription className="text-zinc-500 text-xs">
                                Create a new service agreement or contract.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateContract} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Project/Agreement Title</Label>
                                <Input id="title" name="title" placeholder="Annual Maintenance Contract" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Name</Label>
                                <Input id="client" name="clientName" placeholder="Acme Corporation" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Contract Value ($)</Label>
                                <Input id="amount" name="amount" type="number" step="0.01" placeholder="12000.00" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                            <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                                Generate Contract
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                {contracts.length > 0 ? (
                    <>
                        {/* Mobile Grid View */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {contracts.map((contract) => (
                                <Link key={contract.id} href={`/contracts/${contract.id}`} className="block">
                                    <div className="bg-black/20 border border-white/5 rounded-3xl p-6 space-y-4 active:scale-95 transition-transform">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="text-sm font-black text-white uppercase tracking-widest leading-tight">{contract.title}</h3>
                                                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Ref: {contract.contractNumber}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {contract.status === 'active' && <CircleDollarSign className="h-4 w-4 text-orange-500" />}
                                                {contract.status === 'signed' && <FileCheck className="h-4 w-4 text-primary" />}
                                                {(contract.status === 'draft' || contract.status === 'pending') && <Clock className="h-4 w-4 text-zinc-600" />}
                                                <Badge variant="default" className="rounded-full uppercase text-[8px] font-black px-3 py-1 bg-white/5 border-white/10 text-zinc-400">
                                                    {contract.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Client</p>
                                                <p className="text-[10px] font-bold text-zinc-300 uppercase leading-none">{contract.clientName}</p>
                                            </div>
                                            <p className="text-sm font-black text-[#ea580c] uppercase tracking-widest leading-none">
                                                {formatCurrency(contract.totalValue || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block">
                            <DataTable
                                columns={columns}
                                data={contracts}
                                searchKey="title"
                            />
                        </div>
                    </>
                ) : (
                    <EmptyState
                        icon={FileSignature}
                        title="No Contracts Yet"
                        description="You haven't issued any contracts yet. Protect your business with professional agreements."
                        actionLabel="Issue First Contract"
                        onAction={() => setIsDialogOpen(true)}
                    />
                )}
            </div>
        </DashboardShell>
    );
}
