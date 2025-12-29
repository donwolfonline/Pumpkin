'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Building2,
    Calendar,
    FileText,
    FileSignature,
    PenLine,
    Save
} from 'lucide-react';
import { Contact } from '@/lib/types/crm';
import { Invoice } from '@/lib/types/invoice';
import { Proposal } from '@/lib/types/proposal';
import { Contract } from '@/lib/types/contract';
import { getContacts, setContacts, getInvoices, getProposals, getContracts } from '@/lib/storage-utils';

export default function ContactDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { toast } = usePumpkinToast();
    const [contact, setContact] = useState<Contact | null>(null);
    const [invoices, setInvoicesList] = useState<Invoice[]>([]);
    const [proposals, setProposalsList] = useState<Proposal[]>([]);
    const [contracts, setContractsList] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        const loadData = () => {
            const allContacts = getContacts();
            const found = allContacts.find(c => c.id === params.id);

            if (!found) {
                toast('Contact not found', 'error');
                router.push('/crm');
                return;
            }

            setContact(found);
            setNotes(found.notes || '');

            // Load related items
            const allInvoices = getInvoices();
            setInvoicesList(allInvoices.filter(i => i.clientId === params.id));

            const allProposals = getProposals();
            setProposalsList(allProposals.filter(p => p.clientId === params.id));

            const allContracts = getContracts();
            // Assuming contracts have distinct clientId or link via proposal/invoice?
            // Checking contracts type... usually they have clientName but maybe not ID.
            // For now, filter by matching name if ID not present, or assume future implementation
            // Let's check matching name for now as fallback
            setContractsList(allContracts.filter(c =>
                c.clientId === params.id ||
                c.clientName?.toLowerCase() === found.name.toLowerCase()
            ));

            setIsLoading(false);
        };
        loadData();
    }, [params.id, router, toast]);

    const handleSave = () => {
        if (!contact) return;
        const allContacts = getContacts();
        const updated = {
            ...contact,
            notes,
            lastActivity: new Date().toISOString()
        };
        const newContacts = allContacts.map(c => c.id === contact.id ? updated : c);
        setContacts(newContacts);
        setContact(updated);
        setIsEditing(false);
        toast('Contact updated successfully', 'success');
    };

    if (isLoading) return <DashboardShell><div>Loading...</div></DashboardShell>;
    if (!contact) return <DashboardShell><div>Contact not found</div></DashboardShell>;

    return (
        <DashboardShell>
            <PageHeader
                title={contact.name}
                description="Contact Details & History"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'CRM', href: '/crm' },
                    { label: contact.name }
                ]}
                action={{
                    label: isEditing ? "Save Changes" : "Edit Contact",
                    icon: isEditing ? <Save className="h-4 w-4" /> : <PenLine className="h-4 w-4" />,
                    onClick: isEditing ? handleSave : () => setIsEditing(true)
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-[#0c2a27] border-white/5 text-white">
                        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-24 w-24 border-4 border-[#164e46]">
                                <AvatarImage src={contact.avatar} />
                                <AvatarFallback className="text-2xl bg-[#0a2c28] text-primary">
                                    {contact.firstName[0]}{contact.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold">{contact.name}</h2>
                                <p className="text-zinc-400 font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-1 mt-1">
                                    <Building2 className="h-3 w-3" />
                                    {contact.company || 'No Company'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <StatusBadge variant={contact.status === 'active' ? 'success' : 'secondary'}>
                                    {contact.status}
                                </StatusBadge>
                                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                                    {contact.type}
                                </span>
                            </div>

                            <div className="w-full pt-4 space-y-3 text-sm text-left border-t border-white/5 mt-4">
                                <div className="flex items-center gap-3 text-zinc-400">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{contact.email}</span>
                                </div>
                                {contact.phone && (
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        <span>{contact.phone}</span>
                                    </div>
                                )}
                                {contact.website && (
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <Globe className="h-4 w-4 shrink-0" />
                                        <span>{contact.website}</span>
                                    </div>
                                )}
                                {contact.address && (
                                    <div className="flex items-center gap-3 text-zinc-400">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{contact.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-zinc-500 text-xs pt-2">
                                    <Calendar className="h-3 w-3 shrink-0" />
                                    <span>Last Activity: {new Date(contact.lastActivity).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#0c2a27] border-white/5 text-white">
                        <CardHeader>
                            <CardTitle className="text-sm font-heading uppercase tracking-widest">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-black/20 border-white/10 min-h-[150px]"
                                    placeholder="Add notes about this contact..."
                                />
                            ) : (
                                <div className="text-sm text-zinc-400 whitespace-pre-wrap">
                                    {notes || "No notes added yet."}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Info */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-[#0a2c28] border border-white/5 p-1">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-black text-zinc-400">Overview</TabsTrigger>
                            <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-black text-zinc-400">Invoices</TabsTrigger>
                            <TabsTrigger value="proposals" className="data-[state=active]:bg-primary data-[state=active]:text-black text-zinc-400">Proposals</TabsTrigger>
                            <TabsTrigger value="contracts" className="data-[state=active]:bg-primary data-[state=active]:text-black text-zinc-400">Contracts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6 space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="bg-[#0c2a27] border-white/5">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-bold text-white">${invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString()}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Lifetime Value</span>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0c2a27] border-white/5">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-bold text-primary">{proposals.filter(p => p.status === 'accepted' || p.status === 'signed').length}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Won Deals</span>
                                    </CardContent>
                                </Card>
                                <Card className="bg-[#0c2a27] border-white/5">
                                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                        <span className="text-2xl font-bold text-white">{invoices.filter(i => i.status === 'pending' || i.status === 'draft').length}</span>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Open Invoices</span>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Activity or Empty State */}
                            <Card className="bg-[#0c2a27] border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-sm font-heading uppercase tracking-widest text-white">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-zinc-500 text-sm">No recent activity recorded.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="invoices" className="mt-6">
                            {invoices.length > 0 ? (
                                <div className="grid gap-3">
                                    {invoices.map(inv => (
                                        <div key={inv.id} className="p-4 bg-[#0c2a27] border border-white/5 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Invoice #{inv.invoiceNumber}</p>
                                                    <p className="text-xs text-zinc-500">{new Date(inv.issueDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-white">${inv.total?.toLocaleString()}</p>
                                                <StatusBadge variant={inv.status === 'paid' ? 'success' : 'warning'}>{inv.status}</StatusBadge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500">No invoices found for this contact.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="proposals" className="mt-6">
                            {proposals.length > 0 ? (
                                <div className="grid gap-3">
                                    {proposals.map(prop => (
                                        <div key={prop.id} className="p-4 bg-[#0c2a27] border border-white/5 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{prop.title}</p>
                                                    <p className="text-xs text-zinc-500">Sent {new Date(prop.createdAt || '').toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge variant={prop.status === 'signed' ? 'success' : 'secondary'}>{prop.status}</StatusBadge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500">No proposals found for this contact.</p>
                            )}
                        </TabsContent>

                        <TabsContent value="contracts" className="mt-6">
                            {contracts.length > 0 ? (
                                <div className="grid gap-3">
                                    {contracts.map(con => (
                                        <div key={con.id} className="p-4 bg-[#0c2a27] border border-white/5 rounded-xl flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                                    <FileSignature className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{con.title}</p>
                                                    <p className="text-xs text-zinc-500">Status: {con.status}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge variant={con.status === 'signed' ? 'success' : 'secondary'}>{con.status}</StatusBadge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500">No contracts found for this contact.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardShell>
    );
}
