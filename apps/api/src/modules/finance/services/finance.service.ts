import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
    ChartOfAccount,
    AccountType,
} from '../entities/chart-of-account.entity';
import { JournalEntry } from '../entities/journal-entry.entity';
import { JournalLine, EntryType } from '../entities/journal-line.entity';
import { Expense } from '../entities/expense.entity';

@Injectable()
export class FinanceService {
    private readonly logger = new Logger(FinanceService.name);

    constructor(
        @InjectRepository(ChartOfAccount)
        private readonly accountRepo: Repository<ChartOfAccount>,
        @InjectRepository(JournalEntry)
        private readonly journalRepo: Repository<JournalEntry>,
        @InjectRepository(Expense)
        private readonly expenseRepo: Repository<Expense>,
        private readonly dataSource: DataSource,
    ) { }

    async getChartOfAccounts(organizationId: string) {
        const accounts = await this.accountRepo.find({
            where: { organizationId },
            relations: ['children'],
        });

        if (accounts.length === 0) {
            return await this.seedDefaultAccounts(organizationId);
        }

        // Process hierarchy
        const rootAccounts = accounts.filter((a) => !a.parentId);
        return rootAccounts;
    }

    async getAccountsFlat(organizationId: string) {
        return await this.accountRepo.find({
            where: { organizationId },
            order: { code: 'ASC' },
        });
    }

    async createAccount(organizationId: string, data: any) {
        const account = this.accountRepo.create({
            ...data,
            organizationId,
        });
        return this.accountRepo.save(account);
    }

    async updateAccount(organizationId: string, id: string, data: any) {
        await this.accountRepo.update({ id, organizationId }, data);
        return this.accountRepo.findOne({ where: { id, organizationId } });
    }

    private async seedDefaultAccounts(organizationId: string) {
        const defaults = [
            { code: '1000', name: 'Assets', type: AccountType.ASSET },
            {
                code: '1100',
                name: 'Cash',
                type: AccountType.ASSET,
                parentCode: '1000',
            },
            {
                code: '1200',
                name: 'Accounts Receivable',
                type: AccountType.ASSET,
                parentCode: '1000',
            },
            { code: '2000', name: 'Liabilities', type: AccountType.LIABILITY },
            {
                code: '2100',
                name: 'Accounts Payable',
                type: AccountType.LIABILITY,
                parentCode: '2000',
            },
            { code: '3000', name: 'Equity', type: AccountType.EQUITY },
            { code: '4000', name: 'Revenue', type: AccountType.REVENUE },
            {
                code: '4100',
                name: 'Service Income',
                type: AccountType.REVENUE,
                parentCode: '4000',
            },
            { code: '5000', name: 'Expenses', type: AccountType.EXPENSE },
            {
                code: '5100',
                name: 'Operating Expenses',
                type: AccountType.EXPENSE,
                parentCode: '5000',
            },
        ];

        const createdAccounts: Record<string, ChartOfAccount> = {};

        for (const item of defaults) {
            const parentId = item.parentCode ? createdAccounts[item.parentCode]?.id : undefined;
            const account = this.accountRepo.create({
                organizationId,
                code: item.code,
                name: item.name,
                type: item.type,
                parentId: parentId || null,
            });
            const saved = await this.accountRepo.save(account);
            createdAccounts[item.code] = saved as ChartOfAccount;
        }

        // Return root accounts only for proper tree build on frontend
        return Object.values(createdAccounts).filter((a) => !a.parentId);
    }

    async createJournalEntry(
        organizationId: string,
        data: {
            date: Date;
            description: string;
            reference?: string;
            lines: { accountId: string; type: EntryType; amount: number }[];
        },
    ) {
        const totalDebits = data.lines
            .filter((l) => l.type === EntryType.DEBIT)
            .reduce((sum, l) => sum + Number(l.amount), 0);

        const totalCredits = data.lines
            .filter((l) => l.type === EntryType.CREDIT)
            .reduce((sum, l) => sum + Number(l.amount), 0);

        if (Math.abs(totalDebits - totalCredits) > 0.01) {
            throw new Error('Debits and Credits must be equal');
        }

        return this.dataSource.transaction(async (manager) => {
            const entry = manager.create(JournalEntry, {
                organizationId,
                date: data.date,
                description: data.description,
                reference: data.reference,
            });

            const savedEntry = await manager.save(entry);

            for (const line of data.lines) {
                const journalLine = manager.create(JournalLine, {
                    journalEntryId: savedEntry.id,
                    accountId: line.accountId,
                    type: line.type,
                    amount: line.amount,
                });
                await manager.save(journalLine);

                // Update Account Balance
                const account = await manager.findOne(ChartOfAccount, {
                    where: { id: line.accountId },
                });
                if (account) {
                    const isIncrease =
                        account.type === AccountType.ASSET ||
                            account.type === AccountType.EXPENSE
                            ? line.type === EntryType.DEBIT
                            : line.type === EntryType.CREDIT;

                    if (isIncrease) {
                        account.balance = Number(account.balance) + Number(line.amount);
                    } else {
                        account.balance = Number(account.balance) - Number(line.amount);
                    }
                    await manager.save(account);
                }
            }

            return savedEntry;
        });
    }

    async getExpenses(organizationId: string) {
        return await this.expenseRepo.find({
            where: { organizationId },
            order: { date: 'DESC' },
        });
    }

    async createExpense(organizationId: string, data: any) {
        const expense = this.expenseRepo.create({
            ...data,
            organizationId,
        });
        return this.expenseRepo.save(expense);
    }

    async getLedger(organizationId: string) {
        return this.journalRepo.find({
            where: { organizationId },
            relations: ['lines', 'lines.account'],
            order: { date: 'DESC' },
        });
    }
}
