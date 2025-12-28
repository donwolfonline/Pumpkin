import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { SchedulingService } from '../services/scheduling.service';
import { CreateBookingTypeDto } from '../dto/create-booking-type.dto';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@ApiTags('Scheduling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  // --- Booking Types ---

  @Post('types')
  @ApiOperation({ summary: 'Create a new booking type' })
  createType(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: CreateBookingTypeDto,
  ) {
    return this.schedulingService.createBookingType(member.organizationId, dto);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all booking types' })
  findAllTypes(@CurrentUser() { member }: AuthenticatedUser) {
    return this.schedulingService.findAllBookingTypes(member.organizationId);
  }

  // --- Appointments ---

  @Post('appointments')
  @ApiOperation({ summary: 'Schedule a new appointment' })
  createAppointment(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.schedulingService.createAppointment(member.organizationId, dto);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Get all appointments' })
  findAllAppointments(
    @CurrentUser() { member }: AuthenticatedUser,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.schedulingService.findAllAppointments(
      member.organizationId,
      start ? new Date(start) : undefined,
      end ? new Date(end) : undefined,
    );
  }

  // --- Availability ---

  @Get('availability')
  @ApiOperation({ summary: 'Get current user availability' })
  getAvailability(@CurrentUser() { user, member }: AuthenticatedUser) {
    return this.schedulingService.getUserAvailability(
      member.organizationId,
      user.id,
    );
  }

  @Patch('availability')
  @ApiOperation({ summary: 'Update current user availability' })
  updateAvailability(
    @CurrentUser() { user, member }: AuthenticatedUser,
    @Body() availabilities: any[],
  ) {
    return this.schedulingService.updateAvailability(
      member.organizationId,
      user.id,
      availabilities as {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
      }[],
    );
  }
}
