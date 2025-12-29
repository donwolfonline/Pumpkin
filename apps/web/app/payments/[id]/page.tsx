"use client"

import { use, useState, useEffect } from 'react';
import { DashboardShell } from '../../../components/dashboard-shell';
import { PageHeader } from '../../../components/shared/page-header';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { InvoiceStatusBadge } from '../../../components/shared/status-badge';
import { Download, Send, CheckCircle, ArrowLeft, Edit, Eye, Share2, QrCode, Copy, Check, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../../lib/utils';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import type { Invoice, InvoiceStatus, InvoiceHistoryEvent } from '../../../lib/types/invoice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { usePumpkinToast } from '../../../components/ui/pumpkin-toast';
import { Label } from '../../../components/ui/label';
import { generatePDF } from '../../../lib/pdf-generator';
import { InvoiceTemplate } from '../../../components/templates/invoice-template';
import { getOrganizationBranding, getInvoices, setInvoices } from '../../../lib/storage-utils';
import { OrganizationBranding } from '../../../lib/types/organization-settings';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding>(getOrganizationBranding());
    const [showPreview, setShowPreview] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Invoice>>({});
    const [isSending, setIsSending] = useState(false);
    const { toast } = usePumpkinToast();

    useEffect(() => {
        // Load invoice from storage util
        const invoices = getInvoices();
        const foundInvoice = invoices.find((inv: Invoice) => inv.id === id);
        setInvoice(foundInvoice || null);
        setBranding(getOrganizationBranding());
    }, [id]);

    const handleMarkAsPaid = () => {
        if (!invoice) return;

        const newStatus: InvoiceStatus = invoice.status === 'paid' ? 'pending' : 'paid';
        const updatedInvoice: Invoice = {
            ...invoice,
            status: newStatus,
            history: [{
                id: crypto.randomUUID(),
                action: 'paid',
                timestamp: new Date().toISOString(),
                details: `Invoice marked as ${newStatus}`,
                actor: 'User'
            } as InvoiceHistoryEvent, ...(invoice.history || [])]
        };

        // Update in storage
        const invoices = getInvoices();
        const index = invoices.findIndex((inv: Invoice) => inv.id === id);
        if (index !== -1) {
            invoices[index] = updatedInvoice;
            setInvoices(invoices);
            setInvoice(updatedInvoice);
            toast(`Invoice marked as ${newStatus}!`, 'success');
        }
    };

    const handleSendInvoice = async () => {
        if (!invoice) return;

        setIsSending(true);

        // Simulate network delay for email sending
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newHistoryItem: InvoiceHistoryEvent = {
            id: crypto.randomUUID(),
            action: 'sent',
            timestamp: new Date().toISOString(),
            details: `Invoice sent to ${invoice.clientEmail}`,
            actor: 'User'
        };

        const updatedInvoice: Invoice = {
            ...invoice,
            history: [newHistoryItem, ...(invoice.history || [])]
        };

        // Update storage
        const invoices = getInvoices();
        const index = invoices.findIndex((inv: Invoice) => inv.id === id);
        if (index !== -1) {
            invoices[index] = updatedInvoice;
            setInvoices(invoices);
            setInvoice(updatedInvoice);
        }

        setIsSending(false);
        toast(`Invoice sent successfully to ${invoice.clientEmail}`, 'success');
    };

    const handleDownloadPDF = async () => {
        if (!invoice) return;

        setIsGeneratingPDF(true);
        try {
            // Temporarily show the template if it's hidden to ensure it's in the DOM
            const wasShowing = showPreview;
            if (!wasShowing) setShowPreview(true);

            // Wait for render
            await new Promise(resolve => setTimeout(resolve, 100));

            await generatePDF('invoice-content', `invoice-${invoice.invoiceNumber}.pdf`);

            if (!wasShowing) setShowPreview(false);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            toast('Failed to generate PDF. Please try again.', 'error');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleCopyLink = () => {
        const shareUrl = `${window.location.origin}/pay/${id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleEditClick = () => {
        if (invoice) {
            setEditForm({
                clientName: invoice.clientName,
                clientEmail: invoice.clientEmail,
                total: invoice.total,
                subtotal: invoice.subtotal,
                taxRate: invoice.taxRate ?? 0,
                dueDate: invoice.dueDate,
                items: invoice.items,
            });
            setIsEditing(true);
        }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice) return;

        const currentTaxRate = editForm.taxRate !== undefined ? editForm.taxRate : (invoice.taxRate ?? 0);
        const subtotal = editForm.subtotal !== undefined ? editForm.subtotal : invoice.subtotal;
        const tax = subtotal * (currentTaxRate / 100);
        const total = subtotal + tax;

        // Ensure item amount syncs with subtotal (single item assumption for now)
        const currentItem = editForm.items?.[0] || invoice.items[0];
        const updatedItems = [{
            ...currentItem,
            rate: subtotal,
            amount: subtotal,
            description: currentItem?.description || 'Service',
        }];

        const updatedInvoice: Invoice = {
            ...invoice,
            ...editForm,
            items: updatedItems,
            subtotal: subtotal,
            taxRate: currentTaxRate,
            tax: tax,
            total: total,
            history: [{
                id: crypto.randomUUID(),
                action: 'updated',
                timestamp: new Date().toISOString(),
                details: 'Invoice details updated',
                actor: 'User'
            } as InvoiceHistoryEvent, ...(invoice.history || [])]
        } as Invoice;

        // Update in storage
        const invoices = getInvoices();
        const index = invoices.findIndex((inv: Invoice) => inv.id === id);
        if (index !== -1) {
            invoices[index] = updatedInvoice;
            setInvoices(invoices);
            setInvoice(updatedInvoice);
            setIsEditing(false);
            toast('Invoice updated successfully!', 'success');
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
                <div className="flex justify-between items-center">
                    <PageHeader
                        title={`Invoice ${invoice.invoiceNumber}`}
                        description="View and manage this invoice."
                        action={{
                            label: 'Edit Invoice',
                            icon: <Edit className="h-4 w-4" />,
                            onClick: handleEditClick
                        }}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="bg-[#0c2a27] border-white/5 rounded-xl h-9 px-4 text-xs font-bold uppercase tracking-widest"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        {showPreview ? 'Standard View' : 'Professional Preview'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {showPreview ? (
                        <div className="w-full border border-white/5 rounded-3xl bg-zinc-900 flex justify-center py-6 sm:py-10 px-4 overflow-hidden">
                            <div className="relative w-[320px] h-[440px] sm:w-[480px] h-[660px] md:w-[600px] h-[825px] lg:w-[800px] lg:h-[1100px] shrink-0">
                                <div className="absolute top-0 left-0 w-[800px] transform scale-[0.4] sm:scale-[0.6] md:scale-[0.75] lg:scale-100 origin-top-left transition-transform duration-300">
                                    <InvoiceTemplate invoice={invoice} branding={branding} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card className="bg-[#051c1c] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                            <CardHeader className="flex flex-row items-start justify-between p-8 border-b border-white/5">
                                <div>
                                    <CardTitle className="text-xl font-bold text-white">Invoice Details</CardTitle>
                                    <p className="text-sm text-zinc-500 mt-1">Issued on {new Date(invoice.issueDate).toLocaleDateString()}</p>
                                </div>
                                <InvoiceStatusBadge status={invoice.status} />
                            </CardHeader>
                            <CardContent className="space-y-8 p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-2">Billed To:</h4>
                                        <p className="text-lg font-bold text-white">{invoice.clientName}</p>
                                        {invoice.clientEmail && <p className="text-sm text-zinc-400">{invoice.clientEmail}</p>}
                                    </div>
                                    <div className="text-right">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-2">Due Date:</h4>
                                        <p className="text-lg font-bold text-white">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-2xl p-6">
                                    <div className="grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">
                                        <div className="col-span-8">Description</div>
                                        <div className="col-span-4 text-right">Amount</div>
                                    </div>
                                    <div className="space-y-4">
                                        {invoice.items.map((item, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-4 text-sm bg-black/10 p-4 rounded-xl items-center">
                                                <div className="col-span-8 font-bold text-white">{item.description}</div>
                                                <div className="col-span-4 text-right font-black text-[#ea580c]">{formatCurrency(item.amount)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <div className="w-full md:w-1/2 bg-[#ea580c] p-6 rounded-2xl flex justify-between items-center">
                                        <span className="text-xs font-black uppercase tracking-widest text-white">Total</span>
                                        <span className="text-lg sm:text-2xl font-black text-white">{formatCurrency(invoice.total)}</span>
                                    </div>
                                </div>

                                {invoice.notes && (
                                    <div className="bg-black/20 p-6 rounded-2xl text-sm border border-white/5">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ea580c] block mb-2">Notes:</span>
                                        <p className="text-zinc-400 leading-relaxed font-medium">{invoice.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-2" size="sm" onClick={() => setIsShareDialogOpen(true)}>
                                <Share2 className="h-3 w-3" /> Share Invoice
                            </Button>
                            <Button variant="outline" className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2" size="sm" onClick={handleSendInvoice} disabled={isSending}>
                                {isSending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                {isSending ? 'Sending...' : 'Send via Email'}
                            </Button>
                            <Button variant="outline" className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2" size="sm" onClick={handleMarkAsPaid}>
                                <CheckCircle className="h-3 w-3" /> {invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2"
                                size="sm"
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                            >
                                <Download className="h-3 w-3" /> {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(invoice.history || [
                                    { id: 'init', action: 'created', timestamp: invoice.issueDate, details: 'Invoice Created', actor: 'System' } as InvoiceHistoryEvent
                                ]).map((event: InvoiceHistoryEvent, i: number) => (
                                    <div key={i} className="flex gap-3 text-sm">
                                        <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${event.action === 'sent' ? 'bg-blue-500' :
                                            event.action === 'paid' ? 'bg-green-500' :
                                                'bg-zinc-500'
                                            }`} />
                                        <div>
                                            <p className="font-medium">
                                                {event.action === 'sent' ? 'Sent to Client' :
                                                    event.action === 'paid' ? 'Marked as Paid' :
                                                        event.action === 'created' ? 'Invoice Created' :
                                                            event.action === 'updated' ? 'Invoice Updated' : event.action}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {new Date(event.timestamp).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short'
                                                })}
                                            </p>
                                            {event.details && <p className="text-zinc-600 text-[10px] mt-0.5">{event.details}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="max-w-[95vw] sm:max-w-[500px] w-full bg-[#0c2a27] border-white/5 text-white rounded-2xl md:rounded-3xl backdrop-blur-2xl overflow-y-auto max-h-[90vh]">
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Subtotal ($)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={editForm.subtotal || ''}
                                    onChange={(e) => setEditForm({ ...editForm, subtotal: parseFloat(e.target.value) })}
                                    className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxRate" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Tax (%)</Label>
                                <Input
                                    id="taxRate"
                                    type="number"
                                    step="0.1"
                                    value={editForm.taxRate || ''}
                                    onChange={(e) => setEditForm({ ...editForm, taxRate: parseFloat(e.target.value) })}
                                    className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 opacity-50">Total Est.</Label>
                                <div className="h-11 flex items-center px-4 bg-black/40 border border-white/5 rounded-xl text-sm font-mono text-[#ea580c]">
                                    {formatCurrency((editForm.subtotal || 0) * (1 + (editForm.taxRate || 0) / 100))}
                                </div>
                            </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                            <Input
                                id="description"
                                value={editForm.items?.[0]?.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, items: [{ ...editForm.items?.[0], description: e.target.value, id: editForm.items?.[0]?.id || '', quantity: 1, rate: editForm.subtotal || 0, amount: editForm.subtotal || 0 }] })}
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

            {/* Share Dialog with QR Code */}
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-sm bg-[#0c2a27] border-white/5 text-white rounded-[2rem] backdrop-blur-3xl px-6 py-6 border shadow-2xl">
                    <DialogHeader className="pt-2">
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white text-center">Share Invoice</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[9px] text-center uppercase font-bold tracking-tight">
                            Secure payment link for your client
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center space-y-6">
                        {/* QR Code Section - Responsive Scaling */}
                        <div className="p-4 bg-white rounded-2xl shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ea580c]/10 to-transparent pointer-events-none"></div>
                            <QRCodeSVG
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/pay/${id}`}
                                size={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180}
                                level="H"
                                includeMargin={false}
                                className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Link Selection Area - Better Mobile Handling */}
                        <div className="w-full space-y-3">
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Payment Link</Label>
                                <div className="relative group">
                                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pr-12 min-h-[48px] flex items-center transition-all duration-300 group-hover:border-white/20">
                                        <span className="text-[10px] text-zinc-300 font-mono break-all leading-relaxed line-clamp-2">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/pay/{id}
                                        </span>
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={handleCopyLink}
                                        className={`absolute right-1.5 top-1.5 h-9 w-9 shrink-0 rounded-lg transition-all duration-300 shadow-lg ${copied ? 'bg-green-500 hover:bg-green-600 scale-95' : 'bg-[#ea580c] hover:bg-[#ea580c]/90'}`}
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>



                        <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex gap-3 items-start backdrop-blur-md">
                            <div className="h-4 w-4 rounded-full bg-[#ea580c]/20 flex items-center justify-center shrink-0 mt-0.5">
                                <QrCode className="h-2.5 w-2.5 text-[#ea580c]" />
                            </div>
                            <p className="text-[9px] text-zinc-400 leading-relaxed font-medium">
                                Secure direct payment link. Verify recipient before sharing.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardShell >
    );
}
