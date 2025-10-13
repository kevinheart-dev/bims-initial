import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmploymentStatusTable from "@/Pages/BarangayOfficer/DashboardCharts/EmployementStatusTable";
import EmploymentStatusPieChart from "@/Pages/BarangayOfficer/DashboardCharts/EmploymentStatusPie";

const EmploymentStatusPage = ({ employmentStatusData }) => {
    // Compute totals and percentages
    const { total, breakdown } = useMemo(() => {
        if (!employmentStatusData || typeof employmentStatusData !== "object") {
            return { total: 0, breakdown: {} };
        }

        const totalCount = Object.values(employmentStatusData).reduce(
            (sum, val) => sum + (Number(val) || 0),
            0
        );

        const computedBreakdown = {};
        Object.entries(employmentStatusData).forEach(([key, value]) => {
            const percentage = totalCount ? ((value / totalCount) * 100).toFixed(1) : 0;
            computedBreakdown[key] = { count: value, percentage };
        });

        return { total: totalCount, breakdown: computedBreakdown };
    }, [employmentStatusData]);

    // Helper for clean labels
    const formatLabel = (label) =>
        label
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-start justify-center px-6 md:px-20 py-10 space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                    Employment Status
                </h3>

                <p className="text-[#093a7b] text-sm sm:text-base leading-relaxed text-left">
                    This section provides an overview of the barangay's employment status.
                    The total recorded population is <strong>{total.toLocaleString()}</strong> residents.
                    Among them, <strong>{breakdown.employed?.count || 0}</strong> ({breakdown.employed?.percentage || 0}%) are employed,
                    <strong>{breakdown.self_employed?.count || 0}</strong> ({breakdown.self_employed?.percentage || 0}%) are self-employed,
                    <strong>{breakdown.student?.count || 0}</strong> ({breakdown.student?.percentage || 0}%) are students,
                    <strong>{breakdown.under_employed?.count || 0}</strong> ({breakdown.under_employed?.percentage || 0}%) are under-employed,
                    and <strong>{breakdown.unemployed?.count || 0}</strong> ({breakdown.unemployed?.percentage || 0}%) are unemployed.
                    This summary highlights the distribution of the workforce and education engagement across the barangay.
                </p>

            </div>


            {/* Two Cards Section */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-20 lg:px-2 pb-20">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Card – Table */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-[#093a7b] text-left">
                                Employment Status Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-72 overflow-y-auto">
                            <EmploymentStatusTable employmentStatusData={employmentStatusData} />
                        </CardContent>
                    </Card>

                    {/* Right Card – Chart */}
                    <Card className="flex-1 shadow-lg bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-[#093a7b] text-left">
                                Employment Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-80 flex items-center justify-center">
                            <EmploymentStatusPieChart employmentStatusData={employmentStatusData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmploymentStatusPage;
