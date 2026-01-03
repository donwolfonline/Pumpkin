export enum UserRole {
    PROVIDER = 'provider',
    CLIENT = 'client',
    SUPER_ADMIN = 'super_admin',
}

// User types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Organization types
export interface Organization {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    subscriptionTier: 'free' | 'starter' | 'professional' | 'enterprise';
    subscriptionStatus: 'active' | 'cancelled' | 'past_due' | 'trialing';
    settings: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface OrganizationMember {
    id: string;
    organizationId: string;
    userId: string;
    role: MemberRole;
    permissions: string[];
    joinedAt: Date;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthUser extends User {
    organizations: OrganizationMember[];
}
