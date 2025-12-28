import * as React from "react"

interface SelectContextValue {
    value: string
    setValue: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

export const Select = ({
    value,
    onValueChange,
    children
}: {
    value?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    const [open, setOpen] = React.useState(false)

    const currentValue = value !== undefined ? value : internalValue

    const handleValueChange = (newValue: string) => {
        if (onValueChange) {
            onValueChange(newValue)
        } else {
            setInternalValue(newValue)
        }
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value: currentValue, setValue: handleValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectTrigger must be used within Select")

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={`flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        >
            {children}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    )
}

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectValue must be used within Select")

    return <span>{context.value || placeholder || "Select..."}</span>
}

export const SelectContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectContent must be used within Select")

    if (!context.open) return null

    return (
        <div className={`absolute top-full left-0 z-50 mt-1 w-full rounded-xl border bg-popover shadow-md ${className}`}>
            <div className="p-1">{children}</div>
        </div>
    )
}

export const SelectItem = ({ value, children, className = "" }: { value: string; children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectItem must be used within Select")

    const isSelected = context.value === value

    return (
        <div
            onClick={() => context.setValue(value)}
            className={`relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${isSelected ? "bg-accent" : ""
                } ${className}`}
        >
            {children}
        </div>
    )
}
