import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class SignDocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  signerName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  signerEmail: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  signatureImage?: string;
}
