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
import type { Contact } from './contact.entity';

export enum LeadStage {
  NEW = 'new',
  CONTACTED = 'contacted',
  PROPOSAL_SENT = 'proposal_sent',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

@Entity('crm_leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne((): typeof Organization => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'contact_id' })
  contactId: string;

  @ManyToOne('Contact', 'leads')
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'integer', default: 0 })
  value: number; // Stored in cents

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: LeadStage.NEW,
  })
  stage: LeadStage;

  @Column({ type: 'integer', default: 0 })
  probability: number;

  @Column({ name: 'expected_close_date', nullable: true })
  expectedCloseDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
