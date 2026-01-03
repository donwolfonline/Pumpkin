import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Organization } from '../../tenant/entities/organization.entity';
import { JournalLine } from './journal-line.entity';

@Entity('journal_entries')
export class JournalEntry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    organizationId: string;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column()
    date: Date;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    reference: string;

    @OneToMany(() => JournalLine, (line) => line.journalEntry, { cascade: true })
    lines: JournalLine[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
