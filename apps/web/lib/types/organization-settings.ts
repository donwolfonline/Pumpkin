export interface OrganizationBranding {
    companyName: string;
    logo?: string;
    email: string;
    phone: string;
    website?: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
    brandColors: {
        primary: string;
        accent: string;
    };
    defaultContractTerms?: string;
    paymentGateway?: {
        type: 'stripe' | 'none';
        enabled: boolean;
        config: {
            stripePublicKey?: string;
            stripeSecretKey?: string;
            stripeClientId?: string;
            stripeAccountId?: string;
            connected?: boolean;
            instructions?: string;
        };
    };
}

export const DEFAULT_BRANDING: OrganizationBranding = {
    companyName: 'Pumpkin CRM',
    email: 'hello@pumpkin.com',
    phone: '',
    address: {
        street: '',
        city: '',
        state: '',
        country: '',
    },
    brandColors: {
        primary: '#ea580c',
        accent: '#ea580c',
    },
    defaultContractTerms: 'This document is a legally binding agreement. Any disputes arising from this agreement shall be governed by the laws of the jurisdiction where Pumpkin CRM is registered.',
    paymentGateway: {
        type: 'none',
        enabled: false,
        config: {}
    }
};
