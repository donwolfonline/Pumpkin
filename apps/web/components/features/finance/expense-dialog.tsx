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

import { Account, Expense } from '@/lib/api'

interface ExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: Account[];
    onSubmit: (data: Partial<Expense>) => void;
}

export function ExpenseDialog({ open, onOpenChange, accounts, onSubmit }: ExpenseDialogProps) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: '',
        vendor: '',
        accountId: '',
        reference: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        } as Partial<Expense>);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent key={open ? 'open' : 'closed'} className="w-[90vw] max-w-[425px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                <DialogHeader>
                    <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1">
                        Log New Expense
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px]">
                        Record a business expense and categorize it appropriately.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
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
                            <Label htmlFor="amount" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Amount</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="vendor" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Vendor / Payee</Label>
                        <Input
                            id="vendor"
                            placeholder="Starbucks, Apple, etc."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.vendor}
                            onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                        <Input
                            id="description"
                            placeholder="Office supplies, Client lunch, etc."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="category" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                    <SelectItem value="Meals">Meals</SelectItem>
                                    <SelectItem value="Travel">Travel</SelectItem>
                                    <SelectItem value="Supplies">Supplies</SelectItem>
                                    <SelectItem value="Software">Software</SelectItem>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Utilities">Utilities</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="accountId" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Payment Account</Label>
                            <Select value={formData.accountId} onValueChange={(value) => setFormData({ ...formData, accountId: value })}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                    {accounts.filter(a => a.type === 'ASSET' || a.type === 'LIABILITY').map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id}>
                                            {acc.code} - {acc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="reference" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Reference (Optional)</Label>
                        <Input
                            id="reference"
                            placeholder="Invoice #, Receipt ID"
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] mt-4">
                        Log Expense
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
