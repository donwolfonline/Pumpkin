import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTemplate } from './entities/document-template.entity';
import { Document } from './entities/document.entity';
import { DocumentSignature } from './entities/document-signature.entity';
import { DocumentVersion } from './entities/document-version.entity';
import { DocumentsService } from './services/documents.service';
import { DocumentsController } from './controllers/documents.controller';
import { PublicDocumentsController } from './controllers/public-documents.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocumentTemplate,
      Document,
      DocumentSignature,
      DocumentVersion,
    ]),
  ],
  controllers: [DocumentsController, PublicDocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule { }
