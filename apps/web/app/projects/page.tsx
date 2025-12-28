"use client"

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectCard } from '@/components/features/projects/project-card';
import { Project } from '@/lib/types/project';
import { Plus, ListFilter, LayoutGrid, List as ListIcon, GitBranch, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            setProjects([]);
            setIsLoading(false);
        }, 800);
    }, []);

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Project added to the patch! (Simulation)');
        setIsDialogOpen(false);
    };

    const hasProjects = projects.length > 0;

    return (
        <DashboardShell>
            <PageHeader
                title="Patch Projects"
                description="Track your active projects and deliverables."
                action={{
                    label: 'New Project',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => setIsDialogOpen(true)
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Projects' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#0c2a27] border-white/5 text-white rounded-3xl backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-sm">Plant New Project</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-xs">
                            Add a new project to your workspace to start tracking progress.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Project Name</Label>
                            <Input id="name" placeholder="Website Relaunch" className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm focus:ring-primary/20" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="client" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client</Label>
                            <Input id="client" placeholder="Acme Inc." className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm focus:ring-primary/20" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Status</Label>
                                <Select value="active">
                                    <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="on_hold">On Hold</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Priority</Label>
                                <Select value="medium">
                                    <SelectTrigger className="bg-black/20 border-white/5 rounded-xl h-11 px-4 text-sm">
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
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                            Create Project
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <div className="w-full max-w-sm">
                    <Input placeholder="Search projects..." className="bg-black/20 border-white/5 rounded-xl h-10 px-4 text-xs font-bold uppercase tracking-widest placeholder:text-zinc-600" />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-widest px-4">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Filter
                    </Button>
                    <div className="flex items-center rounded-xl border border-white/5 bg-white/5 p-1 h-10">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg bg-primary/10 text-primary">
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-zinc-500">
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            ) : hasProjects ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={GitBranch}
                    title="The Vine is Empty"
                    description="No projects found in your patch. Start a new project to orchestrate your tasks and team."
                    actionLabel="Create First Project"
                    onAction={() => setIsDialogOpen(true)}
                />
            )}
        </DashboardShell>
    );
}
