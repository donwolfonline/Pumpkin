import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SchedulingService } from '../services/scheduling.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@ApiTags('Public Scheduling')
@Controller('public/scheduling')
export class PublicSchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('types/:slug')
  @ApiOperation({ summary: 'Get a booking type by slug' })
  getTypeBySlug(@Param('slug') slug: string) {
    return this.schedulingService.findBookingTypeBySlug(slug);
  }

  @Get('slots/:bookingTypeId')
  @ApiOperation({ summary: 'Get available slots for a booking type' })
  getAvailableSlots(
    @Param('bookingTypeId') bookingTypeId: string,
    @Query('date') dateStr: string,
  ) {
    const date = dateStr ? new Date(dateStr) : new Date();
    // In MVP, we'll bypass org check or assume it's valid for the booking type.
    // For now, passing an empty string as organizationId for public lookup.
    return this.schedulingService.getAvailableSlots('', bookingTypeId, date);
  }

  @Post('book')
  @ApiOperation({ summary: 'Publicly book an appointment' })
  async book(@Body() dto: CreateAppointmentDto) {
    // In a public booking flow, we would usually have a way to identify the organization
    // For now, we'll assume the DTO contains the necessary IDs or we'd look them up by slug.
    // For the sake of this MVP, we'll use a simplified version.
    // In a real scenario, you'd find the orgId by the booking type's slug.

    const bookingType = await this.schedulingService.findBookingTypeBySlug(
      dto.bookingTypeId,
    ); // Assuming ID is passed or slug
    return this.schedulingService.createAppointment(
      bookingType.organizationId,
      dto,
    );
  }
}
