import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-400 shadow-sm rounded-xl sm:rounded-lg p-4">
                        <p>Admin Dashboard</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
