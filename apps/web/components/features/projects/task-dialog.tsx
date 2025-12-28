"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task, TaskStatus, TaskPriority } from '@/lib/types/task';

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task; // If provided, we are in edit mode
    onSubmit: (data: Partial<Task>) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSubmit }: TaskDialogProps) {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: (task?.status || 'todo') as TaskStatus,
        priority: (task?.priority || 'medium') as TaskPriority,
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        estimatedHours: task?.estimatedHours || 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString()
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[425px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                <DialogHeader>
                    <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1">
                        {task ? 'Edit Task' : 'New Task'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px]">
                        {task ? 'Update task details.' : 'Add a new task to tracking.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                    <div className="space-y-1">
                        <Label htmlFor="title" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Task Title</Label>
                        <Input
                            id="title"
                            placeholder="Implement login page"
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                        <Input
                            id="description"
                            placeholder="Details about the task..."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="status" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="priority" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Priority</Label>
                            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="dueDate" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Due Date</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="estimatedHours" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Est. Hours</Label>
                            <Input
                                id="estimatedHours"
                                type="number"
                                placeholder="4"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.estimatedHours || ''}
                                onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] mt-2">
                        {task ? 'Update Task' : 'Create Task'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
