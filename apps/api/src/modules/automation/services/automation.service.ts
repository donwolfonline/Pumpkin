import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Automation,
  AutomationTrigger,
  AutomationAction,
} from '../entities/automation.entity';
import { ActivitiesService } from '../../crm/services/activities.service';
import { CommunicationsService } from '../../crm/services/communications.service';
import { ActivityType } from '../../crm/entities/activity.entity';

interface AutomationConfig {
  activityType?: ActivityType;
  title?: string;
  content?: string;
  subject?: string;
}

@Injectable()
export class AutomationService {
  constructor(
    @InjectRepository(Automation)
    private readonly automationRepo: Repository<Automation>,
    private readonly activitiesService: ActivitiesService,
    private readonly communicationsService: CommunicationsService,
  ) {}

  async handleTrigger(
    trigger: AutomationTrigger,
    organizationId: string,
    context: {
      entityType: string;
      entityId: string;
      contactId?: string;
      userId?: string;
    },
  ): Promise<void> {
    const automations = await this.automationRepo.find({
      where: { organizationId, trigger, isActive: true },
    });

    for (const automation of automations) {
      await this.executeAction(automation, context);
    }
  }

  private async executeAction(
    automation: Automation,
    context: {
      entityType: string;
      entityId: string;
      contactId?: string;
      userId?: string;
    },
  ): Promise<void> {
    const config = automation.configuration as AutomationConfig;

    switch (automation.action) {
      case AutomationAction.CREATE_ACTIVITY:
        await this.activitiesService.create(
          automation.organizationId,
          context.userId || automation.organizationId,
          {
            entityType: context.entityType,
            entityId: context.entityId,
            type: config.activityType || ActivityType.NOTE,
            title: config.title || 'Automated Activity',
            content: config.content || 'Action triggered by automation',
          },
        );
        break;

      case AutomationAction.SEND_EMAIL:
        if (context.contactId) {
          await this.communicationsService.sendEmail(
            automation.organizationId,
            context.contactId,
            context.userId || '',
            config.subject || 'Automated Email',
            config.content || 'This is an automated message.',
          );
        }
        break;

      default:
        console.warn(`[Automation] Unknown action type: ${automation.action}`);
    }
  }

  async create(
    organizationId: string,
    data: Partial<Automation>,
  ): Promise<Automation> {
    const automation = this.automationRepo.create({ ...data, organizationId });
    return this.automationRepo.save(automation);
  }

  async findAll(organizationId: string): Promise<Automation[]> {
    return this.automationRepo.find({ where: { organizationId } });
  }
}
