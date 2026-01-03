"use client"

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, CreditCard, Users, Bell, Shield, Building2, Upload, Image as ImageIcon, Trash2, Check, Loader2, Database } from 'lucide-react';
import { api } from '@/lib/api';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { getOrganizationBranding, setOrganizationBranding, getUserData, setUserData, scanForOrphanData, recoverOrphanData, deepScanForData, recoverSpecificKey, DEFAULT_BRANDING } from '@/lib/storage-utils';
import { OrganizationBranding } from '@/lib/types/organization-settings';
import { getBillingDaysRemaining } from '@/lib/subscription-utils';

interface ProfileSettings {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar?: string;
}

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Member';
}

interface NotificationSettings {
    emailAlerts: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
}

export default function SettingsPage() {
    const { toast } = usePumpkinToast();

    // --- State with lazy initialization to avoid cascading renders ---
    // --- State (Initialized safely for SSR) ---
    const [company, setCompany] = useState<OrganizationBranding>(DEFAULT_BRANDING);
    const [profile, setProfile] = useState<ProfileSettings>({ firstName: '', lastName: '', email: '', bio: '' });
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [plan, setPlan] = useState<'free' | 'plus' | 'pro'>('free');
    const [notifications, setNotifications] = useState<NotificationSettings>({ emailAlerts: true, pushNotifications: true, marketingEmails: false });
    const [security, setSecurity] = useState<SecuritySettings>({ twoFactorEnabled: false });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    // --- Hydration Effect ---
    useEffect(() => {
        // Load stored data after mount
        setCompany(getOrganizationBranding());

        const loadedProfile = getUserData<ProfileSettings>('pumpkin_profile_settings');
        const apiUser = api.getUser();
        if (loadedProfile) setProfile({ ...loadedProfile, avatar: apiUser?.avatar });
        else if (apiUser) setProfile({ firstName: apiUser.firstName, lastName: apiUser.lastName, email: apiUser.email, bio: '', avatar: apiUser.avatar });

        setTeam(getUserData<TeamMember[]>('pumpkin_team_settings') || []);
        setPlan(getUserData<'free' | 'plus' | 'pro'>('pumpkin_billing_plan') || 'free');
        setNotifications(getUserData<NotificationSettings>('pumpkin_notifications_settings') || { emailAlerts: true, pushNotifications: true, marketingEmails: false });
        setSecurity(getUserData<SecuritySettings>('pumpkin_security_settings') || { twoFactorEnabled: false });
    }, []);

    // --- Modal State ---
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'payment'>('select');
    const [selectedTier, setSelectedTier] = useState<'free' | 'plus' | 'pro'>('free');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
    const [nextPaymentDate, setNextPaymentDate] = useState<string>('N/A');

    // --- Data Recovery State ---
    const [orphanStats, setOrphanStats] = useState({ found: false, count: 0 });
    const [deepScanResults, setDeepScanResults] = useState<{ key: string; type: string; summary: string }[]>([]);

    // --- Effects ---
    // Calculate next payment date on mount
    useEffect(() => {
        const days = getBillingDaysRemaining();
        const date = new Date();
        date.setDate(date.getDate() + days);
        setNextPaymentDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));

        // Scan for orphan data (filtered by current user email/company)
        const user = api.getUser();
        const context = {
            email: user?.email || profile.email,
            companyName: company.companyName
        };

        setOrphanStats(scanForOrphanData(context));

        // Run deep scan matching this user's identity
        const deepScan = deepScanForData(context);
        setDeepScanResults(deepScan.matches);
    }, [company.companyName, profile.email]);

    // --- Handlers ---
    const handleSaveCompany = () => {
        setOrganizationBranding(company);
        toast('Organization branding saved!', 'success');
    };
    const handleSaveProfile = () => {
        setUserData('pumpkin_profile_settings', profile);

        // Sync with global user object for layout consistency
        const currentUser = api.getUser();
        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                avatar: profile.avatar
            };
            api.setUser(updatedUser);
        }

        toast('Profile updated!', 'success');
    };
    const handleSaveNotifications = () => { setUserData('pumpkin_notifications_settings', notifications); toast('Preferences saved.', 'success'); };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) return toast("File too large (max 1MB)", 'error');
            const reader = new FileReader();
            reader.onloadend = () => setCompany((prev: OrganizationBranding) => ({ ...prev, logo: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) return toast("File too large (max 1MB)", 'error');
            const reader = new FileReader();
            reader.onloadend = () => setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleWipeData = async () => {
        if (confirm("DANGER: This will wipe ALL local storage, including guest data and other sessions. Are you sure?")) {
            const { dangerouslyClearAllLocalStorage } = await import('@/lib/storage-utils');
            dangerouslyClearAllLocalStorage();
            window.location.reload();
        }
    };

    const handleAddTeamMember = () => {
        if (!newMemberEmail) return;
        const newMember: TeamMember = { id: crypto.randomUUID(), name: 'Pending User', email: newMemberEmail, role: 'Member' };
        const updated = [...team, newMember];
        setTeam(updated);
        setUserData('pumpkin_team_settings', updated);
        setNewMemberEmail('');
        toast(`Invitation sent to ${newMemberEmail}`, 'success');
    };

    const handleRemoveTeamMember = (id: string) => {
        const updated = team.filter(m => m.id !== id);
        setTeam(updated);
        setUserData('pumpkin_team_settings', updated);
        toast('Team member removed', 'info');
    };

    const handleSaveSecurity = () => {
        setUserData('pumpkin_security_settings', security);
        if (passwordData.new) {
            if (passwordData.new !== passwordData.confirm) return toast("Passwords don't match!", 'error');
            toast('Security updated & Password changed!', 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } else toast('Security settings updated.', 'success');
    };

    const handleRecoverData = () => {
        const user = api.getUser();
        const context = { email: user?.email || profile.email, companyName: company.companyName };
        const result = recoverOrphanData(context);
        if (result.success) {
            toast(`Successfully recovered ${result.recoveredCount} items!`, 'success');
            setOrphanStats({ found: false, count: 0 });
            setTimeout(() => window.location.reload(), 500);
        } else {
            toast('No matching data found.', 'error');
        }
    };

    const handleDeepRecover = (key: string, type: string) => {
        const user = api.getUser();
        const context = { email: user?.email || profile.email, companyName: company.companyName };
        const success = recoverSpecificKey(key, 'auto', context);
        if (success) {
            toast(`Recovered ${type} from key: ${key}`, 'success');
            setTimeout(() => window.location.reload(), 500);
        } else {
            toast('Failed to recover specific data.', 'error');
        }
    };

    // --- Payment Logic ---
    const openUpgradeModal = () => {
        setSelectedTier(plan);
        setPaymentStep('select');
        setIsUpgradeOpen(true);
    };

    const handlePlanSelect = (tier: 'free' | 'plus' | 'pro') => {
        setSelectedTier(tier);
        if (tier === 'free') {
            // Downgrade logic immediately
            setPaymentStep('select'); // Stay here but show confirm button
        } else {
            setPaymentStep('payment');
        }
    };

    const validatePaymentDetails = () => {
        const { number, expiry, cvc, name } = paymentDetails;
        if (!number || !expiry || !cvc || !name) {
            toast('Please fill in all payment details.', 'error');
            return false;
        }

        // Basic validation (mock)
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.length < 16 || isNaN(Number(cleanNumber))) {
            toast('Invalid card number.', 'error');
            return false;
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expiryRegex.test(expiry)) {
            toast('Invalid expiry date (MM/YY).', 'error');
            return false;
        }

        if (cvc.length < 3 || cvc.length > 4 || isNaN(Number(cvc))) {
            toast('Invalid CVC.', 'error');
            return false;
        }

        return true;
    };

    const processPayment = async () => {
        if (selectedTier !== 'free' && !validatePaymentDetails()) return;

        setIsProcessing(true);
        // Simulate Stripe delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setPlan(selectedTier);
        setUserData('pumpkin_billing_plan', selectedTier);

        // Set subscription start date for paid plans
        if (selectedTier === 'plus' || selectedTier === 'pro') {
            const { setSubscriptionStartDate } = await import('@/lib/subscription-utils');
            setSubscriptionStartDate();
        }

        setIsProcessing(false);
        setIsUpgradeOpen(false);

        if (selectedTier === 'pro' || selectedTier === 'plus') {
            toast(`Payment successful! Welcome to ${selectedTier === 'pro' ? 'Big Pumpkin' : 'Sprout'}.`, 'success');
        } else {
            toast('Plan downgraded to Seedling.', 'info');
        }
    };

    return (
        <DashboardShell>
            <PageHeader title="Patch Settings" description="Manage your account settings and preferences." breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />

            <Tabs defaultValue="billing" className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 shrink-0">
                    <TabsList className="flex flex-col h-auto w-full justify-start gap-1 bg-transparent p-0">
                        {['company', 'profile', 'billing', 'team', 'notifications', 'security', 'data'].map(tab => (
                            <TabsTrigger key={tab} value={tab} className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] border border-transparent data-[state=active]:border-primary/20 transition-all">
                                {tab === 'company' && <Building2 className="mr-3 h-4 w-4" />}
                                {tab === 'profile' && <User className="mr-3 h-4 w-4" />}
                                {tab === 'billing' && <CreditCard className="mr-3 h-4 w-4" />}
                                {tab === 'team' && <Users className="mr-3 h-4 w-4" />}
                                {tab === 'notifications' && <Bell className="mr-3 h-4 w-4" />}
                                {tab === 'security' && <Shield className="mr-3 h-4 w-4" />}
                                {tab === 'data' && <Database className="mr-3 h-4 w-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </aside>

                <div className="flex-1">
                    {/* --- COMPANY --- */}
                    <TabsContent value="company" className="mt-0 space-y-6">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Organization Branding</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Your professional identity across all documents.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logo</Label>
                                    <div className="flex items-start gap-6"><div className="h-24 w-24 shrink-0 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">{company.logo ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={company.logo} alt="Logo" className="h-full w-full object-contain p-2" />
                                    ) : <ImageIcon className="h-8 w-8 text-zinc-600" />}</div>
                                        <div className="space-y-3"><div className="flex gap-3"><Button variant="outline" className="h-9 px-4 text-xs font-bold uppercase tracking-widest border-white/10 bg-white/5" onClick={() => document.getElementById('logo')?.click()}><Upload className="mr-2 h-3 w-3" /> Upload</Button>{company.logo && <Button variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10" onClick={() => setCompany({ ...company, logo: '' })}>Remove</Button>}</div><input type="file" id="logo" className="hidden" accept="image/*" onChange={handleLogoUpload} /><p className="text-[10px] text-zinc-500">Max 1MB. JPG/PNG.</p></div></div></div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Organization Name</Label><Input value={company.companyName} onChange={e => setCompany({ ...company, companyName: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" placeholder="Acme Inc." /></div>
                                    <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact Phone</Label><Input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" placeholder="+1 (555) 000-0000" /></div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address Details</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="Street" value={company.address.street} onChange={e => setCompany({ ...company, address: { ...company.address, street: e.target.value } })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" />
                                        <Input placeholder="City" value={company.address.city} onChange={e => setCompany({ ...company, address: { ...company.address, city: e.target.value } })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" />
                                        <Input placeholder="State/Prov" value={company.address.state} onChange={e => setCompany({ ...company, address: { ...company.address, state: e.target.value } })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" />
                                        <Input placeholder="Country" value={company.address.country} onChange={e => setCompany({ ...company, address: { ...company.address, country: e.target.value } })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</Label><Input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Website</Label><Input value={company.website || ''} onChange={e => setCompany({ ...company, website: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div></div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brand Colors</Label>
                                    <div className="flex gap-4">
                                        <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-2 px-4">
                                            <input type="color" value={company.brandColors.primary} onChange={e => setCompany({ ...company, brandColors: { ...company.brandColors, primary: e.target.value } })} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <span className="text-[10px] font-bold uppercase text-zinc-500">Primary Color</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl p-2 px-4">
                                            <input type="color" value={company.brandColors.accent} onChange={e => setCompany({ ...company, brandColors: { ...company.brandColors, accent: e.target.value } })} className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" />
                                            <span className="text-[10px] font-bold uppercase text-zinc-500">Accent Color</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6"><Button onClick={handleSaveCompany} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Branding Settings</Button></CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- PROFILE --- */}
                    <TabsContent value="profile" className="mt-0 space-y-6">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Profile</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Personal details.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Profile Picture</Label>
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 shrink-0 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center overflow-hidden">
                                            {profile.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-8 w-8 text-primary" />
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <Button variant="outline" className="h-9 px-4 text-xs font-bold uppercase tracking-widest border-white/10 bg-white/5" onClick={() => document.getElementById('avatar')?.click()}>
                                                    <Upload className="mr-2 h-3 w-3" /> Change
                                                </Button>
                                                {profile.avatar && (
                                                    <Button variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10" onClick={() => setProfile({ ...profile, avatar: '' })}>
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <input type="file" id="avatar" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Max 1MB. SQUARE JPG/PNG PREFERRED.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">First Name</Label><Input value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Name</Label><Input value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div></div>
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</Label><Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div>
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bio</Label><Textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} className="min-h-[100px] bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6"><Button onClick={handleSaveProfile} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Changes</Button></CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- BILLING --- */}
                    <TabsContent value="billing" className="mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Billing & Plan</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Manage your subscription.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`p-6 md:p-8 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0 ${plan !== 'free' ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/10'}`}>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <p className="font-heading font-bold text-white uppercase tracking-widest text-lg">
                                                {plan === 'pro' ? 'Big Pumpkin' : plan === 'plus' ? 'Sprout' : 'Seedling Plan'}
                                            </p>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${plan !== 'free' ? 'bg-primary text-primary-foreground' : 'bg-zinc-800 text-zinc-400'}`}>
                                                {plan === 'pro' ? 'TIER 3' : plan === 'plus' ? 'TIER 2' : 'FREE'}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                            {plan === 'pro' ? '$29/mo • Unlimited • Full Power' : plan === 'plus' ? '$12/mo • 10 Projects • Growing' : 'Free forever • Up to 3 clients'}
                                        </p>
                                    </div>
                                    <Button onClick={openUpgradeModal} className={`h-12 w-full md:w-auto px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] ${plan !== 'free' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                                        {plan !== 'free' ? 'Manage Subscription' : 'Upgrade Plan'}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Next Payment: {plan !== 'free' ? nextPaymentDate : 'N/A'}</div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Method: {plan !== 'free' ? 'Visa •••• 4242' : 'None'}</div>
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Billing Email: {company.email || 'N/A'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TEAM --- */}
                    <TabsContent value="team" className="mt-0 space-y-6">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Team</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Manage access.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4"><Input placeholder="Email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /><Button onClick={handleAddTeamMember} className="h-12 px-6 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Invite</Button></div>
                                <div className="space-y-4">{team.map(m => (
                                    <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"><div className="flex items-center gap-4"><div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{m.name[0]}</div><div><p className="text-xs font-bold text-white uppercase tracking-widest">{m.name}</p><p className="text-[10px] font-bold text-zinc-500 uppercase">{m.email}</p></div></div><Button variant="ghost" size="icon" onClick={() => handleRemoveTeamMember(m.id)}><Trash2 className="h-4 w-4 text-zinc-500 hover:text-red-500" /></Button></div>
                                ))}</div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- NOTIFICATIONS --- */}
                    <TabsContent value="notifications" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Notifications</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Preferences.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { id: 'emailAlerts', label: 'Email Alerts' },
                                    { id: 'pushNotifications', label: 'Push Notifications' },
                                    { id: 'marketingEmails', label: 'Marketing Emails' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <p className="text-xs font-bold text-white uppercase tracking-widest">{item.label}</p>
                                        <Switch
                                            checked={notifications[item.id as keyof NotificationSettings]}
                                            onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, [item.id]: checked })}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6"><Button onClick={handleSaveNotifications} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Preferences</Button></CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- SECURITY --- */}
                    <TabsContent value="security" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Security</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Two-factor & Password.</CardDescription></CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4"><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Password</Label><Input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div><div className="grid grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</Label><Input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm</Label><Input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div></div></div>
                                <div className="pt-6 border-t border-white/5 flex items-center justify-between"><div className="space-y-1"><p className="text-xs font-bold text-white uppercase tracking-widest">Enable 2FA</p></div><Switch checked={security.twoFactorEnabled} onCheckedChange={c => setSecurity({ ...security, twoFactorEnabled: c })} /></div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6"><Button onClick={handleSaveSecurity} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Update Security</Button></CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- DATA RECOVERY --- */}
                    <TabsContent value="data" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Data Recovery</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Recover data from previous sessions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                                <div className="p-4 md:p-6 rounded-xl bg-white/5 border border-white/5 space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className={`p-3 rounded-full flex-shrink-0 ${orphanStats.found ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'}`}>
                                            <Database className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white uppercase tracking-widest text-sm">
                                                {orphanStats.found ? 'Orphaned Data Found' : 'No Lost Data Found'}
                                            </h3>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                {orphanStats.found
                                                    ? `We found ${orphanStats.count} items (invoices, clients, etc.) from a previous session or guest account. You can merge them into your current account below.`
                                                    : 'We scanned your local storage and didn\'t find any orphaned data. Your valid data should be visible.'}
                                            </p>
                                        </div>
                                    </div>

                                    {orphanStats.found && (
                                        <Button onClick={handleRecoverData} className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl">
                                            Recover & Merge {orphanStats.count} Items
                                        </Button>
                                    )}

                                    {/* Deep Scan Results */}
                                    {deepScanResults.length > 0 && (
                                        <div className="pt-6 border-t border-white/5 space-y-4">
                                            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Deep Scan Candidates</h3>
                                            <p className="text-[10px] text-zinc-500">We found these potential matches based on your &quot;Citrullix&quot; request or recognizable data shapes.</p>

                                            <div className="space-y-3">
                                                {deepScanResults.map((result, idx) => (
                                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 rounded-xl bg-white/5 border border-white/5 gap-3 md:gap-4 transition-colors hover:bg-white/[0.07]">
                                                        <div className="overflow-hidden space-y-1 flex-1 w-full">
                                                            <p className="text-xs font-bold text-white truncate">{result.summary}</p>
                                                            <p className="text-[10px] text-zinc-500 font-mono truncate opacity-60">{result.key}</p>
                                                            <div className="pt-1">
                                                                <span className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider">{result.type}</span>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            onClick={() => handleDeepRecover(result.key, result.type)}
                                                            variant="outline"
                                                            className="h-9 px-6 w-full sm:w-auto text-[10px] font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/20 text-primary rounded-lg transition-all"
                                                        >
                                                            Restore
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Wipe Data Section */}
                                    <div className="pt-6 border-t border-white/5 space-y-3">
                                        <h3 className="font-bold text-red-500 uppercase tracking-widest text-xs">Danger Zone</h3>
                                        <p className="text-[10px] text-zinc-500">If you see persistent mock data (like &quot;Michael Duo&quot;), use this to wipe your local cache completely.</p>
                                        <Button
                                            onClick={handleWipeData}
                                            variant="outline"
                                            className="w-full h-11 border-red-500/20 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all"
                                        >
                                            Wipe All Local State
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            {/* --- UPGRADE MODAL --- */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-[#051c1c] border-white/10 text-white p-0 rounded-2xl md:rounded-3xl">
                    <DialogHeader className="p-4 md:p-8 pb-4">
                        <DialogTitle className="text-xl font-heading uppercase tracking-widest text-start flex items-center gap-2">
                            {plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-bold uppercase tracking-widest text-xs text-start">
                            {paymentStep === 'select' ? 'Choose the plan that fits your patch.' : 'Enter your payment details.'}
                        </DialogDescription>
                    </DialogHeader>

                    {paymentStep === 'select' ? (
                        <div className="p-4 md:p-8 pt-0 grid md:grid-cols-3 gap-4">
                            {/* SEEDLING */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-4 md:p-6 transition-all ${selectedTier === 'free' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('free')}
                            >
                                <div className="text-2xl md:text-3xl mb-3 md:mb-4">🌱</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Seedling</span>
                                    {selectedTier === 'free' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-xl md:text-2xl font-bold mb-4">$0 <span className="text-sm font-normal text-zinc-500">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3" /> 3 Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Basic CRM</li>
                                </ul>
                            </div>

                            {/* SPROUT */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-4 md:p-6 transition-all ${selectedTier === 'plus' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('plus')} // Mapping Sprout to 'plus'
                            >
                                <div className="text-2xl md:text-3xl mb-3 md:mb-4">🌿</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Sprout</span>
                                    {selectedTier === 'plus' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-xl md:text-2xl font-bold mb-4 text-white">$12 <span className="text-sm font-normal text-zinc-500">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3 text-white" /> 10 Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3 text-white" /> Advanced CRM</li>
                                </ul>
                            </div>

                            {/* BIG PUMPKIN */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-4 md:p-6 transition-all ${selectedTier === 'pro' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('pro')} // Mapping Big Pumpkin to 'pro'
                            >
                                <div className="absolute top-4 right-4 text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Best</div>
                                <div className="text-2xl md:text-3xl mb-3 md:mb-4">🔥</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Big Pumpkin</span>
                                    {selectedTier === 'pro' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-xl md:text-2xl font-bold mb-4 text-primary">$29 <span className="text-sm font-normal text-primary/60">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Unlimited Projects</li>
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Full Automation</li>
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Team Access</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 md:p-8 pt-0 space-y-6">
                            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white uppercase tracking-widest text-xs">
                                        {selectedTier === 'pro' ? 'Big Pumpkin' : 'Sprout'} Plan
                                    </p>
                                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
                                        {selectedTier === 'pro' ? '$29.00' : '$12.00'} / month
                                    </p>
                                </div>
                                <div className="font-bold text-primary text-xl">
                                    {selectedTier === 'pro' ? '$29.00' : '$12.00'}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Card Information</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-zinc-500" />
                                        <Input
                                            placeholder="0000 0000 0000 0000"
                                            className="h-12 pl-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
                                            value={paymentDetails.number}
                                            onChange={e => setPaymentDetails({ ...paymentDetails, number: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Expiry Date</Label>
                                        <Input
                                            placeholder="MM/YY"
                                            className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
                                            value={paymentDetails.expiry}
                                            onChange={e => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CVC</Label>
                                        <Input
                                            placeholder="123"
                                            className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
                                            value={paymentDetails.cvc}
                                            onChange={e => setPaymentDetails({ ...paymentDetails, cvc: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name on Card</Label>
                                    <Input
                                        placeholder="JOHN APPLESEED"
                                        className="h-12 bg-black/40 border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest"
                                        value={paymentDetails.name}
                                        onChange={e => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-4 md:p-8 border-t border-white/5 bg-white/[0.02]">
                        {paymentStep === 'payment' && (
                            <Button variant="ghost" onClick={() => setPaymentStep('select')} disabled={isProcessing} className="mr-auto h-12 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5">
                                Back
                            </Button>
                        )}

                        {(paymentStep === 'select' && selectedTier === plan) ? (
                            <Button disabled className="h-12 px-8 rounded-xl bg-white/5 text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Current Plan</Button>
                        ) : (
                            <Button
                                onClick={processPayment}
                                disabled={isProcessing}
                                className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px] min-w-[140px]"
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    paymentStep === 'select'
                                        ? (selectedTier === 'free' ? 'Confirm Downgrade' : 'Proceed to Payment')
                                        : `Pay ${selectedTier === 'pro' ? '$29.00' : '$12.00'}`
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
