"use client";

import { useEffect, useState } from "react";
import { Bell, CreditCard, Lock, Mail, Shield, User, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
    // Payment Settings State
    const [stripeSettings, setStripeSettings] = useState({
        publishableKey: "",
        secretKey: "",
        isTestMode: true,
        webhookSecret: ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem("admin_stripe_settings");
        if (savedSettings) {
            setStripeSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setSaveSuccess(false);

        // Simulate API delay
        setTimeout(() => {
            localStorage.setItem("admin_stripe_settings", JSON.stringify(stripeSettings));
            setIsSaving(false);
            setSaveSuccess(true);

            // Reset success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2 font-heading uppercase">Platform Settings</h2>
                <p className="text-zinc-400">Configure global platform behavior and admin preferences.</p>
            </div>

            {/* Payment Gateway Section */}
            <div id="payment-gateway" className="rounded-xl border border-emerald-500/20 bg-[#0a2c28]/40 backdrop-blur-md overflow-hidden relative overflow-visible">
                {/* Glow Effect */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="p-6 border-b border-emerald-500/20">
                    <h3 className="font-bold text-lg text-emerald-400 flex items-center gap-2 font-heading uppercase tracking-wide">
                        <CreditCard className="w-5 h-5" />
                        Payment Gateway (Stripe)
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium text-white">Test Mode</div>
                            <div className="text-xs text-zinc-400">Toggle between Stripe Test and Live environments.</div>
                        </div>
                        <Switch
                            checked={stripeSettings.isTestMode}
                            onCheckedChange={(checked) => setStripeSettings(prev => ({ ...prev, isTestMode: checked }))}
                            className="data-[state=checked]:bg-emerald-500"
                        />
                    </div>

                    <Separator className="bg-white/5" />

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Publishable Key</label>
                            <Input
                                value={stripeSettings.publishableKey}
                                onChange={(e) => setStripeSettings(prev => ({ ...prev, publishableKey: e.target.value }))}
                                placeholder={stripeSettings.isTestMode ? "pk_test_..." : "pk_live_..."}
                                className="bg-white/5 border-white/10 text-white font-mono text-sm focus-visible:ring-emerald-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Secret Key</label>
                            <Input
                                type="password"
                                value={stripeSettings.secretKey}
                                onChange={(e) => setStripeSettings(prev => ({ ...prev, secretKey: e.target.value }))}
                                placeholder={stripeSettings.isTestMode ? "sk_test_..." : "sk_live_..."}
                                className="bg-white/5 border-white/10 text-white font-mono text-sm focus-visible:ring-emerald-500/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Webhook Secret (Optional)</label>
                            <Input
                                type="password"
                                value={stripeSettings.webhookSecret}
                                onChange={(e) => setStripeSettings(prev => ({ ...prev, webhookSecret: e.target.value }))}
                                placeholder="whsec_..."
                                className="bg-white/5 border-white/10 text-white font-mono text-sm focus-visible:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
                        <strong className="block mb-1 uppercase tracking-wide text-emerald-400">Configuration Check</strong>
                        Ensure these keys match your Stripe Dashboard. Payments for "Sprout" and "Big Pumpkin" plans will be routed to the connected Stripe account.
                    </div>
                </div>
                <div className="p-6 pt-0 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(
                            "font-bold uppercase tracking-widest text-xs min-w-[140px] transition-all duration-300",
                            saveSuccess ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        )}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : saveSuccess ? (
                            <>
                                <Check className="mr-2 h-4 w-4" />
                                Saved!
                            </>
                        ) : (
                            "Save Credentials"
                        )}
                    </Button>
                </div>
            </div>

            {/* Profile Section */}
            <div className="rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2 font-heading uppercase tracking-wide">
                        <User className="w-5 h-5 text-zinc-400" />
                        Admin Profile
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                            <Input defaultValue="Super Admin" className="bg-white/5 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                            <Input defaultValue="admin@pumpkin.app" className="bg-white/5 border-white/10 text-white" disabled />
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2 font-heading uppercase tracking-wide">
                        <Bell className="w-5 h-5 text-zinc-400" />
                        Notifications
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium text-white">New User Signups</div>
                            <div className="text-sm text-zinc-500">Receive an email when a new user registers.</div>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium text-white">New Subscription Alerts</div>
                            <div className="text-sm text-zinc-500">Receive an email when a user upgrades their plan.</div>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium text-white">Daily Summary</div>
                            <div className="text-sm text-zinc-500">Receive a daily summary of platform activity.</div>
                        </div>
                        <Switch />
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="rounded-xl border border-white/5 bg-[#0a2c28]/20 backdrop-blur-md overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2 font-heading uppercase tracking-wide">
                        <Shield className="w-5 h-5 text-zinc-400" />
                        Security & Access
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium text-white">Maintenance Mode</div>
                            <div className="text-sm text-zinc-500">Disable access for all non-admin users.</div>
                        </div>
                        <Switch />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="space-y-2">
                        <Button variant="outline" className="text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10">
                            Reset All Data (Dev Only)
                        </Button>
                        <p className="text-xs text-zinc-500">
                            This will clear all localStorage data. Use with caution.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="ghost" className="text-zinc-400 hover:text-white">Cancel</Button>
                {/* Main page save button - functionality could be added later for other settings */}
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs">Save All Changes</Button>
            </div>
        </div>
    );
}

// Utility for styles
import { cn } from "@/lib/utils";
