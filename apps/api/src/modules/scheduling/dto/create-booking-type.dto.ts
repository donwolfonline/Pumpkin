import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  Min,
  IsBoolean,
} from 'class-validator';

export class CreateBookingTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  bufferBefore?: number;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @IsOptional()
  @Min(0)
  bufferAfter?: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
