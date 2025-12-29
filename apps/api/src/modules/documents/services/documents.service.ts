import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as crypto from 'crypto';
import { DocumentTemplate } from '../entities/document-template.entity';
import {
  Document,
  DocumentStatus,
  DocumentType,
} from '../entities/document.entity';
import { DocumentSignature } from '../entities/document-signature.entity';
import { DocumentVersion } from '../entities/document-version.entity';
import { CreateDocumentTemplateDto } from '../dto/create-template.dto';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { SignDocumentDto } from '../dto/sign-document.dto';
import { AuthService } from '../../auth/auth.service';
import { Contact } from '../../crm/entities/contact.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(DocumentTemplate)
    private readonly templateRepository: Repository<DocumentTemplate>,
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    @InjectRepository(DocumentSignature)
    private readonly signatureRepository: Repository<DocumentSignature>,
    @InjectRepository(DocumentVersion)
    private readonly versionRepository: Repository<DocumentVersion>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
  ) { }

  // --- Template Methods ---

  async createTemplate(
    organizationId: string,
    dto: CreateDocumentTemplateDto,
  ): Promise<DocumentTemplate> {
    const template = this.templateRepository.create({
      ...dto,
      organizationId,
    });
    return this.templateRepository.save(template);
  }

  async findAllTemplates(organizationId: string): Promise<DocumentTemplate[]> {
    return this.templateRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  // --- Document Methods ---

  async createDocument(
    organizationId: string,
    dto: CreateDocumentDto,
  ): Promise<Document> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const publicToken = crypto.randomBytes(32).toString('hex');

      const document = this.documentRepository.create({
        ...dto,
        organizationId,
        publicToken,
        status: DocumentStatus.DRAFT,
      });

      const savedDocument = await queryRunner.manager.save(document);

      // Create initial version
      const version = this.versionRepository.create({
        documentId: savedDocument.id,
        versionNumber: 1,
        content: dto.content || [],
      });

      const savedVersion = await queryRunner.manager.save(version);

      // Update document with current version ID
      savedDocument.currentVersionId = savedVersion.id;
      await queryRunner.manager.save(savedDocument);

      await queryRunner.commitTransaction();

      // Trigger auto-registration if contact is present
      if (savedDocument.contactId) {
        const contact = await this.contactRepository.findOne({
          where: { id: savedDocument.contactId },
        });
        if (contact?.email) {
          const nameParts = (contact.name || '').split(' ');
          await this.authService.autoRegisterClient(
            contact.email,
            {
              firstName: nameParts[0] || 'Client',
              lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
            },
            organizationId,
          );
        }
      }

      return savedDocument;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createVersion(
    organizationId: string,
    documentId: string,
    content: any[],
  ): Promise<DocumentVersion> {
    const document = await this.findOne(organizationId, documentId);

    const latestVersion = await this.versionRepository.findOne({
      where: { documentId },
      order: { versionNumber: 'DESC' },
    });

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    const version = this.versionRepository.create({
      documentId,
      versionNumber: newVersionNumber,
      content,
    });

    const savedVersion = await this.versionRepository.save(version);

    // Update document's current version
    document.currentVersionId = savedVersion.id;
    // If it was signed, moving to a new version might reset it to negotiating
    if (document.status === DocumentStatus.SIGNED) {
      document.status = DocumentStatus.NEGOTIATING;
    }
    await this.documentRepository.save(document);

    return savedVersion;
  }

  async sendDocument(organizationId: string, id: string): Promise<Document> {
    const document = await this.findOne(organizationId, id);

    if (
      document.status !== DocumentStatus.DRAFT &&
      document.status !== DocumentStatus.NEGOTIATING
    ) {
      throw new BadRequestException(
        `Cannot send document in status ${document.status}`,
      );
    }

    document.status = DocumentStatus.SENT;
    // In a real app, this is where we'd trigger the email
    // await this.emailService.sendDocumentInvite(document);

    return this.documentRepository.save(document);
  }

  async findAllDocuments(organizationId: string): Promise<Document[]> {
    return this.documentRepository.find({
      where: { organizationId },
      relations: ['contact', 'lead'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, organizationId },
      relations: ['contact', 'lead', 'signatures', 'versions'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID "${id}" not found`);
    }

    return document;
  }

  async findByToken(token: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { publicToken: token },
      relations: ['contact', 'organization', 'versions'],
    });

    if (!document) {
      throw new NotFoundException('Invalid or expired document link');
    }

    return document;
  }

  async signDocument(
    token: string,
    dto: SignDocumentDto,
    requestInfo: { ip: string; userAgent: string },
  ): Promise<Document> {
    const document = await this.findByToken(token);

    if (document.status === DocumentStatus.SIGNED) {
      throw new BadRequestException('This document has already been signed');
    }

    if (document.status === DocumentStatus.VOIDED) {
      throw new BadRequestException('This document has been voided');
    }

    // Create signature record linked to current version
    const signature = this.signatureRepository.create({
      documentId: document.id,
      versionId: document.currentVersionId,
      signerName: dto.signerName,
      signerEmail: dto.signerEmail,
      signatureImage: dto.signatureImage,
      ipAddress: requestInfo.ip,
      userAgent: requestInfo.userAgent,
    });

    await this.signatureRepository.save(signature);

    // Update document status
    document.status = DocumentStatus.SIGNED;
    document.signedAt = new Date();

    const signedDocument = await this.documentRepository.save(document);

    // Placeholder for PDF generation
    // await this.generatePdf(signedDocument.id);

    return signedDocument;
  }

  async generatePdf(documentId: string): Promise<string> {
    // This is a placeholder for the PDF generation logic using Puppeteer
    console.log(`Generating PDF for document ${documentId}...`);
    return `pdfs/${documentId}.pdf`;
  }

  async updateStatus(
    organizationId: string,
    id: string,
    status: DocumentStatus,
  ): Promise<Document> {
    const document = await this.findOne(organizationId, id);
    document.status = status;
    return this.documentRepository.save(document);
  }
}
