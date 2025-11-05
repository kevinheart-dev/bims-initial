import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import Counter from "@/Components/counter";
import {
    Users,
    House,
    UsersRound,
    User,
    Flame,
    BarChart2,
    AlertTriangle,
    Briefcase,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";
import AgeDistributionChart from "./GraphDashboard/AgeDistributionChart";
import GenderDonutChart from "./GraphDashboard/GenderDonutChart";
import TopBarangaysList from "./GraphDashboard/CRAProgressList";
import { router } from "@inertiajs/react";
import LivelihoodStatisticsChart from "./GraphDashboard/LivelihoodStatisticsChart";
import CustomPieChart from "./GraphDashboard/Piechart";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Button } from "@/Components/ui/button";

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
    livelihoodStatistics = [],
    selectedBarangay,
    householdServices = [],
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const [sortOrder, setSortOrder] = useState("desc");
    const { props } = usePage();

    const groupedServices = householdServices.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = {};

        if (!acc[item.category][item.service_name]) {
            acc[item.category][item.service_name] = item.households_quantity;
        } else {
            acc[item.category][item.service_name] += item.households_quantity;
        }

        return acc;
    }, {});

    // Convert to array format suitable for pie charts
    const chartDataByCategory = Object.entries(groupedServices).reduce(
        (acc, [category, services]) => {
            acc[category] = Object.entries(services).map(
                ([service_name, value]) => ({
                    service_name,
                    households_quantity: value,
                })
            );
            return acc;
        },
        {}
    );

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

    const reportCards = [
        {
            title: "Population Overview Summary",
            icon: <BarChart2 className="w-6 h-6 text-green-500" />,
            routeName: "cdrrmo_admin/cra/population-overview-summary/pdf",
            color: "bg-green-100",
            description: "Overview of population metrics and statistics",
        },
        {
            title: "Top Hazard Summary",
            icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
            routeName: "cdrrmo_admin/cra/top-hazard/pdf",
            color: "bg-red-100",
            description: "Highlights top hazards affecting the community",
        },
        {
            title: "Livelihood Summary",
            icon: <Briefcase className="w-6 h-6 text-yellow-500" />,
            routeName: "cdrrmo_admin/cra/livelihood-summary/pdf",
            color: "bg-yellow-100",
            description: "Summary of livelihoods and economic activities",
        },
        {
            title: "Human Resources Summary",
            icon: <User className="w-6 h-6 text-purple-500" />,
            routeName: "cdrrmo_admin/cra/hr-summary/pdf",
            color: "bg-purple-100",
            description: "Overview of human resources and personnel data",
        },
        {
            title: "Disaster Risk Population Summary",
            icon: <Flame className="w-6 h-6 text-orange-500" />,
            routeName: "cdrrmo_admin/cra/risk-assessment-summary/pdf",
            color: "bg-orange-100",
            description: "Population at risk for various disaster types",
        },
        {
            title: "Risk Assessment Summary",
            icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
            routeName: "cdrrmo_admin/cra/vulnerability-assessment-summary/pdf",
            color: "bg-teal-100",
            description: "Assessment of potential risks and vulnerabilities",
        },
        {
            title: "Vulnerability Assessment Summary",
            icon: <AlertCircle className="w-6 h-6 text-pink-500" />,
            routeName: "vulnerabilityassessment.summary.pdf",
            color: "bg-pink-100",
            description: "Detailed vulnerability analysis and reports",
        },
    ];

    // Hazards from your database
    const hazards = [
        "Flood",
        "Pandemic/Emerging and Re-emerging Diseases",
        "Typhoon",
        "Rain-induced Landslide",
        "Fire",
        "Earthquake",
        "Drought",
        "Vehicular Incident",
        "Pandemic/Emerging and Re-emerging Diseases", // remove duplicate if needed
    ];

    // Generate hazard cards
    const hazardCards = hazards.map((hazard, index) => ({
        index: index,
        title: `${hazard} Disaster Risk Summary`,
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        routeName: `cdrrmo_admin/cra/population-exposure-summary/pdf?hazard=${encodeURIComponent(
            hazard
        )}`,
        color: "bg-orange-100",
        description: `Summary report for ${hazard} hazard`,
    }));

    const allCards = [...reportCards, ...hazardCards];

    // Export handler
    const handleExport = (routePath) => {
        const year =
            sessionStorage.getItem("cra_year") || new Date().getFullYear();

        // Append year properly whether route already has query params
        const hasQuery = routePath.includes("?");
        const exportUrl = `${window.location.origin}/${routePath.replace(
            /^\/+/,
            ""
        )}${hasQuery ? "&" : "?"}year=${year}`;

        console.log(exportUrl);
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-2 pb-8 min-h-screen bg-gray-50">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* No Data Placeholder */}
                    {isDataNull ? (
                        <NoDataPlaceholder tip="No data available for the selected barangay or year." />
                    ) : (
                        <>
                            {/* Section Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-0">
                                        Barangay Statistics
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {selectedBarangay
                                            ? "Overview for the selected barangay"
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
                                        <option
                                            key={barangay.id}
                                            value={barangay.id}
                                        >
                                            {barangay.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                                {/* Left column: Cards + Charts */}
                                <div className="lg:col-span-9 flex flex-col gap-2">
                                    {/* Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {data.map((item, index) => (
                                            <Card
                                                key={index}
                                                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-3"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-50">
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

                                    {/* Charts */}
                                    <AgeDistributionChart
                                        ageDistribution={ageDistribution}
                                    />
                                    <LivelihoodStatisticsChart
                                        livelihoodStatistics={
                                            livelihoodStatistics
                                        }
                                    />
                                </div>

                                <div className="lg:col-span-3 flex flex-col items-center gap-2">
                                    <div className="w-full max-w-full">
                                        <TopBarangaysList
                                            data={topBarangays}
                                            selectedBarangayId={
                                                selectedBarangay
                                            }
                                            year={
                                                props.session?.cra_year || null
                                            }
                                        />
                                    </div>
                                    <div className="w-full max-w-full">
                                        <GenderDonutChart
                                            genderData={genderData}
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-12 flex gap-2">
                                    {Object.entries(chartDataByCategory).map(
                                        ([category, dataArray]) => (
                                            <div
                                                key={category}
                                                className="flex-1 bg-white rounded-lg shadow p-4 border hover:shadow-xl"
                                            >
                                                <h3 className="text-lg font-medium mb-2">
                                                    {category}
                                                </h3>
                                                <CustomPieChart
                                                    data={dataArray}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="space-y-12 px-6 py-6">
                                {/* General Reports */}
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        General Reports
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {reportCards.map((item) => (
                                            <div
                                                key={item.title}
                                                className="flex flex-col justify-between p-5 rounded-xl shadow-md hover:shadow-xl transition bg-white border border-gray-200 hover:scale-[1.02]"
                                            >
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div
                                                        className={`flex items-center justify-center w-12 h-12 rounded-full ${item.color} text-white`}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    {item.description ||
                                                        "Summary report available"}
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        handleExport(
                                                            item.routeName
                                                        )
                                                    }
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                                                >
                                                    Export PDF
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Hazard Reports */}
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                        Hazard Reports
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {hazardCards.map((item) => (
                                            <div
                                                key={`${item.index}-${item.title}`}
                                                className="flex flex-col justify-between p-5 rounded-xl shadow-md hover:shadow-xl transition bg-white border border-gray-200 hover:scale-[1.02]"
                                            >
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <div
                                                        className={`flex items-center justify-center w-12 h-12 rounded-full ${item.color} text-white`}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    {item.description ||
                                                        "Summary report available"}
                                                </p>
                                                <div className="flex justify-between items-center">
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                        Hazard
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleExport(
                                                                item.routeName
                                                            )
                                                        }
                                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                                                    >
                                                        Export PDF
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
