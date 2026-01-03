import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccount } from './chart-of-account.entity';

export enum EntryType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

@Entity('journal_lines')
export class JournalLine {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    journalEntryId: string;

    @ManyToOne(() => JournalEntry, (entry) => entry.lines)
    @JoinColumn({ name: 'journal_entry_id' })
    journalEntry: JournalEntry;

    @Column()
    accountId: string;

    @ManyToOne(() => ChartOfAccount)
    @JoinColumn({ name: 'account_id' })
    account: ChartOfAccount;

    @Column({
        type: 'varchar',
        length: 10,
    })
    type: EntryType;

    @Column('decimal', { precision: 20, scale: 2 })
    amount: number;
}
