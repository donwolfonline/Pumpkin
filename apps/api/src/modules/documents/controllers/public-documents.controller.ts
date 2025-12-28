import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { DocumentsService } from '../services/documents.service';
import { SignDocumentDto } from '../dto/sign-document.dto';

@ApiTags('Public Documents')
@Controller('public/documents')
export class PublicDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':token')
  @ApiOperation({ summary: 'View a document by public token' })
  viewByToken(@Param('token') token: string) {
    return this.documentsService.findByToken(token);
  }

  @Post(':token/sign')
  @ApiOperation({ summary: 'Sign a document by public token' })
  sign(
    @Param('token') token: string,
    @Body() dto: SignDocumentDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for']?.toString() || '';
    const userAgent = req.headers['user-agent'] || '';

    return this.documentsService.signDocument(token, dto, { ip, userAgent });
  }
}
