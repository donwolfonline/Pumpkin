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
import { ContactsService } from '../services/contacts.service';
import { CreateContactDto } from '../dto/create-contact.dto';

@ApiTags('CRM Contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('crm/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  create(
    @CurrentUser() { member }: AuthenticatedUser,
    @Body() createContactDto: CreateContactDto,
  ) {
    return this.contactsService.create(member.organizationId, createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts for the organization' })
  findAll(@CurrentUser() { member }: AuthenticatedUser) {
    return this.contactsService.findAll(member.organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact' })
  findOne(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.contactsService.findOne(member.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  update(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateContactDto: Partial<CreateContactDto>,
  ) {
    return this.contactsService.update(
      member.organizationId,
      id,
      updateContactDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  remove(
    @CurrentUser() { member }: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.contactsService.remove(member.organizationId, id);
  }
}
