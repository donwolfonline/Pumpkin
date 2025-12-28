import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { PaymentsService } from '../services/payments.service';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-intent')
  @ApiOperation({ summary: 'Create a Stripe Payment Intent' })
  createIntent(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: CreatePaymentIntentDto,
  ) {
    return this.paymentsService.createPaymentIntent(member.organizationId, dto);
  }

  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Create a Stripe Checkout Session' })
  createCheckoutSession(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: { priceId: string; mode: 'subscription' | 'payment' },
  ) {
    return this.paymentsService.createCheckoutSession(
      member.organizationId,
      dto,
    );
  }
}
