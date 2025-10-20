import { useState } from "react";
import { Users, Cross, Activity, Home, Key } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function Dashboard({
    livelihoodStats,
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

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-white">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {isDataNull ? (
                        <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {livelihoodStats.map((barangayRow) => {
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
                                        key={barangayRow.number}
                                        icon={<Users />}
                                        color="green"
                                        title={`Livelihoods - ${barangayRow.barangay_name}`}
                                        description={`Detailed livelihood statistics for ${barangayRow.barangay_name}`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: barangayRow.livelihoods,
                                            allColumns: allcolBarangay,
                                            columnRenderers: colrenderBarangay,
                                            queryParams,
                                            visibleColumns: allcolBarangay.map(
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
