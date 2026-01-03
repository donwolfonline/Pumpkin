"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getPublicSiteBySubdomain, debugPublicSites, type UserSite, type ServiceOffering } from "@/lib/storage-utils";
import { Globe, ShoppingBag, Mail, Loader2, ArrowRight, Calendar, CheckCircle2, CreditCard, Lock, ShieldCheck, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/branding/logo";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { } from "@/lib/storage-utils";

export default function PublicUserSitePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const subdomain = params.subdomain as string;
    const currentPageSlug = searchParams.get('p') || '';

    const [siteState, setSiteState] = useState<{ site: UserSite | null, isLoading: boolean }>({ site: null, isLoading: true });
    const { site, isLoading } = siteState;

    // UI State
    const [selectedItem, setSelectedItem] = useState<ServiceOffering | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [customerEmail, setCustomerEmail] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState<'auth' | 'verify' | 'settle'>('auth');
    const [paymentDetails, setPaymentDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [transactionRef, setTransactionRef] = useState("");
    const [isAppleDevice, setIsAppleDevice] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay'>('card');

    useEffect(() => {
        if (subdomain) {
            const found = getPublicSiteBySubdomain(subdomain);
            setTimeout(() => {
                setSiteState({ site: found, isLoading: false });
            }, 0);
        }

        // Apple device detection
        const isApple = /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        setTimeout(() => {
            setIsAppleDevice(isApple);
        }, 0);
    }, [subdomain]);

    const currentPage = useMemo(() => {
        if (!site) return null;
        if (!currentPageSlug) return null; // Home
        return site.pages?.find(p => p.slug === currentPageSlug);
    }, [site, currentPageSlug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!site) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <Globe className="w-16 h-16 text-zinc-700 mb-4" />
                <h1 className="text-2xl font-heading mb-2">Site Not Found</h1>
                <p className="text-zinc-500 mb-6 text-center max-w-md">There is no published site at this address. Please check the URL.</p>
                <div className="mt-8 p-4 bg-zinc-900 rounded-lg border border-white/10 max-w-md w-full text-left">
                    <p className="text-xs text-zinc-500 font-mono mb-2">DEBUG: Available Sites</p>
                    <pre className="text-[10px] text-zinc-400 overflow-auto max-h-40 whitespace-pre-wrap">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {JSON.stringify(debugPublicSites().map((s: any) => ({
                            subdomain: s.data.subdomain,
                            published: s.data.published
                        })), null, 2)}
                    </pre>
                </div>
                <Button asChild variant="outline" className="border-white/10 mt-6">
                    <Link href="/">Back to Pumpkin</Link>
                </Button>
            </div>
        );
    }

    // Dynamic Theme Map
    const themeColors = {
        emerald: "from-emerald-900/40 via-black to-black text-emerald-400 border-emerald-500/20",
        blue: "from-blue-900/40 via-black to-black text-blue-400 border-blue-500/20",
        purple: "from-purple-900/40 via-black to-black text-purple-400 border-purple-500/20",
        orange: "from-orange-900/40 via-black to-black text-orange-400 border-orange-500/20",
    };

    const accentColor = themeColors[site.themeColor as keyof typeof themeColors] || themeColors.emerald;
    const btnColor =
        site.themeColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
            site.themeColor === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                site.themeColor === 'orange' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-emerald-600 hover:bg-emerald-700';

    const handlePurchase = async () => {
        if (!selectedItem || !customerEmail) {
            toast.error("Please enter your email.");
            return;
        }

        if (selectedItem.price > 0) {
            // Card validation only if card is selected
            if (paymentMethod === 'card') {
                if (!paymentDetails.number || !paymentDetails.expiry || !paymentDetails.cvc) {
                    toast.error("Please fill in payment details.");
                    return;
                }
            }

            setIsProcessing(true);
            setProcessingStage('auth');
            await new Promise(r => setTimeout(r, 1200));

            setProcessingStage('verify');
            await new Promise(r => setTimeout(r, 1500));

            setProcessingStage('settle');
            await new Promise(r => setTimeout(r, 1200));

            const ref = Math.floor(Math.random() * 1000000).toString(16).toUpperCase();
            setTransactionRef(ref);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _newInvoice = {
                id: crypto.randomUUID(),
                invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
                clientName: "Public Customer",
                clientEmail: customerEmail,
                amount: selectedItem.price,
                status: 'paid' as const,
                date: new Date().toISOString(),
                dueDate: new Date().toISOString(),
                items: [{ description: selectedItem.title, quantity: 1, price: selectedItem.price }]
            };
            // In a real app, we'd save this to the site owner's data
            toast.success("Payment processed successfully!");
        } else {
            setIsProcessing(true);
            await new Promise(r => setTimeout(r, 800));
            toast.success("Booking request sent!");
        }

        setIsProcessing(false);
        setIsCheckoutOpen(false);
        setIsSuccessOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-white/20">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-md bg-black/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={`/s/${subdomain}`} className="flex items-center gap-3">
                        {site.logo ? (
                            <img src={site.logo} alt={site.title} className="h-8 w-auto object-contain" />
                        ) : (
                            <div className="font-heading font-bold text-xl uppercase tracking-wider">{site.title}</div>
                        )}
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {(site.categories || []).map(cat => (
                            <a
                                key={cat}
                                href={`#category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-xs font-bold uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-colors"
                            >
                                {cat}
                            </a>
                        ))}
                        <div className="h-4 w-px bg-white/10 mx-2" />
                        {(site.headerLinks || []).map(link => (
                            <Link
                                key={link.id}
                                href={link.type === 'page' ? `/s/${subdomain}?p=${link.url}` : link.url}
                                className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <Button size="sm" className={cn("text-white font-bold uppercase tracking-widest text-[10px] md:text-xs rounded-full", btnColor)}>
                        <Mail className="w-4 h-4 mr-2 hidden sm:block" />
                        Contact
                    </Button>
                </div>
            </header>

            {currentPage ? (
                /* Custom Page View */
                <main className="pt-32 pb-20 px-4 min-h-[80vh]">
                    <div className="container mx-auto max-w-3xl">
                        <Link href={`/s/${subdomain}`} className="text-zinc-500 hover:text-white mb-8 inline-flex items-center text-sm gap-2 transition-colors">
                            <ArrowRight className="w-4 h-4 rotate-180" /> Back Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-heading uppercase tracking-tight">{currentPage.title}</h1>
                        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {currentPage.content}
                        </div>
                    </div>
                </main>
            ) : (
                /* Home View */
                <>
                    {/* Hero Section */}
                    <section className={cn("pt-40 pb-20 px-4 bg-gradient-to-b relative overflow-hidden", accentColor.split(' ')[0])}>
                        <div className="container mx-auto max-w-4xl text-center relative z-10">
                            <h1 className="text-4xl md:text-7xl font-bold mb-6 font-heading tracking-tight leading-tight uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {site.title}
                            </h1>
                            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                {site.description || "Welcome to my customized service page. Browse my offerings below."}
                            </p>
                            <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <Button className={cn("h-12 px-8 text-white font-bold uppercase tracking-widest rounded-full shadow-xl shadow-black/50", btnColor)} asChild>
                                    <a href="#offerings">
                                        View Offers <ArrowRight className="ml-2 w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>
                        {/* Decorative background elements */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    </section>

                    {/* Offerings Grid */}
                    <section id="offerings" className="py-20 px-4 border-t border-white/5">
                        <div className="container mx-auto max-w-6xl">
                            <div className="flex flex-col items-center mb-16">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
                                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-zinc-500">Products & Services</h2>
                            </div>

                            {site.offerings.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {site.offerings.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-2"
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <div className="aspect-[4/5] bg-zinc-800/50 relative overflow-hidden">
                                                {item.images && item.images.length > 0 ? (
                                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                                                        <ShoppingBag className="w-12 h-12 text-white/5" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 pt-20">
                                                    <div className={cn("inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md text-white mb-3")}>
                                                        {item.customCategory || item.category}
                                                    </div>
                                                    <h3 className="font-bold text-2xl text-white block truncate mb-1">{item.title}</h3>
                                                    <p className="text-xl font-mono font-bold text-emerald-400">${item.price}</p>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-6 h-10">
                                                    {item.description}
                                                </p>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedItem(item);
                                                        setIsCheckoutOpen(true);
                                                    }}
                                                    className={cn("w-full font-bold uppercase tracking-widest text-xs h-11 rounded-xl transition-all", btnColor)}
                                                >
                                                    {item.price > 0 ? 'Pay Now' : 'Book Now'}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-32 bg-zinc-900/20 rounded-[3rem] border border-white/5 border-dashed">
                                    <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-800" />
                                    <p className="text-zinc-600 font-medium italic">No offerings listed at the moment.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Custom Footer */}
            <footer className="py-20 border-t border-white/5 bg-zinc-950/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-16">
                        <div className="text-left space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">About</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">{site.description}</p>
                        </div>
                        <div className="text-left space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Navigation</h4>
                            <ul className="space-y-2">
                                <li><Link href={`/s/${subdomain}`} className="text-zinc-500 hover:text-white text-sm transition-colors">Home</Link></li>
                                {(site.pages || []).map(p => (
                                    <li key={p.id}><Link href={`/s/${subdomain}?p=${p.slug}`} className="text-zinc-500 hover:text-white text-sm transition-colors">{p.title}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="text-left space-y-4">
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contact</h4>
                            <p className="text-zinc-500 text-sm">support@{subdomain}.pumpkin.app</p>
                        </div>
                    </div>
                    {site.footerContent && <p className="text-zinc-500 text-xs mb-8">{site.footerContent}</p>}
                    <div className="h-px w-20 bg-white/5 mx-auto mb-8" />
                    <div className="flex items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Powered by</span>
                        <Logo className="scale-75 origin-left" />
                    </div>
                </div>
            </footer>

            <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="bg-[#051c1c] border-white/10 text-zinc-100 max-w-2xl rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>{selectedItem?.title}</DialogTitle>
                        <DialogDescription>{selectedItem?.description}</DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="grid md:grid-cols-2">
                            <div className="bg-zinc-900 flex items-center justify-center relative min-h-[250px] md:min-h-[300px]">
                                {selectedItem.images?.[0] ? (
                                    <img src={selectedItem.images[0]} alt={selectedItem.title} className="w-full h-full object-cover" />
                                ) : (
                                    <ShoppingBag className="w-20 h-20 text-white/5" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <div className="flex gap-2 mb-2">
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase rounded-full">${selectedItem.price}</span>
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full">{selectedItem.category}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedItem.title}</h2>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 space-y-6 flex flex-col justify-center">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Description</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{selectedItem.description}</p>
                                    {selectedItem.stock !== undefined && (
                                        <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 uppercase">Availability</span>
                                            <span className="text-xs font-bold text-white">{selectedItem.stock} items left</span>
                                        </div>
                                    )}
                                    {selectedItem.duration && (
                                        <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 uppercase">Duration</span>
                                            <span className="text-xs font-bold text-white">{selectedItem.duration} minutes</span>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className={cn("w-full h-11 md:h-12 font-bold uppercase tracking-widest text-xs rounded-xl", btnColor)}
                                >
                                    Proceed to {selectedItem.price > 0 ? 'Payment' : 'Booking'}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* High-Fidelity Checkout Modal */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogContent className="bg-[#051c1c] border-white/10 text-zinc-100 w-[95%] max-w-md rounded-3xl p-0 overflow-hidden">
                    {!isProcessing ? (
                        <>
                            <DialogHeader className="p-6 pb-2">
                                <DialogTitle className="text-white font-heading uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-emerald-500" />
                                    Secure Checkout
                                </DialogTitle>
                                <DialogDescription className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                                    Complete your {(selectedItem?.price ?? 0) > 0 ? 'purchase' : 'booking'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-6 pt-2 space-y-6">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                            {selectedItem?.category === 'product' ? <ShoppingBag className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase tracking-tight">{selectedItem?.title}</div>
                                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{selectedItem?.category}</div>
                                        </div>
                                    </div>
                                    <div className="text-lg font-mono font-bold text-white">${selectedItem?.price}</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            placeholder="customer@example.com"
                                        />
                                    </div>

                                    {isAppleDevice && selectedItem && selectedItem.price > 0 && (
                                        <div className="grid grid-cols-2 gap-3 pb-2">
                                            <button
                                                onClick={() => setPaymentMethod('card')}
                                                className={cn(
                                                    "h-14 rounded-xl border flex items-center justify-center gap-2 transition-all",
                                                    paymentMethod === 'card'
                                                        ? "bg-emerald-500/10 border-emerald-500 text-white"
                                                        : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/20"
                                                )}
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Card</span>
                                            </button>
                                            <button
                                                onClick={() => setPaymentMethod('apple_pay')}
                                                className={cn(
                                                    "h-14 rounded-xl border flex items-center justify-center gap-2 transition-all bg-black",
                                                    paymentMethod === 'apple_pay'
                                                        ? "border-white text-white ring-1 ring-white/20"
                                                        : "border-white/10 text-zinc-500 hover:border-white/20"
                                                )}
                                            >
                                                <svg width="14" height="18" viewBox="0 0 28 34" fill="currentColor">
                                                    <path d="M23.5 17.5C23.5 14.8 25.3 12.6 27.5 11.9C26.3 10.1 24.3 9 22.1 9C19.7 9 18.4 10.2 16.9 10.2C15.3 10.2 13.8 9 11.8 9C8.9 9 5.5 11.2 5.5 16C5.5 18.5 6.3 21.2 7.4 23.5C8.3 25.4 10.7 29.5 13.1 29.5C14.9 29.5 15.9 28.4 18.1 28.4C20.4 28.4 21.1 29.5 23.1 29.5C25.5 29.5 27.6 25.9 28.5 24C24.8 22.3 23.5 17.6 23.5 17.5Z" />
                                                    <path d="M19.5 4.5C20.7 3 21.5 1.1 21.3 0C19.7 0.1 17.8 1.1 16.5 2.5C15.3 3.8 14.5 5.6 14.7 7.5C16.4 7.6 18.2 6.5 19.5 4.5Z" />
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Apple Pay</span>
                                            </button>
                                        </div>
                                    )}

                                    {selectedItem && selectedItem.price > 0 && paymentMethod === 'card' && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Card Information</label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
                                                    <input
                                                        placeholder="0000 0000 0000 0000"
                                                        value={paymentDetails.number}
                                                        onChange={e => setPaymentDetails({ ...paymentDetails, number: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono tracking-wider"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Expiry</label>
                                                    <input
                                                        placeholder="MM/YY"
                                                        value={paymentDetails.expiry}
                                                        onChange={e => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">CVC</label>
                                                    <input
                                                        placeholder="123"
                                                        value={paymentDetails.cvc}
                                                        onChange={e => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem && selectedItem.price > 0 && paymentMethod === 'apple_pay' && (
                                        <div className="p-8 bg-zinc-950 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in-95 duration-500 cursor-pointer group" onClick={handlePurchase}>
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Fingerprint className="w-8 h-8 text-black" />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <div className="text-white font-bold text-xs tracking-tight">Apple Pay</div>
                                                <div className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Confirm with Touch ID</div>
                                            </div>
                                            <div className="text-zinc-600 text-[8px] uppercase font-bold tracking-[0.2em] animate-pulse">Double Click Button to Pay</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="p-6 bg-black/20">
                                <Button
                                    className={cn("w-full h-12 font-bold uppercase tracking-widest text-xs rounded-xl", btnColor)}
                                    onClick={handlePurchase}
                                    disabled={paymentMethod === 'apple_pay'}
                                >
                                    {paymentMethod === 'apple_pay' ? 'Authorize via Apple' : `Authorize ${selectedItem && selectedItem.price > 0 ? 'Transaction' : 'Booking'}`}
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <div className="p-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 h-[400px]">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="relative w-24 h-24 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ShieldCheck className="h-8 w-8 text-emerald-500" />
                                </div>
                            </div>
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-black text-white uppercase tracking-widest">
                                    {processingStage === 'auth' && 'Authorizing...'}
                                    {processingStage === 'verify' && 'Verifying...'}
                                    {processingStage === 'settle' && 'Settling...'}
                                </h2>
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={cn("h-full bg-emerald-500 transition-all duration-700",
                                            processingStage === 'auth' ? 'w-1/3' :
                                                processingStage === 'verify' ? 'w-2/3' : 'w-full'
                                        )}></div>
                                    </div>
                                    <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em]">Encrypted Transaction</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Professional Success Modal */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="bg-[#051c1c] border-white/10 text-zinc-100 w-[95%] max-w-md rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>Your transaction was successful.</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 md:p-12 pb-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20 scale-110">
                            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 stroke-[3]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 font-heading uppercase tracking-tighter italic">Confirmed</h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                            Transaction Ref: {transactionRef || 'TRX-SAMPLE'}
                        </p>

                        <div className="w-full p-4 md:p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 mb-8 text-left">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-zinc-500 font-bold uppercase tracking-wider">Item</span>
                                <span className="text-white font-bold">{selectedItem?.title}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-4">
                                <span className="text-zinc-500 font-bold uppercase tracking-wider">Amount</span>
                                <span className="text-white font-mono font-bold text-lg">${selectedItem?.price}</span>
                            </div>
                        </div>

                        <p className="text-zinc-400 text-[10px] md:text-xs leading-relaxed mb-4">
                            A confirmation and receipt has been sent to <span className="text-white font-bold">{customerEmail}</span>.
                        </p>
                    </div>
                    <DialogFooter className="p-6 bg-black/20">
                        <Button
                            className={cn("w-full h-11 md:h-12 font-bold uppercase tracking-widest text-[10px] rounded-xl", btnColor)}
                            onClick={() => {
                                setIsSuccessOpen(false);
                                setSelectedItem(null);
                            }}
                        >
                            Return to Site
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
