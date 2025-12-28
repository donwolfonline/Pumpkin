"use client"

import { use, useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceStatusBadge } from '@/components/shared/status-badge';
import { Separator } from '@/components/ui/separator';
import { Download, Send, CheckCircle, ArrowLeft, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import type { Invoice } from '@/lib/types/invoice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generatePDF } from '@/lib/pdf-generator';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Invoice>>({});

    useEffect(() => {
        // Load invoice from localStorage
        const savedInvoices = localStorage.getItem('pumpkin_invoices');
        if (savedInvoices) {
            try {
                const invoices = JSON.parse(savedInvoices);
                const foundInvoice = invoices.find((inv: Invoice) => inv.id === id);
                setInvoice(foundInvoice || null);
            } catch (error) {
                console.error('Failed to load invoice:', error);
            }
        }
        setIsLoading(false);
    }, [id]);

    const handleMarkAsPaid = () => {
        if (!invoice) return;

        const newStatus = invoice.status === 'paid' ? 'pending' : 'paid';
        const updatedInvoice = { ...invoice, status: newStatus };

        // Update in localStorage
        const savedInvoices = localStorage.getItem('pumpkin_invoices');
        if (savedInvoices) {
            const invoices = JSON.parse(savedInvoices);
            const index = invoices.findIndex((inv: Invoice) => inv.id === id);
            if (index !== -1) {
                invoices[index] = updatedInvoice;
                localStorage.setItem('pumpkin_invoices', JSON.stringify(invoices));
                setInvoice(updatedInvoice);
                alert(`Invoice marked as ${newStatus}!`);
            }
        }
    };

    const handleSendInvoice = () => {
        alert(`Invoice will be sent to ${invoice?.clientEmail || 'client'}. (Email functionality coming soon!)`);
    };

    const handleDownloadPDF = async () => {
        if (!invoice) return;

        setIsGeneratingPDF(true);
        try {
            await generatePDF('invoice-content', `invoice-${invoice.invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleEditClick = () => {
        if (invoice) {
            setEditForm({
                clientName: invoice.clientName,
                clientEmail: invoice.clientEmail,
                total: invoice.total,
                dueDate: invoice.dueDate,
                items: invoice.items,
            });
            setIsEditing(true);
        }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice) return;

        const newTotal = editForm.total !== undefined ? editForm.total : invoice.total;

        // Ensure item amount syncs with total (single item assumption for now)
        const currentItem = editForm.items?.[0] || invoice.items[0];
        const updatedItems = [{
            ...currentItem,
            rate: newTotal,
            amount: newTotal,
            description: currentItem?.description || 'Service',
        }];

        const updatedInvoice = {
            ...invoice,
            ...editForm,
            items: updatedItems,
            subtotal: newTotal,
            total: newTotal,
        };

        // Update in localStorage
        const savedInvoices = localStorage.getItem('pumpkin_invoices');
        if (savedInvoices) {
            const invoices = JSON.parse(savedInvoices);
            const index = invoices.findIndex((inv: Invoice) => inv.id === id);
            if (index !== -1) {
                invoices[index] = updatedInvoice;
                localStorage.setItem('pumpkin_invoices', JSON.stringify(invoices));
                setInvoice(updatedInvoice);
                setIsEditing(false);
                alert('Invoice updated successfully!');
            }
        }
    };

    if (!invoice) {
        return (
            <DashboardShell>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-xl font-bold mb-2">Invoice not found</p>
                        <Link href="/payments" className="text-primary hover:underline">
                            ← Back to Invoices
                        </Link>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mb-6">
                <Link href="/payments" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Invoices
                </Link>
                <PageHeader
                    title={`Invoice ${invoice.invoiceNumber}`}
                    description="View and manage this invoice."
                    action={{
                        label: 'Edit Invoice',
                        icon: <Edit className="h-4 w-4" />,
                        onClick: handleEditClick
                    }}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card id="invoice-content" className="bg-[#051c1c]">
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">Invoice Details</CardTitle>
                                <p className="text-sm text-muted-foreground">Issued on {new Date(invoice.issueDate).toLocaleDateString()}</p>
                            </div>
                            <InvoiceStatusBadge status={invoice.status} />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Billed To:</h4>
                                    <p className="text-sm">{invoice.clientName}</p>
                                    {invoice.clientEmail && <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>}
                                </div>
                                <div className="text-right">
                                    <h4 className="text-sm font-semibold mb-1">Due Date:</h4>
                                    <p className="text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground mb-4">
                                    <div className="col-span-8">Description</div>
                                    <div className="col-span-4 text-right">Amount</div>
                                </div>
                                <div className="space-y-3">
                                    {invoice.items.map((item: any, i: number) => (
                                        <div key={i} className="grid grid-cols-12 gap-4 text-sm">
                                            <div className="col-span-8 font-medium">{item.description}</div>
                                            <div className="col-span-4 text-right font-medium">{formatCurrency(item.amount)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <div className="w-1/2 space-y-2">
                                    <div className="flex justify-between text-base font-bold">
                                        <span>Total</span>
                                        <span>{formatCurrency(invoice.total)}</span>
                                    </div>
                                </div>
                            </div>

                            {invoice.notes && (
                                <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
                                    <span className="font-semibold block mb-1 text-foreground">Notes:</span>
                                    {invoice.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="w-full justify-start" size="sm" onClick={handleSendInvoice}>
                                <Send className="mr-2 h-4 w-4" /> Send Invoice
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleMarkAsPaid}>
                                <CheckCircle className="mr-2 h-4 w-4" /> {invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                            </Button>
                            <Button variant="outline" className="w-full justify-start" size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                                <Download className="mr-2 h-4 w-4" /> {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <div>
                                        <p className="font-medium">Invoice Created</p>
                                        <p className="text-muted-foreground text-xs">Nov 1, 2023 at 10:00 AM</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-muted-foreground shrink-0" />
                                    <div>
                                        <p className="font-medium">Sent to Client</p>
                                        <p className="text-muted-foreground text-xs">Nov 1, 2023 at 10:05 AM</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[500px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Edit Invoice</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Update the invoice details below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="clientName" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Name</Label>
                            <Input
                                id="clientName"
                                value={editForm.clientName || ''}
                                onChange={(e) => setEditForm({ ...editForm, clientName: e.target.value })}
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="clientEmail" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Email</Label>
                            <Input
                                id="clientEmail"
                                type="email"
                                value={editForm.clientEmail || ''}
                                onChange={(e) => setEditForm({ ...editForm, clientEmail: e.target.value })}
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={editForm.total || ''}
                                    onChange={(e) => setEditForm({ ...editForm, total: parseFloat(e.target.value) })}
                                    className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={editForm.dueDate?.split('T')[0] || ''}
                                    onChange={(e) => setEditForm({ ...editForm, dueDate: new Date(e.target.value).toISOString() })}
                                    className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm invert"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                            <Input
                                id="description"
                                value={editForm.items?.[0]?.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, items: [{ ...editForm.items?.[0], description: e.target.value, id: editForm.items?.[0]?.id || '', quantity: 1, rate: editForm.total || 0, amount: editForm.total || 0 }] })}
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1 h-11 rounded-xl border-white/10 hover:bg-white/5">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
