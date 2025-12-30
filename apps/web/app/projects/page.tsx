"use client"

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { ProjectCard } from '@/components/features/projects/project-card';
import { Project, ProjectStatus, ProjectPriority } from '@/lib/types/project';
import { Plus, ListFilter, LayoutGrid, List as ListIcon, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { getUserData, setUserData } from '@/lib/storage-utils';

import { ProjectDialog } from '@/components/features/projects/project-dialog';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const storedProjects = getUserData<Project[]>('pumpkin_projects') || [];
        setProjects(storedProjects);
        setIsLoading(false);
    }, []);

    const handleCreateProject = (projectData: Partial<Project>) => {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: projectData.name!,
            client: projectData.client!,
            clientEmail: projectData.clientEmail,
            status: projectData.status as ProjectStatus,
            priority: projectData.priority as ProjectPriority,
            progress: 0,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            team: [],
            budget: projectData.budget || 0,
            description: projectData.description
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        setUserData('pumpkin_projects', updatedProjects);
    };

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

            <ProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleCreateProject}
            />

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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[200px] rounded-xl border border-white/5 bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : projects.length > 0 ? (
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
