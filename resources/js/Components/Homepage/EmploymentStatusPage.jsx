import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EmploymentStatusTable from "@/Pages/BarangayOfficer/DashboardCharts/EmployementStatusTable";
import EmploymentStatusPieChart from "@/Pages/BarangayOfficer/DashboardCharts/EmploymentStatusPie";

const EmploymentStatusPage = ({ employmentStatusData }) => {
    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-start justify-center px-6 md:px-20 py-10 space-y-2">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                    Employment Status
                </h3>

                <p className="max-w-3xl text-[#093a7b] text-sm sm:text-base leading-relaxed text-left">
                    This section presents an overview of employment status across barangays.
                    The table displays detailed figures for each employment group, while the chart
                    provides a visual comparison of employed, unemployed, and other related categories.
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
