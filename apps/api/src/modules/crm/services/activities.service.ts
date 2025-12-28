import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity, ActivityType } from '../entities/activity.entity';

export class CreateActivityDto {
  entityType: string;
  entityId: string;
  type: ActivityType;
  title: string;
  content?: string;
  occurredAt?: Date;
}

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    const activity = this.activityRepository.create({
      ...createActivityDto,
      organizationId,
      createById: userId,
    });
    return this.activityRepository.save(activity);
  }

  async findByEntity(
    organizationId: string,
    entityType: string,
    entityId: string,
  ): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { organizationId, entityType, entityId },
      relations: ['createdBy'],
      order: { occurredAt: 'DESC' },
    });
  }
}
