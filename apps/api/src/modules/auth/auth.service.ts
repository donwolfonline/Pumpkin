import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Organization } from '../tenant/entities/organization.entity';
import { OrganizationMember } from '../tenant/entities/organization-member.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, organizationName } =
      registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });
    await this.userRepository.save(user);

    // Create organization with slug
    const slug = organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const organization = this.organizationRepository.create({
      name: organizationName,
      slug: `${slug}-${Date.now().toString(36)}`,
      ownerId: user.id,
    });
    await this.organizationRepository.save(organization);

    // Add user as organization owner
    const member = this.organizationMemberRepository.create({
      userId: user.id,
      organizationId: organization.id,
      role: 'owner',
      permissions: {},
    });
    await this.organizationMemberRepository.save(member);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, organization.id);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: organization.id,
        role: 'owner',
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user's organization (first one for now)
    const member = await this.organizationMemberRepository.findOne({
      where: { userId: user.id },
      relations: ['organization'],
    });

    if (!member && user.role !== 'client') {
      throw new UnauthorizedException(
        'User not associated with any organization',
      );
    }

    // Generate tokens
    const organizationId = member?.organizationId || null;
    const tokens = await this.generateTokens(user.id, organizationId);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId,
        role: user.role, // Use global User role
      },
    };
  }

  async generateTokens(userId: string, organizationId: string | null) {
    const payload = { sub: userId, organizationId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string, organizationId?: string | null) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }

    if (!organizationId) {
      return user.role === 'client' ? { user, member: null } : null;
    }

    const member = await this.organizationMemberRepository.findOne({
      where: { userId, organizationId },
    });

    if (!member) {
      return null;
    }

    return { user, member };
  }

  async switchOrganization(userId: string, targetOrganizationId: string) {
    const member = await this.organizationMemberRepository.findOne({
      where: { userId, organizationId: targetOrganizationId },
      relations: ['organization'],
    });

    if (!member) {
      throw new UnauthorizedException(
        'User not associated with target organization',
      );
    }

    const tokens = await this.generateTokens(userId, targetOrganizationId);

    return {
      ...tokens,
      organization: member.organization,
    };
  }

  async autoRegisterClient(
    email: string,
    metadata: { firstName?: string; lastName?: string } = {},
    organizationId?: string | null,
  ) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return existingUser;
    }

    const { firstName = 'Client', lastName = '' } = metadata;

    // Generate a secure random password for the first time
    const tempPassword = Math.random().toString(36).slice(-12);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const user = this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'client',
    });

    await this.userRepository.save(user);

    // TODO: Send email with tempPassword
    console.log(
      `[CLIENT-PROVISIONING] Created account for ${email} with password: ${tempPassword}`,
    );

    return user;
  }
}
