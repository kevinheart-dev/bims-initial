import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AgeDistributionTable from "@/Pages/BarangayOfficer/DashboardCharts/AgeDistributionTable";
import AgeCard from "../DasboardComponents/AgeCard";

const AgeGroup = ({ ageCategoryData, ageDistributionData }) => {
    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-start justify-center px-6 md:px-20 py-10 space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                    Age Population
                </h3>

                <p className="max-w-3xl text-[#093a7b] text-sm sm:text-base leading-relaxed">
                    This section provides an overview of the population distribution by age group.
                    The table summarizes age ranges and their population counts, while the chart on
                    the right visualizes the overall age composition across the barangay.
                </p>
            </div>

            {/* Two Cards Section */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-20 lg:px-2 pb-20">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Card – Table */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-[#093a7b]">
                                Age Population Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-96 overflow-y-auto">
                            <AgeDistributionTable ageDistributionData={ageDistributionData} />
                        </CardContent>
                    </Card>

                    {/* Right Card – Chart */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-[#093a7b]">
                                Age Category Composition
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center">
                            <AgeCard
                                ageDistribution={ageDistributionData}
                                ageCategory={ageCategoryData}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AgeGroup;
