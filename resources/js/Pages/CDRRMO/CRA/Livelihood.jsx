import { useState } from "react";
import {
    Users,
    Cross,
    Activity,
    Home,
    Key,
    Tractor,
    BarChart3,
    FileSpreadsheet,
} from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Button } from "@/Components/ui/button";

export default function Dashboard({
    livelihoodStats,
    overallLivelihoodStats,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !livelihoodStats || livelihoodStats.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.livelihood"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const handleExport = () => {
        const year =
            sessionStorage.getItem("cra_year") ||
            selectedYear ||
            new Date().getFullYear();

        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/cdrrmo_admin/cra/livelihood-summary/pdf?year=${year}`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {/* ✅ Overall Summary Across All Barangays */}
                            {overallLivelihoodStats &&
                                overallLivelihoodStats.length > 0 && (
                                    <TableSection
                                        icon={<BarChart3 />} // optional: different icon
                                        color="blue"
                                        title="Overall Livelihood Distribution (All Barangays)"
                                        description="Total number of individuals engaged in each livelihood type across all barangays."
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: overallLivelihoodStats,
                                            allColumns: [
                                                { key: "number", label: "No." },
                                                {
                                                    key: "livelihood_type",
                                                    label: "Livelihood Type",
                                                },
                                                {
                                                    key: "male_without_disability",
                                                    label: "Male w/o Disability",
                                                },
                                                {
                                                    key: "male_with_disability",
                                                    label: "Male w/ Disability",
                                                },
                                                {
                                                    key: "female_without_disability",
                                                    label: "Female w/o Disability",
                                                },
                                                {
                                                    key: "female_with_disability",
                                                    label: "Female w/ Disability",
                                                },
                                                {
                                                    key: "lgbtq_without_disability",
                                                    label: "LGBTQ w/o Disability",
                                                },
                                                {
                                                    key: "lgbtq_with_disability",
                                                    label: "LGBTQ w/ Disability",
                                                },
                                                {
                                                    key: "total",
                                                    label: "Total",
                                                },
                                            ],
                                            columnRenderers: {
                                                number: (row) => (
                                                    <span className="font-semibold text-gray-700">
                                                        {row.number}
                                                    </span>
                                                ),
                                                livelihood_type: (row) => (
                                                    <span className="font-semibold text-gray-700">
                                                        {row.livelihood_type}
                                                    </span>
                                                ),
                                                male_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.male_without_disability
                                                        }
                                                    </span>
                                                ),
                                                male_with_disability: (row) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.male_with_disability
                                                        }
                                                    </span>
                                                ),
                                                female_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.female_without_disability
                                                        }
                                                    </span>
                                                ),
                                                female_with_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.female_with_disability
                                                        }
                                                    </span>
                                                ),
                                                lgbtq_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.lgbtq_without_disability
                                                        }
                                                    </span>
                                                ),
                                                lgbtq_with_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.lgbtq_with_disability
                                                        }
                                                    </span>
                                                ),
                                                total: (row) => (
                                                    <span className="font-semibold text-blue-500">
                                                        {row.total}
                                                    </span>
                                                ),
                                            },
                                            queryParams,
                                            visibleColumns: [
                                                "number",
                                                "livelihood_type",
                                                "male_without_disability",
                                                "male_with_disability",
                                                "female_without_disability",
                                                "female_with_disability",
                                                "lgbtq_without_disability",
                                                "lgbtq_with_disability",
                                                "total",
                                            ],
                                            showTotal: true,
                                            tableHeight: "400px",
                                        }}
                                    >
                                        {" "}
                                        <Button
                                            onClick={handleExport}
                                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
                                        >
                                            <FileSpreadsheet className="w-5 h-5" />
                                            Export Data
                                        </Button>
                                    </TableSection>
                                )}
                            {selectedBarangay &&
                                livelihoodStats.map((barangayRow) => {
                                    const allcolBarangay = [
                                        {
                                            key: "livelihood_type",
                                            label: "Livelihood Type",
                                        },
                                        {
                                            key: "male_without_disability",
                                            label: "Male w/o Disability",
                                        },
                                        {
                                            key: "male_with_disability",
                                            label: "Male w/ Disability",
                                        },
                                        {
                                            key: "female_without_disability",
                                            label: "Female w/o Disability",
                                        },
                                        {
                                            key: "female_with_disability",
                                            label: "Female w/ Disability",
                                        },
                                        {
                                            key: "lgbtq_without_disability",
                                            label: "LGBTQ w/o Disability",
                                        },
                                        {
                                            key: "lgbtq_with_disability",
                                            label: "LGBTQ w/ Disability",
                                        },
                                        {
                                            key: "total",
                                            label: "Total",
                                        },
                                    ];

                                    const colrenderBarangay = {
                                        livelihood_type: (row) => (
                                            <span className="font-semibold text-gray-700">
                                                {row.livelihood_type}
                                            </span>
                                        ),
                                        male_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.male_without_disability}
                                            </span>
                                        ),
                                        male_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.male_with_disability}
                                            </span>
                                        ),
                                        female_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.female_without_disability}
                                            </span>
                                        ),
                                        female_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.female_with_disability}
                                            </span>
                                        ),
                                        lgbtq_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.lgbtq_without_disability}
                                            </span>
                                        ),
                                        lgbtq_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.lgbtq_with_disability}
                                            </span>
                                        ),
                                        total: (row) => (
                                            <span className="font-semibold text-blue-500">
                                                {row.total}
                                            </span>
                                        ),
                                    };

                                    return (
                                        <TableSection
                                            key={`${barangayRow.barangay_name}-${barangayRow.number}`}
                                            icon={<Tractor />}
                                            color="green"
                                            title={`Livelihoods - ${barangayRow.barangay_name}`}
                                            description={`Detailed livelihood statistics for ${barangayRow.barangay_name}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData:
                                                    barangayRow.livelihoods,
                                                allColumns: allcolBarangay,
                                                columnRenderers:
                                                    colrenderBarangay,
                                                queryParams,
                                                visibleColumns:
                                                    allcolBarangay.map(
                                                        (c) => c.key
                                                    ),
                                                showTotal: true,
                                                tableHeight: "400px",
                                            }}
                                        />
                                    );
                                })}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
