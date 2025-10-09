import BarangayPopulationTable from "@/Pages/BarangayOfficer/DashboardCharts/BarangayPopulationTable";
import TopBarangaysPieChart from "@/Pages/BarangayOfficer/DashboardCharts/BarangayTopTem";
import PopulationChart from "@/Pages/BarangayOfficer/DashboardCharts/PopulationChartWelcome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// src/Pages/OverviewPage.jsx
const OverviewPage = ({ populationPerBarangay }) => {

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat">
            {/* Content Section */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 space-y-5">
                <h3 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#093a7b] text-center">
                    Ilagan City, Isabela
                </h3>

                <p className="max-w-6xl text-center text-[#093a7b] text-md sm:text-md md:text-xl leading-relaxed">
                    Ilagan City, the capital of the province of Isabela, is a vibrant and rapidly developing
                    coastal component city in the Cagayan Valley region of the Philippines. Encompassing a vast
                    land area of 1,166.26 square kilometers, it stands as one of the largest cities in terms of
                    land area in the country. Known for its fertile plains and rich agricultural heritage, Ilagan
                    serves as a major center for trade, governance, and innovation in Northern Luzon. The city
                    harmoniously blends rural charm with modern progress, reflecting the resilience, industriousness,
                    and unity of its people.
                </p>
                <div className="w-full max-w-7xl pt-2 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader className="p-4 md:p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#093a7b]">
                                    Barangay Population Overview
                                </h2>

                                {populationPerBarangay && populationPerBarangay.length > 0 && (() => {
                                    const totalPopulation = populationPerBarangay.reduce(
                                        (sum, item) => sum + (item.population || 0),
                                        0
                                    );

                                    const totalPercentage =
                                        totalPopulation > 0
                                            ? (populationPerBarangay[0].population / totalPopulation) * 100
                                            : 0;

                                    return (
                                        <div className="flex items-center space-x-6">
                                            {/* Total Population */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-[#2563eb]">
                                                    {totalPopulation.toLocaleString()}
                                                </span>
                                                <span className="text-gray-500 text-sm mt-1">Total Population</span>
                                            </div>

                                            {/* Vertical Line */}
                                            <div className="w-px h-12 bg-gray-300"></div>

                                            {/* Percentage */}
                                            <div className="flex flex-col items-center">
                                                <span className="text-3xl font-bold text-[#2563eb]">
                                                    {totalPercentage.toFixed(2)}% {/* Added % for clarity */}
                                                </span>
                                                <span className="text-gray-500 text-sm mt-1">Percentage</span>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </CardHeader>

                        <CardContent className="h-96 w-full p-24 md:p-6">
                            <PopulationChart populationPerBarangay={populationPerBarangay} />
                        </CardContent>
                    </Card>


                    {/* 2. Horizontal Summary Cards (New) */}
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <Card className="flex-1 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-[#093a7b]">
                                    Barangay Population Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 md:p-4">
                                <BarangayPopulationTable populationPerBarangay={populationPerBarangay} />
                            </CardContent>
                        </Card>

                        {/* Empty Card 2 */}
                        <Card className="flex-1 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl text-[#093a7b]">
                                    Top 10 Most Populated Barangays
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-96 p-2">
                                <TopBarangaysPieChart populationPerBarangay={populationPerBarangay} />
                            </CardContent>
                        </Card>

                    </div>
                </div>


            </div>
        </div>
    );
};

export default OverviewPage;
