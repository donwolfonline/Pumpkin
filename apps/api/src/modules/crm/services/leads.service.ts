import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from '../entities/lead.entity';
import { CreateLeadDto } from '../dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async create(
    organizationId: string,
    createLeadDto: CreateLeadDto,
  ): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...createLeadDto,
      organizationId,
    });
    return this.leadRepository.save(lead);
  }

  async findAll(organizationId: string): Promise<Lead[]> {
    return this.leadRepository.find({
      where: { organizationId },
      relations: ['contact'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id, organizationId },
      relations: ['contact'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID "${id}" not found`);
    }

    return lead;
  }

  async update(
    organizationId: string,
    id: string,
    updateLeadDto: Partial<CreateLeadDto>,
  ): Promise<Lead> {
    const lead = await this.findOne(organizationId, id);
    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const result = await this.leadRepository.delete({ id, organizationId });
    if (result.affected === 0) {
      throw new NotFoundException(`Lead with ID "${id}" not found`);
    }
  }
}
