"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { User, CreditCard, Users, Bell, Shield, Building2, Upload, Image as ImageIcon, Trash2, Check, Lock, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { Switch } from '@/components/ui/switch'; // Assuming Switch component exists or I'll use a checkbox for now if not
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

    // --- Company State ---
    const [company, setCompany] = useState<CompanySettings>({
        name: '', address: '', email: '', website: '', logoUrl: ''
    });

    // --- Profile State ---
    const [profile, setProfile] = useState<ProfileSettings>({
        firstName: '', lastName: '', email: '', bio: ''
    });

    // --- Team State ---
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    // --- Billing State ---
    const [plan, setPlan] = useState<'free' | 'pro'>('free');

    // --- Notifications State ---
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailAlerts: true, pushNotifications: true, marketingEmails: false
    });

    // --- Security State ---
    const [security, setSecurity] = useState<SecuritySettings>({
        twoFactorEnabled: false
    });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    // --- Load Data ---
    useEffect(() => {
        const load = (key: string, setter: any) => {
            const data = localStorage.getItem(key);
            if (data) {
                try { setter(JSON.parse(data)); } catch (e) { console.error(`Error loading ${key}`, e); }
            }
        };

        load('pumpkin_company_settings', setCompany);
        load('pumpkin_profile_settings', setProfile); // Initialize from storage, or fallback to user api later if needed
        load('pumpkin_team_settings', setTeam);
        load('pumpkin_billing_plan', setPlan);
        load('pumpkin_notifications_settings', setNotifications);
        load('pumpkin_security_settings', setSecurity);

        // Fallback for profile if empty
        if (!localStorage.getItem('pumpkin_profile_settings')) {
            const apiUser = api.getUser();
            if (apiUser) {
                setProfile({
                    firstName: apiUser.firstName,
                    lastName: apiUser.lastName,
                    email: apiUser.email,
                    bio: ''
                });
            }
        }
    }, []);

    // --- Handlers ---

    const handleSaveCompany = () => {
        localStorage.setItem('pumpkin_company_settings', JSON.stringify(company));
        toast('Company settings saved successfully!', 'success');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                toast("File too large (max 1MB)", 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setCompany(prev => ({ ...prev, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        localStorage.setItem('pumpkin_profile_settings', JSON.stringify(profile));
        toast('Profile updated successfully!', 'success');
    };

    const handleAddTeamMember = () => {
        if (!newMemberEmail) return;
        const newMember: TeamMember = {
            id: crypto.randomUUID(),
            name: 'Pending User',
            email: newMemberEmail,
            role: 'Member'
        };
        const updatedTeam = [...team, newMember];
        setTeam(updatedTeam);
        localStorage.setItem('pumpkin_team_settings', JSON.stringify(updatedTeam));
        setNewMemberEmail('');
        toast('Invitation sent to ' + newMemberEmail, 'success');
    };

    const handleRemoveTeamMember = (id: string) => {
        const updatedTeam = team.filter(m => m.id !== id);
        setTeam(updatedTeam);
        localStorage.setItem('pumpkin_team_settings', JSON.stringify(updatedTeam));
        toast('Team member removed', 'info');
    };

    const handleUpgradePlan = () => {
        setPlan(plan === 'free' ? 'pro' : 'free');
        localStorage.setItem('pumpkin_billing_plan', JSON.stringify(plan === 'free' ? 'pro' : 'free'));
        toast(plan === 'free' ? 'Welcome to the Pumpkin Patch Pro!' : 'Downgraded to Seedling Plan.', 'success');
    };

    const handleSaveNotifications = () => {
        localStorage.setItem('pumpkin_notifications_settings', JSON.stringify(notifications));
        toast('Notification preferences saved.', 'success');
    };

    const handleSaveSecurity = () => {
        localStorage.setItem('pumpkin_security_settings', JSON.stringify(security));
        if (passwordData.new) {
            if (passwordData.new !== passwordData.confirm) {
                toast("Passwords don't match!", 'error');
                return;
            }
            toast('Security settings updated & Password changed!', 'success');
            setPasswordData({ current: '', new: '', confirm: '' });
        } else {
            toast('Security settings updated.', 'success');
        }
    };

    return (
        <DashboardShell>
            <PageHeader
                title="Patch Settings"
                description="Manage your account settings and preferences."
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Settings' }
                ]}
            />

            <Tabs defaultValue="company" className="flex flex-col md:flex-row gap-8">
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
                    {/* --- COMPANY TAB --- */}
                    <TabsContent value="company" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Company Branding</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Configure your business details for documents and invoices.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Logo</Label>
                                    <div className="flex items-start gap-6">
                                        <div className="h-24 w-24 shrink-0 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                            {company.logoUrl ? (
                                                <img src={company.logoUrl} alt="Company Logo" className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-zinc-600" />
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex gap-3">
                                                <Button type="button" variant="outline" className="h-9 px-4 text-xs font-bold uppercase tracking-widest border-white/10 bg-white/5 hover:bg-white/10" onClick={() => document.getElementById('logo-upload')?.click()}>
                                                    <Upload className="mr-2 h-3 w-3" /> Upload Image
                                                </Button>
                                                {company.logoUrl && (
                                                    <Button type="button" variant="ghost" className="h-9 px-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => setCompany({ ...company, logoUrl: '' })}>
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            <input type="file" id="logo-upload" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleLogoUpload} />
                                            <p className="text-[10px] text-zinc-500">Recommended size: 256x256px. Max size: 1MB. Formats: JPG, PNG.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Organization Name</Label>
                                    <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" placeholder="Acme Inc." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Business Address</Label>
                                    <Input value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" placeholder="123 Growth St, New York, NY" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Business Email</Label>
                                        <Input value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" placeholder="contact@acme.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Website</Label>
                                        <Input value={company.website} onChange={(e) => setCompany({ ...company, website: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" placeholder="https://acme.com" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6">
                                <Button onClick={handleSaveCompany} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- PROFILE TAB --- */}
                    <TabsContent value="profile" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Profile Information</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Update your personal identity in the patch.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">First name</Label>
                                        <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Last name</Label>
                                        <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Email address</Label>
                                    <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Bio</Label>
                                    <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="min-h-[100px] bg-black/40 border-white/5 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" placeholder="Tell us about yourself" />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6">
                                <Button onClick={handleSaveProfile} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- BILLING TAB --- */}
                    <TabsContent value="billing" className="mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Billing & Plan</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Manage your subscription and harvesting nutrients.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`p-6 border rounded-2xl flex items-center justify-between ${plan === 'pro' ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/10'}`}>
                                    <div>
                                        <p className="font-bold text-white uppercase tracking-widest text-sm mb-1">{plan === 'pro' ? 'Master Gardener (Pro)' : 'Seedling Plan (Free)'}</p>
                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {plan === 'pro' ? '$29/month • Unlimited Clients • Team Access' : 'Free forever • Up to 3 clients'}
                                        </p>
                                    </div>
                                    <Button onClick={handleUpgradePlan} variant={plan === 'pro' ? "secondary" : "default"} className="h-10 text-[10px] font-bold uppercase tracking-widest rounded-xl px-6">
                                        {plan === 'pro' ? 'Manage Subscription' : 'Upgrade Plan'}
                                    </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Next Payment: Oct 1, 2025', 'Payment Method: Visa •••• 4242', 'Billing Email: billing@acme.com'].map((info, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                            {info}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- TEAM TAB --- */}
                    <TabsContent value="team" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Team Members</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Manage who has access to your patch.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <Input
                                        placeholder="colleague@example.com"
                                        className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTeamMember()}
                                    />
                                    <Button onClick={handleAddTeamMember} className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                                        Invite Member
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {team.length === 0 && <p className="text-center text-zinc-600 text-xs italic py-8">No team members yet. Invite someone!</p>}
                                    {team.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase tracking-widest">{member.name}</p>
                                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{member.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-lg">{member.role}</span>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleRemoveTeamMember(member.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- NOTIFICATIONS TAB --- */}
                    <TabsContent value="notifications" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Notification Preferences</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Choose how Pumpkin communicates with you.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {[
                                    { id: 'emailAlerts', label: 'Email Alerts', sub: 'Receive emails about updates, invoices, and activity.' },
                                    { id: 'pushNotifications', label: 'Push Notifications', sub: 'Get spooky notifications on your device.' },
                                    { id: 'marketingEmails', label: 'Marketing Emails', sub: 'Receive tips, tricks, and pumpkin recipes.' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">{item.label}</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{item.sub}</p>
                                        </div>
                                        <Switch
                                            checked={(notifications as any)[item.id]}
                                            onCheckedChange={(checked) => setNotifications({ ...notifications, [item.id]: checked })}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6">
                                <Button onClick={handleSaveNotifications} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* --- SECURITY TAB --- */}
                    <TabsContent value="security" className="space-y-6 mt-0">
                        <Card className="bg-black/20 border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Security & Access</CardTitle>
                                <CardDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Protect your patch from pests and unauthorized access.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2"><Lock className="h-3 w-3" /> Change Password</h4>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Current Password</Label>
                                        <Input type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">New Password</Label>
                                            <Input type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Confirm New Password</Label>
                                            <Input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className="h-12 bg-black/40 border-white/5 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-primary/20" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2"><Smartphone className="h-3 w-3" /> Two-Factor Authentication</h4>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-widest">Enable 2FA</p>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Add an extra layer of security to your account.</p>
                                        </div>
                                        <Switch
                                            checked={security.twoFactorEnabled}
                                            onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-6">
                                <Button onClick={handleSaveSecurity} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Update Security</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </DashboardShell>
    );
}
