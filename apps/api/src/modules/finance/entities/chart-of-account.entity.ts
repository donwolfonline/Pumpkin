import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Index,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { Organization } from '../../tenant/entities/organization.entity';

export enum AccountType {
    ASSET = 'ASSET',
    LIABILITY = 'LIABILITY',
    EQUITY = 'EQUITY',
    REVENUE = 'REVENUE',
    EXPENSE = 'EXPENSE',
}

@Entity('chart_of_accounts')
export class ChartOfAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    organizationId: string;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    type: AccountType;

    @Column('decimal', { precision: 20, scale: 2, default: 0 })
    balance: number;

    @Column({ type: 'varchar', nullable: true, name: 'parent_id' })
    parentId?: string | null;

    @Exclude()
    @ManyToOne(() => ChartOfAccount, (account) => account.children)
    @JoinColumn({ name: 'parent_id' })
    parent?: ChartOfAccount | null;

    @Type(() => ChartOfAccount)
    @OneToMany(() => ChartOfAccount, (account) => account.parent)
    children?: ChartOfAccount[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
