import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Head } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Clock } from "lucide-react";

const Index = () => {
    const breadcrumbs = [{ label: "Reports", showOnMobile: false }];

    const reports = [
        { id: "resident", title: "Residents Report", description: "A detailed report listing all registered residents in the barangay, including personal details, household associations, and demographic information.", lastGenerated: "Not yet generated" },
        { id: "seniorcitizen", title: "Senior Citizens Report", description: "A summary of all senior citizens within the community, including age, household connections, and eligibility for assistance programs.", lastGenerated: "Not yet generated" },
        { id: "family", title: "Family Report", description: "An overview of families, highlighting their composition, relationships, and address information within the barangay records.", lastGenerated: "Not yet generated" },
        { id: "household", title: "Household Report", description: "A complete listing of households, their members, and classification details for record-keeping and barangay statistics.", lastGenerated: "Not yet generated" },
        { id: "vehicles", title: "Vehicles Report", description: "An organized list of vehicles registered by residents, including ownership details, type, and classification.", lastGenerated: "Not yet generated" },
        { id: "blotter", title: "Blotter Reports", description: "Incident and blotter records filed within the barangay, including case details, parties involved, and resolution status.", lastGenerated: "Not yet generated" },
    ];

    return (
        <AdminLayout>
            <Head title="Reports" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-8xl px-4 sm:px-2 md:px-4 lg:px-6 py-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                        <div className="p-2 bg-blue-200 rounded-full">
                            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                Reports
                            </h1>
                            <p className="text-sm text-gray-500">
                                Generate and download detailed records of residents, households,
                                families, vehicles, and blotter cases. Use the tools below to
                                <span className="font-medium"> export</span> data for documentation
                                and analytics.
                            </p>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {reports.map((report) => (
                        <Card
                            key={report.id}
                            className="border rounded-xl shadow-sm hover:shadow-md transition flex flex-col h-64"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                    {report.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col flex-1">
                                {/* Description with text truncation */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {report.description}
                                </p>

                                {/* Last generated */}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <Clock className="h-4 w-4" />
                                    <span>Last generated: {report.lastGenerated}</span>
                                </div>

                                {/* Button pinned at bottom */}
                                <div className="mt-auto">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                                        Download Excel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
