import { getInvoices, getProposals, getContracts, getContacts } from './storage-utils';

export interface ActivityItem {
    id: string;
    type: 'proposal' | 'contract' | 'invoice' | 'client';
    title: string;
    description: string;
    date: string;
    status?: string;
    amount?: number;
}

export interface ChartDataPoint {
    name: string; // e.g. "Jan"
    value: number;
    total?: number;
    revenue?: number;
    [key: string]: string | number | undefined;
}

export function getRecentActivities(limit = 5): ActivityItem[] {
    const activities: ActivityItem[] = [];

    // Proposals
    const proposals = getProposals();
    proposals.forEach(p => {
        activities.push({
            id: p.id,
            type: 'proposal',
            title: 'Proposal Created',
            description: `${p.title} for ${p.clientName}`,
            date: p.createdAt || new Date().toISOString(),
            status: p.status,
            amount: p.totalAmount
        });

        // If signed, add a signed activity too (using updatedAt as proxy if no signature date conveniently available for both)
        if (p.status === 'signed') {
            // Try to find latest signature date
            const lastSig = p.signatures?.sort((a, b) => (b.signedAt || '').localeCompare(a.signedAt || ''))[0];
            activities.push({
                id: p.id + '_signed',
                type: 'proposal',
                title: 'Proposal Signed',
                description: `${p.title} accepted`,
                date: lastSig?.signedAt || p.updatedAt || new Date().toISOString(),
                status: 'signed',
                amount: p.totalAmount
            });
        }
    });

    // Invoices
    const invoices = getInvoices();
    invoices.forEach(inv => {
        activities.push({
            id: inv.id,
            type: 'invoice',
            title: 'Invoice Generated',
            description: `Invoice #${inv.invoiceNumber}`,
            date: inv.issueDate || new Date().toISOString(),
            status: inv.status,
            amount: inv.total
        });

        if (inv.status === 'paid') {
            activities.push({
                id: inv.id + '_paid',
                type: 'invoice',
                title: 'Payment Received',
                description: `Invoice #${inv.invoiceNumber} paid`,
                date: inv.issueDate || new Date().toISOString(),
                status: 'paid',
                amount: inv.total
            });
        }
    });

    // Contracts
    const contracts = getContracts();
    contracts.forEach(c => {
        activities.push({
            id: c.id,
            type: 'contract',
            title: 'Contract Drafted',
            description: c.title,
            date: c.createdAt || new Date().toISOString(),
            status: c.status,
            amount: c.value
        });

        if (c.status === 'signed') {
            activities.push({
                id: c.id + '_signed',
                type: 'contract',
                title: 'Contract Signed',
                description: c.title,
                date: c.signedAt || c.updatedAt || new Date().toISOString(),
                status: 'signed',
                amount: c.value
            });
        }
    });

    // Contacts (New Leads/Clients)
    const contacts = getContacts();
    contacts.forEach(c => {
        activities.push({
            id: c.id,
            type: 'client',
            title: 'New Client',
            description: c.name || `${c.firstName} ${c.lastName}`,
            date: c.lastActivity || new Date().toISOString(),
            status: 'active'
        });
    });

    // Sort by date desc
    return activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
}

export function getRevenueChartData(): ChartDataPoint[] {
    const invoices = getInvoices();
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');

    // Group by month (last 6 months)
    const months: Record<string, number> = {};
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        months[key] = 0;
    }

    paidInvoices.forEach(inv => {
        if (!inv.issueDate) return;
        const d = new Date(inv.issueDate);
        const key = d.toLocaleString('default', { month: 'short' });
        if (months[key] !== undefined) {
            months[key] += inv.total || 0;
        }
    });

    return Object.entries(months).map(([name, value]) => ({
        name,
        value,
        total: value,   // For Dashboard RevenueChart
        revenue: value  // For Analytics DetailedRevenueChart
    }));
}

export function getCategoryDistribution(): ChartDataPoint[] {
    const proposals = getProposals();
    // Simplified category distribution based on status
    const counts: Record<string, number> = {};

    proposals.forEach(p => {
        const status = p.status; // e.g., 'draft', 'sent', 'signed'
        // nice names
        let name = status.charAt(0).toUpperCase() + status.slice(1);
        if (name === 'Pending_signatures') name = 'Pending';

        counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
