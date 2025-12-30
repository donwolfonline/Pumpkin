"use client"

import { useMemo, useState } from 'react';
import { Task } from '@/lib/types/task';
import { getUserData } from '@/lib/storage-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectTimelineProps {
    projectId: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
    const [currentMonthOffset, setCurrentMonthOffset] = useState(0);

    const tasks = useMemo(() => {
        if (typeof window === 'undefined') return [];
        const allTasks = getUserData<Task[]>('pumpkin_tasks') || [];
        return allTasks.filter(t => t.projectId === projectId).sort((a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
    }, [projectId]);

    // If no tasks, show empty state
    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
                <p className="text-zinc-500">No tasks with due dates to display.</p>
            </div>
        );
    }

    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1);

    // Mobile: Show 2 weeks, Desktop: Show 1 month
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const daysToShow = isMobile ? 14 : 31;

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysToShow - 1);

    const days = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }

    return (
        <div className="h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold">Timeline</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonthOffset(prev => prev - 1)}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs sm:text-sm font-medium text-zinc-400 min-w-[80px] text-center">
                        {startDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentMonthOffset(prev => prev + 1)}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto border border-white/5 rounded-xl bg-black/20 relative">
                <div className="min-w-full w-max h-full relative">
                    {/* Header: Days */}
                    <div className="sticky top-0 z-10 flex border-b border-white/5 bg-[#0c2a27]">
                        {days.map((day, i) => {
                            const isToday = day.toDateString() === today.toDateString();
                            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 min-w-[30px] sm:min-w-[40px] h-10 sm:h-12 border-r border-white/5 flex flex-col items-center justify-center text-[9px] sm:text-[10px] ${isToday ? 'bg-primary/10 text-primary font-bold' :
                                            isWeekend ? 'bg-white/5 text-zinc-600' :
                                                'text-zinc-500'
                                        }`}
                                >
                                    <span className="text-[8px] sm:text-[9px] opacity-60">
                                        {day.toLocaleString('default', { weekday: 'short' }).slice(0, 1)}
                                    </span>
                                    <span className="font-medium">{day.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Task Rows */}
                    <div className="p-2 sm:p-4 space-y-2 sm:space-y-4">
                        {tasks.map((task) => {
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
                            const visualWidth = Math.max(width, 3);

                            return (
                                <div key={task.id} className="relative h-8 sm:h-10 flex items-center group">
                                    <div className="absolute w-full h-[1px] bg-white/5" />
                                    <div
                                        className={`absolute h-7 sm:h-8 rounded-md sm:rounded-lg border border-white/10 px-2 sm:px-3 flex items-center gap-1 sm:gap-2 cursor-pointer hover:border-primary/50 transition-colors z-20 ${task.status === 'done' ? 'bg-green-500/20 text-green-200' :
                                                task.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                                                    'bg-white/10 text-zinc-300'
                                            }`}
                                        style={{ left: `${startOffset}%`, width: `${visualWidth}%` }}
                                        title={`${task.title} (${new Date(task.dueDate).toLocaleDateString()})`}
                                    >
                                        <span className="text-[10px] sm:text-xs font-medium truncate">{task.title}</span>
                                        {task.assignee && (
                                            <Avatar className="h-4 w-4 sm:h-5 sm:w-5 border border-white/10 ml-auto hidden sm:block">
                                                <AvatarImage src={task.assignee.avatar} />
                                                <AvatarFallback className="text-[8px] sm:text-[9px]">{task.assignee.name[0]}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Current day line */}
                    {today >= startDate && today <= endDate && (
                        <div
                            className="absolute top-0 bottom-0 w-[2px] sm:w-[1px] bg-primary z-0 pointer-events-none"
                            style={{ left: `${((today.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100}%` }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
