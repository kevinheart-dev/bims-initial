import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House } from "lucide-react";
import GenderDonutChart from "../CDRRMO/GraphDashboard/GenderDonutChart";
import AgeDistributionChart from "../CDRRMO/GraphDashboard/AgeDistributionChart";
import PopulationPerPurok from "../BarangayOfficer/DashboardCharts/PopulationPerPurok";
import PwdPieChart from "../BarangayOfficer/DashboardCharts/PwdDistribution";

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
    genderDistribution,
    populationPerPurok,
    ageDistribution,
    pwdDistribution,
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
                    {/* Main layout grid - Stacks vertically on mobile, becomes a 12-col grid on large screens */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                        {/* Left Column - Takes full width on mobile, 8 columns on large screens */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            {/* Top stats cards - 2 columns on mobile, 4 on medium screens and up */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                                                {/* Responsive number */}
                                                <p className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 drop-shadow-sm">
                                                    <Counter
                                                        end={item.value}
                                                        duration={900}
                                                    />
                                                </p>
                                            </CardContent>
                                            <CardHeader className="p-0 mt-2">
                                                {/* Responsive title */}
                                                <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-gray-500">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            {/* Middle wide card */}
                            <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[310px]">
                                <h2 className="text-xl font-bold text-gray-800 mb-2">
                                    Population Overview
                                </h2>
                                <PopulationPerPurok
                                    populationPerPurok={populationPerPurok}
                                />
                            </div>

                            {/* Bottom two cards - Stacks on mobile, 2 columns on medium screens and up */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[220px]">
                                    <h3 className="font-bold text-gray-700">
                                        Gender Distribution
                                    </h3>
                                    <GenderDonutChart
                                        genderDistribution={genderDistribution}
                                    />
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 min-h-[220px]">
                                    <h3 className="font-bold text-gray-700">
                                        PWD Distribution
                                    </h3>
                                    <PwdPieChart
                                        pwdDistribution={pwdDistribution}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                            {/* Incoming Document Requests */}
                            <div className="flex-1 rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 flex flex-col min-h-0">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Incoming Document Requests
                                </h2>
                                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                                    {/* Dummy Data */}
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1234 - Barangay Clearance
                                        </p>
                                        <span className="text-sm text-blue-600 font-semibold">
                                            Pending
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1235 - Business Permit
                                        </p>
                                        <span className="text-sm text-green-600 font-semibold">
                                            Approved
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1236 - Indigency Cert.
                                        </p>
                                        <span className="text-sm text-green-600 font-semibold">
                                            Approved
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1234 - Barangay Clearance
                                        </p>
                                        <span className="text-sm text-blue-600 font-semibold">
                                            Pending
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1235 - Business Permit
                                        </p>
                                        <span className="text-sm text-green-600 font-semibold">
                                            Approved
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-xl bg-white/30 backdrop-blur-sm shadow">
                                        <p className="text-gray-700 font-medium">
                                            Request #1236 - Indigency Cert.
                                        </p>
                                        <span className="text-sm text-green-600 font-semibold">
                                            Approved
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* System Health */}
                            <div className="flex-1 rounded-2xl border border-white/80 bg-white/20 backdrop-blur-md shadow-lg p-6 flex flex-col min-h-0">
                                <h3 className="font-bold text-gray-700 mb-4">
                                    Population by Age
                                </h3>
                                {/* This wrapper div will now control the space for the chart */}
                                <div className="flex-1 w-full">
                                    <AgeDistributionChart
                                        ageDistribution={ageDistribution}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
