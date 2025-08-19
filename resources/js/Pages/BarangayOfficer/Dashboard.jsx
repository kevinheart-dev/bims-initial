import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House } from "lucide-react";

const iconMap = {
    users: <Users className="w-32 h-32 text-blue-500" />,
    senior: <Users className="w-32 h-32 text-green-500" />,
    house: <House className="w-32 h-32 text-orange-500" />,
    family: <Users className="w-32 h-32 text-purple-500" />,
};

export default function Dashboard({
    residentCount,
    seniorCitizenCount,
    totalHouseholds,
    totalFamilies,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const data = [
        { title: "Total Residents", value: residentCount, icon: "users" },
        { title: "Senior Citizens", value: seniorCitizenCount, icon: "senior" },
        { title: "Households", value: totalHouseholds, icon: "house" },
        { title: "Families", value: totalFamilies, icon: "family" },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-4 min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-400">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6 space-y-8">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column */}
                        <div className="col-span-8 flex flex-col gap-6">
                            <div className="grid grid-cols-4 gap-6">
                                {data.map((item, index) => (
                                    <Card
                                        key={index}
                                        className="relative flex flex-col justify-between rounded-2xl border border-white/80
                                         bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300
                                            p-6 min-h-[150px] overflow-hidden"
                                    >
                                        <div className="absolute bottom-0 right-0 w-28 h-28 overflow-hidden pointer-events-none">
                                            <div className="opacity-30 transform translate-x-4 translate-y-4">
                                                {iconMap[item.icon]}
                                            </div>
                                        </div>

                                        <div className="z-10 flex flex-col items-start">
                                            <CardContent className="p-0">
                                                <p className="text-5xl font-bold text-gray-900 drop-shadow-sm">
                                                    <Counter end={item.value} duration={1000} />
                                                </p>
                                            </CardContent>
                                            <CardHeader className="p-0 mt-2">
                                                <CardTitle className="text-base font-semibold text-gray-500">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            {/* Middle wide card */}
                            <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[310px]">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Population Overview</h2>
                                <p className="text-gray-600">Placeholder for a chart or detailed summary...</p>
                            </div>

                            {/* Bottom two cards */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[220px]">
                                    <h3 className="font-bold text-gray-700">Gender Distribution</h3>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[220px]">
                                    <h3 className="font-bold text-gray-700">Quick Links</h3>
                                    <ul className="list-disc list-inside text-sm text-blue-600 mt-2">
                                        <li><a href="#" className="hover:underline">Add Resident</a></li>
                                        <li><a href="#" className="hover:underline">View Reports</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-span-4 flex flex-col gap-6">
                            <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[485px]">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Incoming Document Requests</h2>

                                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">Request #1234 - Barangay Clearance</p>
                                        <span className="text-sm text-blue-600 font-semibold">Pending</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">Request #1235 - Business Permit</p>
                                        <span className="text-sm text-green-600 font-semibold">Approved</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">Request #1236 - Indigency Cert.</p>
                                        <span className="text-sm text-green-600 font-semibold">Approved</span>
                                    </div>

                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[220px]">
                                <h3 className="font-bold text-gray-700">System Health</h3>
                                <p className="text-sm text-green-600 mt-2">All systems normal.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </AdminLayout>
    );
}
