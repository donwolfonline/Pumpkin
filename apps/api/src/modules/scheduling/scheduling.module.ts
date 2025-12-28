import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingType } from './entities/booking-type.entity';
import { Availability } from './entities/availability.entity';
import { Appointment } from './entities/appointment.entity';
import { SchedulingService } from './services/scheduling.service';
import { SchedulingController } from './controllers/scheduling.controller';
import { PublicSchedulingController } from './controllers/public-scheduling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BookingType, Availability, Appointment])],
  controllers: [SchedulingController, PublicSchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
