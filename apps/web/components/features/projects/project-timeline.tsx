"use client"

import { useMemo } from 'react';
import { Task } from '@/lib/types/task';
import { getUserData } from '@/lib/storage-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProjectTimelineProps {
    projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
    const tasks = useMemo(() => {
        if (typeof window === 'undefined') return [];
        const allTasks = getUserData<Task[]>('pumpkin_tasks') || [];
        return allTasks.filter(t => t.projectId === projectId).sort((a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
    }, [projectId]);

    // Simple timeline logic:
    // We visualize the next 30 days or the range of tasks?
    // Let's do a Month view for now.

    // Find min/max dates
    // If no tasks, show empty state
    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
                <p className="text-zinc-500">No tasks with due dates to display.</p>
            </div>
        );
    }

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of current month
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0); // End of next month (2 month view)

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }



    // For task duration, we use estimatedHours or 1 day default if createdAt is missing or same as dueDate
    // But better: show point for dueDate.
    // Or if we had start/end. We only have dueDate and createdAt.
    // Let's assume task duration is 1 day for visualization point of view unless we want to range from createdAt to dueDate.
    // Range from createdAt to dueDate might be too long.
    // Let's just visualize the Due Date as a marker.

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Timeline</h2>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto border border-white/5 rounded-xl bg-black/20 relative">
                <div className="min-w-full w-max h-full relative">
                    {/* Header: Months/Days */}
                    <div className="sticky top-0 z-10 flex border-b border-white/5 bg-[#0c2a27]">
                        {days.map((day, i) => {
                            const isFirstDay = day.getDate() === 1;
                            return (
                                <div key={i} className={`flex-1 min-w-[30px] h-12 border-r border-white/5 flex flex-col items-center justify-center text-[10px] ${day.toDateString() === today.toDateString() ? 'bg-primary/10 text-primary font-bold' : 'text-zinc-500'
                                    }`}>
                                    {isFirstDay && (
                                        <span className="absolute top-0 mt-0.5 text-[apx] font-bold uppercase">{day.toLocaleString('default', { month: 'short' })}</span>
                                    )}
                                    <span className="mt-auto mb-1">{day.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Task Rows */}
                    <div className="p-4 space-y-4">
                        {tasks.map((task) => {
                            // Calculate positioning logic using createdAt and dueDate
                            // Using dueDate only as point? 
                            // Let's visualize range: createdAt -> dueDate
                            // If createdAt is missing, assume today or recently.
                            // If createdAt > dueDate (impossible?), handle it.

                            const created = new Date(task.createdAt || new Date().toISOString());
                            const due = new Date(task.dueDate);

                            // Clamp to view
                            const start = created < startDate ? startDate : created;
                            const end = due > endDate ? endDate : due;

                            if (end < startDate || start > endDate) return null; // Out of view

                            const rangeMs = endDate.getTime() - startDate.getTime();

                            const startOffset = ((start.getTime() - startDate.getTime()) / rangeMs) * 100;
                            const width = (((end.getTime() - start.getTime()) / rangeMs) * 100);

                            // Ensure minimum width visually
                            const visualWidth = Math.max(width, 2); // min 2%

                            return (
                                <div key={task.id} className="relative h-10 flex items-center group">
                                    <div className="absolute w-full h-[1px] bg-white/5" />
                                    <div
                                        className={`absolute h-8 rounded-lg border border-white/10 px-3 flex items-center gap-2 cursor-pointer hover:border-primary/50 transition-colors z-20 ${task.status === 'done' ? 'bg-green-500/20 text-green-200' :
                                            task.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                                                'bg-white/10 text-zinc-300'
                                            }`}
                                        style={{ left: `${startOffset}%`, width: `${visualWidth}%` }}
                                        title={`${task.title} (${new Date(task.dueDate).toLocaleDateString()})`}
                                    >
                                        <span className="text-xs font-medium truncate">{task.title}</span>
                                        {task.assignee && (
                                            <Avatar className="h-5 w-5 border border-white/10 ml-auto hidden sm:block">
                                                <AvatarImage src={task.assignee.avatar} />
                                                <AvatarFallback className="text-[9px]">{task.assignee.name[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Current day line */}
                    <div
                        className="absolute top-0 bottom-0 w-[1px] bg-primary z-0 pointer-events-none"
                        style={{ left: `${((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
