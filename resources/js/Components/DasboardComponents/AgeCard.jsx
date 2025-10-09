import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AgeCategory from "@/Pages/BarangayOfficer/DashboardCharts/AgeCategory";
import AgeDistribution from "@/Pages/BarangayOfficer/DashboardCharts/AgeDistribution";

const AgeCard = ({ ageDistribution, ageCategory }) => {
    const [view, setView] = useState("category");

    return (
        <Card className="w-full p-6 ">
            <CardHeader className="p-0 mb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="font-bold text-gray-700 whitespace-nowrap">
                        {view === "distribution" ? "Population by Age" : "Age Category"}
                    </CardTitle>
                    <button
                        onClick={() =>
                            setView(view === "distribution" ? "category" : "distribution")
                        }
                        className="px-3 py-1 text-[11px] rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-200 transition whitespace-nowrap"
                    >
                        {view === "distribution" ? "Show Age Category" : "Show Distribution"}
                    </button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {view === "distribution" ? (
                    <AgeDistribution ageDistribution={ageDistribution} />
                ) : (
                    <AgeCategory ageCategory={ageCategory} />
                )}
            </CardContent>
        </Card>
    );
};

export default AgeCard;
