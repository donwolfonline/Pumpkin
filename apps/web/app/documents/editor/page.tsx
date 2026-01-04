"use client"

import { useState, useEffect, useRef, Suspense } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
    Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Type, Palette, Image as ImageIcon, Link as LinkIcon,
    Save, Printer, ArrowLeft, Upload, Loader2, Minus, Plus
} from 'lucide-react';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { PumpkinDocument } from '@/lib/api';
import { usePumpkinToast } from '@/components/ui/pumpkin-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { jsPDF } from "jspdf";
import { ALL_TEMPLATES } from '../templates';

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = usePumpkinToast();
    const docId = searchParams.get('id');

    const [title, setTitle] = useState('Untitled Document');
    const [content, setContent] = useState('');
    const [header, setHeader] = useState('');
    const [footer, setFooter] = useState('');
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    // Load existing document
    useEffect(() => {
        if (docId) {
            // Priority 1: Check localStorage for user-saved versions
            const saved = localStorage.getItem('pumpkin_documents');
            let doc: PumpkinDocument | undefined;

            if (saved) {
                const docs: PumpkinDocument[] = JSON.parse(saved);
                doc = docs.find(d => d.id === docId);
            }

            // Priority 2: Check pre-defined templates if not found in saved
            if (!doc) {
                doc = ALL_TEMPLATES.find(t => t.id === docId);
            }

            if (doc) {
                setTitle(doc.title);
                setContent(doc.content || '');
                setHeader(doc.header || '');
                setFooter(doc.footer || '');
                setLogoUrl(doc.logoUrl || null);
            }
        }
    }, [docId]);

    const execCommand = (command: string, value: string = '') => {
        document.execCommand(command, false, value);
    };

    const handleSave = () => {
        setIsSaving(true);
        const activeContent = contentRef.current?.innerHTML || content;
        const activeHeader = headerRef.current?.innerHTML || header;
        const activeFooter = footerRef.current?.innerHTML || footer;

        const saved = localStorage.getItem('pumpkin_documents');
        let docs: PumpkinDocument[] = saved ? JSON.parse(saved) : [];

        const docData: PumpkinDocument = {
            id: docId || Math.random().toString(36).substr(2, 9),
            title,
            type: 'Proposal',
            client: 'Client',
            date: new Date().toLocaleDateString(),
            status: 'draft',
            content: activeContent,
            header: activeHeader,
            footer: activeFooter,
            logoUrl: logoUrl || undefined
        };

        if (docId) {
            docs = docs.map(d => d.id === docId ? docData : d);
        } else {
            docs = [docData, ...docs];
            router.replace(`/documents/editor?id=${docData.id}`);
        }

        localStorage.setItem('pumpkin_documents', JSON.stringify(docs));
        setTimeout(() => {
            setIsSaving(false);
            toast('Document saved to vault', 'success');
        }, 500);
    };

    const handleDownload = async () => {
        const doc = new jsPDF();
        const activeContent = contentRef.current?.innerHTML || content;
        const activeHeader = headerRef.current?.innerHTML || header;
        const activeFooter = footerRef.current?.innerHTML || footer;

        const margin = 20;
        let yPos = 20;

        if (logoUrl) {
            try {
                const img = new Image();
                img.src = logoUrl;
                await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
                doc.addImage(img, 'PNG', margin, yPos, 25, 25);
            } catch (e) { console.log(e); }
        }

        const stripHtml = (html: string) => (html || '').replace(/<[^>]*>?/gm, ' ').replace(/\s\s+/g, ' ').trim();

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(stripHtml(activeHeader) || 'Company Header', 190, 20, { align: 'right' });

        yPos = 55;
        doc.setFontSize(22);
        doc.setTextColor(0);
        doc.text(title.toUpperCase(), margin, yPos);
        yPos += 15;

        doc.setFontSize(11);
        const splitText = doc.splitTextToSize(stripHtml(activeContent), 170);
        doc.text(splitText, margin, yPos);

        doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
        toast('PDF Export Complete', 'success');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <DashboardShell>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/documents')} className="rounded-full hover:bg-white/5">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-transparent border-none text-xl font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/20 rounded px-2"
                        placeholder="Document Title"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleDownload} className="h-9 gap-2 border-white/5 bg-white/5 hover:bg-white/10">
                        <Printer className="h-4 w-4" /> Export PDF
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="h-9 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6">
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? 'Saving...' : 'Save to Vault'}
                    </Button>
                </div>
            </div>

            {/* Advanced Toolbar */}
            <div className="sticky top-0 z-20 bg-[#061816] border-y border-white/5 p-2 flex flex-wrap gap-1 items-center backdrop-blur-md mb-8">
                <div className="flex items-center gap-0.5 border-r border-white/5 pr-2 mr-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('bold')}><Bold className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('italic')}><Italic className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('underline')}><Underline className="h-4 w-4" /></Button>
                </div>

                <div className="flex items-center gap-0.5 border-r border-white/5 pr-2 mr-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('justifyLeft')}><AlignLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('justifyCenter')}><AlignCenter className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('justifyRight')}><AlignRight className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('justifyFull')}><AlignJustify className="h-4 w-4" /></Button>
                </div>

                <div className="flex items-center gap-0.5 border-r border-white/5 pr-2 mr-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('insertUnorderedList')}><List className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" onClick={() => execCommand('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Button>
                </div>

                <Select onValueChange={(v) => execCommand('fontName', v)}>
                    <SelectTrigger className="w-[120px] h-8 bg-white/5 border-none text-[10px] uppercase font-bold tracking-widest">
                        <SelectValue placeholder="Font Family" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={(v) => execCommand('fontSize', v)}>
                    <SelectTrigger className="w-[70px] h-8 bg-white/5 border-none text-[10px] uppercase font-bold tracking-widest ml-1">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                        <SelectItem value="2">Small</SelectItem>
                        <SelectItem value="3">Normal</SelectItem>
                        <SelectItem value="4">Large</SelectItem>
                        <SelectItem value="5">Huge</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* A4 Page View */}
            <div className="flex-1 overflow-y-auto p-12 flex justify-center bg-black/40 rounded-3xl border border-white/5">
                <div className="bg-white text-zinc-900 w-full max-w-[850px] min-h-[1100px] shadow-2xl flex flex-col rounded-sm relative selection:bg-primary/20">
                    {/* Header Zone */}
                    <div className="p-12 pb-6 border-b border-zinc-100 relative group/header">
                        <div className="flex justify-between items-start">
                            <div className="w-32 h-32 border-2 border-dashed border-zinc-100 rounded-lg flex items-center justify-center hover:border-primary/40 transition-colors relative overflow-hidden">
                                {logoUrl ? (
                                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center gap-2 text-zinc-300">
                                        <Upload className="h-6 w-6" />
                                        <span className="text-[8px] font-bold uppercase tracking-widest">Upload Logo</span>
                                        <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                                    </label>
                                )}
                            </div>
                            <div
                                ref={headerRef}
                                contentEditable
                                className="text-right text-[10px] text-zinc-500 min-w-[200px] p-2 outline-none focus:bg-zinc-50 rounded"
                                dangerouslySetInnerHTML={{ __html: header || 'COMPANy NAME<br/>123 BUSINESS AVE<br/>CITY, STATE, ZIP' }}
                            />
                        </div>
                    </div>

                    {/* Main Body */}
                    <div className="flex-1 p-12 py-16">
                        <div
                            ref={contentRef}
                            contentEditable
                            className="min-h-full outline-none prose prose-zinc max-w-none text-zinc-800 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Footer Zone */}
                    <div className="p-12 pt-6 border-t border-zinc-100 mt-auto">
                        <div
                            ref={footerRef}
                            contentEditable
                            className="text-center text-[9px] text-zinc-400 p-2 outline-none focus:bg-zinc-50 rounded"
                            dangerouslySetInnerHTML={{ __html: footer || 'CONFIDENTIAL - FOR PROFESSIONAL USE ONLY<br/>PAGE 1 OF 1' }}
                        />
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

export default function DocumentEditorPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-[#061816]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}
