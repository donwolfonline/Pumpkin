import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { LeadStage } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  contactId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiProperty({ required: false, default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: LeadStage, default: LeadStage.NEW })
  @IsEnum(LeadStage)
  @IsOptional()
  stage?: LeadStage;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  probability?: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;
}
