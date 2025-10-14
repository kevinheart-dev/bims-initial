import React from "react";
import BarangayPopulationTable from "@/Pages/BarangayOfficer/DashboardCharts/BarangayPopulationTable";
import TopBarangaysPieChart from "@/Pages/BarangayOfficer/DashboardCharts/BarangayTopTem";
import PopulationChart from "@/Pages/BarangayOfficer/DashboardCharts/PopulationChartWelcome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OverviewPage = ({ populationPerBarangay }) => {
    // Compute total population only
    const totalPopulation = populationPerBarangay
        ? populationPerBarangay.reduce((sum, item) => sum + (item.population || 0), 0)
        : 0;

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 space-y-6 text-center">
                <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#093a7b] leading-tight">
                    Ilagan City, Isabela
                </h3>

                <p className="max-w-5xl text-[#093a7b] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                    Ilagan City, the capital of the province of Isabela, is a vibrant and rapidly developing
                    coastal component city in the Cagayan Valley region of the Philippines. Encompassing a vast
                    land area of 1,166.26 square kilometers, it stands as one of the largest cities in terms of
                    land area in the country. Known for its fertile plains and rich agricultural heritage, Ilagan
                    serves as a major center for trade, governance, and innovation in Northern Luzon. The city
                    harmoniously blends rural charm with modern progress, reflecting the resilience, industriousness,
                    and unity of its people.
                </p>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-6 pb-16">
                {/* Population Overview Chart */}
                <Card className="shadow-lg">
                    <CardHeader className="p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#093a7b] text-center md:text-left">
                            Barangay Population Overview
                        </h2>

                        {populationPerBarangay && populationPerBarangay.length > 0 && (
                            <div className="flex flex-wrap justify-center items-center gap-6">
                                {/* Total Population */}
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2563eb]">
                                        {totalPopulation.toLocaleString()}
                                    </span>
                                    <span className="text-gray-500 text-xs sm:text-sm mt-1">
                                        Total Population
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent className="h-54 sm:h-62 md:h-96 w-full px-2 sm:px-4 md:px-6">
                        <PopulationChart populationPerBarangay={populationPerBarangay} />
                    </CardContent>
                </Card>

                {/* Table and Pie Chart Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Barangay Population Table */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl text-[#093a7b] text-center sm:text-left">
                                Barangay Population Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4 overflow-x-auto">
                            <BarangayPopulationTable populationPerBarangay={populationPerBarangay} />
                        </CardContent>
                    </Card>

                    {/* Top 10 Barangays Pie Chart */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl text-[#093a7b] text-center sm:text-left">
                                Top 10 Most Populated Barangays
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-64 sm:h-72 md:h-96 p-2 sm:p-4">
                            <TopBarangaysPieChart populationPerBarangay={populationPerBarangay} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
