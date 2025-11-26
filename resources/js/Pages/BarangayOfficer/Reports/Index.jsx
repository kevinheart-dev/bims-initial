import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Head } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { FileSpreadsheet, FileText, BarChart3, Download } from "lucide-react";

const Index = () => {
    const breadcrumbs = [{ label: "Reports", showOnMobile: false }];

    const reports = [
        {
            title: "RBI form C",
            baseDesc: "summary of population by age bracket and sector.",
            pdfUrl: "/report/export-monitoring-form-pdf",
        },
        {
            title: "Residents",
            baseDesc: "resident records.",
            url: "/report/export-residents-excel",
            pdfUrl: "/report/export-resident-pdf",
        },
        {
            title: "Senior Citizens",
            baseDesc: "senior citizen registry.",
            url: "/report/export-seniorcitizen-excel",
            pdfUrl: "/report/export-seniorcitizen-pdf",
        },
        {
            title: "Families",
            baseDesc: "family composition records.",
            url: "report/export-family-excel",
            pdfUrl: "/report/export-family-pdf",
        },
        {
            title: "Households",
            baseDesc: "household listings.",
            url: "/report/export-household-excel",
            pdfUrl: "/report/export-household-pdf",
        },
        {
            title: "Vehicles",
            baseDesc: "vehicle registrations.",
            url: "/report/export-vehicles-excel",
            pdfUrl: "/report/export-vehicle-pdf",
        },
        {
            title: "Occupations",
            baseDesc: "employment data.",
            url: "/report/export-occupations-excel",
            pdfUrl: "/report/export-occupations-pdf",
        },
        {
            title: "Education",
            baseDesc: "student statistics.",
            url: "/report/export-education-excel",
            pdfUrl: "/report/export-education-pdf",
        },
        {
            title: "Blotter",
            baseDesc: "incident cases.",
            url: "/report/export-blotter-reports-excel",
            pdfUrl: "/report/export-blotter-reports-pdf",
        },
        {
            title: "Summons",
            baseDesc: "summon schedules.",
            url: "/report/export-summon-excel",
            pdfUrl: "/report/export-summon-pdf",
        },
        {
            title: "Medical",
            baseDesc: "health records.",
            url: "/report/export-medical-excel",
            pdfUrl: "/report/export-medical-pdf",
        },
    ];

    return (
        <div className="mx-auto max-w-1250 px-6 py-6">
            <div className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-full shrink-0">
                    <BarChart3 className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        System Reports
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Select a file card below to download the specific report
                        format.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {reports.map((report, index) => (
                    <React.Fragment key={index}>
                        {report.url && (
                            <a
                                href={report.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <Card className="h-full p-4 border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <FileSpreadsheet className="w-5 h-5" />
                                        </div>
                                        <Download className="w-4 h-4 text-gray-300 group-hover:text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
                                            {report.title} Excel
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Editable spreadsheet for{" "}
                                            {report.baseDesc}
                                        </p>
                                    </div>
                                </Card>
                            </a>
                        )}
                        {report.pdfUrl && (
                            <a
                                href={report.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <Card className="h-full p-4 border border-gray-200 hover:border-red-400 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-red-50 rounded-lg text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <Download className="w-4 h-4 text-gray-300 group-hover:text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-red-700">
                                            {report.title} PDF
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Printable document for{" "}
                                            {report.baseDesc}
                                        </p>
                                    </div>
                                </Card>
                            </a>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Index;
