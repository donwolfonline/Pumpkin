import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { UserAssistant } from '@/components/user-assistant';

interface DashboardShellProps {
    children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <div className="flex min-h-screen bg-[#051c1c] moonlight selection:bg-primary/20 overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/5 bg-[#051c1c] lg:block">
                <Sidebar className="h-full" />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-64 pb-32 lg:pb-0 relative min-h-screen border-l border-white/5">
                {/* Subtle radial glow in the content area */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

                <Header />
                <div className="flex-1 space-y-4 p-6 md:p-10 pt-8 relative z-10">
                    {children}
                </div>
            </main>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
                <MobileNav />
            </div>

            {/* Mobile Side Drawer */}
            <MobileSidebar />

            {/* Dashboard AI Support */}
            <UserAssistant />
        </div>
    );
}
