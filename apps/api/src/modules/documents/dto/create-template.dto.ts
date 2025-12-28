import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { DocumentTemplateType } from '../entities/document-template.entity';

export class CreateDocumentTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: DocumentTemplateType,
    default: DocumentTemplateType.PROPOSAL,
  })
  @IsEnum(DocumentTemplateType)
  @IsOptional()
  type?: DocumentTemplateType;

  @ApiProperty({ type: [Object], default: [] })
  @IsArray()
  @IsOptional()
  content?: any[];
}
