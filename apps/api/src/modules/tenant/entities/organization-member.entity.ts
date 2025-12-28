import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import type { Organization } from './organization.entity';
import type { User } from '../../auth/entities/user.entity';

export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

@Entity('organization_members')
@Unique(['organizationId', 'userId'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne('Organization', 'members', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne('User', 'organizations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50 })
  role: MemberRole;

  @Column({ type: 'simple-json', default: '{}' })
  permissions: Record<string, any>;

  @Column({ name: 'invited_by', nullable: true })
  invitedBy: string;

  @ManyToOne('User', { nullable: true })
  @JoinColumn({ name: 'invited_by' })
  inviter: User;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
