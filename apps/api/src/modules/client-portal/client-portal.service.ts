import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from '../documents/entities/document.entity';
import { Invoice } from '../payments/entities/invoice.entity';
import { Contact } from '../crm/entities/contact.entity';

@Injectable()
export class ClientPortalService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        @InjectRepository(Contact)
        private readonly contactRepository: Repository<Contact>,
    ) { }

    async getClientDashboard(email: string) {
        const [documents, invoices] = await Promise.all([
            this.getClientDocuments(email),
            this.getClientInvoices(email),
        ]);

        return {
            documents,
            invoices,
            stats: {
                totalDocuments: documents.length,
                totalInvoices: invoices.length,
                pendingPayments: invoices.filter((i) => i.status !== 'paid').length,
                unsignedDocuments: documents.filter((d) => d.status !== DocumentStatus.SIGNED).length,
            },
        };
    }

    async getClientDocuments(email: string) {
        return this.documentRepository
            .createQueryBuilder('document')
            .innerJoin('document.contact', 'contact')
            .where('contact.email = :email', { email })
            .leftJoinAndSelect('document.organization', 'organization')
            .orderBy('document.createdAt', 'DESC')
            .getMany();
    }

    async getClientInvoices(email: string) {
        return this.invoiceRepository.find({
            where: { customerEmail: email },
            relations: ['organization'],
            order: { createdAt: 'DESC' },
        });
    }
}
