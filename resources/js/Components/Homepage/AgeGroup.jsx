import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AgeDistributionTable from "@/Pages/BarangayOfficer/DashboardCharts/AgeDistributionTable";
import AgeCard from "../DasboardComponents/AgeCard";

const AgeGroup = ({ ageCategoryData, ageDistributionData }) => {
    const insights = useMemo(() => {
        if (!ageDistributionData || Object.keys(ageDistributionData).length === 0) {
            return {
                totalPopulation: 0,
                dominantGroup: "N/A",
                dominantPercentage: 0,
                summary: "No data available to analyze age distribution.",
            };
        }

        const entries = Object.entries(ageDistributionData).map(([ageRange, value]) => ({
            ageRange,
            value,
        }));

        const totalPopulation = entries.reduce((sum, item) => sum + item.value, 0);
        const dominant = entries.reduce(
            (prev, curr) => (curr.value > prev.value ? curr : prev),
            entries[0]
        );

        const dominantPercentage =
            totalPopulation > 0 ? ((dominant.value / totalPopulation) * 100).toFixed(1) : 0;

        let summary = `This section provides an overview of the barangay's population by age group. `;
        summary += `The total recorded population across all age brackets is approximately ${totalPopulation.toLocaleString()} residents. `;
        summary += `The largest segment of the population falls under the ${dominant.ageRange.replace(
            /_/g,
            " "
        )} group, comprising about ${dominantPercentage}% of the total population. `;
        summary += `This insight helps identify which age groups dominate the demographic structure and informs resource allocation, programs, and policy planning.`;

        return {
            totalPopulation,
            dominantGroup: dominant.ageRange,
            dominantPercentage,
            summary,
        };
    }, [ageDistributionData]);

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Use the same centered container for header + cards so edges align */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-20 lg:px-2 pb-20">
                {/* Header Section (now inside same container) */}
                <div className="relative z-10 flex flex-col items-start justify-center py-10 space-y-2">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                        Age Population
                    </h3>

                    <p className="w-full text-[#093a7b] text-sm sm:text-base leading-relaxed max-w-8xl">
                        {insights.summary}
                    </p>
                </div>

                {/* Two Cards Section */}
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
