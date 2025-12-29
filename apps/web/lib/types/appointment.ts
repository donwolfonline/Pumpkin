export interface Appointment {
    time: string;
    title: string;
    client: string;
    duration: string;
    avatar?: string;
    date?: string; // Optional for now as legacy data might not have it
}
