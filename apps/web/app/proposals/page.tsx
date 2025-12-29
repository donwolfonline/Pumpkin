"use client"

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/ui/data-table';
import { Proposal } from '@/lib/types/proposal';
import { Plus, FileEdit, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getProposals, setProposals, getContacts } from '@/lib/storage-utils';
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

export default function ProposalsPage() {
    const [proposals, setProposalsList] = useState<Proposal[]>(() => {
        if (typeof window !== 'undefined') return getProposals();
        return [];
    });
    const [contacts] = useState(() => {
        if (typeof window !== 'undefined') return getContacts();
        return [];
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateProposal = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        const clientId = formData.get('clientId') as string;
        const client = contacts.find(c => c.id === clientId);

        const newProposal: Proposal = {
            id: crypto.randomUUID(),
            organizationId: 'org_1',
            clientId,
            clientName: client ? (client.name || `${client.firstName} ${client.lastName}`.trim()) : 'Unknown Client',
            title: formData.get('title') as string,
            status: 'draft',
            totalAmount: parseFloat(formData.get('amount') as string) || 0,
            content: 'Project overview and scope details...',
            createdBy: 'user_1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        };

        const updated = [newProposal, ...proposals];
        setProposalsList(updated);
        setProposals(updated);
        setIsDialogOpen(false);
    };

    const columns = [
        {
            accessorKey: "title",
            header: "Proposal",
            cell: ({ row }: { row: { original: Proposal } }) => (
                <div className="flex flex-col max-w-[140px] sm:max-w-none">
                    <span className="font-bold text-white uppercase tracking-widest text-[10px] truncate">{row.original.title}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                        <span className="text-[#ea580c] text-[8px] font-black uppercase tracking-widest truncate">{row.original.clientName}</span>
                        <span className="hidden sm:inline text-zinc-500 text-[8px] uppercase tracking-widest">• Valid until {row.original.validUntil ? new Date(row.original.validUntil).toLocaleDateString() : 'N/A'}</span>

                        {/* Mobile interactions/details */}
                        <div className="sm:hidden flex items-center gap-2 mt-0.5">
                            <span className="text-zinc-500 text-[8px]">{formatCurrency(row.original.totalAmount || 0)}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: { original: Proposal } }) => {
                const isFullySigned = row.original.status === 'signed' || (
                    row.original.signatures?.some((s: { party: string }) => s.party === 'provider') &&
                    row.original.signatures?.some((s: { party: string }) => s.party === 'client')
                );

                return (
                    <div className="flex items-center">
                        <Badge
                            variant="default"
                            className={`rounded-full uppercase text-[8px] font-black px-2 sm:px-3 py-1 border text-nowrap ${isFullySigned
                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                    : 'bg-white/5 border-white/10 text-zinc-400'
                                }`}
                        >
                            {isFullySigned ? (
                                <span className="flex items-center gap-1">
                                    <span className="hidden sm:inline">Dual Signed</span>
                                    <span className="sm:hidden">Signed</span>
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                </span>
                            ) : (
                                row.original.status.replace('_', ' ')
                            )}
                        </Badge>
                    </div>
                );
            }
        },
        {
            accessorKey: "totalAmount",
            header: () => <span className="hidden md:inline">Amount</span>,
            cell: ({ row }: { row: { original: Proposal } }) => (
                <span className="hidden md:inline font-black text-[#ea580c] uppercase tracking-widest text-[10px]">
                    {formatCurrency(row.original.totalAmount || 0)}
                </span>
            )
        },
        {
            id: "actions",
            cell: ({ row }: { row: { original: Proposal } }) => (
                <Link href={`/proposals/${row.original.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500 hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </Link>
            )
        }
    ];

    return (
        <DashboardShell>
            <PageHeader
                title="Proposals"
                description="Create and manage your business proposals."
                action={{
                    label: 'New Proposal',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => setIsDialogOpen(true)
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Proposals' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Create Proposal</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Start a new business proposal for your client.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProposal} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Proposal Title</Label>
                            <Input id="title" name="title" placeholder="Website Redesign Project" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientId" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Select Client</Label>
                            <select
                                id="clientId"
                                name="clientId"
                                className="w-full bg-black/20 border border-white/5 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                required
                            >
                                <option value="" disabled className="bg-[#0c2a27]">Select a client...</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id} className="bg-[#0c2a27]">
                                        {contact.name || `${contact.firstName} ${contact.lastName}`}
                                    </option>
                                ))}
                                {contacts.length === 0 && (
                                    <option disabled className="bg-[#0c2a27]">No clients found in CRM</option>
                                )}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Total Amount ($)</Label>
                            <Input id="amount" name="amount" type="number" step="0.01" placeholder="2500.00" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Create Proposal
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {proposals.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={proposals}
                    searchKey="title"
                />
            ) : (
                <EmptyState
                    icon={FileEdit}
                    title="No Proposals Yet"
                    description="You haven't created any business proposals yet. Win more clients by sending professional proposals."
                    actionLabel="Create First Proposal"
                    onAction={() => setIsDialogOpen(true)}
                />
            )}
        </DashboardShell>
    );
}
