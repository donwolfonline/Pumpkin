"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger }
    from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, FileText, PenTool, Files, Loader2, BookOpen, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { jsPDF } from "jspdf";
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';

interface Document {
    id: string;
    title: string;
    type: string;
    client: string;
    date: string;
    status: string;
    content: string;
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';

import { Contact } from '@/lib/types/crm';

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const { toast } = usePumpkinToast();

    // Form state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedType, setSelectedType] = useState('Proposal');
    const [selectedClient, setSelectedClient] = useState('');

    // Load data on mount
    useEffect(() => {
        const saved = localStorage.getItem('pumpkin_documents');
        if (saved) {
            try {
                const parsed: Document[] = JSON.parse(saved);
                // Migration check: if old docs had numeric IDs or missing fields
                if (parsed.length > 0 && typeof parsed[0].id === 'number') {
                    const migrated = parsed.map((doc: any) => ({
                        ...doc,
                        id: String(doc.id),
                        status: doc.status || 'draft',
                        content: doc.content || ''
                    }));
                    setDocuments(migrated);
                } else {
                    // Ensure all docs have an ID and content for existing string IDs
                    const migrated = parsed.map(doc => ({
                        ...doc,
                        id: doc.id || crypto.randomUUID(),
                        content: doc.content || ''
                    }));
                    setDocuments(migrated);
                }
            } catch (e) {
                console.error("Failed to parse documents", e);
                // Fallback to seeding defaults if parsing fails
                const defaults: Document[] = [
                    {
                        id: crypto.randomUUID(),
                        title: 'Standard Service Agreement',
                        type: 'Template',
                        client: 'Internal',
                        date: new Date().toLocaleDateString(),
                        status: 'draft',
                        content: `SERVICE AGREEMENT

BETWEEN: {{client_name}}
AND: {{company_name}}

1. SERVICES
Provider agrees to perform the services described in the attached SOW.

2. COMPENSATION
Client agrees to pay Provider as outlined in the attached Invoice.

3. CONFIDENTIALITY
Both parties agree to keep all proprietary information confidential.

4. TERM
This agreement shall commence on {{date}} and continue until completion.`
                    },
                    {
                        id: crypto.randomUUID(),
                        title: 'Project Proposal Structure',
                        type: 'Template',
                        client: 'Internal',
                        date: new Date().toLocaleDateString(),
                        status: 'draft',
                        content: `PROJECT PROPOSAL
Prepared for: {{client_name}}

1. EXECUTIVE SUMMARY
Brief overview of the project goals.

2. PROJECT SCOPE
Detailed description of deliverables.

3. TIMELINE
Phase 1: Discovery
Phase 2: Design
Phase 3: Development

4. INVESTMENT
Total Project Cost: $X,XXX`
                    },
                    {
                        id: crypto.randomUUID(),
                        title: 'Non-Disclosure Agreement (NDA)',
                        type: 'Template',
                        client: 'Internal',
                        date: new Date().toLocaleDateString(),
                        status: 'draft',
                        content: `NON-DISCLOSURE AGREEMENT

This Agreement is made between {{company_name}} and {{client_name}}.

1. DEFINITION OF CONFIDENTIAL INFORMATION
...

2. OBLIGATIONS
Receiving Party shall hold and maintain the Confidential Information in strictest confidence.`
                    }
                ];
                setDocuments(defaults);
                localStorage.setItem('pumpkin_documents', JSON.stringify(defaults));
            }
        } else {
            // Seed defaults if no documents found
            const defaults: Document[] = [
                {
                    id: crypto.randomUUID(),
                    title: 'Standard Service Agreement',
                    type: 'Template',
                    client: 'Internal',
                    date: new Date().toLocaleDateString(),
                    status: 'draft',
                    content: `SERVICE AGREEMENT

BETWEEN: {{client_name}}
AND: {{company_name}}

1. SERVICES
Provider agrees to perform the services described in the attached SOW.

2. COMPENSATION
Client agrees to pay Provider as outlined in the attached Invoice.

3. CONFIDENTIALITY
Both parties agree to keep all proprietary information confidential.

4. TERM
This agreement shall commence on {{date}} and continue until completion.`
                },
                {
                    id: crypto.randomUUID(),
                    title: 'Project Proposal Structure',
                    type: 'Template',
                    client: 'Internal',
                    date: new Date().toLocaleDateString(),
                    status: 'draft',
                    content: `PROJECT PROPOSAL
Prepared for: {{client_name}}

1. EXECUTIVE SUMMARY
Brief overview of the project goals.

2. PROJECT SCOPE
Detailed description of deliverables.

3. TIMELINE
Phase 1: Discovery
Phase 2: Design
Phase 3: Development

4. INVESTMENT
Total Project Cost: $X,XXX`
                },
                {
                    id: crypto.randomUUID(),
                    title: 'Non-Disclosure Agreement (NDA)',
                    type: 'Template',
                    client: 'Internal',
                    date: new Date().toLocaleDateString(),
                    status: 'draft',
                    content: `NON-DISCLOSURE AGREEMENT

This Agreement is made between {{company_name}} and {{client_name}}.

1. DEFINITION OF CONFIDENTIAL INFORMATION
...

2. OBLIGATIONS
Receiving Party shall hold and maintain the Confidential Information in strictest confidence.`
                }
            ];
            setDocuments(defaults);
            localStorage.setItem('pumpkin_documents', JSON.stringify(defaults));
        }

        // Load Contacts
        const savedContacts = localStorage.getItem('pumpkin_contacts');
        if (savedContacts) {
            try {
                setContacts(JSON.parse(savedContacts));
            } catch (error) {
                console.error('Failed to load contacts:', error);
            }
        }

        setIsLoading(false);
    }, []);

    // Save to localStorage whenever documents change
    useEffect(() => {
        if (!isLoading && documents.length >= 0) {
            localStorage.setItem('pumpkin_documents', JSON.stringify(documents));
        }
    }, [documents, isLoading]);

    const handleCreateDocument = (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-replace placeholders if creating a new doc from a template content
        // This is a simple logic: if content has placeholders, try to fill them with current selection
        let processedContent = content;
        if (!editingId && content.includes('{{')) {
            const savedCompany = localStorage.getItem('pumpkin_company_settings');
            const company = savedCompany ? JSON.parse(savedCompany) : { name: '[Your Company]' };

            processedContent = processedContent
                .replace(/{{company_name}}/g, company.name || '[Your Company]')
                .replace(/{{client_name}}/g, selectedClient || '[Client Name]')
                .replace(/{{date}}/g, new Date().toLocaleDateString());
        }

        if (editingId) {
            // Update existing
            setDocuments(prev => prev.map(doc => {
                if (doc.id === editingId) {
                    return {
                        ...doc,
                        title,
                        type: selectedType,
                        client: selectedClient || 'Unknown Client',
                        content, // Keep raw content if editing, but maybe we should have processed it?
                        // Actually, let's only process on CREATE or DOWNLOAD. Editing raw is safer.
                        date: new Date().toLocaleDateString()
                    };
                }
                return doc;
            }));
            toast('Document updated successfully', 'success');
        } else {
            // Create new
            const newDoc: Document = {
                id: crypto.randomUUID(),
                title: title || 'Untitled Document',
                type: selectedType,
                client: selectedClient || 'Unknown Client',
                content: processedContent,
                date: new Date().toLocaleDateString(),
                status: 'draft'
            };
            setDocuments(prev => [newDoc, ...prev]);
            toast('New document created!', 'success');
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = () => {
        if (!editingId) return;
        setDocuments(prev => prev.filter(doc => doc.id !== editingId));
        setIsDialogOpen(false);
        resetForm();
        toast('Document deleted', 'info');
    };

    const handleDownload = async () => {
        const doc = new jsPDF();

        // Settings & Data
        const savedCompany = localStorage.getItem('pumpkin_company_settings');
        const company = savedCompany ? JSON.parse(savedCompany) : {};

        const margin = 20;
        let yPos = 20;

        // --- Header Section ---

        // Logo (if available) - Needs to be base64 or URL
        // Simple caching or just try to add image if it's a valid URL
        // For reliability in this environment, we might skip complex image loading if it fails,
        // but we'll try standard addImage
        if (company.logoUrl) {
            try {
                // If cors issues, this might fail on client side without proxy
                // We'll try to add it. If it fails, catch and ignore.
                const img = new Image();
                img.src = company.logoUrl;
                // Awaiting image load manually
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                doc.addImage(img, 'PNG', margin, yPos, 30, 30);
                // Move text to right of logo
            } catch (e) {
                console.log("Could not load logo", e);
            }
        }

        // Company Info (Right aligned or next to logo)
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(company.name || 'Company Name', 190, yPos, { align: 'right' });
        yPos += 5;
        if (company.address) {
            doc.text(company.address, 190, yPos, { align: 'right' });
            yPos += 5;
        }
        if (company.email) {
            doc.text(company.email, 190, yPos, { align: 'right' });
            yPos += 5;
        }
        if (company.website) {
            doc.text(company.website, 190, yPos, { align: 'right' });
        }

        yPos = 60; // Start content below header

        // --- Title & Client ---
        doc.setFontSize(18);
        doc.setTextColor(0);
        doc.text(title.toUpperCase(), margin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Prepared For: ${selectedClient}`, margin, yPos);
        yPos += 5;
        doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 15;

        // --- Separator ---
        doc.setDrawColor(200);
        doc.line(margin, yPos, 190, yPos);
        yPos += 10;

        // --- Content ---
        doc.setFontSize(11);
        doc.setTextColor(0);

        // Variable replacement for download (just in case they exist)
        const finalContent = content
            .replace(/{{company_name}}/g, company.name || '[My Company]')
            .replace(/{{client_name}}/g, selectedClient || '[Client Name]')
            .replace(/{{date}}/g, new Date().toLocaleDateString());

        const splitText = doc.splitTextToSize(finalContent, 170); // 190 - 20 margin
        doc.text(splitText, margin, yPos);

        // --- Footer ---
        const pageCount = doc.internal.pages.length - 1; // fix for jspdf counting
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' });
            doc.text(`Generated by Pumpkin`, margin, 287);
        }

        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
        toast('Your polished PDF is downloading...', 'success');
    };

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setSelectedType('Proposal');
        setSelectedClient('');
    };

    const openNewDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (doc: Document) => {
        setEditingId(doc.id);
        setTitle(doc.title);
        setContent(doc.content || '');
        setSelectedType(doc.type);
        setSelectedClient(doc.client);
        setIsDialogOpen(true);
    };

    const filteredDocuments = documents.filter(doc => {
        if (activeTab === 'all') return true;
        if (activeTab === 'proposals') return doc.type.toLowerCase() === 'proposal';
        if (activeTab === 'contracts') return doc.type.toLowerCase() === 'contract';
        if (activeTab === 'templates') return doc.type.toLowerCase() === 'template';
        return true;
    });

    const hasDocuments = filteredDocuments.length > 0;

    const statusVariantMap: Record<string, "success" | "warning" | "error" | "secondary" | "info"> = {
        draft: 'secondary',
        sent: 'info',
        signed: 'success',
        accepted: 'success',
        rejected: 'error'
    };

    return (
        <DashboardShell>
            <PageHeader
                title="Vault"
                description="Create and manage proposals, contracts, and templates."
                action={{
                    label: 'New Document',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: openNewDialog
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Documents' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[600px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm text-white">
                            {editingId ? 'Edit Document' : 'Draft New Document'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            {editingId ? 'Update document details and content.' : 'Create a new proposal, contract, or template.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateDocument} className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Doc Title"
                                    className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Type</Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                        <SelectItem value="Proposal">Proposal</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Template">Template</SelectItem>
                                        <SelectItem value="Terms">Terms of Service</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Assign to Client</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm">
                                    <SelectValue placeholder="Select a client..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white max-h-[200px]">
                                    {contacts.length > 0 ? (
                                        contacts.map(contact => (
                                            <SelectItem key={contact.id} value={`${contact.firstName} ${contact.lastName}`}>
                                                {contact.firstName} {contact.lastName}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-xs text-zinc-500 text-center">No clients found</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter document content here..."
                                className="bg-black/20 border-white/5 rounded-xl min-h-[150px] p-4 text-sm font-mono"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            {editingId && (
                                <>
                                    <Button
                                        type="button"
                                        onClick={handleDelete}
                                        variant="destructive"
                                        className="h-11 w-11 p-0 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleDownload}
                                        variant="outline"
                                        className="h-11 w-11 p-0 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary"
                                        title="Download .txt"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            <Button type="submit" className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                                {editingId ? 'Save Changes' : 'Create Document'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1">
                    <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">All</TabsTrigger>
                    <TabsTrigger value="proposals" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Proposals</TabsTrigger>
                    <TabsTrigger value="contracts" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Contracts</TabsTrigger>
                    <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">Templates</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        </div>
                    ) : hasDocuments ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDocuments.map((doc, i) => (
                                <Card key={doc.id || i} onClick={() => openEditDialog(doc)} className="cursor-pointer bg-black/20 border-white/5 rounded-2xl hover:border-primary/20 hover:shadow-2xl transition-all group overflow-hidden">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                                        <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                            {doc.type === 'Proposal' ? <PenTool className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                        </div>
                                        <StatusBadge variant={statusVariantMap[doc.status] || 'secondary'}>{doc.status}</StatusBadge>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <h3 className="font-bold text-white uppercase tracking-widest text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{doc.title}</h3>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-4">for {doc.client}</p>
                                        <div className="text-[9px] text-zinc-600 flex items-center gap-2 font-bold uppercase tracking-[0.2em] border-t border-white/5 pt-4">
                                            <Files className="h-3 w-3" />
                                            Updated {doc.date}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="Empty Archives"
                            description="No documents found in your vault. Start by creating a proposal or contract to send to your clients."
                            actionLabel="Create Document"
                            onAction={openNewDialog}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}
