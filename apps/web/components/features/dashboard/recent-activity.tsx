import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

interface RecentActivityProps {
    activities?: any[];
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
    const hasActivities = activities.length > 0;

    return (
        <div className="inset-pod p-8 rounded-[3rem] border border-white/5 shadow-2xl min-h-[450px] flex flex-col">
            <div className="mb-8">
                <h3 className="text-xl font-bold font-heading text-white mb-2">Recent Activity</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
                    {hasActivities ? `You have ${activities.length} new notifications` : 'No recent updates'}
                </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {hasActivities ? (
                    <div className="space-y-6">
                        {activities.map((item, index) => (
                            <div key={index} className="flex items-center group">
                                <Avatar className="h-10 w-10 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
                                    <AvatarImage src={item.user.avatar} alt="Avatar" />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{item.user.initials}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-bold text-white font-heading uppercase tracking-wide leading-none">
                                        {item.user.name} <span className="text-zinc-500 font-normal lowercase tracking-normal font-sans"> {item.action} </span> <span className="text-primary italic">{item.target}</span>
                                    </p>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                                        {item.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={History}
                        title="Silence in the Patch"
                        description="Nothing has happened yet. Start by adding a client or creating a new project to see activity here."
                        actionLabel="Add First Client"
                    />
                )}
            </div>
        </div>
    );
}
