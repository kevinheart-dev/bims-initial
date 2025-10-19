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
    infraData,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !infraData || infraData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.infraFacilities"),
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
                            {/* <pre>{JSON.stringify(infraData, undefined, 2)}</pre> */}
                            {infraData.length > 0 &&
                                // Loop through categories using the first barangay as reference
                                infraData[0].categories.map(
                                    (categoryRow, catIndex) => {
                                        // Get all unique facilities for this category across barangays
                                        const facilitySet = new Set();
                                        infraData.forEach((barangayRow) => {
                                            const category =
                                                barangayRow.categories.find(
                                                    (c) =>
                                                        c.category ===
                                                        categoryRow.category
                                                );
                                            if (category) {
                                                category.facilities.forEach(
                                                    (f) =>
                                                        facilitySet.add(
                                                            f.infrastructure_name
                                                        )
                                                );
                                            }
                                        });

                                        const facilityColumns = Array.from(
                                            facilitySet
                                        ).map((name) => ({
                                            key: name,
                                            label: name,
                                        }));

                                        const allColumns = [
                                            {
                                                key: "barangay_name",
                                                label: "Barangay",
                                            },
                                            ...facilityColumns,
                                            { key: "total", label: "Total" },
                                        ];

                                        // Prepare row data: one row per barangay
                                        const rowData = infraData.map(
                                            (barangayRow) => {
                                                const category =
                                                    barangayRow.categories.find(
                                                        (c) =>
                                                            c.category ===
                                                            categoryRow.category
                                                    );

                                                const row = {
                                                    number: barangayRow.number,
                                                    barangay_name:
                                                        barangayRow.barangay_name,
                                                    total: category?.total || 0,
                                                };

                                                facilityColumns.forEach(
                                                    (col) => {
                                                        const facility =
                                                            category?.facilities.find(
                                                                (f) =>
                                                                    f.infrastructure_name ===
                                                                    col.key
                                                            );
                                                        row[col.key] =
                                                            facility?.quantity ||
                                                            0;
                                                    }
                                                );

                                                return row;
                                            }
                                        );

                                        // Column renderers
                                        const columnRenderers = {
                                            barangay_name: (row) => (
                                                <span className="font-semibold text-gray-700">
                                                    {row.barangay_name}
                                                </span>
                                            ),
                                            total: (row) => (
                                                <span className="font-bold text-blue-600">
                                                    {row.total}
                                                </span>
                                            ),
                                            ...facilityColumns.reduce(
                                                (acc, col) => {
                                                    acc[col.key] = (row) => (
                                                        <span className="text-gray-700">
                                                            {row[col.key]}
                                                        </span>
                                                    );
                                                    return acc;
                                                },
                                                {}
                                            ),
                                        };

                                        return (
                                            <TableSection
                                                key={catIndex}
                                                icon={<Users />}
                                                color="green"
                                                title={categoryRow.category}
                                                description={`Infrastructure facilities under ${categoryRow.category}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: rowData,
                                                    allColumns: allColumns,
                                                    columnRenderers:
                                                        columnRenderers,
                                                    visibleColumns:
                                                        allColumns.map(
                                                            (c) => c.key
                                                        ),
                                                    showTotal: true,
                                                    tableHeight: "600px",
                                                }}
                                            />
                                        );
                                    }
                                )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
