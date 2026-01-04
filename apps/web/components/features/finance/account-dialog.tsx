"use client"

import { useState, useEffect } from 'react';
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

import { Account } from '@/lib/api'

export enum AccountType {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EQUITY = 'EQUITY',
    REVENUE = 'REVENUE',
    EXPENSE = 'EXPENSE',
}

interface AccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account?: Account | null;
    accounts: Account[];
    onSubmit: (data: Partial<Account>) => void;
}

export function AccountDialog({ open, onOpenChange, account, accounts, onSubmit }: AccountDialogProps) {
    const [formData, setFormData] = useState<{
        code: string;
        name: string;
        type: AccountType;
        parentId: string | null;
    }>({
        code: '',
        name: '',
        type: AccountType.ASSET,
        parentId: ''
    });

    useEffect(() => {
        if (account) {
            setFormData({
                code: account.code || '',
                name: account.name || '',
                type: (account.type as AccountType) || AccountType.ASSET,
                parentId: account.parentId || ''
            });
        } else {
            setFormData({
                code: '',
                name: '',
                type: AccountType.ASSET,
                parentId: ''
            });
        }
    }, [account, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = { ...formData };
        if (submissionData.parentId === 'none' || submissionData.parentId === '') {
            submissionData.parentId = null;
        }
        onSubmit(submissionData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[425px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                <DialogHeader>
                    <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1">
                        {account ? 'Edit Account' : 'Add New Account'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px]">
                        {account ? 'Update account details and classification.' : 'Create a new account in your Chart of Accounts.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1 col-span-1">
                            <Label htmlFor="code" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Code</Label>
                            <Input
                                id="code"
                                placeholder="1000"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Account Name</Label>
                            <Input
                                id="name"
                                placeholder="Cash in Bank"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="type" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Account Type</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as AccountType })}>
                            <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                <SelectItem value={AccountType.ASSET}>Asset</SelectItem>
                                <SelectItem value={AccountType.LIABILITY}>Liability</SelectItem>
                                <SelectItem value={AccountType.EQUITY}>Equity</SelectItem>
                                <SelectItem value={AccountType.REVENUE}>Revenue</SelectItem>
                                <SelectItem value={AccountType.EXPENSE}>Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="parentId" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Parent Account</Label>
                        <Select value={formData.parentId || 'none'} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                            <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                <SelectValue placeholder="None (Root)" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                <SelectItem value="none">None (Root Account)</SelectItem>
                                {accounts.filter(a => a.id !== account?.id).map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.code} - {acc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button type="submit" className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] mt-4">
                        {account ? 'Update Account' : 'Create Account'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
