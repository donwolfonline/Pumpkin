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
import { Organization } from '../../tenant/entities/organization.entity';
import type { Lead } from './lead.entity';

export enum ContactType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
}

@Entity('crm_contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({
    type: 'varchar',
    length: 20,
    default: ContactType.INDIVIDUAL,
  })
  type: ContactType;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'simple-json', nullable: true })
  address: Record<string, any>;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  @Column({ type: 'simple-json', default: '{}' })
  metadata: Record<string, any>;

  @OneToMany('Lead', 'contact')
  leads: Lead[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
