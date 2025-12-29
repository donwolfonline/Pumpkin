"use client"

import { use, useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, FileSignature, ArrowLeft, Eye, Loader2, Calendar, Shield, Share2, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { Contract } from '@/lib/types/contract';
import { getContracts, getOrganizationBranding } from '@/lib/storage-utils';
import { generatePDF } from '@/lib/pdf-generator';
import { ContractTemplate } from '@/components/templates/contract-template';
import { OrganizationBranding } from '@/lib/types/organization-settings';
import { formatCurrency } from '@/lib/utils';
import { setContracts } from '@/lib/storage-utils';
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

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [contract, setContract] = useState<Contract | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding>(getOrganizationBranding());
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Feature modals
    const [isEditTermsOpen, setIsEditTermsOpen] = useState(false);
    const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
    const [isSignDialogOpen, setIsSignDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [termsText, setTermsText] = useState('');
    const [signatureName, setSignatureName] = useState('');
    const [hasCopied, setHasCopied] = useState(false);

    const { toast } = usePumpkinToast();

    useEffect(() => {
        const foundContract = getContracts().find(c => c.id === id);
        if (foundContract) {
            setContract(foundContract);
            setTermsText(foundContract.terms || '');
        }
        setBranding(getOrganizationBranding());
        setIsLoading(false);
    }, [id]);

    const updateContractInStorage = (updatedContract: Contract) => {
        const allContracts = getContracts();
        const updatedContracts = allContracts.map(c => c.id === id ? updatedContract : c);
        setContracts(updatedContracts);
        setContract(updatedContract);
    };

    const handleSaveTerms = () => {
        if (!contract) return;
        const updated = { ...contract, terms: termsText, updatedAt: new Date().toISOString() };
        updateContractInStorage(updated);
        setIsEditTermsOpen(false);
        toast('Contract terms updated.', 'success');
    };

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const description = formData.get('description') as string;
        const amount = parseFloat(formData.get('amount') as string) || 0;
        const dueDate = formData.get('dueDate') as string;

        const newMilestone = {
            id: crypto.randomUUID(),
            description,
            amount,
            dueDate,
            status: 'pending' as const
        };

        const updated = {
            ...contract,
            paymentSchedule: [...(contract.paymentSchedule || []), newMilestone],
            updatedAt: new Date().toISOString()
        };

        updateContractInStorage(updated);
        setIsAddMilestoneOpen(false);
        toast('Milestone added to schedule.', 'success');
    };

    const handleSignContract = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contract) return;

        const providerSignature = {
            party: 'company' as const,
            name: signatureName,
            signedAt: new Date().toISOString()
        };

        const updated = {
            ...contract,
            status: contract.status === 'draft' ? 'pending' : (contract.status as string),
            signatures: [...(contract.signatures || []).filter((s: { party: string }) => s.party !== 'company'), providerSignature],
            updatedAt: new Date().toISOString()
        };

        // @ts-expect-error - status type conversion
        updateContractInStorage(updated as any);
        setIsSignDialogOpen(false);
        toast('Contract signed successfully!', 'success');
    };

    const handleDownloadPDF = async () => {
        if (!contract) return;

        setIsGeneratingPDF(true);
        try {
            const wasShowing = showPreview;
            if (!wasShowing) setShowPreview(true);

            await new Promise(resolve => setTimeout(resolve, 100));
            await generatePDF('contract-content', `contract-${contract.contractNumber.toLowerCase()}.pdf`);

            if (!wasShowing) setShowPreview(false);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/sign/${id}`;
        navigator.clipboard.writeText(url);
        setHasCopied(true);
        toast('Link copied to clipboard!', 'success');
        setTimeout(() => setHasCopied(false), 2000);
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

    if (!contract) {
        return (
            <DashboardShell>
                <div className="flex flex-col items-center justify-center h-64">
                    <h2 className="text-xl font-bold mb-4">Contract not found</h2>
                    <Button asChild>
                        <Link href="/contracts">Back to Contracts</Link>
                    </Button>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mb-8">
                <Link href="/contracts" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Contracts
                </Link>
                <PageHeader
                    title={contract.title}
                    description={`Ref: ${contract.contractNumber}`}
                    action={{
                        label: showPreview ? 'Standard View' : 'Professional Preview',
                        icon: <Eye className="h-4 w-4" />,
                        onClick: () => setShowPreview(!showPreview)
                    }}
                />

                {/* Secondary Actions for Mobile/Desktop */}
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
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsShareDialogOpen(true)}
                        className="bg-white/5 border border-white/10 rounded-xl h-10 px-6 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white"
                    >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Agreement
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    {showPreview ? (
                        <div className="w-full border border-white/5 rounded-3xl bg-zinc-900 flex justify-center py-6 sm:py-10 px-2 sm:px-4 overflow-hidden overflow-x-auto custom-scrollbar">
                            <div className="relative w-[300px] h-[410px] sm:w-[480px] h-[660px] md:w-[600px] h-[825px] lg:w-[800px] lg:h-[1100px] shrink-0">
                                <div className="absolute top-0 left-0 w-[800px] transform scale-[0.375] sm:scale-[0.6] md:scale-[0.75] lg:scale-100 origin-top-left transition-transform duration-300">
                                    <ContractTemplate contract={contract} branding={branding} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card className="bg-[#051c1c] border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Contract Agreement</p>
                                    <CardTitle className="text-xl font-bold text-white">{contract.title}</CardTitle>
                                </div>
                                <Badge variant="default" className="rounded-full uppercase text-[8px] font-black px-3 py-1 bg-white/5 border-white/10 text-zinc-400">
                                    {contract.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-4">Agreement Dates</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-zinc-500" />
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Effective Date</p>
                                                    <p className="text-sm font-bold text-white uppercase">{new Date(contract.startDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="h-4 w-4 text-zinc-500" />
                                                <div>
                                                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">End Date</p>
                                                    <p className="text-sm font-bold text-white uppercase">{new Date(contract.endDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-4">Financial Value</h4>
                                        <div className="flex flex-col justify-center h-full pb-4">
                                            <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Contract Value</p>
                                            <p className="text-3xl font-black text-white">{formatCurrency(contract.totalValue || 0)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c] mb-4">Master Terms</h4>
                                    <div className="text-zinc-400 font-medium leading-relaxed text-sm whitespace-pre-wrap">
                                        {contract.terms || 'No terms specified.'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Signatures</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Service Provider</p>
                                {(() => {
                                    const sig = contract.signatures?.find((s: { party: string }) => s.party === 'company');
                                    if (sig) {
                                        return (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-white italic tracking-widest">{sig.name}</p>
                                                {/* @ts-ignore - signedAt exists on signature */}
                                                <p className="text-[8px] text-zinc-500 font-bold uppercase">Signed on {new Date(sig.signedAt!).toLocaleDateString()}</p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="h-10 flex items-center justify-center border border-dashed border-white/10 rounded-lg text-[8px] font-bold uppercase text-zinc-600">
                                            Pending Digital Signature
                                        </div>
                                    );
                                })()}
                            </div>
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Client Signature</p>
                                {(() => {
                                    const sig = contract.signatures?.find((s: { party: string }) => s.party === 'client');
                                    if (sig) {
                                        return (
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-white italic tracking-widest">{sig.name}</p>
                                                {/* @ts-ignore - signedAt exists on signature */}
                                                <p className="text-[8px] text-zinc-500 font-bold uppercase">Signed on {new Date(sig.signedAt!).toLocaleDateString()}</p>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="h-10 flex items-center justify-center border border-dashed border-white/10 rounded-lg text-[8px] font-bold uppercase text-zinc-600">
                                            Waiting for Client
                                        </div>
                                    );
                                })()}
                            </div>
                            <Button
                                onClick={() => setIsSignDialogOpen(true)}
                                disabled={contract.signatures?.some((s: { party: string }) => s.party === 'company')}
                                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px] gap-2 mt-2"
                            >
                                <FileSignature className="h-3 w-3" />
                                {contract.signatures?.some((s: { party: string }) => s.party === 'company') ? 'Already Signed' : 'Sign Now'}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Contract Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 grid gap-3">
                            <Button
                                onClick={() => setIsEditTermsOpen(true)}
                                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px]"
                            >
                                Edit Terms
                            </Button>
                            <Button
                                onClick={() => setIsAddMilestoneOpen(true)}
                                className="w-full h-11 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold uppercase tracking-widest text-[9px]"
                            >
                                Add Milestone
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Milestones List */}
                    {contract.paymentSchedule && contract.paymentSchedule.length > 0 && (
                        <Card className="bg-[#051c1c] border-white/5 rounded-3xl shadow-xl">
                            <CardHeader className="p-6">
                                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-[#ea580c]">Payment Milestones</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-3">
                                {contract.paymentSchedule.map((m: any) => (
                                    <div key={m.id} className="bg-black/20 p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white">{m.description}</p>
                                            <p className="text-[10px] font-black text-[#ea580c]">{formatCurrency(m.amount)}</p>
                                        </div>
                                        <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                                            Due: {new Date(m.dueDate).toLocaleDateString()} • {m.status}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modals */}
            <Dialog open={isEditTermsOpen} onOpenChange={setIsEditTermsOpen}>
                <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[90vh] flex flex-col bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl px-4 sm:px-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Edit Master Terms</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Define the specific legal terms and conditions for this agreement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            value={termsText}
                            onChange={(e) => setTermsText(e.target.value)}
                            className="min-h-[400px] bg-black/20 border-white/5 rounded-2xl p-6 text-sm leading-relaxed"
                            placeholder="Type contract terms here..."
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveTerms} className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Update Terms
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Add Payment Milestone</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Set a payment trigger based on a project milestone.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMilestone} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Milestone Description</Label>
                            <Input name="description" placeholder="Project Initiation / Halfway Point" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount ($)</Label>
                                <Input name="amount" type="number" step="0.01" placeholder="2500.00" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Target Date</Label>
                                <Input name="dueDate" type="date" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Add to Schedule
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl px-4 sm:px-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Digital Signature</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Please provide your legal name to digitally sign this agreement as the Service Provider.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSignContract} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sigName" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Legal Name</Label>
                            <Input
                                id="sigName"
                                value={signatureName}
                                onChange={(e) => setSignatureName(e.target.value)}
                                placeholder="Your Full Name"
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm italic font-medium"
                                required
                            />
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Signature Preview</p>
                            <p className="text-lg font-black text-white italic tracking-widest h-8">{signatureName || '...'}</p>
                        </div>
                        <div className="flex gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <Shield className="h-4 w-4 text-orange-500 shrink-0" />
                            <p className="text-[9px] text-orange-200/60 leading-tight">
                                By signing, you agree that this digital signature is as legally binding as a handwritten one.
                            </p>
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Confirm Signature
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl px-4 sm:px-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Digital Signature</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Please provide your legal name to digitally sign this agreement as the Service Provider.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSignContract} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sigName" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Legal Name</Label>
                            <Input
                                id="sigName"
                                value={signatureName}
                                onChange={(e) => setSignatureName(e.target.value)}
                                placeholder="Your Full Name"
                                className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm italic font-medium"
                                required
                            />
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Signature Preview</p>
                            <p className="text-lg font-black text-white italic tracking-widest h-8">{signatureName || '...'}</p>
                        </div>
                        <div className="flex gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                            <Shield className="h-4 w-4 text-orange-500 shrink-0" />
                            <p className="text-[9px] text-orange-200/60 leading-tight">
                                By signing, you agree that this digital signature is as legally binding as a handwritten one.
                            </p>
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Confirm Signature
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
                <DialogContent className="sm:max-w-[425px] w-[95vw] bg-[#0c2a27] border-white/5 text-white rounded-[2.5rem] backdrop-blur-3xl px-4 sm:px-8 border shadow-2xl">
                    <DialogHeader className="pt-4">
                        <DialogTitle className="font-heading uppercase tracking-widest text-base text-white text-center">Share Agreement</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px] text-center uppercase font-bold tracking-tight">
                            Secure access for your client
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 flex flex-col items-center space-y-8">
                        {/* QR Code Section - Responsive Scaling */}
                        <div className="p-4 sm:p-6 bg-white rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none"></div>
                            <QRCodeSVG
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sign/${id}`}
                                size={typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 200}
                                level="H"
                                includeMargin={false}
                                className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Link Selection Area - Better Mobile Handling */}
                        <div className="w-full space-y-4">
                            <div className="flex flex-col space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client Access Link</Label>
                                <div className="relative group">
                                    <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-14 min-h-[56px] flex items-center transition-all duration-300 group-hover:border-white/20">
                                        <span className="text-[11px] text-zinc-300 font-mono break-all leading-relaxed">
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/sign/{id}
                                        </span>
                                    </div>
                                    <Button
                                        size="icon"
                                        onClick={handleCopyLink}
                                        className={`absolute right-2 top-2 h-10 w-10 shrink-0 rounded-xl transition-all duration-300 shadow-lg ${hasCopied ? 'bg-green-500 hover:bg-green-600 scale-95' : 'bg-primary hover:bg-primary/90'}`}
                                    >
                                        {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-3 items-start backdrop-blur-md">
                            <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                <Shield className="h-3 w-3 text-orange-400" />
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal font-medium">
                                This secure link provides direct access to the signing portal. Please verify the recipient before sharing.
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
