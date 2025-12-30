export type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'archived';
export type ProjectPriority = 'high' | 'medium' | 'low';

export interface Project {
    id: string;
    name: string;
    client: string;
    clientEmail?: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    dueDate: string; // ISO Date
    progress: number; // 0-100
    budget: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    tags?: string[];
    team?: Array<{ name: string; avatar: string }>;
}
