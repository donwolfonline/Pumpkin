import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../modules/auth/entities/user.entity';
import { Organization } from '../../modules/tenant/entities/organization.entity';
import { OrganizationMember } from '../../modules/tenant/entities/organization-member.entity';
import { Contact } from '../../modules/crm/entities/contact.entity';
import { BookingType } from '../../modules/scheduling/entities/booking-type.entity';

@Injectable()
export class DummyDataSeeder implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Organization) private orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private memberRepo: Repository<OrganizationMember>,
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    @InjectRepository(BookingType)
    private bookingTypeRepo: Repository<BookingType>,
  ) {}

  async onModuleInit() {
    const useDummy = this.configService.get('USE_DUMMY_DATA') === 'true';
    if (!useDummy) return;

    const count = await this.userRepo.count();
    if (count > 0) return;

    console.log('🌱 Seeding dummy data...');

    // 1. Create User (password: password123)
    const user = this.userRepo.create({
      email: 'demo@pumpkin.app',
      passwordHash:
        '$2b$10$o8v4F.rR8V6lD.9C7p0z4.g2uRJRz6G5v6T9Qo.e8.yR7l3m8z.p.', // bcrypted 'password123'
      firstName: 'Demo',
      lastName: 'User',
    });
    await this.userRepo.save(user);

    // 2. Create Organization
    const org = this.orgRepo.create({
      name: 'Pumpkin Demo',
      slug: 'pumpkin-demo',
      ownerId: user.id,
    });
    await this.orgRepo.save(org);

    // 3. Create Member
    const member = this.memberRepo.create({
      organization: org,
      user: user,
      role: 'owner',
    });
    await this.memberRepo.save(member);

    // 4. Create some Contacts
    const contacts = [
      { name: 'John Doe', email: 'john@example.com', organizationId: org.id },
      { name: 'Jane Smith', email: 'jane@example.com', organizationId: org.id },
    ];
    await this.contactRepo.save(this.contactRepo.create(contacts));

    // 5. Create Booking Types
    const bookingTypes = [
      {
        name: 'Discovery Call',
        slug: 'discovery',
        duration: 15,
        organizationId: org.id,
        isActive: true,
      },
      {
        name: 'Strategy Session',
        slug: 'strategy',
        duration: 60,
        organizationId: org.id,
        isActive: true,
      },
    ];
    await this.bookingTypeRepo.save(this.bookingTypeRepo.create(bookingTypes));

    console.log('✅ Dummy data seeded!');
    console.log('User: demo@pumpkin.app / password123');
  }
}
