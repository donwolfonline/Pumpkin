import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseInterceptors,
    UseGuards,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import { FinanceService } from '../services/finance.service';
import { TenantInterceptor } from '../../../common/interceptors/tenant.interceptor';
import { EntryType } from '../entities/journal-line.entity';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { CreateJournalEntryDto } from '../dto/create-journal-entry.dto';
import { ChartOfAccount } from '../entities/chart-of-account.entity';
import { Expense } from '../entities/expense.entity';
import { JournalEntry } from '../entities/journal-entry.entity';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance')
@UseInterceptors(TenantInterceptor, ClassSerializerInterceptor)
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get('accounts')
    @ApiOperation({ summary: 'Get Chart of Accounts (Hierarchical)' })
    @ApiResponse({ status: 200, description: 'Returns the tree of accounts', type: [ChartOfAccount] })
    async getAccounts(@CurrentUser() { member }: AuthenticatedUser) {
        return await this.financeService.getChartOfAccounts(member.organizationId);
    }

    @Get('accounts/all')
    @ApiOperation({ summary: 'Get all accounts (Flat)' })
    @ApiResponse({ status: 200, description: 'Returns flat list of all accounts', type: [ChartOfAccount] })
    async getAccountsFlat(@CurrentUser() { member }: AuthenticatedUser) {
        return await this.financeService.getAccountsFlat(member.organizationId);
    }

    @Post('accounts')
    @ApiOperation({ summary: 'Create a new account' })
    @ApiResponse({ status: 201, description: 'Account created successfully', type: ChartOfAccount })
    async createAccount(
        @CurrentUser() { member }: AuthenticatedUser,
        @Body() body: any,
    ) {
        return this.financeService.createAccount(member.organizationId, body);
    }

    @Patch('accounts/:id')
    @ApiOperation({ summary: 'Update an account' })
    @ApiResponse({ status: 200, description: 'Account updated successfully', type: ChartOfAccount })
    async updateAccount(
        @CurrentUser() { member }: AuthenticatedUser,
        @Param('id') id: string,
        @Body() body: any,
    ) {
        return this.financeService.updateAccount(member.organizationId, id, body);
    }

    @Get('ledger')
    @ApiOperation({ summary: 'Get General Ledger' })
    @ApiResponse({ status: 200, description: 'Returns the list of journal entries', type: [JournalEntry] })
    async getLedger(@CurrentUser() { member }: AuthenticatedUser) {
        return this.financeService.getLedger(member.organizationId);
    }

    @Get('expenses')
    @ApiOperation({ summary: 'Get all expenses' })
    @ApiResponse({ status: 200, description: 'Returns the list of expenses', type: [Expense] })
    async getExpenses(@CurrentUser() { member }: AuthenticatedUser) {
        return await this.financeService.getExpenses(member.organizationId);
    }

    @Post('expenses')
    @ApiOperation({ summary: 'Log a new expense' })
    @ApiResponse({ status: 201, description: 'Expense created successfully', type: Expense })
    async createExpense(
        @CurrentUser() { member }: AuthenticatedUser,
        @Body() body: CreateExpenseDto,
    ) {
        return this.financeService.createExpense(member.organizationId, body);
    }

    @Post('journal')
    @ApiOperation({ summary: 'Create a new journal entry' })
    @ApiResponse({ status: 201, description: 'Journal entry created successfully', type: JournalEntry })
    async createJournalEntry(
        @CurrentUser() { member }: AuthenticatedUser,
        @Body() body: CreateJournalEntryDto,
    ) {
        return this.financeService.createJournalEntry(
            member.organizationId,
            body,
        );
    }
}
