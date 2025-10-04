import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House } from "lucide-react";
import GenderDonutChart from "./DashboardCharts/GenderDonutChart";
import PopulationPerPurok from "./DashboardCharts/PopulationPerPurok";
import AgeDistribution from "./DashboardCharts/AgeDistribution";
import PwdHalfPie from "./DashboardCharts/PwdDistribution";
import AgeCategory from "./DashboardCharts/AgeCategory";
import EmploymentStatus from "./DashboardCharts/EmploymentStatus";
import CivilStatus from "./DashboardCharts/CivilStatus";

const iconMap = {
    users: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <Users className="w-6 h-6 text-blue-500" />
        </div>
    ),
    senior: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <Users className="w-6 h-6 text-green-500" />
        </div>
    ),
    house: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <House className="w-6 h-6 text-orange-500" />
        </div>
    ),
    family: (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
            <Users className="w-6 h-6 text-purple-500" />
        </div>
    ),
};

export default function Dashboard({
    barangayName,
    residentCount,
    seniorCitizenCount,
    totalHouseholds,
    totalFamilies,
    genderDistribution,
    sexDistribution,
    populationPerPurok,
    ageDistribution,
    pwdDistribution,
    ageCategory,
    employmentStatusDistribution,
    civilStatusDistribution,
    voterDistribution,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const data = [
        { title: "Total Residents", value: residentCount, icon: "users" },
        { title: "Senior Citizens", value: seniorCitizenCount, icon: "senior" },
        { title: "Households", value: totalHouseholds, icon: "house" },
        { title: "Families", value: totalFamilies, icon: "family" },
    ];
    const [view, setView] = useState("sex");

    console.log(voterDistribution);
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mt-4 mb-0 mx-7 text-left">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    Barangay {barangayName} Dashboard
                </h1>
                <p className="text-md text-gray-600 mt-0">
                    This dashboard provides an overview of the barangay’s population, demographics, and social statistics to help in planning and decision-making.
                </p>
            </div>



            <div className="pt-4 min-h-screen">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {data.map((item, index) => (
                            <Card
                                key={index}
                                className="flex flex-col items-center justify-center
                                rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md
                                transition-all duration-200 p-3 text-center"
                            >
                                <div className="mb-2">{iconMap[item.icon]}</div>
                                <CardHeader className="p-0 mt-1">
                                    <CardTitle className="text-xs sm:text-sm font-semibold text-gray-500">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                                        <Counter end={item.value} duration={900} />
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Population Overview Per Purok - Takes 2/3 width on large screens */}
                        <Card className="lg:col-span-2 p-6">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="text-xl font-bold text-gray-800">
                                    Population Overview Per Purok
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <PopulationPerPurok populationPerPurok={populationPerPurok} />
                            </CardContent>
                        </Card>

                        {/* Gender/Sex Distribution - Takes 1/3 width on large screens */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-bold text-gray-700">
                                        {view === "sex" ? "Sex Distribution" : "Gender Distribution"}
                                    </CardTitle>
                                    <button
                                        onClick={() => setView(view === "sex" ? "gender" : "sex")}
                                        className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                                    >
                                        {view === "sex" ? "Show Gender" : "Show Sex"}
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <GenderDonutChart
                                    view={view}
                                    genderDistribution={genderDistribution}
                                    sexDistribution={sexDistribution}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Second row of charts: Age Distribution, PWD Distribution, Age Category, Employment Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Age Distribution */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="font-bold text-gray-700">Population by Age</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 h-[350px]">
                                <AgeDistribution ageDistribution={ageDistribution} />
                            </CardContent>
                        </Card>

                        {/* PWD Distribution */}


                        <PwdHalfPie pwdDistribution={pwdDistribution} />


                        {/* Age Category */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="font-bold text-gray-700">Age Category</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <AgeCategory ageCategory={ageCategory} />
                            </CardContent>
                        </Card>

                        {/* Employment Status */}
                        <Card className="p-6">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="font-bold text-gray-700">Employment Status</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <EmploymentStatus employmentStatusDistribution={employmentStatusDistribution} />
                            </CardContent>
                        </Card>

                        <Card className="p-6">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle className="font-bold text-gray-700">Civil Status</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <CivilStatus civilStatusDistribution={civilStatusDistribution} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
