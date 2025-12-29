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

interface PumpkinDocument {
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

const DEFAULT_DOCUMENTS: PumpkinDocument[] = [
    {
        id: '155b412e-1317-4f68-9646-6468449c2358',
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
        id: '7d3539fc-2244-4632-9cb8-685b8004f762',
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
        id: '45d4791a-7b3b-4866-9351-512595f48743',
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

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<PumpkinDocument[]>([]);
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
        const loadData = () => {
            try {
                // Load Documents
                const saved = localStorage.getItem('pumpkin_documents');
                let initialDocs: PumpkinDocument[] = [];

                if (saved) {
                    try {
                        const parsed: PumpkinDocument[] = JSON.parse(saved);
                        // Migration check: if old docs had numeric IDs or missing fields
                        if (parsed.length > 0 && typeof (parsed[0] as { id: unknown }).id === 'number') {
                            initialDocs = parsed.map(doc => ({
                                ...doc,
                                id: String(doc.id),
                                status: doc.status || 'draft',
                                content: doc.content || ''
                            } as PumpkinDocument));
                        } else {
                            // Ensure all docs have an ID and content for existing string IDs
                            initialDocs = parsed.map(doc => ({
                                ...doc,
                                id: doc.id || crypto.randomUUID(),
                                content: doc.content || ''
                            }));
                        }
                    } catch (e) {
                        console.error("Failed to parse documents", e);
                        initialDocs = DEFAULT_DOCUMENTS;
                        localStorage.setItem('pumpkin_documents', JSON.stringify(DEFAULT_DOCUMENTS));
                    }
                } else {
                    initialDocs = DEFAULT_DOCUMENTS;
                    localStorage.setItem('pumpkin_documents', JSON.stringify(DEFAULT_DOCUMENTS));
                }

                setDocuments(initialDocs);

                // Load Contacts
                const savedContacts = localStorage.getItem('pumpkin_contacts');
                if (savedContacts) {
                    try {
                        setContacts(JSON.parse(savedContacts));
                    } catch (error) {
                        console.error('Failed to load contacts:', error);
                    }
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
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
            const newDoc: PumpkinDocument = {
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

    const openEditDialog = (doc: PumpkinDocument) => {
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
                <DialogContent className="w-[90vw] max-w-[420px] bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-5 gap-0">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1 text-white">
                            {editingId ? 'Edit Document' : 'Draft New Document'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px]">
                            {editingId ? 'Update document details and content.' : 'Create a new proposal, contract, or template.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateDocument} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="title" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Doc Title"
                                    className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="type" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Type</Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
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

                        <div className="space-y-1">
                            <Label htmlFor="client" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Assign to Client</Label>
                            <Select value={selectedClient} onValueChange={setSelectedClient}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
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

                        <div className="space-y-1">
                            <Label htmlFor="content" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Content</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Enter document content here..."
                                className="bg-black/20 border-white/5 rounded-lg min-h-[120px] p-3 text-xs font-mono"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            {editingId && (
                                <>
                                    <Button
                                        type="button"
                                        onClick={handleDelete}
                                        variant="destructive"
                                        className="h-9 w-9 p-0 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleDownload}
                                        variant="outline"
                                        className="h-9 w-9 p-0 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary"
                                        title="Download .txt"
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                            <Button type="submit" className="flex-1 h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px]">
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
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            {filteredDocuments.map((doc, i) => (
                                <Card key={doc.id || i} onClick={() => openEditDialog(doc)} className="cursor-pointer bg-black/20 border-white/5 rounded-2xl hover:border-primary/20 hover:shadow-xl transition-all group overflow-hidden">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            {doc.type === 'Proposal' ? <PenTool className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                        </div>
                                        <StatusBadge variant={statusVariantMap[doc.status] || 'secondary'} className="text-[9px] px-2 h-5">{doc.status}</StatusBadge>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-1">
                                        <h3 className="font-bold text-white uppercase tracking-widest text-xs leading-tight mb-1 group-hover:text-primary transition-colors truncate">{doc.title}</h3>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-3 truncate">for {doc.client}</p>
                                        <div className="text-[8px] text-zinc-600 flex items-center gap-1.5 font-bold uppercase tracking-[0.15em] border-t border-white/5 pt-3">
                                            <Files className="h-2.5 w-2.5" />
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
