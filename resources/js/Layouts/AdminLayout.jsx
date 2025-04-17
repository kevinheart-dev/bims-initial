import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/Components/app-sidebar2";
import { usePage } from "@inertiajs/react";

export default function Sidebar({ children }) {
    const { auth } = usePage().props;
    return (
        <SidebarProvider>
            <AppSidebar auth={auth} />
            <main className="w-full">
                <div className="p-4 bg-gray-900">
                    <SidebarTrigger className="text-white text-xl" />
                </div>
                {children}
            </main>
        </SidebarProvider>
    );
}
