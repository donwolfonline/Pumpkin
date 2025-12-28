import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Message,
  MessageChannel,
  MessageDirection,
} from '../entities/message.entity';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async create(data: {
    organizationId: string;
    contactId: string;
    channel: MessageChannel;
    direction: MessageDirection;
    subject: string;
    body: string;
    senderId?: string;
    metadata?: Record<string, any>;
  }): Promise<Message> {
    const message = this.messageRepo.create(data);
    return this.messageRepo.save(message);
  }

  async findByContact(
    organizationId: string,
    contactId: string,
  ): Promise<Message[]> {
    return this.messageRepo.find({
      where: { organizationId, contactId },
      order: { sentAt: 'DESC' },
      relations: ['sender'],
    });
  }

  // Simulation: Send an email
  async sendEmail(
    organizationId: string,
    contactId: string,
    senderId: string,
    subject: string,
    body: string,
  ): Promise<Message> {
    // In a real app, this would call an email provider (SES, Postmark, etc.)
    console.log(
      `[SIMULATION] Sending email to contact ${contactId}: ${subject}`,
    );

    return this.create({
      organizationId,
      contactId,
      channel: MessageChannel.EMAIL,
      direction: MessageDirection.OUTBOUND,
      subject,
      body,
      senderId,
    });
  }
}
