"use client"

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardFooter } from "@/components/ui/card";
import { Check, Loader2, ShieldCheck, FileText, CreditCard, Fingerprint, Lock, AlertCircle } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { usePumpkinToast } from '../../../components/ui/pumpkin-toast';
import { getContractPublicly, updateContractByKey, getOrganizationBranding } from '../../../lib/storage-utils';
import { ContractTemplate } from '../../../components/templates/contract-template';
import { Contract } from '../../../lib/types/contract';
import { OrganizationBranding, DEFAULT_BRANDING } from '../../../lib/types/organization-settings';
import { formatCurrency } from '../../../lib/utils';

export default function SignPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = usePumpkinToast();

    const [contract, setContract] = useState<Contract | null>(null);
    const [storageKey, setStorageKey] = useState<string | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding>(DEFAULT_BRANDING);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'review' | 'sign' | 'pay' | 'processing' | 'success'>('review');
    const [clientSignature, setClientSignature] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState<'auth' | 'verify' | 'settle'>('auth');

    useEffect(() => {
        const loadContract = () => {
            const data = getContractPublicly(id);
            if (data) {
                setContract(data.contract);
                setStorageKey(data.storageKey);
                const orgBranding = getOrganizationBranding();
                setBranding(orgBranding);

                // Check if contract is already signed and active
                const isAlreadySigned = data.contract.status === 'active' || data.contract.status === 'signed';
                const hasClientSignature = data.contract.signatures?.some((s: { party: string }) => s.party === 'client');

                // If already signed, show success screen directly
                if (isAlreadySigned && hasClientSignature) {
                    setStep('success');
                    // Also set the client signature name for display purposes
                    const clientSig = data.contract.signatures.find((s: { party: string; name?: string }) => s.party === 'client');
                    if (clientSig?.name) {
                        setClientSignature(clientSig.name);
                    }
                }
            }
            setIsLoading(false);
        };
        loadContract();
    }, [id]);

    const handleSign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientSignature) return;
        setStep('pay');
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setStep('processing');

        // Simulating the high-fidelity handshake process
        setProcessingStage('auth');
        await new Promise(r => setTimeout(r, 1500));

        setProcessingStage('verify');
        await new Promise(r => setTimeout(r, 1500));

        setProcessingStage('settle');
        await new Promise(r => setTimeout(r, 1500));

        if (contract && storageKey) {
            const newSignature = {
                party: 'client' as const,
                name: clientSignature,
                signedAt: new Date().toISOString()
            };

            const updatedContract: Contract = {
                ...contract,
                status: 'active',
                signatures: [...(contract.signatures || []).filter(s => s.party !== 'client'), newSignature],
                updatedAt: new Date().toISOString()
            };

            updateContractByKey(storageKey, updatedContract);
            setContract(updatedContract);
            setStep('success');
            toast("Contract signed and payment authorized!", "success");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex flex-col items-center justify-center text-white space-y-6">
                <AlertCircle className="h-16 w-16 text-orange-500" />
                <h1 className="text-2xl font-black uppercase tracking-widest">Agreement Not Found</h1>
                <p className="text-zinc-500 text-center max-w-md uppercase text-xs font-bold tracking-widest leading-relaxed">
                    This agreement may have expired or been moved. Please contact your service provider for a new link.
                </p>
                <Button variant="ghost" onClick={() => router.push('/')} className="text-primary hover:text-white">
                    Return Home
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#051c1c] flex flex-col font-sans selection:bg-primary selection:text-white">
            <header className="fixed top-0 left-0 right-0 p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl z-50 bg-[#051c1c]/80">
                <Logo />
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Lock className="h-3 w-3 text-primary/60" />
                        256-bit Encrypted
                    </div>
                </div>
            </header>

            <main className="flex-1 mt-24 pb-24 container mx-auto px-4 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {step === 'review' && (
                    <div className="flex flex-col items-center space-y-12">
                        <div className="text-center space-y-4 max-w-2xl px-4">
                            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">Review Agreement</h1>
                            <p className="text-zinc-500 text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] leading-relaxed">
                                Please review the terms below. Once satisfied, click &quot;Proceed to Sign&quot; to complete the execution.
                            </p>
                        </div>

                        <div className="w-full flex-1 overflow-x-hidden pb-12">
                            <div className="relative group perspective-1000 origin-top">
                                {/* Decorative elements behind document */}
                                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 via-orange-500/20 to-transparent rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                                <div className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl">
                                    <ContractTemplate contract={contract} branding={branding} />
                                </div>
                            </div>
                        </div>

                        <div className="fixed bottom-12 left-0 right-0 flex justify-center px-4 z-40 pointer-events-none">
                            <Button
                                onClick={() => setStep('sign')}
                                className="h-16 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 pointer-events-auto transform transition hover:scale-105 active:scale-95"
                            >
                                Proceed to Sign
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'sign' && (
                    <div className="max-w-xl mx-auto space-y-12 py-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                                <FileText className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Step 01 / Execution</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Digital Signature</h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Provide your legal name to digitally sign the agreement.
                            </p>
                        </div>

                        <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl overflow-hidden p-8 sm:p-12 space-y-8">
                            <form onSubmit={handleSign} className="space-y-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Full Legal Name</Label>
                                    <div className="relative">
                                        <Input
                                            value={clientSignature}
                                            onChange={(e) => setClientSignature(e.target.value)}
                                            placeholder="Your Full Name"
                                            className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-xl font-medium italic text-white focus:ring-primary/20 transition-all"
                                            required
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                            <Fingerprint className="h-6 w-6 text-zinc-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-3 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest relative z-10">Signature Preview</p>
                                    <p className="text-3xl font-black text-white italic tracking-widest h-10 relative z-10">
                                        {clientSignature || '...'}
                                    </p>
                                </div>

                                <div className="flex gap-4 items-start p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                    <ShieldCheck className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-orange-200/40 leading-relaxed font-bold uppercase tracking-wider">
                                        By signing, you agree that this electronic signature is as legally binding as a handwritten one.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                    Next: Payment Authorization
                                </Button>
                            </form>
                        </Card>

                        <Button variant="ghost" onClick={() => setStep('review')} className="w-full text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-black">
                            Back to Document
                        </Button>
                    </div>
                )}

                {step === 'pay' && (
                    <div className="max-w-xl mx-auto space-y-12 py-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                                <CreditCard className="h-3 w-3 text-primary" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Step 02 / Settlement</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Authorize Payment</h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Complete the transaction to activate your agreement.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] border transition-all duration-500 flex flex-row sm:flex-col items-center justify-center gap-3 ${paymentMethod === 'card' ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            >
                                <CreditCard className={`h-5 w-5 sm:h-6 sm:w-6 ${paymentMethod === 'card' ? 'text-primary' : 'text-zinc-600'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-600'}`}>Credit Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('apple_pay')}
                                className={`h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] border transition-all duration-300 flex items-center justify-center bg-black hover:bg-[#1a1a1a] border-white/10 shadow-lg group relative overflow-hidden ${paymentMethod === 'apple_pay' ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#051c1c]' : ''}`}
                                aria-label="Pay with Apple Pay"
                            >
                                <div className="flex items-center gap-2">
                                    {/* Apple Logo SVG - Official Apple shape */}
                                    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7 sm:w-7 sm:h-8">
                                        <path d="M23.5 17.5C23.5 14.8 25.3 12.6 27.5 11.9C26.3 10.1 24.3 9 22.1 9C19.7 9 18.4 10.2 16.9 10.2C15.3 10.2 13.8 9 11.8 9C8.9 9 5.5 11.2 5.5 16C5.5 18.5 6.3 21.2 7.4 23.5C8.3 25.4 10.7 29.5 13.1 29.5C14.9 29.5 15.9 28.4 18.1 28.4C20.4 28.4 21.1 29.5 23.1 29.5C25.5 29.5 27.6 25.9 28.5 24C24.8 22.3 23.5 17.6 23.5 17.5Z" fill="white" />
                                        <path d="M19.5 4.5C20.7 3 21.5 1.1 21.3 0C19.7 0.1 17.8 1.1 16.5 2.5C15.3 3.8 14.5 5.6 14.7 7.5C16.4 7.6 18.2 6.5 19.5 4.5Z" fill="white" />
                                    </svg>
                                    {/* Pay text with SF Pro Display characteristics */}
                                    <span className="text-white text-2xl sm:text-[28px] font-light tracking-[-0.02em] leading-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', fontWeight: '300' }}>
                                        Pay
                                    </span>
                                </div>
                                {paymentMethod === 'apple_pay' && (
                                    <div className="absolute top-2 right-2">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                    </div>
                                )}
                            </button>
                        </div>

                        <Card className="bg-white/[0.02] border-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-2xl overflow-hidden">
                            {paymentMethod === 'card' ? (
                                <div className="p-8 sm:p-12 space-y-8">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Card Number</Label>
                                            <div className="relative">
                                                <Input placeholder="0000 0000 0000 0000" className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-lg font-mono text-white tracking-widest" />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                                    <div className="w-8 h-5 bg-zinc-800 rounded"></div>
                                                    <div className="w-8 h-5 bg-blue-600 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Expiry</Label>
                                                <Input placeholder="MM/YY" className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-lg font-mono text-white" />
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">CVC</Label>
                                                <Input placeholder="000" className="h-16 bg-black/40 border-white/10 rounded-2xl px-6 text-lg font-mono text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-white/20">
                                        <Fingerprint className="h-10 w-10 text-black animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-black text-white uppercase tracking-tighter">Double Click to Pay</p>
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">With Touch ID or Face ID</p>
                                    </div>
                                </div>
                            )}

                            <CardFooter className="bg-primary/5 border-t border-white/5 p-8 flex flex-col gap-6">
                                <div className="w-full flex justify-between items-center text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">
                                    <span>Initial Deposit</span>
                                    <span className="text-xl text-primary">
                                        {(() => {
                                            const deposit = contract.paymentSchedule[0]?.amount;
                                            // Fallback logic: if deposit is 0 or missing, show totalValue. 
                                            // If both are 0 (demo edge case), show $1,500.00 for the 'wow' factor
                                            if (deposit && deposit > 0) return formatCurrency(deposit);
                                            if (contract.totalValue > 0) return formatCurrency(contract.totalValue);
                                            return formatCurrency(1500);
                                        })()}
                                    </span>
                                </div>
                                <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                    Complete Authorization
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="max-w-xl mx-auto py-24 flex flex-col items-center justify-center space-y-12">
                        <div className="relative">
                            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                            </div>
                        </div>

                        <div className="text-center space-y-6">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                                {processingStage === 'auth' && 'Authorizing...'}
                                {processingStage === 'verify' && 'Verifying...'}
                                {processingStage === 'settle' && 'Settling Funds...'}
                            </h2>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-primary transition-all duration-1000 ${processingStage === 'auth' ? 'w-1/3' : processingStage === 'verify' ? 'w-2/3' : 'w-full'}`}></div>
                                </div>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Secure Handshake in Progress</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="max-w-xl mx-auto py-24 flex flex-col items-center justify-center space-y-12 animate-in zoom-in duration-700">
                        <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/40 relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                            <Check className="h-16 w-16 text-white stroke-[4]" />
                        </div>

                        <div className="text-center space-y-6">
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic">Agreement Active</h2>
                            <div className="space-y-2">
                                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Project: {contract.title}</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">Ref: {contract.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] text-center px-8 leading-relaxed">
                                A confirmation and copy of the signed agreement has been sent to your email.
                            </p>
                            <Button
                                onClick={() => {
                                    // Trigger print dialog with styled contract template
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                        const contractElement = document.getElementById('signed-contract-download');
                                        if (contractElement) {
                                            // Get all stylesheets from the current page
                                            const styles = Array.from(document.styleSheets)
                                                .map(styleSheet => {
                                                    try {
                                                        return Array.from(styleSheet.cssRules)
                                                            .map(rule => rule.cssText)
                                                            .join('\n');
                                                    } catch {
                                                        return '';
                                                    }
                                                })
                                                .join('\n');

                                            printWindow.document.write(`
                                                <!DOCTYPE html>
                                                <html>
                                                <head>
                                                    <meta charset="UTF-8">
                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                    <title>${contract.title} - Signed Agreement</title>
                                                    <script src="https://cdn.tailwindcss.com"></script>
                                                    <style>
                                                        @media print {
                                                            @page { 
                                                                margin: 1cm;
                                                                size: A4;
                                                            }
                                                            body { 
                                                                margin: 0;
                                                                -webkit-print-color-adjust: exact;
                                                                print-color-adjust: exact;
                                                            }
                                                        }
                                                        body { 
                                                            margin: 0; 
                                                            padding: 20px;
                                                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                                                            background: white;
                                                        }
                                                        ${styles}
                                                    </style>
                                                </head>
                                                <body>
                                                    <div class="flex justify-center">
                                                        ${contractElement.innerHTML}
                                                    </div>
                                                </body>
                                                </html>
                                            `);
                                            printWindow.document.close();

                                            // Wait for Tailwind to load before printing
                                            setTimeout(() => {
                                                printWindow.print();
                                            }, 1000);
                                        }
                                    }
                                }}
                                variant="default"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl"
                            >
                                <FileText className="mr-2 h-4 w-4" /> Download Signed Agreement
                            </Button>
                        </div>

                        {/* Hidden contract template for download/print */}
                        <div id="signed-contract-download" className="hidden">
                            <ContractTemplate contract={contract} branding={branding} />
                        </div>
                    </div>
                )}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-full px-8 py-3 flex gap-8 items-center pointer-events-all">
                    <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">© 2025 Pumpkin CRM</p>
                    <div className="flex gap-4">
                        <div className="w-6 h-4 bg-zinc-800 rounded-sm"></div>
                        <div className="w-6 h-4 bg-zinc-800 rounded-sm"></div>
                        <div className="w-6 h-4 bg-zinc-800 rounded-sm"></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
