"use client"

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/lib/types/project';
import { getUserData } from '@/lib/storage-utils';

import { ProjectDialog } from '@/components/features/projects/project-dialog';
import { TaskBoard } from '@/components/features/projects/task-board';
import { ProjectTimeline } from '@/components/features/projects/project-timeline';
import { setUserData } from '@/lib/storage-utils';
import { Loader2 } from 'lucide-react';

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const projectId = params.id as string;
            const projects = getUserData<Project[]>('pumpkin_projects') || [];
            const found = projects.find(p => p.id === projectId);

            if (found) {
                setProject(found);
            } else {
                router.push('/projects');
            }
            setIsLoading(false);
        }
    }, [params.id, router]);

    const handleUpdateProject = (updatedData: Partial<Project>) => {
        if (!project) return;

        const updatedProject = { ...project, ...updatedData };
        setProject(updatedProject);

        const projects = getUserData<Project[]>('pumpkin_projects') || [];
        const updatedProjects = projects.map(p => p.id === project.id ? updatedProject : p);
        setUserData('pumpkin_projects', updatedProjects);
    };

    if (isLoading) {
        return (
            <DashboardShell>
                <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
            </DashboardShell>
        );
    }

    if (!project) return null;

    return (
        <DashboardShell>
            <PageHeader
                title={project.name}
                description={project.description || `Project for ${project.client}`}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Projects', href: '/projects' },
                    { label: project.name }
                ]}
                action={{
                    label: 'Edit Project',
                    onClick: () => setIsEditDialogOpen(true)
                }}
            />

            <ProjectDialog
                key={project.id} // Reset form when project changes
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                project={project}
                onSubmit={handleUpdateProject}
            />

            <Tabs defaultValue="tasks" className="mt-6">
                <TabsList className="bg-black/20 border-white/5 p-1 h-12 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-10 px-4">Overview</TabsTrigger>
                    <TabsTrigger value="tasks" className="rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-10 px-4">Tasks</TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-10 px-4">Timeline</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary/20 data-[state=active]:text-primary h-10 px-4">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Summary Cards */}
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Status</h3>
                            <p className="mt-2 text-2xl font-bold capitalize">{project.status.replace('_', ' ')}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Priority</h3>
                            <p className="mt-2 text-2xl font-bold capitalize">{project.priority}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Due Date</h3>
                            <p className="mt-2 text-2xl font-bold">{new Date(project.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Budget</h3>
                            <p className="mt-2 text-2xl font-bold">${project.budget?.toLocaleString() || '0'}</p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tasks" className="mt-6 h-[calc(100vh-300px)]">
                    <TaskBoard projectId={project.id} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-6 h-[500px] sm:h-[calc(100dvh-300px)]">
                    <ProjectTimeline projectId={project.id} />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
                        <p className="text-zinc-500">Project settings coming soon...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardShell >
    );
}
