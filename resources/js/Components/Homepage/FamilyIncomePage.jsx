import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FamilyIncomeBarChart from "@/Pages/BarangayOfficer/DashboardCharts/FamilyIncome";
import FamilyIncomeTable from "@/Pages/BarangayOfficer/DashboardCharts/FamilyIncomeTable";

const FamilyIncomePage = ({ familyIncomeData }) => {

    return (
        <div className="relative overflow-hidden bg-[#f8faff] font-montserrat min-h-screen">
            {/* Header Section */}
            <div className="relative z-10 flex flex-col items-start justify-center px-6 md:px-20 py-12 space-y-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#093a7b]">
                    Family Income
                </h3>

                <p className="max-w-3xl text-[#093a7b] text-sm sm:text-base leading-relaxed">
                    This section presents an overview of family income levels across barangays.
                    The table summarizes income brackets and population percentages, while the chart
                    on the right visualizes income distribution for easier comparison.
                </p>
            </div>

            {/* Two Empty Cards */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-20 lg:px-2 pb-20">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Left Card */}
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

                    {/* Right Card */}
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
