import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import { Users, House, UsersRound } from "lucide-react";
import { router } from "@inertiajs/react";
import FamilyIncomeBarChart from "../BarangayOfficer/DashboardCharts/FamilyIncome";
import EducationStackedBarChart from "../BarangayOfficer/DashboardCharts/EducationHistory";
import HalfPieChart from "@/Components/DasboardComponents/HalfPieChart";
import AgeCard from "@/Components/DasboardComponents/AgeCard";
import GenderDonutChart from "../BarangayOfficer/DashboardCharts/GenderDonutChart";
import EthnicityBarChart from "../BarangayOfficer/DashboardCharts/EthnicityDistribution";
import CivilStatus from "../BarangayOfficer/DashboardCharts/CivilStatus";
import EmploymentStatus from "../BarangayOfficer/DashboardCharts/EmploymentStatus";
import PopulationPerBarangay from "../BarangayOfficer/DashboardCharts/PopulationPerBarangay";
import PopulationPerPurok from "../BarangayOfficer/DashboardCharts/PopulationPerPurok";

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
    residentCount,
    totalFamilies,
    totalHouseholds,
    familyIncomeAllBarangay,
    barangays,
    seniorCitizenCount,
    selectedBarangay,
    pwdDistributionAllBarangay,
    voterDistributionAllBrgy,
    ageDistributionAllBrgy,
    ageCategoryAllBrgy,
    genderDistributionAllBrgy,
    sexDistibutionAllBrgy,
    educationDataAllBrgy,
    ethnicityDistributionAllBrgy,
    civilStatusAllBrgy,
    fourPsDistributionAllBrgy,
    soloParentDistributionAllBrgy,
    employmentStatusAllBrgy,
    populationPerBarangay,
    populationPerPurok,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const data = [
        { title: "Total Residents", value: residentCount, icon: "users" },
        { title: "Senior Citizens", value: seniorCitizenCount, icon: "senior" },
        { title: "Households", value: totalHouseholds, icon: "house" },
        { title: "Families", value: totalFamilies, icon: "family" },
    ];
    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(route("super_admin.dashboard"), { barangay_id: barangayId });
    };

    const PopulationChartComponent = selectedBarangay
        ? (
            <PopulationPerPurok
                populationPerPurok={populationPerPurok}
            />
        )
        : (
            <PopulationPerBarangay
                populationPerBarangay={populationPerBarangay}
            />
        );

    // console.log(populationPerPurok);

    const [view, setView] = useState("sex");
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div
                className="
                mt-4 mb-0 mx-6 p-4 rounded-xl shadow-md
                bg-gradient-to-r from-purple-100 via-white to-blue-100"
            >
                <div className="flex items-start justify-between">
                    <div className="text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            Barangay Statistics
                        </h2>
                        <p className="text-md text-gray-600">
                            {selectedBarangay
                                ? `Overview for selected barangay`
                                : "Overview for Ilagan City (all barangays)"}
                        </p>
                    </div>

                    <select
                        className="
                border border-gray-300 rounded-lg p-3 text-base font-medium text-gray-700
                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 w-64 md:w-80"
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
            </div>

            <div className="pt-4 min-h-screen">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div className="grid grid-cols-2 gap-2 col-span-2 mb-6">
                            {data.map((item, index) => (
                                <Card
                                    key={index}
                                    className="flex items-center justify-between rounded-xl
    border border-gray-200 bg-white
    shadow-sm transition-all duration-300 py-2 px-4 hover:-translate-y-0.5
    hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    {/* Icon container */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
                                        {iconMap[item.icon]}
                                    </div>

                                    {/* Value + Title */}
                                    <div className="text-right max-w-[70%]">
                                        <CardContent className="p-0">
                                            <p className="text-lg md:text-3xl font-bold text-gray-900">
                                                <Counter end={item.value} duration={900} />
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
                                <Card
                                    className="w-full px-4 py-2
                                        shadow-md transition-all duration-300 hover:-translate-y-0.5
                                        hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    {PopulationChartComponent}
                                </Card>
                            </div>

                            {/* Family Income Bar Chart Card */}
                            <div className="col-span-2 mt-0 w-full">
                                <CardHeader className="p-0 mb-4">
                                    <CardTitle className="font-bold text-gray-700">Family Income</CardTitle>
                                </CardHeader>
                                <Card
                                    className="w-full px-4 py-2
                                    shadow-md transition-all duration-300 hover:-translate-y-0.5
                                    hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <FamilyIncomeBarChart familyIncome={familyIncomeAllBarangay} />
                                </Card>
                            </div>

                            {/* Education Stacked Bar Chart Card */}
                            <div className="col-span-2 mt-0 w-full">
                                <Card
                                    className="w-full px-4 py-2
                                    shadow-md transition-all duration-300 hover:-translate-y-0.5
                                    hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <EducationStackedBarChart educationData={educationDataAllBrgy} />
                                </Card>
                            </div>
                        </div>


                        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="flex flex-col gap-2">
                                {/* PWD Distribution Card */}
                                <Card
                                    className="shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <HalfPieChart
                                        title="PWD Distribution"
                                        distribution={pwdDistributionAllBarangay}
                                        labelName="PWD"
                                        gradientId="pwdGradient"
                                        gradientColor="#3b82f6"
                                    />
                                </Card>

                                {/* Age Card - Assuming AgeCard handles its own wrapper/styling, leave it as is. */}
                                <AgeCard ageDistribution={ageDistributionAllBrgy} ageCategory={ageCategoryAllBrgy} />


                                {/* Employment Status Card */}
                                <Card
                                    className="w-full p-6
            shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="font-bold text-gray-700">Employment Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <EmploymentStatus employmentStatusDistribution={employmentStatusAllBrgy} />
                                    </CardContent>
                                </Card>

                                {/* Ethnicity Bar Chart Card */}
                                <Card
                                    className="shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <EthnicityBarChart ethnicityDistribution={ethnicityDistributionAllBrgy} />
                                </Card>
                            </div>

                            <div className="flex flex-col gap-2">
                                {/* Voters Distribution Card */}
                                <Card
                                    className="shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <HalfPieChart
                                        title="Voters Distribution"
                                        distribution={voterDistributionAllBrgy}
                                        labelName="Registered"
                                        gradientId="votersGradient"
                                        gradientColor="#3b82f6"
                                    />
                                </Card>

                                {/* Sex/Gender Distribution Card */}
                                <Card
                                    className="p-6
            shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <CardHeader className="p-0 mb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="font-bold text-gray-700">
                                                {view === "sex" ? "Sex Distribution" : "Gender Distribution"}
                                            </CardTitle>
                                            <button
                                                onClick={() => setView(view === "sex" ? "gender" : "sex")}
                                                className="px-3 py-1 text-sm rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition"
                                            >
                                                {view === "sex" ? "Show Gender" : "Show Sex"}
                                            </button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <GenderDonutChart
                                            view={view}
                                            genderDistribution={genderDistributionAllBrgy}
                                            sexDistribution={sexDistibutionAllBrgy}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Civil Status Card */}
                                <Card
                                    className="w-full p-6
            shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <CardHeader className="p-0 mb-4">
                                        <CardTitle className="font-bold text-gray-700">Civil Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <CivilStatus civilStatusDistribution={civilStatusAllBrgy} />
                                    </CardContent>
                                </Card>

                                {/* 4Ps Beneficiaries Card */}
                                <Card
                                    className="shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <HalfPieChart
                                        title="4Ps Beneficiaries"
                                        distribution={fourPsDistributionAllBrgy}
                                        gradientId="fourPsGradient"
                                        gradientColor="#22D3EE"
                                        labelName="4Ps Beneficiary"
                                    />
                                </Card>

                                {/* Solo Parents Card */}
                                <Card
                                    className="shadow-sm transition-all duration-300 hover:-translate-y-0.5
            hover:shadow-[0_4px_10px_rgba(59,130,246,0.3)]"
                                >
                                    <HalfPieChart
                                        title="Solo Parents"
                                        distribution={soloParentDistributionAllBrgy}
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
