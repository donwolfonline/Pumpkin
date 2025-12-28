"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/features/invoices/invoice-columns';
import { Invoice } from '@/lib/types/invoice';
import { Plus, CreditCard, Loader2, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import Link from 'next/link';
import { InvoiceStatusBadge } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Button } from '@/components/ui/button';

export default function PaymentsPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Load invoices on mount
    useEffect(() => {
        const saved = localStorage.getItem('pumpkin_invoices');
        if (saved) {
            try {
                setInvoices(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to load invoices:', error);
            }
        }
        setIsLoading(false);
    }, []);

    // Save invoices to localStorage whenever they change
    useEffect(() => {
        if (!isLoading && invoices.length >= 0) {
            localStorage.setItem('pumpkin_invoices', JSON.stringify(invoices));
        }
    }, [invoices, isLoading]);

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        // Create a new invoice object
        const newInvoice: Invoice = {
            id: crypto.randomUUID(),
            invoiceNumber: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            clientName: formData.get('clientName') as string,
            clientEmail: formData.get('clientEmail') as string || '',
            clientId: crypto.randomUUID(),
            status: 'draft',
            issueDate: new Date().toISOString(),
            dueDate: formData.get('dueDate') as string || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            items: [{
                id: crypto.randomUUID(),
                description: formData.get('description') as string || 'Service',
                quantity: 1,
                rate: parseFloat(formData.get('amount') as string) || 0,
                amount: parseFloat(formData.get('amount') as string) || 0,
            }],
            subtotal: parseFloat(formData.get('amount') as string) || 0,
            tax: 0,
            total: parseFloat(formData.get('amount') as string) || 0,
        };

        // Add to state
        setInvoices(prev => [newInvoice, ...prev]);
        setIsDialogOpen(false);

        // Show success message briefly
        setTimeout(() => {
            alert('Invoice created successfully!');
        }, 100);
    };

    const searchKey: string = ""; // Placeholder for search functionality
    const hasInvoices = invoices.length > 0;

    return (
        <DashboardShell>
            <PageHeader
                title="Bounty"
                description="Manage and track your invoices and payments."
                action={{
                    label: 'New Invoice',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => setIsDialogOpen(true)
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Payments' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Issue New Bounty</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Create and send a new invoice to your client.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateInvoice} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Name</Label>
                            <Input id="client" name="clientName" placeholder="Acme Corporation" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount ($)</Label>
                                <Input id="amount" name="amount" type="number" step="0.01" placeholder="500.00" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="due" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Due Date</Label>
                                <Input id="due" name="dueDate" type="date" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm invert" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Reference / Note</Label>
                            <Input id="note" name="description" placeholder="Web Design Project - Phase 1" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Create Invoice
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            ) : hasInvoices ? (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable
                            columns={columns}
                            data={invoices}
                            searchKey="clientName"
                        />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {invoices.filter(inv => !searchKey || inv.clientName.toLowerCase().includes(searchKey.toLowerCase())).map((invoice) => (
                            <Link
                                key={invoice.id}
                                href={`/payments/${invoice.id}`}
                                className="block"
                            >
                                <div className="bg-[#0a2c28] border border-white/5 rounded-2xl p-5 space-y-4 active:scale-95 transition-transform">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white text-lg">{invoice.clientName}</h3>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{invoice.invoiceNumber}</p>
                                        </div>
                                        <InvoiceStatusBadge status={invoice.status} />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Due Date</p>
                                            <p className="text-zinc-300 text-sm font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-white">{formatCurrency(invoice.total)}</span>
                                            <ChevronRight className="h-5 w-5 text-zinc-600" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {invoices.length === 0 && (
                            <p className="text-center text-zinc-500 py-8">No invoices found.</p>
                        )}
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={CreditCard}
                    title="No Bounty Yet"
                    description="You haven't issued any invoices yet. Start getting paid for your work by creating your first invoice."
                    actionLabel="Issue First Invoice"
                    onAction={() => setIsDialogOpen(true)}
                />
            )}
        </DashboardShell>
    );
}
