'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Contact } from '@/lib/types/crm';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';

export const columns: ColumnDef<Contact>[] = [
    {
        accessorKey: 'name',
        accessorFn: (row) => row.name || `${row.firstName} ${row.lastName}`,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const contact = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.firstName[0]}{contact.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{contact.firstName} {contact.lastName}</div>
                        <div className="text-xs text-muted-foreground">{contact.email}</div>
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: 'company',
        header: 'Company',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variantMap: Record<string, "success" | "warning" | "error" | "secondary"> = {
                active: 'success',
                lead: 'warning',
                inactive: 'secondary',
                archived: 'secondary'
            }
            return <StatusBadge variant={variantMap[status] || 'secondary'}>{status}</StatusBadge>;
        },
    },
    {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => <div className="capitalize">{row.getValue('type')}</div>,
    },
    {
        id: 'actions',
        cell: () => {
            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
];
