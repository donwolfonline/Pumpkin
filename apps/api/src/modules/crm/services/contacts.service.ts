import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/create-contact.dto';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly authService: AuthService,
  ) { }

  async create(
    organizationId: string,
    createContactDto: CreateContactDto,
  ): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      organizationId,
    });
    const savedContact = await this.contactRepository.save(contact);

    if (savedContact.email) {
      const nameParts = (savedContact.name || '').split(' ');
      const firstName = nameParts[0] || 'Client';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

      await this.authService.autoRegisterClient(
        savedContact.email,
        {
          firstName,
          lastName,
        },
        organizationId,
      );
    }

    return savedContact;
  }

  async findAll(organizationId: string): Promise<Contact[]> {
    return this.contactRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(organizationId: string, id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, organizationId },
      relations: ['leads'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }

    return contact;
  }

  async update(
    organizationId: string,
    id: string,
    updateContactDto: Partial<CreateContactDto>,
  ): Promise<Contact> {
    const contact = await this.findOne(organizationId, id);
    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const result = await this.contactRepository.delete({ id, organizationId });
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
  }
}
