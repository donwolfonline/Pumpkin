"use client"

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Card, CardFooter } from "../../../components/ui/card";
import { Check, Loader2, ShieldCheck, CreditCard, Fingerprint, Lock, AlertCircle, FileText } from "lucide-react";
import { Logo } from "../../../components/branding/logo";
import { usePumpkinToast } from '../../../components/ui/pumpkin-toast';
import { getInvoicePublicly, updateInvoiceByKey, getOrganizationBranding } from '../../../lib/storage-utils';
import { generatePDF } from '../../../lib/pdf-generator';
import { InvoiceTemplate } from '../../../components/templates/invoice-template';
import { Invoice } from '../../../lib/types/invoice';
import { OrganizationBranding, DEFAULT_BRANDING } from '../../../lib/types/organization-settings';
import { formatCurrency } from '../../../lib/utils';

export default function PayPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = usePumpkinToast();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [storageKey, setStorageKey] = useState<string | null>(null);
    const [branding, setBranding] = useState<OrganizationBranding>(DEFAULT_BRANDING);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState<'review' | 'pay' | 'processing' | 'success'>('review');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState<'auth' | 'verify' | 'settle'>('auth');

    useEffect(() => {
        const loadInvoice = () => {
            const data = getInvoicePublicly(id);
            if (data) {
                setInvoice(data.invoice);
                setStorageKey(data.storageKey);
                setBranding(getOrganizationBranding());

                if (data.invoice.status === 'paid') {
                    setStep('success');
                }
            }
            setIsLoading(false);
        };
        loadInvoice();
    }, [id]);

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

        if (invoice && storageKey) {
            // Determine the actual display name for the payment method
            const methodDisplay = paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Credit Card';

            const updatedInvoice: Invoice = {
                ...invoice,
                status: 'paid',
                paymentMethod: methodDisplay,
                paymentDetails: `Transaction Ref: ${invoice.id.slice(0, 8).toUpperCase()}`,
                updatedAt: new Date().toISOString()
            };

            updateInvoiceByKey(storageKey, updatedInvoice);
            setInvoice(updatedInvoice);
            setStep('success');
            toast(`Payment via ${methodDisplay} authorized successfully!`, "success");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="min-h-screen bg-[#051c1c] flex flex-col items-center justify-center text-white space-y-6">
                <AlertCircle className="h-16 w-16 text-orange-500" />
                <h1 className="text-2xl font-black uppercase tracking-widest">Invoice Not Found</h1>
                <p className="text-zinc-500 text-center max-w-md uppercase text-xs font-bold tracking-widest leading-relaxed">
                    This invoice may have been deleted or moved. Please contact your service provider for a new link.
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
                            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">Review Invoice</h1>
                            <p className="text-zinc-500 text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] leading-relaxed">
                                Please review your invoice details below. Once confirmed, proceed to payment to settle the balance.
                            </p>
                        </div>

                        <div className="w-full flex-1 pb-24 flex justify-center">
                            <div className="relative group perspective-1000 origin-top flex justify-center w-full max-w-full overflow-hidden px-4">
                                {/* Decorative elements behind document */}
                                <div className="absolute -inset-1 bg-gradient-to-tr from-[#ea580c]/20 via-orange-500/20 to-transparent rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50"></div>

                                <div className="relative w-[300px] h-[412px] sm:w-[480px] sm:h-[660px] md:w-[600px] md:h-[825px] lg:w-[800px] lg:h-[1100px] shrink-0 transition-all duration-500">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] transform scale-[0.375] sm:scale-[0.6] md:scale-[0.75] lg:scale-100 origin-top transition-transform duration-500">
                                        <div className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-white">
                                            <InvoiceTemplate invoice={invoice} branding={branding} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="fixed bottom-12 left-0 right-0 flex justify-center px-4 z-40 pointer-events-none">
                            <Button
                                onClick={() => setStep('pay')}
                                className="h-16 px-12 rounded-[2rem] bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#ea580c]/40 pointer-events-auto transform transition hover:scale-105 active:scale-95"
                            >
                                Proceed to Payment ({formatCurrency(invoice.total)})
                            </Button>
                        </div>
                    </div>
                )}

                {step === 'pay' && (
                    <div className="max-w-xl mx-auto space-y-12 py-12">
                        <div className="text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                                <CreditCard className="h-3 w-3 text-[#ea580c]" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Checkout</span>
                            </div>
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Settlement</h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                Complete the transaction to settle Invoice #{invoice.invoiceNumber}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] border transition-all duration-500 flex flex-row sm:flex-col items-center justify-center gap-3 ${paymentMethod === 'card' ? 'bg-[#ea580c]/10 border-[#ea580c] shadow-xl shadow-[#ea580c]/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                            >
                                <CreditCard className={`h-5 w-5 sm:h-6 sm:w-6 ${paymentMethod === 'card' ? 'text-[#ea580c]' : 'text-zinc-600'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-600'}`}>Credit Card</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('apple_pay')}
                                className={`h-16 sm:h-24 rounded-2xl sm:rounded-[2rem] border transition-all duration-300 flex items-center justify-center bg-black hover:bg-[#1a1a1a] border-white/10 shadow-lg group relative overflow-hidden ${paymentMethod === 'apple_pay' ? 'ring-2 ring-[#ea580c] ring-offset-2 ring-offset-[#051c1c]' : ''}`}
                                aria-label="Pay with Apple Pay"
                            >
                                <div className="flex items-center gap-2">
                                    <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-7 sm:w-7 sm:h-8">
                                        <path d="M23.5 17.5C23.5 14.8 25.3 12.6 27.5 11.9C26.3 10.1 24.3 9 22.1 9C19.7 9 18.4 10.2 16.9 10.2C15.3 10.2 13.8 9 11.8 9C8.9 9 5.5 11.2 5.5 16C5.5 18.5 6.3 21.2 7.4 23.5C8.3 25.4 10.7 29.5 13.1 29.5C14.9 29.5 15.9 28.4 18.1 28.4C20.4 28.4 21.1 29.5 23.1 29.5C25.5 29.5 27.6 25.9 28.5 24C24.8 22.3 23.5 17.6 23.5 17.5Z" fill="white" />
                                        <path d="M19.5 4.5C20.7 3 21.5 1.1 21.3 0C19.7 0.1 17.8 1.1 16.5 2.5C15.3 3.8 14.5 5.6 14.7 7.5C16.4 7.6 18.2 6.5 19.5 4.5Z" fill="white" />
                                    </svg>
                                    <span className="text-white text-2xl sm:text-[28px] font-light tracking-[-0.02em] leading-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif', fontWeight: '300' }}>
                                        Pay
                                    </span>
                                </div>
                                {paymentMethod === 'apple_pay' && (
                                    <div className="absolute top-2 right-2">
                                        <div className="h-2 w-2 rounded-full bg-[#ea580c] animate-pulse"></div>
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

                            <CardFooter className="bg-[#ea580c]/5 border-t border-white/5 p-8 flex flex-col gap-6">
                                <div className="w-full flex justify-between items-center text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">
                                    <span>Amount Due</span>
                                    <span className="text-xl text-[#ea580c]">
                                        {formatCurrency(invoice.total)}
                                    </span>
                                </div>
                                <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-16 rounded-[2rem] bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-[#ea580c]/20">
                                    Authorize Payment
                                </Button>
                            </CardFooter>
                        </Card>

                        <Button variant="ghost" onClick={() => setStep('review')} className="w-full text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-black">
                            Back to Invoice Details
                        </Button>
                    </div>
                )}

                {step === 'processing' && (
                    <div className="max-w-xl mx-auto py-24 flex flex-col items-center justify-center space-y-12">
                        <div className="relative">
                            <div className="absolute -inset-8 bg-[#ea580c]/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative w-24 h-24 rounded-full border-4 border-[#ea580c]/20 border-t-[#ea580c] animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ShieldCheck className="h-8 w-8 text-[#ea580c]" />
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
                                    <div className={`h-full bg-[#ea580c] transition-all duration-1000 ${processingStage === 'auth' ? 'w-1/3' : processingStage === 'verify' ? 'w-2/3' : 'w-full'}`}></div>
                                </div>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">Encrypted Transaction</p>
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
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic text-center leading-none">Invoice Paid</h2>
                            <div className="space-y-2">
                                <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Invoice #{invoice.invoiceNumber}</p>
                                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {invoice.paymentMethod || 'Paid'} • Transaction Ref: {invoice.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                        </div>

                        <div className="w-full p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-4">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] text-center px-8 leading-relaxed">
                                A receipt and confirmation of your payment has been sent to your email.
                            </p>
                            <Button
                                onClick={async () => {
                                    if (!invoice) return;
                                    try {
                                        await new Promise(resolve => setTimeout(resolve, 300));
                                        await generatePDF('signed-invoice-download', `invoice-${invoice.invoiceNumber}.pdf`);
                                        toast("Invoice downloaded successfully", "success");
                                    } catch (error) {
                                        console.error('Failed to generate PDF:', error);
                                        toast("Failed to download PDF", "error");
                                    }
                                }}
                                variant="default"
                                className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl"
                            >
                                <FileText className="mr-2 h-4 w-4" /> Save Receipt / Download Invoice
                            </Button>
                        </div>

                        <div className="absolute left-[-9999px] top-0 pointer-events-none origin-top-left">
                            <div id="signed-invoice-download" className="bg-white w-[800px]">
                                <InvoiceTemplate invoice={invoice} branding={branding} />
                            </div>
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
