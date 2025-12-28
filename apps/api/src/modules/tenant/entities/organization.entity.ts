import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import type { OrganizationMember } from './organization-member.entity';

export type SubscriptionTier =
  | 'free'
  | 'starter'
  | 'professional'
  | 'enterprise';
export type SubscriptionStatus =
  | 'active'
  | 'cancelled'
  | 'past_due'
  | 'trialing';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({
    name: 'subscription_tier',
    type: 'varchar',
    length: 50,
    default: 'free',
  })
  subscriptionTier: SubscriptionTier;

  @Column({
    name: 'subscription_status',
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  subscriptionStatus: SubscriptionStatus;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripeCustomerId: string;

  @Column({ type: 'simple-json', default: '{}' })
  settings: Record<string, any>;

  @OneToMany('OrganizationMember', 'organization')
  members: OrganizationMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
