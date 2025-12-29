import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum NotificationCategory {
  BILLING = 'billing',
  LEAD = 'lead',
  SYSTEM = 'system',
  SECURITY = 'security',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  @Index()
  organizationId: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  category: NotificationCategory;

  @Column()
  templateId: string;

  @Column({ type: 'simple-json' })
  data: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
