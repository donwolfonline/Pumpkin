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

@Entity('subscriptions')
export class Subscription {
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
    stripeSubscriptionId: string;

    @Column()
    stripePriceId: string;

    @Column({
        type: 'varchar',
        length: 50,
        default: 'trialing',
    })
    status: string;

    @Column({ type: 'datetime' })
    currentPeriodEnd: Date;

    @Column({ default: false })
    cancelAtPeriodEnd: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
