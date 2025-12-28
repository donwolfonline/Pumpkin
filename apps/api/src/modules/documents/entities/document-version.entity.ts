import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Document } from './document.entity';
import { DocumentSignature } from './document-signature.entity';

@Entity('document_versions')
export class DocumentVersion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'document_id' })
    documentId: string;

    @ManyToOne('Document', (doc: Document) => doc.versions)
    @JoinColumn({ name: 'document_id' })
    document: Document;

    @Column({ name: 'version_number' })
    versionNumber: number;

    @Column({ type: 'simple-json' })
    content: any[];

    @Column({ name: 'created_by_id', nullable: true })
    createdById: string;

    @OneToMany('DocumentSignature', (sig: DocumentSignature) => sig.version)
    signatures: DocumentSignature[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
