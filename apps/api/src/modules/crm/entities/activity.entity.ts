import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Organization } from '../../tenant/entities/organization.entity';
import { User } from '../../auth/entities/user.entity';

export enum ActivityType {
  NOTE = 'note',
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
}

@Entity('crm_activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'entity_type' })
  entityType: string; // 'contact' | 'lead'

  @Column({ name: 'entity_id' })
  entityId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ActivityType.NOTE,
  })
  type: ActivityType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({
    name: 'occurred_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredAt: Date;

  @Column({ name: 'created_by_id' })
  createById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
