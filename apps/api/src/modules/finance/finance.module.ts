import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChartOfAccount } from './entities/chart-of-account.entity';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalLine } from './entities/journal-line.entity';
import { Expense } from './entities/expense.entity';
import { FinanceService } from './services/finance.service';
import { FinanceController } from './controllers/finance.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ChartOfAccount,
            JournalEntry,
            JournalLine,
            Expense,
        ]),
    ],
    controllers: [FinanceController],
    providers: [FinanceService],
    exports: [FinanceService],
})
export class FinanceModule { }
