import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
    @ApiProperty({ description: 'Date of the expense' })
    date: Date;

    @ApiProperty({ description: 'Description of the expense' })
    description: string;

    @ApiProperty({ description: 'Amount of the expense' })
    amount: number;

    @ApiProperty({ description: 'Category of the expense (e.g., Office Supplies, Travel)' })
    category: string;

    @ApiPropertyOptional({ description: 'Reference number or invoice ID' })
    reference?: string;

    @ApiPropertyOptional({ description: 'Vendor name' })
    vendor?: string;

    @ApiProperty({ description: 'ID of the account to debit' })
    accountId: string;
}
