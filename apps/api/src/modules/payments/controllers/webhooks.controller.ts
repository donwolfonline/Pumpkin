import {
  Controller,
  Post,
  Headers,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request } from 'express';
import { PaymentsService } from '../services/payments.service';

@ApiTags('Payments Webhooks')
@Controller('webhooks/stripe')
export class WebhooksController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: Request,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    // Note: We need the raw body for signature verification.
    // In NestJS, this usually requires special configuration in main.ts
    // or a custom middleware to preserve the raw body.
    return this.paymentsService.handleWebhook(
      signature,
      (request as Request & { rawBody: Buffer }).rawBody,
    );
  }
}
