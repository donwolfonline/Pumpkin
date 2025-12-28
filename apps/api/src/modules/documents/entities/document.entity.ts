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
import type { Contact } from '../../crm/entities/contact.entity';
import type { Lead } from '../../crm/entities/lead.entity';
import { DocumentSignature } from './document-signature.entity';
import { DocumentVersion } from './document-version.entity';
export enum DocumentStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  VIEWED = 'viewed',
  SIGNED = 'signed',
  VOIDED = 'voided',
  NEGOTIATING = 'negotiating',
}

export enum DocumentType {
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id' })
  organizationId: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'template_id', nullable: true })
  templateId: string;

  @Column({ name: 'contact_id' })
  contactId: string;

  @ManyToOne('Contact')
  @JoinColumn({ name: 'contact_id' })
  contact: Contact;

  @Column({ name: 'lead_id', nullable: true })
  leadId: string;

  @ManyToOne('Lead')
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'project_id', nullable: true })
  projectId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({
    type: 'varchar',
    length: 20,
    default: DocumentType.PROPOSAL,
  })
  type: DocumentType;

  @Column({ type: 'simple-json', default: '[]' })
  content: any[];

  @Column({ name: 'current_version_id', nullable: true })
  currentVersionId: string;

  @OneToMany(() => DocumentVersion, (v) => v.document)
  versions: DocumentVersion[];

  @Column({ name: 'public_token', unique: true, length: 100 })
  publicToken: string;

  @Column({ name: 'total_amount', type: 'integer', default: 0 })
  totalAmount: number;

  @Column({ name: 'signed_at', nullable: true })
  signedAt: Date;

  @Column({ name: 'expires_at', nullable: true })
  expiresAt: Date;

  @OneToMany('DocumentSignature', 'document')
  signatures: DocumentSignature[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
