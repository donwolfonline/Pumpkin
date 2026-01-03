import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FinanceService } from './modules/finance/services/finance.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const financeService = app.get(FinanceService);

    // Mock an organization ID from the database
    const organizationId = '85fb7371-8bc1-4903-8821-665e714397a7'; // Replace with a real one if known, or let it seed

    console.log('--- Testing getChartOfAccounts ---');
    try {
        const accounts = await financeService.getChartOfAccounts(organizationId);
        console.log('Success! Root accounts count:', accounts.length);
        // console.log(JSON.stringify(accounts, null, 2));
    } catch (error) {
        console.error('Error in getChartOfAccounts:', error);
    }

    console.log('--- Testing getExpenses ---');
    try {
        const expenses = await financeService.getExpenses(organizationId);
        console.log('Success! Expenses count:', expenses.length);
    } catch (error) {
        console.error('Error in getExpenses:', error);
    }

    await app.close();
}

bootstrap().catch(err => {
    console.error('Bootstrap error:', err);
    process.exit(1);
});
