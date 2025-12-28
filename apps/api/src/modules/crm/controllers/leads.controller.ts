import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { LeadsService } from '../services/leads.service';
import { CreateLeadDto } from '../dto/create-lead.dto';

@ApiTags('CRM Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm/leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  create(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() createLeadDto: CreateLeadDto,
  ) {
    return this.leadsService.create(member.organizationId, createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads for the organization' })
  findAll(@CurrentUser() { member }: AuthenticatedUser) {
    return this.leadsService.findAll(member.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific lead' })
  findOne(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.leadsService.findOne(member.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  update(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateLeadDto: Partial<CreateLeadDto>,
  ) {
    return this.leadsService.update(member.organizationId, id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead' })
  remove(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.leadsService.remove(member.organizationId, id);
  }
}
