import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Project } from '@/lib/types/project';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils'; // Assumes I implemented formatCurrency in utils

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusVariantMap: Record<string, "success" | "warning" | "error" | "secondary"> = {
        active: 'success',
        completed: 'secondary', // or logic for completed
        on_hold: 'warning',
        archived: 'secondary'
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold leading-tight hover:text-primary cursor-pointer truncate">
                        {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <StatusBadge variant={statusVariantMap[project.status] || 'secondary'}>
                        {project.status.replace('_', ' ')}
                    </StatusBadge>
                    <span className="text-muted-foreground font-medium">{formatCurrency(project.budget)}</span>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    {/* Note: I need Progress component. Using simple div if missing */}
                    <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                    {project.team?.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background ring-0">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="text-[10px]">{member.name[0]}</AvatarFallback>
                        </Avatar>
                    ))}
                    {(project.team?.length || 0) > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium">
                            +{project.team!.length - 3}
                        </div>
                    )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(project.dueDate).toLocaleDateString()}
                </div>
            </CardFooter>
        </Card>
    );
}
