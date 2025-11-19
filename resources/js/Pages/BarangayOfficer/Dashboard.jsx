import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House } from "lucide-react";
import GenderDonutChart from "./DashboardCharts/GenderDonutChart";
import PopulationPerPurok from "./DashboardCharts/PopulationPerPurok";
import PwdHalfPie from "./DashboardCharts/PwdDistribution";
import EmploymentStatus from "./DashboardCharts/EmploymentStatus";
import CivilStatus from "./DashboardCharts/CivilStatus";
import AgeCard from "@/Components/DasboardComponents/AgeCard";
import FamilyIncomeBarChart from "./DashboardCharts/FamilyIncome";
import EducationStackedBarChart from "./DashboardCharts/EducationHistory";
import EthnicityBarChart from "./DashboardCharts/EthnicityDistribution";
import HalfPieChart from "@/Components/DasboardComponents/HalfPieChart";
const iconMap = {
    users: (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <Users className="w-5 h-5 text-blue-500" />
        </div>
    ),
    senior: (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <Users className="w-5 h-5 text-green-500" />
        </div>
    ),
    house: (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <House className="w-5 h-5 text-orange-500" />
        </div>
    ),
    family: (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <Users className="w-5 h-5 text-purple-500" />
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
    familyIncome,
    educationData,
    ethnicityDistribution,
    fourPsDistribution,
    soloParentDistribution,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const data = [
        { title: "Total Residents", value: residentCount, icon: "users" },
        { title: "Senior Citizens", value: seniorCitizenCount, icon: "senior" },
        { title: "Households", value: totalHouseholds, icon: "house" },
        { title: "Families", value: totalFamilies, icon: "family" },
    ];
    const [view, setView] = useState("sex");

    // console.log(voterDistribution);

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div
                className="mt-4 mb-0 mx-7 p-6 rounded-xl shadow-lgtext-left shadow-md
                            bg-gradient-to-r from-sky-50 via-white to-cyan-50"
            >
                <h1 className="text-2xl font-extrabold text-gray-800">
                    Barangay{" "}
                    <span className="bg-blue-100 text-blue-800 rounded-sm px-1">
                        {barangayName}
                    </span>
                </h1>
                <p className="text-md text-gray-600 mt-0">
                    This dashboard visualizes Barangay {barangayName}’s
                    population, demographics, and social data for informed
                    community planning.
                </p>
            </div>

            <div className="pt-4 min-h-screen">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {/* Left Section: Cards */}
                        <div className="grid grid-cols-2 gap-2 col-span-2 mb-6">
                            {data.map((item, index) => (
                                <Card
                                    key={index}
                                    className="flex items-center justify-between rounded-xl
                                    border border-gray-200 bg-white
                                    shadow-sm hover:shadow-md hover:-translate-y-0.5
                                    transition-all duration-300 py-2 px-4"
                                >
                                    {/* Icon container */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
                                        {iconMap[item.icon]}
                                    </div>

                                    {/* Value + Title */}
                                    <div className="text-right max-w-[70%]">
                                        <CardContent className="p-0">
                                            <p className="text-lg md:text-3xl font-bold text-gray-900">
                                                <Counter
                                                    end={item.value}
                                                    duration={900}
                                                />
                                            </p>
                                        </CardContent>
                                        <CardHeader className="p-0 mt-0">
                                            <CardTitle className="text-md font-medium text-gray-600">
                                                {item.title}
                                            </CardTitle>
                                        </CardHeader>
                                    </div>
                                </Card>
                            ))}

                            <div className="col-span-2 mt-0 w-full">
                                <Card className="w-full px-4 py-2">
                                    <PopulationPerPurok
                                        populationPerPurok={populationPerPurok}
                                    />
                                </Card>
                            </div>

                            <div className="col-span-2 mt-0 w-full">
                                <Card className="w-full px-4 py-2">
                                    <FamilyIncomeBarChart
                                        familyIncome={familyIncome}
                                    />
                                </Card>
                            </div>

                            <div className="col-span-2 mt-0 w-full">
                                <Card className="w-full px-4 py-2">
                                    <EducationStackedBarChart
                                        educationData={educationData}
                                    />
                                </Card>
                            </div>
                        </div>

                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-2">
                                <Card>
                                    <HalfPieChart
                                        title="PWD Distribution"
                                        distribution={pwdDistribution}
                                        labelName="PWD"
                                        gradientId="pwdGradient"
                                        gradientColor="#3b82f6"
                                    />
                                </Card>

                                <AgeCard
                                    ageDistribution={ageDistribution}
                                    ageCategory={ageCategory}
                                />

                                <Card className="w-full p-6">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="font-bold text-gray-700">
                                            Employment Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <EmploymentStatus
                                            employmentStatusDistribution={
                                                employmentStatusDistribution
                                            }
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <EthnicityBarChart
                                        ethnicityDistribution={
                                            ethnicityDistribution
                                        }
                                    />
                                </Card>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Card>
                                    <HalfPieChart
                                        title="Voters Distribution"
                                        distribution={voterDistribution}
                                        labelName="Registered"
                                        gradientId="votersGradient"
                                        gradientColor="#3b82f6"
                                    />
                                </Card>
                                <Card className="p-6">
                                    <CardHeader className="p-0 mb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="font-bold text-gray-700">
                                                {view === "sex"
                                                    ? "Sex Distribution"
                                                    : "Gender Distribution"}
                                            </CardTitle>
                                            <button
                                                onClick={() =>
                                                    setView(
                                                        view === "sex"
                                                            ? "gender"
                                                            : "sex"
                                                    )
                                                }
                                                className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition"
                                            >
                                                {view === "sex"
                                                    ? "Show Gender"
                                                    : "Show Sex"}
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <GenderDonutChart
                                            view={view}
                                            genderDistribution={
                                                genderDistribution
                                            }
                                            sexDistribution={sexDistribution}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="w-full p-6">
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="font-bold text-gray-700">
                                            Civil Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <CivilStatus
                                            civilStatusDistribution={
                                                civilStatusDistribution
                                            }
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <HalfPieChart
                                        title="4Ps Beneficiaries"
                                        distribution={fourPsDistribution}
                                        gradientId="fourPsGradient"
                                        gradientColor="#22D3EE"
                                        labelName="4Ps Beneficiary"
                                    />
                                </Card>
                                <Card>
                                    <HalfPieChart
                                        title="Solo Parents"
                                        distribution={soloParentDistribution}
                                        gradientId="soloParentGradient"
                                        gradientColor="#3b82f6"
                                        labelName="Solo Parent"
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
