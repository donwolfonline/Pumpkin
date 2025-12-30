"use client"

import * as React from "react"
import { toast } from "sonner"

import { Appointment } from "@/lib/types/appointment";
export type { Appointment };

export interface Notification {
    id: string;
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

interface NotificationContextType {
    appointments: Appointment[];
    notifications: Notification[];
    unreadCount: number;
    addAppointment: (appointment: Appointment) => void;
    removeAppointment: (appointment: Appointment) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined)

import { getUserData, setUserData } from "@/lib/storage-utils";

import { NotificationPopup } from "@/components/features/notifications/notification-popup";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [appointments, setAppointments] = React.useState<Appointment[]>([])
    const [notifications, setNotifications] = React.useState<Notification[]>([])
    const [activeNotification, setActiveNotification] = React.useState<Appointment | null>(null);
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Load initial data
    React.useEffect(() => {
        const storedAppointments = getUserData<Appointment[]>('pumpkin_appointments');
        if (storedAppointments) {
            setAppointments(storedAppointments);
        }
        setIsInitialized(true);
    }, []);

    // Save data whenever it changes
    React.useEffect(() => {
        if (isInitialized) {
            setUserData('pumpkin_appointments', appointments);
        }
    }, [appointments, isInitialized]);

    const addAppointment = (appointment: Appointment) => {
        setAppointments((prev) => {
            const newAppointments = [...prev, appointment];
            return newAppointments;
        })
        toast.success("Appointment Scheduled", {
            description: `${appointment.title} with ${appointment.client} at ${appointment.time}`
        })
    }

    const removeAppointment = (appointmentToRemove: Appointment) => {
        setAppointments((prev) => prev.filter(appt =>
            appt.time !== appointmentToRemove.time || appt.title !== appointmentToRemove.title
        ));
        toast.success("Appointment Cancelled", {
            description: `${appointmentToRemove.title} has been removed.`
        });
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }

    const clearNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }

    // Check for appointments every minute
    React.useEffect(() => {
        const checkAppointments = () => {
            const now = new Date()

            // Manual time construction for robust 2-digit HH:MM comparison
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const currentTime = `${hours}:${minutes}`;

            appointments.forEach(appt => {
                // Strict check: appt.time comes from input type="time" (HH:MM)
                if (appt.time === currentTime) {
                    const id = `${appt.time}-${appt.title}`
                    // Prevent duplicate notifications
                    if (notifications.some(n => n.id === id)) return;

                    setNotifications(prev => {
                        if (prev.some(n => n.id === id)) return prev

                        // Set active notification for popup
                        setActiveNotification(appt);

                        return [...prev, {
                            id,
                            title: "Appointment Reminder",
                            message: `It's time for ${appt.title}`,
                            timestamp: now,
                            read: false,
                            appointment: appt
                        }]
                    })
                }
            })
        }

        const interval = setInterval(checkAppointments, 10000) // Check every 10 seconds for better responsiveness
        checkAppointments() // Initial check

        return () => clearInterval(interval)
    }, [appointments, notifications])

    return (
        <NotificationContext.Provider value={{
            appointments,
            notifications,
            unreadCount: notifications.filter(n => !n.read).length,
            addAppointment,
            removeAppointment,
            markAllAsRead,
            clearNotification
        }}>
            {children}
            {activeNotification && (
                <NotificationPopup
                    notification={{
                        id: 'active',
                        title: 'Appointment Reminder',
                        message: `It's time for ${activeNotification.title}`,
                        appointment: activeNotification
                    }}
                    onDismiss={() => setActiveNotification(null)}
                    onExpand={() => { }}
                />
            )}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = React.useContext(NotificationContext)
    if (context === undefined) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
