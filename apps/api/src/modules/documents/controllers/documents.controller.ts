import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentTemplateDto } from '../dto/create-template.dto';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { DocumentStatus } from '../entities/document.entity';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  // --- Templates ---

  @Post('templates')
  @ApiOperation({ summary: 'Create a new document template' })
  createTemplate(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: CreateDocumentTemplateDto,
  ) {
    return this.documentsService.createTemplate(member.organizationId, dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all templates for the organization' })
  findAllTemplates(@CurrentUser() { member }: AuthenticatedUser) {
    return this.documentsService.findAllTemplates(member.organizationId);
  }

  // --- Documents ---

  @Post()
  @ApiOperation({ summary: 'Create a new document from template or scratch' })
  createDocument(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.createDocument(member.organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents for the organization' })
  findAllDocuments(@CurrentUser() { member }: AuthenticatedUser) {
    return this.documentsService.findAllDocuments(member.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific document' })
  findOne(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.documentsService.findOne(member.organizationId, id);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send document to recipient' })
  sendDocument(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.documentsService.sendDocument(member.organizationId, id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Create a new version of the document' })
  createVersion(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
    @Body('content') content: any[],
  ) {
    return this.documentsService.createVersion(member.organizationId, id, content);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update document status' })
  updateStatus(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
    @Body('status') status: DocumentStatus,
  ) {
    return this.documentsService.updateStatus(
      member.organizationId,
      id,
      status,
    );
  }
}
