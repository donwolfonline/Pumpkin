import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  addMinutes,
  format,
  parse,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  isEqual,
} from 'date-fns';
import { BookingType } from '../entities/booking-type.entity';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Availability } from '../entities/availability.entity';
import { CreateBookingTypeDto } from '../dto/create-booking-type.dto';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(BookingType)
    private readonly bookingTypeRepo: Repository<BookingType>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {}

  // --- Booking Types ---

  async createBookingType(
    organizationId: string,
    dto: CreateBookingTypeDto,
  ): Promise<BookingType> {
    const existing = await this.bookingTypeRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new BadRequestException('Slug already in use');
    }

    const bookingType = this.bookingTypeRepo.create({
      ...dto,
      organizationId,
    });
    return this.bookingTypeRepo.save(bookingType);
  }

  async findAllBookingTypes(organizationId: string): Promise<BookingType[]> {
    return this.bookingTypeRepo.find({
      where: { organizationId },
      order: { name: 'ASC' },
    });
  }

  async findBookingTypeBySlug(slug: string): Promise<BookingType> {
    const type = await this.bookingTypeRepo.findOne({
      where: { slug, isActive: true },
    });
    if (!type) {
      throw new NotFoundException('Booking type not found');
    }
    return type;
  }

  // --- Appointments ---

  async createAppointment(
    organizationId: string,
    dto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const bookingType = await this.bookingTypeRepo.findOne({
      where: { id: dto.bookingTypeId, organizationId },
    });
    if (!bookingType) {
      throw new NotFoundException('Booking type not found');
    }

    const start = new Date(dto.startTime);
    const end = new Date(start.getTime() + bookingType.duration * 60000);

    // Conflict check (Basic)
    const conflict = await this.appointmentRepo.findOne({
      where: {
        userId: dto.userId,
        status: AppointmentStatus.SCHEDULED,
        startTime: LessThanOrEqual(end),
        endTime: MoreThanOrEqual(start),
      },
    });

    if (conflict) {
      throw new BadRequestException('Time slot is already booked');
    }

    const appointment = this.appointmentRepo.create({
      ...dto,
      organizationId,
      endTime: end,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentRepo.save(appointment);
  }

  async findAllAppointments(
    organizationId: string,
    start?: Date,
    end?: Date,
  ): Promise<Appointment[]> {
    const where: any = { organizationId };
    if (start && end) {
      (where as Record<string, any>)['startTime'] = Between(start, end);
    }

    return this.appointmentRepo.find({
      where: where,
      relations: ['contact', 'bookingType', 'assignedTo'],
      order: { startTime: 'ASC' },
    });
  }

  // --- Availability ---

  async updateAvailability(
    organizationId: string,
    userId: string,
    availabilities: { dayOfWeek: number; startTime: string; endTime: string }[],
  ): Promise<void> {
    // Delete existing for user
    await this.availabilityRepo.delete({ organizationId, userId });

    // Insert new
    const entities = availabilities.map((a) =>
      this.availabilityRepo.create({
        ...a,
        organizationId,
        userId,
      }),
    );

    await this.availabilityRepo.save(entities);
  }

  async getUserAvailability(
    organizationId: string,
    userId: string,
  ): Promise<Availability[]> {
    return this.availabilityRepo.find({
      where: { organizationId, userId },
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async getAvailableSlots(
    organizationId: string,
    bookingTypeId: string,
    date: Date,
  ): Promise<Date[]> {
    const bookingType = await this.bookingTypeRepo.findOne({
      where: { id: bookingTypeId, organizationId },
    });
    if (!bookingType) {
      throw new NotFoundException('Booking type not found');
    }

    const dayOfWeek = date.getDay();
    const availability = await this.availabilityRepo.find({
      where: { organizationId, dayOfWeek },
    });

    if (availability.length === 0) {
      return [];
    }

    const appointments = await this.appointmentRepo.find({
      where: {
        organizationId,
        startTime: Between(startOfDay(date), endOfDay(date)),
        status: AppointmentStatus.SCHEDULED,
      },
    });

    const slots: Date[] = [];
    const duration = bookingType.duration;
    const buffer = bookingType.bufferBefore + bookingType.bufferAfter;

    for (const avail of availability) {
      let current = parse(
        `${format(date, 'yyyy-MM-dd')} ${avail.startTime}`,
        'yyyy-MM-dd HH:mm',
        new Date(),
      );
      const end = parse(
        `${format(date, 'yyyy-MM-dd')} ${avail.endTime}`,
        'yyyy-MM-dd HH:mm',
        new Date(),
      );

      while (isBefore(addMinutes(current, duration), end)) {
        const slotEnd = addMinutes(current, duration);
        const hasConflict = appointments.some((app) => {
          const appStart = new Date(app.startTime);
          const appEnd = new Date(app.endTime);
          return (
            (isBefore(current, appEnd) && isAfter(slotEnd, appStart)) ||
            isEqual(current, appStart)
          );
        });

        if (!hasConflict) {
          slots.push(new Date(current));
        }
        current = addMinutes(current, duration + buffer);
      }
    }

    return slots;
  }
}
