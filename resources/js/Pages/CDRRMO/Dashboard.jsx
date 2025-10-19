import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House, UsersRound } from "lucide-react";
import AgeDistributionChart from "./GraphDashboard/AgeDistributionChart";
import GenderDonutChart from "./GraphDashboard/GenderDonutChart";
import TopBarangaysList from "./GraphDashboard/TopBarangayList";
import { router } from "@inertiajs/react";

const iconMap = {
    population: <Users className="w-8 h-8 text-blue-500" />,
    household: <House className="w-8 h-8 text-orange-500" />,
    family: <UsersRound className="w-8 h-8 text-purple-500" />,
};

export default function Dashboard({
    totalPopulation,
    totalHouseholds,
    totalFamilies,
    ageDistribution = [],
    genderData = [],
    barangays = [],
    topBarangays = [],
    selectedBarangay,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const [sortOrder, setSortOrder] = useState("desc");

    const data = [
        {
            title: "Total Population",
            value: totalPopulation,
            icon: "population",
        },
        {
            title: "Total Households",
            value: totalHouseholds,
            icon: "household",
        },
        { title: "Total Families", value: totalFamilies, icon: "family" },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(route("cdrrmo_admin.dashboard"), {
            barangay_id: barangayId,
        });
    };

    // Check if any required data is null
    const isDataNull =
        totalPopulation === null ||
        totalHouseholds === null ||
        totalFamilies === null ||
        ageDistribution.length === 0 ||
        genderData.length === 0;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-2 pb-2 min-h-screen bg-white">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div>
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-0">
                                Barangay Statistics
                            </h2>
                            <p className="text-sm text-gray-500">
                                {selectedBarangay
                                    ? `Overview for selected barangay`
                                    : "Overview for Ilagan City (all barangays)"}
                            </p>
                        </div>

                        {/* Barangay Dropdown */}
                        <select
                            className="border border-gray-300 rounded-lg p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={selectedBarangay || ""}
                            onChange={handleBarangayChange}
                        >
                            <option value="">
                                Ilagan City (All Barangays)
                            </option>
                            {barangays.map((barangay) => (
                                <option key={barangay.id} value={barangay.id}>
                                    {barangay.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Main content */}
                    {isDataNull ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <img
                                src="/images/chart_error.png"
                                alt="No data"
                                className="w-48 h-48 mb-4"
                            />
                            <p className="text-gray-500 text-lg text-center">
                                Please select a year to display the dashboard
                                data.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                            {/* Left column: Cards + Charts */}
                            <div className="lg:col-span-9 flex flex-col gap-2">
                                {/* Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                    {data.map((item, index) => (
                                        <Card
                                            key={index}
                                            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-2"
                                        >
                                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50">
                                                {iconMap[item.icon]}
                                            </div>
                                            <div className="text-right max-w-[70%]">
                                                <CardContent className="p-0">
                                                    <p className="text-base md:text-lg font-bold text-gray-900">
                                                        <Counter
                                                            end={item.value}
                                                            duration={900}
                                                        />
                                                    </p>
                                                </CardContent>
                                                <CardHeader className="p-0 mt-0.5">
                                                    <CardTitle className="text-xs font-medium text-gray-600">
                                                        {item.title}
                                                    </CardTitle>
                                                </CardHeader>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Age Distribution Chart */}
                                <AgeDistributionChart
                                    ageDistribution={ageDistribution}
                                />
                            </div>

                            {/* Right column: Gender Chart */}
                            <div className="lg:col-span-3 flex flex-col items-center gap-4">
                                <div className="w-full max-w-xs">
                                    <TopBarangaysList
                                        data={topBarangays}
                                        selectedBarangayId={selectedBarangay}
                                    />
                                </div>

                                <div className="w-full max-w-xs">
                                    <GenderDonutChart genderData={genderData} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
