import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsArray,
} from 'class-validator';
import { ContactType } from '../entities/contact.entity';

export class CreateContactDto {
  @ApiProperty({ enum: ContactType, default: ContactType.INDIVIDUAL })
  @IsEnum(ContactType)
  @IsOptional()
  type?: ContactType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  address?: Record<string, any>;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
