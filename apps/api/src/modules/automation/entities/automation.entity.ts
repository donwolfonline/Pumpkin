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

export enum AutomationTrigger {
  LEAD_CREATED = 'lead_created',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  APPOINTMENT_BOOKED = 'appointment_booked',
}

export enum AutomationAction {
  CREATE_ACTIVITY = 'create_activity',
  SEND_EMAIL = 'send_email',
  UPDATE_STATUS = 'update_status',
}

@Entity('automations')
export class Automation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  trigger: AutomationTrigger;

  @Column({
    type: 'varchar',
    length: 50,
  })
  action: AutomationAction;

  @Column({ type: 'simple-json', default: '{}' })
  configuration: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
