import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";

import { Users, DollarSign, Briefcase, Calendar } from "lucide-react";

const iconMap = {
    users: <Users className="w-8 h-8 text-blue-500" />,
    revenue: <DollarSign className="w-8 h-8 text-green-500" />,
    jobs: <Briefcase className="w-8 h-8 text-orange-500" />,
    schedule: <Calendar className="w-8 h-8 text-purple-500" />,
};

const data = [
    { title: "Total Residents", value: 1200, icon: "users" },
    { title: "Monthly Revenue", value: "₱75,000", icon: "revenue" },
    { title: "Job Seekers", value: 350, icon: "jobs" },
    { title: "Scheduled Events", value: 12, icon: "schedule" },
];

export default function Dashboard() {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6 space-y-8">
                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {data.map((item, index) => (
                            <Card
                                key={index}
                                className="flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-200 border border-muted rounded-2xl"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {item.title}
                                    </CardTitle>
                                    {iconMap[item.icon]}
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {item.value}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
