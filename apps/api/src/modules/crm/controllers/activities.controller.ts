import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import {
  ActivitiesService,
  CreateActivityDto,
} from '../services/activities.service';

@ApiTags('CRM Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Log a new activity' })
  create(
    @CurrentUser() { user, member }: AuthenticatedUser,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.activitiesService.create(
      member.organizationId,
      user.id,
      createActivityDto,
    );
  }

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get activities for a specific entity' })
  findByEntity(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.activitiesService.findByEntity(
      member.organizationId,
      entityType,
      entityId,
    );
  }
}
