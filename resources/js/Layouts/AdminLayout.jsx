import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/Components/app-sidebar2";
import { usePage } from "@inertiajs/react";

export default function Sidebar({ children }) {
    const { auth } = usePage().props;
    return (
        <SidebarProvider>
            <AppSidebar auth={auth} />
            <main className="w-full bg-gray-100">{children}</main>
        </SidebarProvider>
    );
}
