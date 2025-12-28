import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../../crm/entities/lead.entity';
import { Payment, PaymentStatus } from '../../payments/entities/payment.entity';
import {
  Appointment,
  AppointmentStatus,
} from '../../scheduling/entities/appointment.entity';

import { SystemEvent, EventCategory } from '../entities/system-event.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(SystemEvent)
    private readonly eventRepo: Repository<SystemEvent>,
  ) {}

  async trackEvent(
    organizationId: string,
    eventName: string,
    category: EventCategory,
    properties: Record<string, any> = {},
    userId?: string,
  ) {
    const event = this.eventRepo.create({
      organizationId,
      userId,
      eventName,
      category,
      properties,
    });
    return this.eventRepo.save(event);
  }

  async getSummary(organizationId: string) {
    const [totalLeads, activeAppointments, payments] = await Promise.all([
      this.leadRepo.count({ where: { organizationId } }),
      this.appointmentRepo.count({
        where: { organizationId, status: AppointmentStatus.SCHEDULED },
      }),
      this.paymentRepo.find({
        where: { organizationId, status: PaymentStatus.SUCCEEDED },
      }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      totalLeads,
      activeAppointments,
      totalRevenue,
      currency: 'USD',
    };
  }
}
