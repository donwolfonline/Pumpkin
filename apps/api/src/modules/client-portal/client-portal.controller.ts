import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientPortalService } from './client-portal.service';

@Controller('portal')
@UseGuards(JwtAuthGuard)
export class ClientPortalController {
    constructor(private readonly clientPortalService: ClientPortalService) { }

    @Get('dashboard')
    async getDashboard(@Req() req: any) {
        const user = req.user.user;
        return this.clientPortalService.getClientDashboard(user.email);
    }

    @Get('documents')
    async getDocuments(@Req() req: any) {
        const user = req.user.user;
        return this.clientPortalService.getClientDocuments(user.email);
    }

    @Get('invoices')
    async getInvoices(@Req() req: any) {
        const user = req.user.user;
        return this.clientPortalService.getClientInvoices(user.email);
    }
}
