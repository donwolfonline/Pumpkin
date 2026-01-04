"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsList, TabsTrigger }
    from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, FileText, Files, Loader2, BookOpen, Trash2, Download, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { jsPDF } from "jspdf";
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { useRouter } from 'next/navigation';
import { PumpkinDocument } from '@/lib/api';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { ALL_TEMPLATES } from './templates';

export default function DocumentsPage() {
    const router = useRouter();
    const { toast } = usePumpkinToast();
    const [documents, setDocuments] = useState<PumpkinDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedStr = localStorage.getItem('pumpkin_documents');
            const savedDocs: PumpkinDocument[] = savedStr ? JSON.parse(savedStr) : [];

            // Merge templates and saved docs, prioritizing saved docs if IDs match
            const savedIds = new Set(savedDocs.map(d => d.id));
            const combined = [...savedDocs];

            ALL_TEMPLATES.forEach(template => {
                if (!savedIds.has(template.id)) {
                    combined.push(template);
                }
            });

            setDocuments(combined);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const openNewDocument = () => router.push('/documents/editor');
    const openEditDocument = (id: string) => router.push(`/documents/editor?id=${id}`);

    const filteredDocuments = documents.filter(doc => {
        const matchesTab = activeTab === 'all' ||
            doc.category === activeTab ||
            (activeTab === 'Misc' && !doc.category);
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleDownload = async (e: React.MouseEvent, docToExport: PumpkinDocument) => {
        e.stopPropagation();
        const doc = new jsPDF();
        const { title, content, logoUrl } = docToExport;

        const margin = 20;
        const yPos = 20;

        if (logoUrl) {
            try {
                const img = new Image();
                img.src = logoUrl;
                await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
                doc.addImage(img, 'PNG', margin, yPos, 20, 20);
            } catch (e) { console.log(e); }
        }

        const stripHtml = (html: string) => (html || '').replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim();

        doc.setFontSize(22);
        doc.text(title.toUpperCase(), margin, 50);
        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(stripHtml(content), 170);
        doc.text(splitText, margin, 65);

        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
        toast('PDF generated', 'success');
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = documents.filter(d => d.id !== id);
        setDocuments(updated);
        localStorage.setItem('pumpkin_documents', JSON.stringify(updated));
        toast('Document removed from vault', 'info');
    };

    return (
        <DashboardShell>
            <PageHeader
                title="Vault"
                description="Secure storage for your professional documents and templates."
                action={{
                    label: 'Create New',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: openNewDocument
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Documents' }
                ]}
            />

            <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                    <Input
                        placeholder="Search titles or clients..."
                        className="pl-10 bg-white/5 border-white/5 rounded-2xl h-10 sm:h-12 text-xs sm:text-sm text-white focus:ring-primary/20 transition-all placeholder:text-zinc-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Mobile Dropdown Menu */}
                <div className="sm:hidden">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-full bg-white/5 border-white/5 rounded-2xl h-10 text-xs font-bold uppercase tracking-widest text-zinc-300">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c2a27] border-white/5 text-white rounded-2xl">
                            <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest py-3">All Documents</SelectItem>
                            <SelectItem value="HR" className="text-xs font-bold uppercase tracking-widest py-3">HR</SelectItem>
                            <SelectItem value="Ops" className="text-xs font-bold uppercase tracking-widest py-3">Ops</SelectItem>
                            <SelectItem value="Marketing" className="text-xs font-bold uppercase tracking-widest py-3">Marketing</SelectItem>
                            <SelectItem value="Sales" className="text-xs font-bold uppercase tracking-widest py-3">Sales</SelectItem>
                            <SelectItem value="Legal" className="text-xs font-bold uppercase tracking-widest py-3">Legal</SelectItem>
                            <SelectItem value="Tax & Gov" className="text-xs font-bold uppercase tracking-widest py-3">Tax & Gov</SelectItem>
                            <SelectItem value="Misc" className="text-xs font-bold uppercase tracking-widest py-3">Misc</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Desktop Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden sm:block w-full">
                    <div className="overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                        <TabsList className="bg-white/5 border border-white/5 rounded-2xl p-1 h-12 inline-flex w-max sm:w-full min-w-full snap-x snap-mandatory">
                            <TabsTrigger value="all" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">All</TabsTrigger>
                            <TabsTrigger value="HR" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">HR</TabsTrigger>
                            <TabsTrigger value="Ops" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Ops</TabsTrigger>
                            <TabsTrigger value="Marketing" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Marketing</TabsTrigger>
                            <TabsTrigger value="Sales" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Sales</TabsTrigger>
                            <TabsTrigger value="Legal" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Legal</TabsTrigger>
                            <TabsTrigger value="Tax & Gov" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Tax & Gov</TabsTrigger>
                            <TabsTrigger value="Misc" className="rounded-xl px-5 sm:px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[9px] h-full transition-all snap-start">Misc</TabsTrigger>
                        </TabsList>
                    </div>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="h-48 sm:h-64 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">Accessing Secure Vault...</span>
                </div>
            ) : filteredDocuments.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
                    {filteredDocuments.map((doc) => (
                        <Card
                            key={doc.id}
                            onClick={() => openEditDocument(doc.id)}
                            className="bg-[#0c2a27]/40 border-white/5 rounded-[2rem] hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden cursor-pointer backdrop-blur-sm"
                        >
                            <CardHeader className="flex flex-row items-start justify-between p-4 sm:p-6 pb-2">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform flex-shrink-0">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex gap-1 ml-4 sm:ml-0">
                                    <Button
                                        variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white"
                                        onClick={(e) => handleDownload(e, doc)}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-500"
                                        onClick={(e) => handleDelete(e, doc.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-2">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary">{doc.category || 'General'}</span>
                                    <h3 className="font-bold text-white uppercase tracking-widest text-[10px] sm:text-xs leading-tight group-hover:text-primary transition-colors truncate">{doc.title}</h3>
                                </div>
                                <p className="text-[9px] sm:text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-4 sm:mb-6">client: {doc.client}</p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="text-[8px] text-zinc-600 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                                        <Files className="h-3 w-3" />
                                        {doc.date}
                                    </div>
                                    <StatusBadge variant={doc.status === 'signed' ? 'success' : 'secondary'} className="text-[8px] px-2 h-4 uppercase tracking-tighter">{doc.status}</StatusBadge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={BookOpen}
                    title="Vault Empty"
                    description="No documents found matching your criteria. Start fresh by creating a new professional document."
                    actionLabel="Initialize Vault"
                    onAction={openNewDocument}
                />
            )}
        </DashboardShell>
    );
}
