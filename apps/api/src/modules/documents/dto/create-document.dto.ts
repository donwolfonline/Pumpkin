import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { DocumentType } from '../entities/document.entity';

export class CreateDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  @IsNotEmpty()
  type: DocumentType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  templateId?: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  contactId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  leadId?: string;

  @ApiProperty({ type: [Object], default: [] })
  @IsArray()
  @IsOptional()
  content?: any[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;
}
