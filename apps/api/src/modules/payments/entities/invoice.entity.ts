import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Organization } from '../../tenant/entities/organization.entity';

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    organizationId: string;

    @ManyToOne(() => Organization)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @Column({ unique: true })
    @Index()
    stripeInvoiceId: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amountPaid: number;

    @Column()
    currency: string;

    @Column({ nullable: true })
    invoicePdfUrl: string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
