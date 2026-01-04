"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Account } from '@/lib/api'

interface JournalEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: Account[];
    onSubmit: (data: {
        date: string;
        description: string;
        reference?: string;
        lines: { accountId: string; type: string; amount: number }[];
    }) => void;
}

export function JournalEntryDialog({ open, onOpenChange, accounts, onSubmit }: JournalEntryDialogProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        reference: '',
        lines: [
            { accountId: '', type: 'DEBIT', amount: '' },
            { accountId: '', type: 'CREDIT', amount: '' }
        ]
    });

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, { accountId: '', type: 'DEBIT', amount: '' }]
        });
    };

    const removeLine = (index: number) => {
        if (formData.lines.length <= 2) return;
        const newLines = [...formData.lines];
        newLines.splice(index, 1);
        setFormData({ ...formData, lines: newLines });
    };

    const updateLine = (index: number, field: string, value: string) => {
        const newLines = [...formData.lines];
        newLines[index] = { ...newLines[index], [field]: value };
        setFormData({ ...formData, lines: newLines });
    };

    const totalDebits = formData.lines
        .filter(l => l.type === 'DEBIT')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

    const totalCredits = formData.lines
        .filter(l => l.type === 'CREDIT')
        .reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isBalanced) {
            alert('Journal entry must be balanced (Total Debits = Total Credits)');
            return;
        }
        onSubmit({
            ...formData,
            lines: formData.lines.map(l => ({
                ...l,
                amount: parseFloat(l.amount)
            }))
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent key={open ? 'open' : 'closed'} className="w-[95vw] max-w-[600px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                <DialogHeader>
                    <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1">
                        New Journal Entry
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px]">
                        Record a manual financial transaction. Debits and credits must balance.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="date" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="reference" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Reference (Optional)</Label>
                            <Input
                                id="reference"
                                placeholder="Ref #"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.reference}
                                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                        <Input
                            id="description"
                            placeholder="Monthly depreciation, Accruals, etc."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <Label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Transaction Lines</Label>
                            <Button type="button" variant="ghost" size="sm" onClick={addLine} className="h-6 text-[9px] uppercase font-black text-primary hover:text-primary/80 gap-1 px-2">
                                <Plus className="h-3 w-3" />
                                Add Line
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                            {formData.lines.map((line, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-6">
                                        <Select value={line.accountId} onValueChange={(value) => updateLine(index, 'accountId', value)}>
                                            <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-8 px-2 text-[10px]">
                                                <SelectValue placeholder="Select Account" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                                {accounts.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id} className="text-[10px]">
                                                        {acc.code} - {acc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Select value={line.type} onValueChange={(value) => updateLine(index, 'type', value)}>
                                            <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-8 px-2 text-[10px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                                <SelectItem value="DEBIT" className="text-[10px]">DR</SelectItem>
                                                <SelectItem value="CREDIT" className="text-[10px]">CR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="bg-black/20 border-white/5 rounded-lg h-8 px-2 text-[10px] focus:ring-primary/20"
                                            value={line.amount}
                                            onChange={(e) => updateLine(index, 'amount', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={formData.lines.length <= 2}
                                            onClick={() => removeLine(index)}
                                            className="h-8 w-8 text-zinc-600 hover:text-red-400 disabled:opacity-30"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                            <span className="text-zinc-500">Total Debits</span>
                            <span className="text-white">${totalDebits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                            <span className="text-zinc-500">Total Credits</span>
                            <span className="text-white">${totalCredits.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="h-px bg-white/5 mb-3" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Difference</span>
                            <span className={cn(
                                "text-xs font-mono font-bold",
                                isBalanced ? "text-emerald-400" : "text-red-400"
                            )}>
                                ${Math.abs(totalDebits - totalCredits).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={!isBalanced || formData.description === ''}
                        className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] disabled:opacity-50"
                    >
                        Post Journal Entry
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
