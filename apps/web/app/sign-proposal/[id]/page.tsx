"use client"

import React, { useState, useEffect, use } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, Loader2, FileText, AlertCircle, Download } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { getProposalPublicly, updateProposalByKey, getOrganizationBranding } from '@/lib/storage-utils';
import { Proposal } from '@/lib/types/proposal';
import { formatCurrency } from '@/lib/utils';
import { OrganizationBranding } from '@/lib/types/organization-settings';
import { generatePDF } from '@/lib/pdf-generator';
import { ProposalTemplate } from '@/components/templates/proposal-template';

type SigningStep = 'review' | 'sign' | 'success';

export default function SignProposalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { toast } = usePumpkinToast();

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding | null>(null);
    const [storageKey, setStorageKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<SigningStep>('review');
    const [clientSignature, setClientSignature] = useState('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        const loadProposal = () => {
            const data = getProposalPublicly(id);
            if (data) {
                setProposal(data.proposal);
                setStorageKey(data.storageKey);

                // Use the snapshot from the proposal if it exists, otherwise get from local storage
                const brandingData = data.proposal.brandingSnapshot || getOrganizationBranding();
                setBranding(brandingData);

                // Check if already signed
                const isAlreadySigned = data.proposal.status === 'signed';
                const hasClientSignature = data.proposal.signatures?.some((s: { party: string }) => s.party === 'client');

                if (isAlreadySigned && hasClientSignature) {
                    setStep('success');
                    const clientSig = data.proposal.signatures?.find((s: { party: string; name?: string }) => s.party === 'client');
                    if (clientSig?.name) {
                        setClientSignature(clientSig.name);
                    }
                }
            }
            setIsLoading(false);
        };
        loadProposal();
    }, [id]);

    const handleSign = () => {
        if (!clientSignature.trim()) {
            toast("Please enter your name", "error");
            return;
        }

        if (proposal && storageKey) {
            const newSignature = {
                party: 'client' as const,
                name: clientSignature,
                signedAt: new Date().toISOString()
            };

            const updatedProposal: Proposal = {
                ...proposal,
                status: 'signed',
                signatures: [...(proposal.signatures || []).filter((s: { party: string }) => s.party !== 'client'), newSignature],
                updatedAt: new Date().toISOString()
            };

            updateProposalByKey(storageKey, updatedProposal);
            setProposal(updatedProposal);
            setStep('success');
            toast("Proposal signed successfully!", "success");
        }
    };

    const handleDownloadPDF = async () => {
        if (!proposal) return;
        setIsGeneratingPDF(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Allow render
            await generatePDF('signed-proposal-download', `proposal-${proposal.id.slice(0, 8)}.pdf`);
            toast("PDF downloaded successfully", "success");
        } catch (error) {
            console.error(error);
            toast("Failed to generate PDF", "error");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex items-center justify-center p-4">
                <Card className="max-w-md w-full p-8 bg-black/20 border-white/5 text-center space-y-4">
                    <AlertCircle className="h-16 w-16 text-orange-500 mx-auto" />
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Proposal Not Found</h2>
                    <p className="text-sm text-zinc-500">This proposal link may be invalid or expired.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051c1c] relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2e2a] via-[#051c1c] to-black opacity-90" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            {/* Header */}
            <div className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
                    <Logo />
                    <div className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest">Proposal Signing</div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
                {/* Review Step */}
                {step === 'review' && (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
                        <div className="text-center space-y-3">
                            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">
                                Review Proposal
                            </h1>
                            <p className="text-sm sm:text-base text-zinc-500 uppercase tracking-widest font-bold">
                                {proposal.title}
                            </p>
                        </div>

                        <Card className="bg-black/20 border-white/5 p-6 sm:p-8 space-y-6 rounded-3xl shadow-2xl">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">For</p>
                                    <p className="text-lg font-bold text-white">{proposal.clientName}</p>
                                </div>

                                {proposal.totalAmount && (
                                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Investment</p>
                                        <p className="text-3xl font-black text-primary">{formatCurrency(proposal.totalAmount)}</p>
                                    </div>
                                )}

                                {typeof proposal.content === 'string' && (
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Project Scope</p>
                                        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{proposal.content}</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={() => setStep('sign')}
                                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs"
                            >
                                <FileText className="mr-2 h-4 w-4" /> Proceed to Sign
                            </Button>
                        </Card>
                    </div>
                )}

                {/* Sign Step */}
                {step === 'sign' && (
                    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
                        <div className="text-center space-y-3">
                            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">
                                Sign Proposal
                            </h1>
                            <p className="text-sm sm:text-base text-zinc-500 uppercase tracking-widest font-bold">
                                {proposal.title}
                            </p>
                        </div>

                        <Card className="bg-black/20 border-white/5 p-6 sm:p-8 space-y-6 rounded-3xl shadow-2xl">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                    Your Full Name
                                </Label>
                                <Input
                                    value={clientSignature}
                                    onChange={(e) => setClientSignature(e.target.value)}
                                    placeholder="John Doe"
                                    className="bg-black/40 border-white/10 rounded-xl h-14 text-lg"
                                />
                                <p className="text-xs text-zinc-600">
                                    By signing, you agree to the proposal terms and conditions.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep('review')}
                                    variant="ghost"
                                    className="flex-1 h-14 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSign}
                                    className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs"
                                >
                                    <Check className="mr-2 h-4 w-4" /> Sign Proposal
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                    <div className="max-w-xl mx-auto py-12 sm:py-24 flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-700">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40 relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                            <Check className="h-12 w-12 sm:h-16 sm:w-16 text-white stroke-[4]" />
                        </div>

                        <div className="text-center space-y-6">
                            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">Proposal Signed</h2>
                            <div className="space-y-2">
                                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Proposal: {proposal.title}</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Ref: {proposal.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="w-full p-6 sm:p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] text-center px-4 sm:px-8 leading-relaxed">
                                A confirmation has been sent. The service provider will be in touch shortly.
                            </p>

                            <Button
                                onClick={handleDownloadPDF}
                                disabled={isGeneratingPDF}
                                className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px]"
                            >
                                {isGeneratingPDF ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2 h-4 w-4" /> Download Signed Proposal
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Hidden Template for PDF Generation */}
                {proposal && branding && (
                    <div className="fixed left-[-9999px] top-0">
                        <div id="signed-proposal-download" className="w-[800px] bg-white">
                            <ProposalTemplate
                                proposal={proposal}
                                branding={branding}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
