"use client"

import * as React from "react"
import { DashboardShell } from '@/components/dashboard-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Users, Calendar as CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from '@/components/shared/empty-state';

import { Appointment, useNotifications } from "@/components/providers/notification-provider";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SchedulingPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const { appointments, addAppointment, removeAppointment } = useNotifications();
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        title: '',
        time: '',
        duration: '60m',
        client: ''
    });

    React.useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            setIsLoading(false);
        }, 800);
    }, []);

    const handleCreateAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        const newAppointment: Appointment = {
            time: formData.time,
            title: formData.title,
            client: formData.client || 'New Client',
            duration: formData.duration,
            avatar: ''
        };
        addAppointment(newAppointment);
        setFormData({ title: '', time: '', duration: '60m', client: '' });
        setIsDialogOpen(false);
    };

    const hasAppointments = appointments.length > 0;

    return (
        <DashboardShell>
            <PageHeader
                title="Patch Calendar"
                description="Manage your appointments and availability."
                action={{
                    label: 'New Appointment',
                    icon: <Plus className="h-4 w-4" />,
                    onClick: () => setIsDialogOpen(true)
                }}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/dashboard' },
                    { label: 'Scheduling' }
                ]}
            />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="w-[90vw] max-w-[425px] gap-0 bg-[#0c2a27] border-white/5 text-white rounded-2xl backdrop-blur-2xl px-4 py-6">
                    <DialogHeader>
                        <DialogTitle className="font-heading uppercase tracking-widest text-xs mb-1 text-white">Schedule Session</DialogTitle>
                        <DialogDescription className="text-zinc-500 text-[10px]">
                            Book a new meeting or work session.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAppointment} className="space-y-3 mt-4">
                        <div className="space-y-1">
                            <Label htmlFor="title" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Event Title</Label>
                            <Input
                                id="title"
                                placeholder="Client Discovery Call"
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="time" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Start Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs invert"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="duration" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Duration</Label>
                                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                                    <SelectTrigger className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs">
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0c2a27] border-white/5 text-white">
                                        <SelectItem value="15m">15 Minutes</SelectItem>
                                        <SelectItem value="30m">30 Minutes</SelectItem>
                                        <SelectItem value="60m">1 Hour</SelectItem>
                                        <SelectItem value="90m">1.5 Hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="client" className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Client / Lead</Label>
                            <Input
                                id="client"
                                placeholder="Select a contact..."
                                className="bg-black/20 border-white/5 rounded-lg h-9 px-3 text-xs focus:ring-primary/20"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-[9px] mt-2">
                            Confirm Appointment
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-12">
                <Card className="md:col-span-5 lg:col-span-4 bg-[#0a2c28] border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">Calendar</CardTitle>
                        <CardDescription className="text-zinc-500 text-xs">Select a date to view appointments.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-xl border border-white/5 bg-black/40 text-white"
                        />
                    </CardContent>
                </Card>

                <Card className="md:col-span-7 lg:col-span-8 bg-[#0a2c28] border-white/5 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white font-heading uppercase tracking-widest text-sm">
                                {date ? date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
                            </CardTitle>
                            <Button variant="ghost" size="sm" className="bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest px-4 h-9">Today</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                            </div>
                        ) : hasAppointments ? (
                            <div className="space-y-6">
                                {appointments.map((appt, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="flex flex-col items-center min-w-[80px]">
                                            <span className="text-sm font-bold text-white tracking-widest uppercase">{appt.time}</span>
                                            <span className="text-xs text-zinc-500 flex items-center gap-1 mt-1 font-bold uppercase tracking-widest">
                                                <Clock className="h-3 w-3" />
                                                {appt.duration}
                                            </span>
                                        </div>
                                        <div className="h-full w-[1px] bg-white/10 rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-bold text-white uppercase tracking-widest text-xs leading-none">{appt.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                                                <Users className="h-3 w-3" />
                                                <span>{appt.client}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarImage src={appt.avatar} />
                                                <AvatarFallback className="text-xs bg-primary/20 text-primary font-bold">{appt.client[0]}</AvatarFallback>
                                            </Avatar>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => removeAppointment(appt)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-4 h-full flex flex-col items-center justify-center">
                                <EmptyState
                                    icon={CalendarIcon}
                                    title="A Quiet Day in the Patch"
                                    description="No appointments scheduled for this date. Time to plant some new meetings?"
                                    actionLabel="Schedule Appointment"
                                    onAction={() => setIsDialogOpen(true)}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
