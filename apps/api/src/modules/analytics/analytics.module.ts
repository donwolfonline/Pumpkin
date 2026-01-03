import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsController } from './controllers/analytics.controller';
import { Lead } from '../crm/entities/lead.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Invoice } from '../payments/entities/invoice.entity';
import { Appointment } from '../scheduling/entities/appointment.entity';

import { SystemEvent } from './entities/system-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Payment, Invoice, Appointment, SystemEvent]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule { }
