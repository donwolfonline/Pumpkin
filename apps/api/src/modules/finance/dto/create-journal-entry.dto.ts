import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntryType } from '../entities/journal-line.entity';

class JournalLineDto {
    @ApiProperty({ description: 'ID of the account' })
    accountId: string;

    @ApiProperty({ enum: EntryType, description: 'Type of entry (DEBIT or CREDIT)' })
    type: EntryType;

    @ApiProperty({ description: 'Amount' })
    amount: number;
}

export class CreateJournalEntryDto {
    @ApiProperty({ description: 'Date of the journal entry' })
    date: Date;

    @ApiProperty({ description: 'Overall description for the entry' })
    description: string;

    @ApiPropertyOptional({ description: 'Reference number' })
    reference?: string;

    @ApiProperty({ type: [JournalLineDto], description: 'List of journal lines' })
    lines: JournalLineDto[];
}
