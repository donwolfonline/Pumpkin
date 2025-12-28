"use client"

import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/types/task';
import { getUserData, setUserData } from '@/lib/storage-utils';
import { Plus, MoreHorizontal, Calendar, Clock } from 'lucide-react';
import { TaskDialog } from './task-dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskBoardProps {
    projectId: string;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
    const [tasks, setTasks] = useState<Task[]>(() => {
        if (typeof window === 'undefined') return [];
        const allTasks = getUserData<Task[]>('pumpkin_tasks') || [];
        return allTasks.filter(t => t.projectId === projectId);
    });
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    const handleCreateTask = (taskData: Partial<Task>) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            projectId,
            title: taskData.title!,
            description: taskData.description || '',
            status: taskData.status || 'todo',
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            estimatedHours: taskData.estimatedHours
        };

        const allTasks = getUserData<Task[]>('pumpkin_tasks') || [];
        const updatedAllTasks = [...allTasks, newTask];
        setUserData('pumpkin_tasks', updatedAllTasks);

        setTasks(prev => [...prev, newTask]);
    };

    const handleUpdateTask = (taskData: Partial<Task>) => {
        if (!editingTask) return;

        const updatedTask = { ...editingTask, ...taskData };

        const allTasks = getUserData<Task[]>('pumpkin_tasks') || [];
        const updatedAllTasks = allTasks.map(t => t.id === editingTask.id ? updatedTask : t);
        setUserData('pumpkin_tasks', updatedAllTasks);

        setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
        setEditingTask(undefined);
    };

    const columns: { id: TaskStatus; label: string }[] = [
        { id: 'todo', label: 'To Do' },
        { id: 'in_progress', label: 'In Progress' },
        { id: 'review', label: 'Review' },
        { id: 'done', label: 'Done' }
    ];

    return (
        <div className="h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Tasks</h2>
                <Button
                    className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] gap-2"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    <Plus className="h-3 w-3" />
                    New Task
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {columns.map(column => (
                    <div key={column.id} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">{column.label}</h3>
                            <span className="text-xs font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">
                                {tasks.filter(t => t.status === column.id).length}
                            </span>
                        </div>
                        <div className="space-y-4 min-h-[200px] rounded-xl bg-white/5 border border-white/5 p-4">
                            {tasks.filter(t => t.status === column.id).map(task => (
                                <div
                                    key={task.id}
                                    className="bg-[#0c2a27] border border-white/5 rounded-xl p-3 shadow-sm hover:border-primary/20 transition-colors cursor-pointer group"
                                    onClick={() => setEditingTask(task)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-sm line-clamp-2">{task.title}</h4>
                                        <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{task.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-2">
                                            {task.assignee && (
                                                <Avatar className="h-6 w-6 border border-white/10">
                                                    <AvatarImage src={task.assignee.avatar} />
                                                    <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            {task.priority === 'high' && (
                                                <div className="h-2 w-2 rounded-full bg-red-500" title="High Priority" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-medium text-zinc-500">
                                            {task.estimatedHours && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {task.estimatedHours}h
                                                </div>
                                            )}
                                            {task.dueDate && (
                                                <div className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-400' : ''
                                                    }`}>
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {tasks.filter(t => t.status === column.id).length === 0 && (
                                <div className="h-24 flex items-center justify-center text-zinc-600 text-xs italic border border-dashed border-white/5 rounded-lg">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <TaskDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSubmit={handleCreateTask}
            />

            <TaskDialog
                key={editingTask?.id}
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(undefined)}
                task={editingTask}
                onSubmit={handleUpdateTask}
            />
        </div>
    );
}
