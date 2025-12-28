import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { CommunicationsService } from '../services/communications.service';
import { MessageChannel } from '../entities/message.entity';

@Controller('crm/communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsController {
  constructor(private readonly commsService: CommunicationsService) {}

  @Get('contact/:contactId')
  async getByContact(
    @Param('contactId') contactId: string,
    @CurrentUser() { member }: AuthenticatedUser,
  ) {
    return this.commsService.findByContact(member.organizationId, contactId);
  }

  @Post('send-email')
  async sendEmail(
    @Body() body: { contactId: string; subject: string; content: string },
    @CurrentUser() { user, member }: AuthenticatedUser,
  ) {
    return this.commsService.sendEmail(
      member.organizationId,
      body.contactId,
      user.id,
      body.subject,
      body.content,
    );
  }
}
