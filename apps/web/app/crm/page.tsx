"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/features/crm/contact-columns';
import { Plus, Users, Loader2, ChevronRight, Mail, Building2 } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import Link from 'next/link';

import { Contact } from '@/lib/types/crm';
import { getContacts, setContacts } from '@/lib/storage-utils';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CRMPage() {
    const [contacts, setContactsList] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { toast } = usePumpkinToast();

    // Load contacts on mount
    useEffect(() => {
        const loadData = () => {
            setContactsList(getContacts());
            setIsLoading(false);
        };
        const timer = setTimeout(loadData, 0);
        return () => clearTimeout(timer);
    }, []);

    // Helper to update both state and storage
    const updateContacts = (newContacts: Contact[]) => {
        setContactsList(newContacts);
        setContacts(newContacts);
    };

    const handleCreateContact = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const fullName = (formData.get('name') as string).trim();
        const nameParts = fullName.split(' ');

        const newContact: Contact = {
            id: crypto.randomUUID(),
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            name: fullName,
            email: formData.get('email') as string,
            company: formData.get('role') as string || '',
            status: 'active',
            type: 'lead',
            phone: '',
            lastActivity: new Date().toISOString(),
        };

        updateContacts([newContact, ...contacts]);
        setIsDialogOpen(false);

        toast(`${fullName} has been planted in your patch.`, 'success');
    };

    const searchKey: string = ""; // Placeholder for search functionality
    const hasContacts = contacts.length > 0;

    return (
        <DashboardShell>
            <PageHeader
                title="Patch Contacts"
                description="Manage your leads, clients, and partners."
                action={{
                    label: 'New Contact',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => setIsDialogOpen(true)
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'CRM' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">Plant New Contact</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Add a new connection to your business patch.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateContact} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Full Name</Label>
                            <Input id="name" name="name" placeholder="Peter Pumpkin" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="peter@example.com" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Role / Company</Label>
                            <Input id="role" name="role" placeholder="CEO at Harvest Co." className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm" />
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Add Contact
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            ) : hasContacts ? (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <DataTable
                            columns={columns}
                            data={contacts}
                            searchKey="name"
                        />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {contacts.filter(contact => !searchKey || `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchKey.toLowerCase())).map((contact) => (
                            <Link
                                key={contact.id}
                                href={`#`} // Placeholder, maybe link to edit later
                                className="block"
                            >
                                <div className="bg-[#0a2c28] border border-white/5 rounded-2xl p-5 space-y-4 active:scale-95 transition-transform">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-white text-lg">{contact.firstName} {contact.lastName}</h3>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Building2 className="h-3 w-3" />
                                                <p className="text-xs font-bold uppercase tracking-widest">{contact.company || 'No Company'}</p>
                                            </div>
                                        </div>
                                        <div className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{contact.type}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-zinc-400">
                                                <Mail className="h-3 w-3" />
                                                <p className="text-sm font-medium">{contact.email}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-zinc-600" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {contacts.length === 0 && (
                            <p className="text-center text-zinc-500 py-8">No contacts found.</p>
                        )}
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={Users}
                    title="No Seeds Planted"
                    description="Your CRM is empty. Add your first contact to start tracking relationships and building your pumpkin empire."
                    actionLabel="Add First Contact"
                    onAction={() => setIsDialogOpen(true)}
                />
            )}
        </DashboardShell>
    );
}
