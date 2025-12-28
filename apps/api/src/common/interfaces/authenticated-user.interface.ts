import { User } from '../../modules/auth/entities/user.entity';
import { OrganizationMember } from '../../modules/tenant/entities/organization-member.entity';

export interface AuthenticatedUser {
  user: User;
  member: OrganizationMember;
}
