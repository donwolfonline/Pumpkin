import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Document } from './document.entity';
import { DocumentVersion } from './document-version.entity';

@Entity('document_signatures')
export class DocumentSignature {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'document_id' })
  documentId: string;

  @ManyToOne('Document', (document: Document) => document.signatures)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @Column({ name: 'version_id', nullable: true })
  versionId: string;

  @ManyToOne(() => DocumentVersion, (version) => version.signatures)
  @JoinColumn({ name: 'version_id' })
  version: DocumentVersion;

  @Column({ name: 'signer_name' })
  signerName: string;

  @Column({ name: 'signer_email' })
  signerEmail: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'signature_image', type: 'text', nullable: true })
  signatureImage: string;

  @CreateDateColumn({ name: 'signed_at' })
  signedAt: Date;
}
