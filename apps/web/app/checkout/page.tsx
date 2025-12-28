"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Loader2, Check, ArrowLeft, ShieldCheck } from "lucide-react"
import { Logo } from "@/components/branding/logo"
import { usePumpkinToast } from '@/components/ui/pumpkin-toast'
import { DashboardShell } from '@/components/dashboard-shell' // We'll just use a layout wrapper or plain div

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const planId = searchParams.get('plan') || 'sprout'
    const { toast } = usePumpkinToast()
    const [isProcessing, setIsProcessing] = useState(false)

    const [planDetails, setPlanDetails] = useState({ name: '', price: '', features: [] as string[] })

    useEffect(() => {
        // Map slug to details
        switch (planId) {
            case 'big-pumpkin':
                setPlanDetails({
                    name: "Big Pumpkin",
                    price: "$29.00",
                    features: ["Unlimited Projects", "Full Automation", "Team Access"]
                })
                break;
            case 'sprout':
            default:
                setPlanDetails({
                    name: "Sprout",
                    price: "$12.00",
                    features: ["10 Projects", "Advanced CRM", "Custom Branding"]
                })
                break;
        }
    }, [planId])

    const handlePayment = async () => {
        setIsProcessing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Save plan to local storage for the demo
        localStorage.setItem('pumpkin_billing_plan', JSON.stringify(planId === 'big-pumpkin' ? 'pro' : 'plus')) // Simple mapping for now

        toast("Welcome to the patch! subscription active.", "success")
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-[#051c1c] flex flex-col">
            <header className="p-6 border-b border-white/5 flex items-center justify-between">
                <Logo />
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Secure Checkout
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex items-start justify-center">
                <div className="w-full max-w-4xl grid md:grid-cols-3 gap-8">

                    {/* Order Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                            <div>
                                <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Order Summary</h3>
                                <div className="text-3xl font-heading text-white mb-1">{planDetails.name}</div>
                                <div className="text-xl font-bold text-primary">{planDetails.price} <span className="text-sm text-zinc-500 font-medium">/mo</span></div>
                            </div>

                            <hr className="border-white/10" />

                            <ul className="space-y-3">
                                {planDetails.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                        <Check className="h-4 w-4 text-primary" /> {f}
                                    </li>
                                ))}
                            </ul>

                            <hr className="border-white/10" />

                            <div className="flex justify-between items-center text-sm font-bold text-white uppercase tracking-widest">
                                <span>Total due today</span>
                                <span>{planDetails.price}</span>
                            </div>
                        </div>
                        <Button variant="ghost" onClick={() => router.back()} className="w-full text-zinc-500 hover:text-white">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </div>

                    {/* Payment Form */}
                    <Card className="md:col-span-2 bg-black/20 border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white font-heading uppercase tracking-widest">Payment Details</CardTitle>
                            <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Complete your subscription setup.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Card Information</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <Input placeholder="0000 0000 0000 0000" className="h-12 pl-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Expiry</Label>
                                        <Input placeholder="MM/YY" className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CVC</Label>
                                        <Input placeholder="123" className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name on Card</Label>
                                    <Input placeholder="JOHN APPLESEED" className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-primary/5 border-t border-white/5 p-8">
                            <Button onClick={handlePayment} disabled={isProcessing} className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                                {isProcessing ? <Loader2 className="animate-spin" /> : `Pay ${planDetails.price} & Start Growing`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#051c1c] flex items-center justify-center text-primary"><Loader2 className="animate-spin h-8 w-8" /></div>}>
            <CheckoutContent />
        </Suspense>
    )
}
