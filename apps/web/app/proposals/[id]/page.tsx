"use client"

import { use, useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Send, ArrowLeft, Edit, Eye, Loader2, FileSignature, Share2, QrCode, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { getProposals, setProposals, getOrganizationBranding, getContacts } from '@/lib/storage-utils';
import { Proposal } from '@/lib/types/proposal';
import { generatePDF } from '@/lib/pdf-generator';
import { ProposalTemplate } from '@/components/templates/proposal-template';
import { OrganizationBranding } from '@/lib/types/organization-settings';
import { Contact } from '@/lib/types/crm';
import { formatCurrency } from '@/lib/utils';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';

export default function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding>(getOrganizationBranding());
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        content: '',
        totalAmount: 0,
        clientId: ''
    });

    const { toast } = usePumpkinToast();

    useEffect(() => {
        const foundProposal = getProposals().find(p => p.id === id);
        if (foundProposal) {
            setProposal(foundProposal);
            setEditData({
                title: foundProposal.title,
                content: (foundProposal.content as string) || '',
                totalAmount: foundProposal.totalAmount || 0,
                clientId: foundProposal.clientId || ''
            });
        }
        setBranding(getOrganizationBranding());
        setContacts(getContacts());
        setIsLoading(false);
    }, [id]);

    const handleSaveEdit = () => {
        if (!proposal) return;

        const client = contacts.find(c => c.id === editData.clientId);

        const updatedProposal: Proposal = {
            ...proposal,
            title: editData.title,
            content: editData.content,
            totalAmount: editData.totalAmount,
            clientId: editData.clientId,
            clientName: client ? (client.name || `${client.firstName} ${client.lastName}`.trim()) : (proposal.clientName || 'Unknown Client')
        };

        const allProposals = getProposals();
        const updatedProposals = allProposals.map(p => p.id === id ? updatedProposal : p);

        setProposals(updatedProposals);
        setProposal(updatedProposal);
        setIsEditModalOpen(false);
        toast('Proposal updated!', 'success');
    };

    const handleDownloadPDF = async () => {
        if (!proposal) return;

        setIsGeneratingPDF(true);
        try {
            const wasShowing = showPreview;
            if (!wasShowing) setShowPreview(true);

            await new Promise(resolve => setTimeout(resolve, 100));
            await generatePDF('proposal-content', `proposal-${proposal.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);

            if (!wasShowing) setShowPreview(false);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleSignAsProvider = () => {
        if (!proposal) return;

        const newSignature = {
            party: 'provider' as const,
            name: branding.companyName,
            signedAt: new Date().toISOString()
        };

        const updatedProposal: Proposal = {
            ...proposal,
            status: 'pending_signatures',
            signatures: [...(proposal.signatures || []).filter((s: { party: string }) => s.party !== 'provider'), newSignature],
            updatedAt: new Date().toISOString()
        };

        const allProposals = getProposals();
        const updatedList = allProposals.map(p => p.id === id ? updatedProposal : p);
        setProposals(updatedList);
        setProposal(updatedProposal);

        toast('Proposal signed successfully!', 'success');
    };

    const handleCopyLink = () => {
        const shareUrl = `${window.location.origin}/sign-proposal/${id}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast('Link copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            </DashboardShell>
        );
    }

    if (!proposal) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center h-64">
                    <h2 className="text-xl font-bold mb-4">Proposal not found</h2>
                    <Button asChild>
                        <Link href="/proposals">Back to Proposals</Link>
                    </Button>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mb-8">
                <Link href="/proposals" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Proposals
                </Link>
                <PageHeader
                    title={proposal.title}
                    description={`Created on ${new Date(proposal.createdAt || '').toLocaleDateString()}`}
                    action={{
                        label: showPreview ? 'Standard View' : 'Professional Preview',
                        icon: <Eye className="h-4 w-4" />,
                        onClick: () => setShowPreview(!showPreview)
                    }}
                />

                <div className="flex flex-wrap gap-3 -mt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isGeneratingPDF}
                        onClick={handleDownloadPDF}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 px-6 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white"
                    >
                        {isGeneratingPDF ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Signature Status Card */}
            <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl mb-6">
                <CardHeader className="p-6">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Signature Status</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl">
                        {proposal.signatures?.some((s: { party: string }) => s.party === 'provider') ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-zinc-600" />
                        )}
                        <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase">Service Provider</p>
                            <p className="text-sm text-white">{proposal.signatures?.some((s: { party: string }) => s.party === 'provider') ? 'Signed' : 'Pending'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-black/20 rounded-xl">
                        {proposal.signatures?.some((s: { party: string }) => s.party === 'client') ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-zinc-600" />
                        )}
                        <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase">Client</p>
                            <p className="text-sm text-white">{proposal.signatures?.some((s: { party: string }) => s.party === 'client') ? proposal.signatures?.find((s: { party: string; name?: string }) => s.party === 'client')?.name || 'Signed' : 'Pending'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    {showPreview ? (
                        <div className="w-full border border-white/5 rounded-3xl bg-zinc-900 flex justify-center py-6 sm:py-10 px-2 sm:px-4 overflow-hidden overflow-x-auto custom-scrollbar">
                            <div className="relative w-[300px] h-[410px] sm:w-[480px] h-[660px] md:w-[600px] h-[825px] lg:w-[800px] lg:h-[1100px] shrink-0">
                                <div className="absolute top-0 left-0 w-[800px] transform scale-[0.375] sm:scale-[0.6] md:scale-[0.75] lg:scale-100 origin-top-left transition-transform duration-300">
                                    <ProposalTemplate proposal={proposal} branding={branding} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card className="bg-[#051c1c] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Proposal Overview</p>
                                    <CardTitle className="text-xl font-bold text-white">{proposal.title}</CardTitle>
                                </div>
                                <Badge variant="default" className="rounded-full uppercase text-[8px] font-black px-3 py-1 bg-white/5 border-white/10 text-zinc-400">
                                    {proposal.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="prose prose-invert max-w-none px-2">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-4">Project Scope</h4>
                                    <div className="text-zinc-400 font-medium leading-relaxed">
                                        {typeof proposal.content === 'string' ? proposal.content : 'No detailed content provided.'}
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-end">
                                    <div className="w-full sm:w-2/3 md:w-1/2 bg-[#ea580c] p-6 rounded-2xl flex justify-between items-center shadow-xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Investment</span>
                                        <span className="text-xl sm:text-2xl font-black text-white">{formatCurrency(proposal.totalAmount || 0)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Proposal Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 grid gap-3">
                            {!proposal.signatures?.some((s: { party: string }) => s.party === 'provider') && (
                                <Button
                                    onClick={handleSignAsProvider}
                                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
                                >
                                    <FileSignature className="h-3 w-3" />
                                    Sign as Provider
                                </Button>
                            )}
                            {proposal.signatures?.some((s: { party: string }) => s.party === 'provider') && (
                                <Button
                                    onClick={() => setIsShareDialogOpen(true)}
                                    className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
                                >
                                    <Share2 className="h-3 w-3" />
                                    Share Proposal
                                </Button>
                            )}
                            <Button className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2">
                                <Send className="h-3 w-3" />
                                Send to Client
                            </Button>
                            <Button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2"
                            >
                                <Edit className="h-3 w-3" />
                                Edit Content
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Client Info</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full text-left bg-black/20 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1 group-hover:text-[#ea580c] transition-colors">Company</p>
                                <p className="text-sm font-bold text-white uppercase italic">{proposal.clientName || 'Needs selection'}</p>
                            </button>
                            <div className="bg-black/20 p-4 rounded-xl">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</p>
                                <p className="text-sm font-bold text-white uppercase italic">{proposal.status}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Proposal Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] overflow-y-auto bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Edit Proposal Content</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Refine the project scope and investment details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-6 border-y border-white/5 my-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Proposal Title</Label>
                            <Input
                                value={editData.title}
                                onChange={e => setEditData({ ...editData, title: e.target.value })}
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Total Investment ($)</Label>
                            <Input
                                type="number"
                                value={editData.totalAmount}
                                onChange={e => setEditData({ ...editData, totalAmount: parseFloat(e.target.value) || 0 })}
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Associate Client</Label>
                            <select
                                value={editData.clientId}
                                onChange={e => setEditData({ ...editData, clientId: e.target.value })}
                                className="w-full bg-black/20 border border-white/5 rounded-xl h-11 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                            >
                                <option value="" disabled className="bg-[#0c2a27]">Select a client...</option>
                                {contacts.map(contact => (
                                    <option key={contact.id} value={contact.id} className="bg-[#0c2a27]">
                                        {contact.name || `${contact.firstName} ${contact.lastName}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Project Scope / Details</Label>
                            <Textarea
                                value={editData.content}
                                onChange={e => setEditData({ ...editData, content: e.target.value })}
                                className="min-h-[250px] bg-black/20 border-white/5 rounded-2xl p-6 text-sm leading-relaxed"
                                placeholder="Describe the scope of work..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveEdit} className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Update Proposal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Share Dialog with QR Code */}
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[90vw] max-w-sm bg-[#0c2a27] border-white/5 text-white rounded-[2rem] backdrop-blur-3xl px-6 py-6 border shadow-2xl">
                    <DialogHeader className="pt-2">
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white text-center">Share Proposal</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[9px] text-center uppercase font-bold tracking-tight">
                            Secure access for your client
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center space-y-6">
                        {/* QR Code Section - Responsive Scaling */}
                        <div className="p-4 bg-white rounded-2xl shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none"></div>
                            <QRCodeSVG
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sign-proposal/${id}`}
                                size={typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180}
                                level="H"
                                includeMargin={false}
                                className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Link Selection Area - Better Mobile Handling */}
                        <div className="w-full space-y-3">
                            <div className="flex flex-col space-y-1.5">
                                <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Access Link</Label>
                                <div className="relative group">
                                    <div className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pr-12 min-h-[48px] flex items-center transition-all duration-300 group-hover:border-white/20">
                                        <span className="text-[10px] text-zinc-300 font-mono break-all leading-relaxed line-clamp-2">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/sign-proposal/{id}
                                        </span>
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={handleCopyLink}
                                        className={`absolute right-1.5 top-1.5 h-9 w-9 shrink-0 rounded-lg transition-all duration-300 shadow-lg ${copied ? 'bg-green-500 hover:bg-green-600 scale-95' : 'bg-primary hover:bg-primary/90'}`}
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex gap-3 items-start backdrop-blur-md">
                            <div className="h-4 w-4 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <QrCode className="h-2.5 w-2.5 text-orange-400" />
                            </div>
                            <p className="text-[9px] text-zinc-400 leading-relaxed font-medium">
                                Secure signing portal link. Verify recipient before sharing.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardShell >
    );
}
