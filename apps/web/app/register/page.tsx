"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Mail, Lock, User, Building, Loader2 } from "lucide-react"
import { Logo } from "@/components/branding/logo"
import { api } from "@/lib/api"

export default function RegisterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const selectedPlan = searchParams.get('plan')

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [organizationName, setOrganizationName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Check if user is already logged in and redirect to dashboard
    useEffect(() => {
        const existingUser = api.getUser()
        if (existingUser) {
            router.push("/dashboard")
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {

            await api.register({
                email,
                password,
                firstName,
                lastName,
                organizationName
            })

            // If a paid plan was selected, redirect to checkout
            if (selectedPlan && selectedPlan !== 'seedling') {
                router.push(`/checkout?plan=${selectedPlan}`)
            } else {
                router.push("/dashboard")
            }
        } catch (err) {
            const error = err as Error
            setError(error.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-[#051c1c] text-white selection:bg-primary/20">
            {/* Left Side - Atmospheric Branding */}
            <div className="hidden lg:flex lg:w-1/2 moonlight relative overflow-hidden border-r border-white/5">
                <div className="absolute inset-x-0 bottom-[-100px] flex justify-center opacity-20 filter blur-2xl">
                    <span className="text-[30rem]">🎃</span>
                </div>

                <div className="relative z-10 flex flex-col justify-between p-16">
                    <Logo />

                    <div className="space-y-8 max-w-lg">
                        <h1 className="text-6xl font-bold tracking-tight font-heading leading-tight glow-orange">
                            Join the party <br />
                            <span className="text-primary italic animate-pulse">호박이~ 넝쿨째~</span>
                        </h1>
                        <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                            Start your 14-day free trial today. Join 10,000+ professionals who trust Pumpkin to manage their entire business workflow.
                        </p>

                        <div className="space-y-4 pt-4">
                            {[
                                "Full CRM and pipeline management",
                                "Unlimited contracts & e-signatures",
                                "Automated invoicing & payments",
                                "Advanced analytics & reporting"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">
                        <span>© 2024 Pumpkin Inc.</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>Secure Party</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Inset Pod Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative overflow-y-auto">
                {/* Decorative floating ghost for flair */}
                <div className="absolute top-20 right-20 text-6xl opacity-10 animate-float">👻</div>

                <div className="w-full max-w-md py-12">
                    {/* Mobile Logo */}
                    <Logo className="lg:hidden justify-center mb-12" />

                    <div className="inset-pod p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                        <div className="space-y-2 text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tight font-heading text-white">Create Account</h2>
                            <p className="text-zinc-400 text-sm">
                                Get your own pumpkin patch started
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                id="firstName"
                                                type="text"
                                                placeholder="John"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Last Name</Label>
                                        <div className="relative">
                                            <Input
                                                id="lastName"
                                                type="text"
                                                placeholder="Doe"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="h-14 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organizationName" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Company Name</Label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="organizationName"
                                            type="text"
                                            placeholder="Pumpkin Patch Inc."
                                            value={organizationName}
                                            onChange={(e) => setOrganizationName(e.target.value)}
                                            className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest ml-1">Min. 8 characters</p>
                                </div>
                            </div>

                            <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
                                By creating an account, you agree to our{" "}
                                <Link href="/terms" className="text-primary hover:underline">Terms</Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                            </p>

                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create Your Account
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="bg-white/5" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold">
                                <span className="bg-[#0c2a27] px-4 text-zinc-600">Quick Access</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-12 w-full rounded-xl bg-white/5 border-white/5 hover:bg-white/10 text-white gap-3 transition-all hover:scale-[1.05]">
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </Button>
                            <Button variant="outline" className="h-12 w-full rounded-xl bg-white/5 border-white/5 hover:bg-white/10 text-white gap-3 transition-all hover:scale-[1.05]">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </Button>
                        </div>
                    </div>

                    <p className="mt-10 text-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
                        Already have a patch?{" "}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in to the party
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
