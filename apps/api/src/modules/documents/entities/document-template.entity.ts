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

export enum DocumentTemplateType {
  PROPOSAL = 'proposal',
  CONTRACT = 'contract',
  COMBINED = 'combined',
}

@Entity('doc_templates')
export class DocumentTemplate {
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
    length: 20,
    default: DocumentTemplateType.PROPOSAL,
  })
  type: DocumentTemplateType;

  @Column({ type: 'simple-json', default: '[]' })
  content: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
