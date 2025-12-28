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
import { Project, ProjectStatus, ProjectPriority } from '@/lib/types/project';

interface ProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: Project; // If provided, we are in edit mode
    onSubmit: (data: Partial<Project>) => void;
}

export function ProjectDialog({ open, onOpenChange, project, onSubmit }: ProjectDialogProps) {
    // Initialize state from props - parent should use key={project.id} to reset form when project changes
    const [formData, setFormData] = useState({
        name: project?.name || '',
        client: project?.client || '',
        status: (project?.status || 'active') as ProjectStatus,
        priority: (project?.priority || 'medium') as ProjectPriority,
        budget: project?.budget || 0,
        description: project?.description || ''
    });



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[425px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                <DialogHeader>
                    <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1">
                        {project ? 'Edit Project' : 'Plant New Project'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 text-[10px]">
                        {project ? 'Update project details and metrics.' : 'Add a new project to start tracking.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 mt-4">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Project Name</Label>
                        <Input
                            id="name"
                            placeholder="Website Relaunch"
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="client" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client</Label>
                        <Input
                            id="client"
                            placeholder="Acme Inc."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                        <Input
                            id="description"
                            placeholder="Project goals..."
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="status" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ProjectStatus })}>
                                <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="on_hold">On Hold</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="priority" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Priority</Label>
                            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as ProjectPriority })}>
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

                    <div className="space-y-1">
                        <Label htmlFor="budget" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Budget</Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="5000"
                            className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                            value={formData.budget || ''}
                            onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <Button type="submit" className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] mt-2">
                        {project ? 'Update Project' : 'Create Project'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
