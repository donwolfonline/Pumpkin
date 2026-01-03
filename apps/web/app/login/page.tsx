"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Mail, Lock, Loader2, Sparkles } from "lucide-react"
import { Logo } from "@/components/branding/logo"
import { api } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
            await api.login(email, password)
            router.push("/dashboard")
        } catch (err) {
            const error = err as Error
            setError(error.message || "Invalid credentials. Please try again.")
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

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-7xl font-bold tracking-tight font-heading leading-tight glow-orange">
                            The party <br />
                            <span className="text-primary italic animate-pulse">is waiting.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 font-medium leading-relaxed">
                            Sign in to access your pumpkin patch. Manage your projects, clients, and team in the most atmospheric operating system for business founders and startups.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">
                        <span>© 2024 Pumpkin Inc.</span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span>Atmospheric OS</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Inset Pod Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <Logo className="lg:hidden justify-center mb-12" />

                    <div className="inset-pod p-10 rounded-[3rem] border border-white/5 shadow-2xl">
                        <div className="space-y-2 text-center mb-10">
                            <h2 className="text-3xl font-bold tracking-tight font-heading text-white">Welcome Back</h2>
                            <p className="text-zinc-400 text-sm italic">
                                Ready to harvest some more?
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold uppercase tracking-widest text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="/forgot-password" title="Coming soon!" className="text-primary hover:underline transition-all">Forgot?</Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 pl-12 bg-black/20 border-white/10 rounded-2xl focus:ring-primary/50 text-white placeholder:text-zinc-600 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

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
                                        Sign In to the Patch
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

                    {/* Client Portal Link */}
                    <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all">
                        <p className="text-center text-sm text-zinc-400 mb-3 font-medium">
                            Looking for the Client Portal?
                        </p>
                        <Link href="/portal/login" className="block">
                            <Button
                                variant="outline"
                                className="w-full h-12 rounded-xl bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 text-orange-400 font-bold gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-orange-500/5"
                            >
                                <Sparkles className="w-4 h-4" />
                                Access Client Portal
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-10 text-center text-sm font-bold text-zinc-500 uppercase tracking-widest">
                        Don&apos;t have a patch yet?{" "}
                        <Link href="/register" className="text-primary hover:underline">
                            Start yours seeds
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
