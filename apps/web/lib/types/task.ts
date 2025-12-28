export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignee?: {
        name: string;
        avatar: string;
    };
    dueDate: string;
    createdAt: string;
    estimatedHours?: number;
}
