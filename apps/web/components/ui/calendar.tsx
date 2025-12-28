"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "w-full flex justify-center",
                month: "w-full max-w-sm flex flex-col items-center",
                month_caption: "flex justify-center pt-1 relative items-center mb-6 w-full px-12",
                caption_label: "text-sm font-bold uppercase tracking-widest text-white mt-1",
                nav: "flex items-center absolute top-1 left-0 right-0 justify-between px-2 w-full",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-white/5 p-0 opacity-50 hover:opacity-100 border-white/10 rounded-lg text-white"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-white/5 p-0 opacity-50 hover:opacity-100 border-white/10 rounded-lg text-white"
                ),
                month_grid: "w-full",
                weekdays: "flex w-full justify-between mb-3 border-b border-white/5 pb-2",
                weekday: "text-zinc-500 w-9 text-center font-bold text-[10px] uppercase tracking-widest",
                week: "flex w-full justify-between mt-1",
                day: cn(
                    "h-9 w-9 p-0 font-medium hover:bg-white/5 rounded-lg text-white text-sm flex items-center justify-center transition-colors cursor-pointer relative"
                ),
                selected: "bg-primary text-white hover:bg-primary/90 hover:text-white focus:bg-primary focus:text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] rounded-lg font-bold",
                today: "bg-white/5 text-primary border border-primary/20 rounded-lg",
                outside: "text-zinc-600 opacity-30 pointer-events-none",
                disabled: "text-zinc-600 opacity-50",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: (props) => {
                    if (props.orientation === 'left') return <ChevronLeft className="h-4 w-4" />
                    return <ChevronRight className="h-4 w-4" />
                }
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
