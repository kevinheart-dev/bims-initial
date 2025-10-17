import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FamilyIncomeBarChart from "@/Pages/BarangayOfficer/DashboardCharts/FamilyIncome";
import FamilyIncomeTable from "@/Pages/BarangayOfficer/DashboardCharts/FamilyIncomeTable";

const FamilyIncomePage = ({ familyIncomeData }) => {
    // Compute totals per income category and overall total
    const { total, breakdown } = useMemo(() => {
        const categories = [
            "Survival",
            "Poor",
            "Low Income",
            "Lower Middle Income",
            "Middle Income",
            "Upper Middle Income",
            "High Income",
        ];

        const computed = {};
        let overallTotal = 0;

        categories.forEach((cat) => {
            const item = familyIncomeData.find((d) => d.income_category === cat);
            const count = item ? item.total : 0;
            computed[cat] = { count, percentage: 0 };
            overallTotal += count;
        });

        // Calculate percentages
        Object.keys(computed).forEach((cat) => {
            computed[cat].percentage = overallTotal
                ? ((computed[cat].count / overallTotal) * 100).toFixed(1)
                : 0;
        });

        return { total: overallTotal, breakdown: computed };
    }, [familyIncomeData]);

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Shared container for header + cards to ensure alignment */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-20 lg:px-2 pb-20">
                {/* Header Section */}
                <div className="relative z-10 flex flex-col items-start justify-center py-10 space-y-2">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                        Family Income
                    </h3>

                    <p className="w-full text-[#093a7b] text-sm sm:text-base leading-relaxed max-w-8xl">
                        This section provides an overview of family income levels across the
                        barangay. The total number of households recorded is{" "}
                        <strong>{total}</strong>. Among them,{" "}
                        <strong>{breakdown["Survival"].count}</strong> (
                        {breakdown["Survival"].percentage}%) fall under the Survival category,{" "}
                        <strong>{breakdown["Poor"].count}</strong> (
                        {breakdown["Poor"].percentage}%) are in the Poor category,{" "}
                        <strong>{breakdown["Low Income"].count}</strong> (
                        {breakdown["Low Income"].percentage}%) are Low Income,{" "}
                        <strong>{breakdown["Lower Middle Income"].count}</strong> (
                        {breakdown["Lower Middle Income"].percentage}%) are Lower Middle Income,{" "}
                        <strong>{breakdown["Middle Income"].count}</strong> (
                        {breakdown["Middle Income"].percentage}%) are Middle Income,{" "}
                        <strong>{breakdown["Upper Middle Income"].count}</strong> (
                        {breakdown["Upper Middle Income"].percentage}%) are Upper Middle Income, and{" "}
                        <strong>{breakdown["High Income"].count}</strong> (
                        {breakdown["High Income"].percentage}%) are in the High Income category.
                    </p>
                </div>

                {/* Two Cards Section */}
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Card – Table */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#093a7b]">
                                Family Income Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center text-gray-400">
                            <FamilyIncomeTable familyIncomeData={familyIncomeData} />
                        </CardContent>
                    </Card>

                    {/* Right Card – Chart */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#093a7b]">
                                Income Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center text-gray-400">
                            <FamilyIncomeBarChart familyIncome={familyIncomeData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FamilyIncomePage;
