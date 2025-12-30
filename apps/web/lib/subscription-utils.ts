import { getUserData, setUserData } from './storage-utils';

export interface SubscriptionStatus {
    plan: 'free' | 'plus' | 'pro';
    status: 'trial' | 'active' | 'expired';
    daysRemaining: number;
    registrationDate: Date;
    subscriptionStartDate?: Date;
}

const TRIAL_DAYS = 14;
const BILLING_CYCLE_DAYS = 30;

/**
 * Get the time remaining in the trial period
 */
export function getTrialTimeRemaining(): { days: number; hours: number; minutes: number; totalDays: number } {
    const registrationDate = getUserData<string>('registration_date');
    if (!registrationDate) return { days: TRIAL_DAYS, hours: 0, minutes: 0, totalDays: TRIAL_DAYS }; // Default for new users

    const regDate = new Date(registrationDate);
    const now = new Date();
    const trialEndDate = new Date(regDate.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const timeRemaining = trialEndDate.getTime() - now.getTime();

    if (timeRemaining <= 0) {
        return { days: 0, hours: 0, minutes: 0, totalDays: 0 };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, totalDays: days };
}

/**
 * Get the number of days remaining in the trial period (legacy - for backwards compatibility)
 */
export function getTrialDaysRemaining(): number {
    return getTrialTimeRemaining().totalDays;
}

/**
 * Get the number of days remaining until next billing date
 */
export function getBillingDaysRemaining(): number {
    const subscriptionStartDate = getUserData<string>('subscription_start_date');
    if (!subscriptionStartDate) {
        // If no subscription start date, use registration date
        const registrationDate = getUserData<string>('registration_date');
        if (!registrationDate) return BILLING_CYCLE_DAYS;

        const regDate = new Date(registrationDate);
        const now = new Date();
        const daysSinceStart = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysRemaining = BILLING_CYCLE_DAYS - (daysSinceStart % BILLING_CYCLE_DAYS);

        return daysRemaining;
    }

    const subDate = new Date(subscriptionStartDate);
    const now = new Date();
    const daysSinceSubscription = Math.floor((now.getTime() - subDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = BILLING_CYCLE_DAYS - (daysSinceSubscription % BILLING_CYCLE_DAYS);

    return daysRemaining;
}

/**
 * Check if trial has expired
 */
export function isTrialExpired(): boolean {
    return getTrialDaysRemaining() <= 0;
}

/**
 * Get the user's current subscription status
 */
export function getSubscriptionStatus(): SubscriptionStatus {
    const plan = getUserData<'free' | 'plus' | 'pro'>('pumpkin_billing_plan') || 'free';
    const registrationDate = getUserData<string>('registration_date');
    const subscriptionStartDate = getUserData<string>('subscription_start_date');

    if (plan === 'free') {
        const daysRemaining = getTrialDaysRemaining();
        return {
            plan,
            status: daysRemaining > 0 ? 'trial' : 'expired',
            daysRemaining,
            registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
        };
    }

    // Paid plans
    return {
        plan,
        status: 'active',
        daysRemaining: getBillingDaysRemaining(),
        registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
        subscriptionStartDate: subscriptionStartDate ? new Date(subscriptionStartDate) : undefined,
    };
}

/**
 * Initialize registration date for a new user
 */
export function initializeRegistrationDate(): void {
    const existingDate = getUserData<string>('registration_date');
    if (!existingDate) {
        setUserData('registration_date', new Date().toISOString());
    }
}

/**
 * Set subscription start date when user upgrades
 */
export function setSubscriptionStartDate(): void {
    setUserData('subscription_start_date', new Date().toISOString());
}
