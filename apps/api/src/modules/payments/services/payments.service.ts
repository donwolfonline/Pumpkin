import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Subscription as SubscriptionEntity } from '../entities/subscription.entity';
import { Invoice } from '../entities/invoice.entity';
import { CreatePaymentIntentDto } from '../dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepo: Repository<SubscriptionEntity>,
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,
  ) {
    const secretKey = this.configService.get<string>(
      'STRIPE_SECRET_KEY',
    ) as string;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion:
        '2025-01-27-preview.acacia' as Stripe.StripeConfig['apiVersion'],
    });
  }

  async createPaymentIntent(
    organizationId: string,
    dto: CreatePaymentIntentDto,
  ) {
    const { amount, currency = 'usd', metadata } = dto;

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: {
        ...metadata,
        organizationId,
      },
    });

    const payment = this.paymentRepo.create({
      organizationId,
      amount,
      currency,
      status: PaymentStatus.PENDING,
      stripePaymentIntentId: intent.id,
      metadata,
    });
    await this.paymentRepo.save(payment);

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  async createCheckoutSession(
    organizationId: string,
    dto: { priceId: string; mode: 'subscription' | 'payment' },
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: dto.priceId, quantity: 1 }],
      mode: dto.mode,
      success_url: `${this.configService.get('FRONTEND_URL')}/billing/success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/billing/cancel`,
      metadata: { organizationId },
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    ) as string;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.updatePaymentStatus(
          event.data.object as Stripe.PaymentIntent,
          PaymentStatus.SUCCEEDED,
        );
        break;
      case 'payment_intent.payment_failed':
        await this.updatePaymentStatus(
          event.data.object as Stripe.PaymentIntent,
          PaymentStatus.FAILED,
        );
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.created':
        await this.syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
      case 'charge.dispute.created':
        await this.handleChargeDisputed(event.data.object as Stripe.Dispute);
        break;
    }

    return { received: true };
  }

  private async updatePaymentStatus(
    intent: Stripe.PaymentIntent,
    status: PaymentStatus,
  ) {
    const payment = await this.paymentRepo.findOne({
      where: { stripePaymentIntentId: intent.id },
    });

    if (payment) {
      payment.status = status;
      await this.paymentRepo.save(payment);
    }
  }

  private async handleChargeRefunded(charge: Stripe.Charge) {
    const payment = await this.paymentRepo.findOne({
      where: { stripePaymentIntentId: charge.payment_intent as string },
    });

    if (payment) {
      payment.status = PaymentStatus.REFUNDED;
      await this.paymentRepo.save(payment);
    }
  }

  private async handleChargeDisputed(dispute: Stripe.Dispute) {
    const payment = await this.paymentRepo.findOne({
      where: { stripePaymentIntentId: dispute.payment_intent as string },
    });

    if (payment) {
      payment.status = PaymentStatus.DISPUTED;
      await this.paymentRepo.save(payment);
    }
  }

  private async syncSubscription(stripeSubscription: Stripe.Subscription) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const sub: any = stripeSubscription;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const orgId = sub.metadata?.organizationId as string;
    if (!orgId) return;

    let subRecord = await this.subscriptionRepo.findOne({
      where: { stripeSubscriptionId: sub.id as string },
    });

    if (!subRecord) {
      subRecord = this.subscriptionRepo.create({
        organizationId: orgId,
        stripeSubscriptionId: sub.id as string,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    subRecord.stripePriceId = sub.items.data[0].price.id as string;
    subRecord.status = sub.status as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    subRecord.currentPeriodEnd = new Date((sub.current_period_end as number) * 1000);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    subRecord.cancelAtPeriodEnd = sub.cancel_at_period_end as boolean;

    await this.subscriptionRepo.save(subRecord);
  }

  private async handleInvoicePaid(stripeInvoice: Stripe.Invoice) {
    const orgId = stripeInvoice.metadata?.organizationId;
    if (!orgId) return;

    const invoice = this.invoiceRepo.create({
      organizationId: orgId,
      stripeInvoiceId: stripeInvoice.id,
      amountPaid: stripeInvoice.amount_paid / 100,
      currency: stripeInvoice.currency,
      invoicePdfUrl: stripeInvoice.invoice_pdf || undefined,
      status: 'paid',
    });

    await this.invoiceRepo.save(invoice);
  }
}
