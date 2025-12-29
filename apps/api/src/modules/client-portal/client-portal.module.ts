import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPortalService } from './client-portal.service';
import { ClientPortalController } from './client-portal.controller';
import { Document } from '../documents/entities/document.entity';
import { Invoice } from '../payments/entities/invoice.entity';
import { Contact } from '../crm/entities/contact.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Document, Invoice, Contact]),
    ],
    controllers: [ClientPortalController],
    providers: [ClientPortalService],
    exports: [ClientPortalService],
})
export class ClientPortalModule { }
