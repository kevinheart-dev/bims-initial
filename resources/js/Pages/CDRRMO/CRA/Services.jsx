import { useState } from "react";
import { Users, Bath, Cable, Toilet, Trash, Droplets, } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function Dashboard({
    servicesData,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !servicesData || servicesData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.services"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const categoryMap = {
        "Bath and Wash Area": { icon: <Bath />, color: "blue" },
        "Electricity Source": { icon: <Cable />, color: "yellow" },
        "Toilet": { icon: <Toilet />, color: "purple" },
        "Waste Management": { icon: <Trash />, color: "green" },
        "Water Source": { icon: <Droplets />, color: "blue" },
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
                            {/* <pre>
                                {JSON.stringify(servicesData, undefined, 2)}
                            </pre> */}
                            {servicesData.length > 0 &&
                                // Loop through categories (use the first barangay to get all categories)
                                servicesData[0].categories.map(
                                    (categoryRow, catIndex) => {
                                        // Get all unique service names across barangays for this category
                                        const serviceSet = new Set();
                                        servicesData.forEach((barangayRow) => {
                                            const category =
                                                barangayRow.categories.find(
                                                    (c) =>
                                                        c.category ===
                                                        categoryRow.category
                                                );
                                            if (category) {
                                                category.services.forEach((s) =>
                                                    serviceSet.add(
                                                        s.service_name
                                                    )
                                                );
                                            }
                                        });

                                        const serviceColumns = Array.from(
                                            serviceSet
                                        ).map((serviceName) => ({
                                            key: serviceName,
                                            label: serviceName,
                                        }));

                                        const allColumns = [
                                            {
                                                key: "barangay_name",
                                                label: "Barangay",
                                            },
                                            ...serviceColumns,
                                            { key: "total", label: "Total" },
                                        ];

                                        const rowData = servicesData.map(
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

                                                // Fill each service column
                                                serviceColumns.forEach(
                                                    (col) => {
                                                        const service =
                                                            category?.services.find(
                                                                (s) =>
                                                                    s.service_name ===
                                                                    col.key
                                                            );
                                                        row[col.key] =
                                                            service?.households_quantity ||
                                                            0;
                                                    }
                                                );

                                                return row;
                                            }
                                        );

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
                                            ...serviceColumns.reduce(
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

                                        const category = categoryMap[categoryRow.category] || { icon: <Bath />, color: "gray" };

                                        return (
                                            <TableSection
                                                key={catIndex}
                                                icon={category.icon}
                                                color={category.color}
                                                title={categoryRow.category}
                                                description={`Household services under ${categoryRow.category}`}
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
                                                    tableHeight: "500px",
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
