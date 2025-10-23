import { useState } from "react";
import { Users, ShieldUser } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function Dashboard({
    disasterImpactsData,
    barangays = [],
    selectedBarangay,
    tip = null,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !disasterImpactsData || disasterImpactsData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.populationimpact"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {!selectedBarangay ? (
                        <div className="flex flex-col items-center justify-center mt-15 bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                            <img
                                src="/images/chart_error.png"
                                alt="No data"
                                className="w-48 h-48 mb-6 animate-bounce"
                            />
                            <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center">
                                No Data Available
                            </h2>
                            <p className="text-gray-700 text-center mb-3 max-w-xl text-base leading-relaxed">
                                To view disaster population impact data, please{" "}
                                <span className="font-bold text-blue-600">
                                    select a barangay
                                </span>{" "}
                                from the dropdown above. Only barangays with
                                recorded disaster impact data for the chosen
                                year will display results.
                            </p>
                            <p className="text-gray-600 text-center mb-6 max-w-xl text-sm italic leading-relaxed">
                                Ensure the data for the selected barangay has
                                been properly recorded in the system. Once
                                selected, the dashboard will display accurate
                                statistics and affected population information.
                            </p>
                            <button
                                onClick={() => router.reload()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg"
                            >
                                Refresh Page
                            </button>
                        </div>
                    ) : isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                        </div>
                    ) : (
                        <>
                            {disasterImpactsData.map((barangay, bIndex) => {
                                // Group disasters by disaster_id
                                const disastersGrouped =
                                    barangay.disasters.reduce((acc, d) => {
                                        if (!acc[d.disaster_id])
                                            acc[d.disaster_id] = [];
                                        acc[d.disaster_id].push(d);
                                        return acc;
                                    }, {});

                                return Object.entries(disastersGrouped).map(
                                    ([disasterId, disasterRows], dIndex) => {
                                        const allColumns = [
                                            {
                                                key: "category",
                                                label: "Category",
                                            },
                                            {
                                                key: "affected",
                                                label: "Affected",
                                            },
                                            { key: "source", label: "Source" },
                                        ];

                                        const columnRenderers = {
                                            category: (row) => (
                                                <span className="text-gray-700">
                                                    {row.category}
                                                </span>
                                            ),
                                            affected: (row) => (
                                                <span className="font-bold text-blue-600">
                                                    {row.value}
                                                </span>
                                            ),
                                            source: (row) => (
                                                <span className="text-gray-700">
                                                    {row.source}
                                                </span>
                                            ),
                                        };

                                        const disasterName =
                                            disasterRows[0].disaster_name;
                                        const disasterYear =
                                            disasterRows[0].year;

                                        // Compute TOTAL row
                                        const totalValue = disasterRows.reduce(
                                            (sum, r) => sum + r.value,
                                            0
                                        );
                                        const totalRow = {
                                            disaster_id: null,
                                            disaster_name: null,
                                            year: null,
                                            category: "Total Affected",
                                            value: totalValue,
                                            source: "",
                                        };

                                        // Append TOTAL row
                                        const rowsWithTotal = [
                                            ...disasterRows,
                                            totalRow,
                                        ];

                                        return (
                                            <TableSection
                                                key={`${bIndex}-${disasterId}`}
                                                icon={<ShieldUser />}
                                                color="green"
                                                title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                                description={`Total affected: ${totalValue}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: rowsWithTotal,
                                                    allColumns,
                                                    columnRenderers,
                                                    visibleColumns:
                                                        allColumns.map(
                                                            (c) => c.key
                                                        ),
                                                    showTotal: true,
                                                    tableHeight: "400px",
                                                }}
                                            />
                                        );
                                    }
                                );
                            })}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
