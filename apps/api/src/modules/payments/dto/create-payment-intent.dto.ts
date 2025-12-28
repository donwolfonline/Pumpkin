import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 100.0, description: 'Amount in decimal format' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'usd', description: 'Currency code' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
