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
        {
            id: "resident",
            title: "Residents Report",
            description:
                "A detailed report listing all registered residents in the barangay, including personal details, household associations, and demographic information.",
            lastGenerated: "Not yet generated",
            url: "report/export-residents-excel",
            pdfUrl: "report/export-resident-pdf",
        },
        {
            id: "seniorcitizen",
            title: "Senior Citizens Report",
            description:
                "A summary of all senior citizens within the community, including age, household connections, and eligibility for assistance programs.",
            lastGenerated: "Not yet generated",
            url: "report/export-seniorcitizen-excel",
            pdfUrl: "report/export-seniorcitizen-pdf",
        },
        {
            id: "family",
            title: "Family Report",
            description:
                "An overview of families, highlighting their composition, relationships, and address information within the barangay records.",
            lastGenerated: "Not yet generated",
            url: "report/export-family-excel",
            pdfUrl: "report/export-family-pdf",
        },
        {
            id: "household",
            title: "Household Report",
            description:
                "A complete listing of households, their members, and classification details for record-keeping and barangay statistics.",
            lastGenerated: "Not yet generated",
            url: "report/export-household-excel",
            pdfUrl: "report/export-household-pdf",
        },
        {
            id: "vehicles",
            title: "Vehicles Report",
            description:
                "An organized list of vehicles registered by residents, including ownership details, type, and classification.",
            lastGenerated: "Not yet generated",
            url: "report/export-vehicles-excel",
            pdfUrl: "report/export-vehicle-pdf",
        },
        {
            id: "occupation",
            title: "Occupation Reports",
            description:
                "A comprehensive report of residents' occupations, employment status, and related livelihood information within the barangay.",
            lastGenerated: "Not yet generated",
            url: "report/export-occupations-excel",
            pdfUrl: "report/export-occupations-pdf",
        },
        {
            id: "education",
            title: "Education Reports",
            description:
                "A record of residents' educational attainment, school enrollment, and academic progress within the barangay.",
            lastGenerated: "Not yet generated",
            url: "report/export-education-excel",
            pdfUrl: "report/export-education-pdf",
        },
        {
            id: "blotter",
            title: "Blotter Reports",
            description:
                "Incident and blotter records filed within the barangay, including case details, parties involved, and resolution status.",
            lastGenerated: "Not yet generated",
            url: "report/export-blotter-reports-excel",
            pdfUrl: "report/export-blotter-reports-pdf",
        },
        {
            id: "summon",
            title: "Summon Reports",
            description:
                "A detailed listing of summons issued by the barangay, including parties involved, hearing schedules, and case status.",
            lastGenerated: "Not yet generated",
            url: "report/export-summon-excel",
            pdfUrl: "report/export-summon-pdf",
        },
        {
            id: "medical",
            title: "Medical Information Report",
            description:
                "Comprehensive health-related records of residents, including medical conditions, disabilities, allergies, vaccinations, and medications.",
            lastGenerated: "Not yet generated",
            url: "report/export-medical-excel",
            pdfUrl: "report/export-medical-pdf",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Reports" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-8xl px-4 sm:px-2 md:px-4 lg:px-6 py-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3 p-3 bg-green-100 rounded-xl shadow-sm">
                        <div className="p-2 bg-green-200 rounded-full">
                            <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                Reports
                            </h1>
                            <p className="text-sm text-gray-500">
                                Generate and download detailed records of
                                residents, households, families, vehicles, and
                                blotter cases. Use the tools below to{" "}
                                <span className="font-medium">export</span> data
                                for documentation and analytics.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reports.map((report) => (
                        <Card
                            key={report.id}
                            className="flex flex-col h-full border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <CardHeader className="bg-green-50 border-b px-4 py-3 rounded-t-xl">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                    {report.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex flex-col flex-1 px-4 py-3">
                                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                                    {report.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        Last generated: {report.lastGenerated}
                                    </span>
                                </div>

                                <div className="mt-auto flex flex-col gap-2">
                                    <a
                                        href={report.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition">
                                            Download Excel
                                        </Button>
                                    </a>
                                    <a
                                        href={report.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition">
                                            Download PDF
                                        </Button>
                                    </a>
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
