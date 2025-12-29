import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Lead } from './entities/lead.entity';
import { Activity } from './entities/activity.entity';
import { Message } from './entities/message.entity';
import { ContactsService } from './services/contacts.service';
import { LeadsService } from './services/leads.service';
import { ActivitiesService } from './services/activities.service';
import { CommunicationsService } from './services/communications.service';
import { ContactsController } from './controllers/contacts.controller';
import { LeadsController } from './controllers/leads.controller';
import { ActivitiesController } from './controllers/activities.controller';
import { CommunicationsController } from './controllers/communications.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, Lead, Activity, Message]),
    AuthModule,
  ],
  controllers: [
    ContactsController,
    LeadsController,
    ActivitiesController,
    CommunicationsController,
  ],
  providers: [
    ContactsService,
    LeadsService,
    ActivitiesService,
    CommunicationsService,
  ],
  exports: [
    ContactsService,
    LeadsService,
    ActivitiesService,
    CommunicationsService,
  ],
})
export class CrmModule { }
