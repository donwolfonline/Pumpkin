'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Invoice } from '@/lib/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, FileText } from 'lucide-react';
import { InvoiceStatusBadge } from '@/components/shared/status-badge';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const columns: ColumnDef<Invoice>[] = [
    {
        accessorKey: 'invoiceNumber',
        header: 'Invoice #',
        cell: ({ row }) => (
            <Link href={`/payments/${row.original.id}`} className="font-medium hover:underline flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {row.getValue('invoiceNumber')}
            </Link>
        )
    },
    {
        accessorKey: 'clientName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Client
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'total',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('total'));
            return <div className="text-right font-medium">{formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <InvoiceStatusBadge status={row.getValue('status')} />,
    },
    {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('dueDate'));
            return <div className="text-muted-foreground">{date.toLocaleDateString()}</div>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            return (
                <div className="flex items-center justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/payments/${row.original.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            );
        },
    },
];
