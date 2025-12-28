"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, CreditCard, Users, Bell, Shield, Building2, Upload, Image as ImageIcon, Trash2, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface CompanySettings {
    name: string;
    address: string;
    email: string;
    website: string;
    logoUrl: string;
}

interface ProfileSettings {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
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

    // --- State ---
    const [company, setCompany] = useState<CompanySettings>({ name: '', address: '', email: '', website: '', logoUrl: '' });
    const [profile, setProfile] = useState<ProfileSettings>({ firstName: '', lastName: '', email: '', bio: '' });
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [plan, setPlan] = useState<'free' | 'plus' | 'pro'>('free');
    const [notifications, setNotifications] = useState<NotificationSettings>({ emailAlerts: true, pushNotifications: true, marketingEmails: false });
    const [security, setSecurity] = useState<SecuritySettings>({ twoFactorEnabled: false });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    // --- Modal State ---
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'select' | 'payment'>('select');
    const [selectedTier, setSelectedTier] = useState<'free' | 'plus' | 'pro'>('free');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

    // --- Load Data ---
    useEffect(() => {
        const load = (key: string, setter: (val: any) => void) => {
            const data = localStorage.getItem(key);
            if (data) try { setter(JSON.parse(data)); } catch (e) { console.error(`Error loading ${key}`, e); }
        };
        load('pumpkin_company_settings', setCompany);
        load('pumpkin_profile_settings', setProfile);
        load('pumpkin_team_settings', setTeam);
        load('pumpkin_billing_plan', setPlan);
        load('pumpkin_notifications_settings', setNotifications);
        load('pumpkin_security_settings', setSecurity);

        if (!localStorage.getItem('pumpkin_profile_settings')) {
            const apiUser = api.getUser();
            if (apiUser) setProfile({ firstName: apiUser.firstName, lastName: apiUser.lastName, email: apiUser.email, bio: '' });
        }
    }, []);

    // --- Handlers ---
    const handleSaveCompany = () => { localStorage.setItem('pumpkin_company_settings', JSON.stringify(company)); toast('Company settings saved!', 'success'); };
    const handleSaveProfile = () => { localStorage.setItem('pumpkin_profile_settings', JSON.stringify(profile)); toast('Profile updated!', 'success'); };
    const handleSaveNotifications = () => { localStorage.setItem('pumpkin_notifications_settings', JSON.stringify(notifications)); toast('Preferences saved.', 'success'); };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) return toast("File too large (max 1MB)", 'error');
            const reader = new FileReader();
            reader.onloadend = () => setCompany(prev => ({ ...prev, logoUrl: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    const handleAddTeamMember = () => {
        if (!newMemberEmail) return;
        const newMember: TeamMember = { id: crypto.randomUUID(), name: 'Pending User', email: newMemberEmail, role: 'Member' };
        const updated = [...team, newMember];
        setTeam(updated);
        localStorage.setItem('pumpkin_team_settings', JSON.stringify(updated));
        setNewMemberEmail('');
        toast(`Invitation sent to ${newMemberEmail}`, 'success');
    };

    const handleRemoveTeamMember = (id: string) => {
        const updated = team.filter(m => m.id !== id);
        setTeam(updated);
        localStorage.setItem('pumpkin_team_settings', JSON.stringify(updated));
        toast('Team member removed', 'info');
    };

    const handleSaveSecurity = () => {
        localStorage.setItem('pumpkin_security_settings', JSON.stringify(security));
        if (passwordData.new) {
            if (passwordData.new !== passwordData.confirm) return toast("Passwords don't match!", 'error');
            toast('Security updated & Password changed!', 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } else toast('Security settings updated.', 'success');
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

    const processPayment = async () => {
        setIsProcessing(true);
        // Simulate Stripe delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setPlan(selectedTier);
        localStorage.setItem('pumpkin_billing_plan', JSON.stringify(selectedTier));
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
                        {['company', 'profile', 'billing', 'team', 'notifications', 'security'].map(tab => (
                            <TabsTrigger key={tab} value={tab} className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-bold uppercase tracking-widest text-[10px] border border-transparent data-[state=active]:border-primary/20 transition-all">
                                {tab === 'company' && <Building2 className="mr-3 h-4 w-4" />}
                                {tab === 'profile' && <User className="mr-3 h-4 w-4" />}
                                {tab === 'billing' && <CreditCard className="mr-3 h-4 w-4" />}
                                {tab === 'team' && <Users className="mr-3 h-4 w-4" />}
                                {tab === 'notifications' && <Bell className="mr-3 h-4 w-4" />}
                                {tab === 'security' && <Shield className="mr-3 h-4 w-4" />}
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </aside>

                <div className="flex-1">
                    {/* --- COMPANY --- */}
                    <TabsContent value="company" className="mt-0 space-y-6">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Company Branding</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Your business identity.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logo</Label>
                                    <div className="flex items-start gap-6"><div className="h-24 w-24 shrink-0 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">{company.logoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={company.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                                    ) : <ImageIcon className="h-8 w-8 text-zinc-600" />}</div>
                                        <div className="space-y-3"><div className="flex gap-3"><Button variant="outline" className="h-9 px-4 text-xs font-bold uppercase tracking-widest border-white/10 bg-white/5" onClick={() => document.getElementById('logo')?.click()}><Upload className="mr-2 h-3 w-3" /> Upload</Button>{company.logoUrl && <Button variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10" onClick={() => setCompany({ ...company, logoUrl: '' })}>Remove</Button>}</div><input type="file" id="logo" className="hidden" accept="image/*" onChange={handleLogoUpload} /><p className="text-[10px] text-zinc-500">Max 1MB. JPG/PNG.</p></div></div></div>
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Organization Name</Label><Input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" placeholder="Acme Inc." /></div>
                                <div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address</Label><Input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div>
                                <div className="grid grid-cols-2 gap-6"><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</Label><Input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div><div className="space-y-2"><Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Website</Label><Input value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest" /></div></div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6"><Button onClick={handleSaveCompany} className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Changes</Button></CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- PROFILE --- */}
                    <TabsContent value="profile" className="mt-0 space-y-6">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-xl backdrop-blur-xl">
                            <CardHeader><CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Profile</CardTitle><CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Personal details.</CardDescription></CardHeader>
                            <CardContent className="space-y-6">
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
                                <div className={`p-8 border rounded-2xl flex items-center justify-between ${plan !== 'free' ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/10'}`}>
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
                                    <Button onClick={openUpgradeModal} className={`h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] ${plan !== 'free' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}>
                                        {plan !== 'free' ? 'Manage Subscription' : 'Upgrade Plan'}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Next Payment: {plan !== 'free' ? 'Oct 1, 2025' : 'N/A'}</div>
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
                                        <Switch checked={!!(notifications as any)[item.id]} onCheckedChange={(checked: boolean) => setNotifications({ ...notifications, [item.id]: checked })} />
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
                </div>
            </Tabs>

            {/* --- UPGRADE MODAL --- */}
            <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
                <DialogContent className="max-w-4xl bg-[#051c1c] border-white/10 text-white p-0 overflow-hidden rounded-3xl">
                    <DialogHeader className="p-8 pb-4">
                        <DialogTitle className="text-xl font-heading uppercase tracking-widest text-start flex items-center gap-2">
                            {plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 font-bold uppercase tracking-widest text-xs text-start">
                            {paymentStep === 'select' ? 'Choose the plan that fits your patch.' : 'Enter your payment details.'}
                        </DialogDescription>
                    </DialogHeader>

                    {paymentStep === 'select' ? (
                        <div className="p-8 pt-0 grid md:grid-cols-3 gap-4">
                            {/* SEEDLING */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedTier === 'free' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('free')}
                            >
                                <div className="text-3xl mb-4">🌱</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Seedling</span>
                                    {selectedTier === 'free' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-2xl font-bold mb-4">$0 <span className="text-sm font-normal text-zinc-500">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3" /> 3 Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3" /> Basic CRM</li>
                                </ul>
                            </div>

                            {/* SPROUT */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedTier === 'plus' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('plus')} // Mapping Sprout to 'plus'
                            >
                                <div className="text-3xl mb-4">🌿</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Sprout</span>
                                    {selectedTier === 'plus' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-2xl font-bold mb-4 text-white">$12 <span className="text-sm font-normal text-zinc-500">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3 text-white" /> 10 Projects</li>
                                    <li className="flex items-center gap-2"><Check className="h-3 w-3 text-white" /> Advanced CRM</li>
                                </ul>
                            </div>

                            {/* BIG PUMPKIN */}
                            <div
                                className={`cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedTier === 'pro' ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                                onClick={() => handlePlanSelect('pro')} // Mapping Big Pumpkin to 'pro'
                            >
                                <div className="absolute top-4 right-4 text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Best</div>
                                <div className="text-3xl mb-4">🔥</div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-heading uppercase tracking-widest text-sm text-white">Big Pumpkin</span>
                                    {selectedTier === 'pro' && <Check className="h-5 w-5 text-primary" />}
                                </div>
                                <div className="text-2xl font-bold mb-4 text-primary">$29 <span className="text-sm font-normal text-primary/60">/mo</span></div>
                                <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Unlimited Projects</li>
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Full Automation</li>
                                    <li className="flex items-center gap-2 text-white"><Check className="h-3 w-3 text-primary" /> Team Access</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 pt-0 space-y-6">
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

                    <DialogFooter className="p-8 border-t border-white/5 bg-white/[0.02]">
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
