import { useState } from "react";
import { Sprout, Wheat } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function DisasterAgriDamage({
    disasterAgriData,
    overallDisasterAgriData = [],
    barangays = [],
    selectedBarangay,
    tip = null,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isBarangayView = !!selectedBarangay;
    const isBarangayDataNull =
        !disasterAgriData || disasterAgriData.length === 0;
    const isOverallDataNull =
        !overallDisasterAgriData || overallDisasterAgriData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.damageagri"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    return (
        <AdminLayout>
            <Head title="Agricultural Damages Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* Barangay Filter */}
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* === CASE 1: OVERALL SUMMARY (no barangay selected) === */}
                    {!isBarangayView ? (
                        isOverallDataNull ? (
                            <NoDataPlaceholder tip="No overall agricultural damage data available for the selected year." />
                        ) : (
                            overallDisasterAgriData.map((disaster, dIndex) => {
                                const allColumns = [
                                    { key: "description", label: "Description" },
                                    { key: "value", label: "Value" },
                                    { key: "source", label: "Source" },
                                ];

                                const columnRenderers = {
                                    description: (row) => (
                                        <span
                                            className={`${row.description ===
                                                "Total Damage Value"
                                                ? "font-bold text-gray-900"
                                                : "text-gray-700"
                                                }`}
                                        >
                                            {row.description}
                                        </span>
                                    ),
                                    value: (row) => (
                                        <span
                                            className={`${row.description ===
                                                "Total Damage Value"
                                                ? "font-bold text-green-700"
                                                : "text-green-600"
                                                }`}
                                        >
                                            {row.value}
                                        </span>
                                    ),
                                    source: (row) => (
                                        <span className="text-gray-700">
                                            {row.source || "—"}
                                        </span>
                                    ),
                                };

                                const totalValue = disaster.effects.find(
                                    (e) =>
                                        e.description === "Total Damage Value"
                                )?.value;

                                return (
                                    <TableSection
                                        key={dIndex}
                                        icon={<Wheat />}
                                        color="green"
                                        title={`${disaster.disaster_name} (Overall Agricultural Damages)`}
                                        description={`Total damage value across all barangays: ${totalValue}`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: disaster.effects,
                                            allColumns,
                                            columnRenderers,
                                            visibleColumns: allColumns.map(
                                                (c) => c.key
                                            ),
                                            showTotal: true,
                                            tableHeight: "400px",
                                        }}
                                    />
                                );
                            })
                        )
                    ) : // === CASE 2: BARANGAY VIEW ===
                        isBarangayDataNull ? (
                            <NoDataPlaceholder tip="No agricultural damage data available for the selected barangay." />
                        ) : (
                            disasterAgriData.map((barangay, bIndex) => {
                                const disastersGrouped = barangay.disasters.reduce(
                                    (acc, d) => {
                                        if (!acc[d.disaster_id])
                                            acc[d.disaster_id] = [];
                                        acc[d.disaster_id].push(d);
                                        return acc;
                                    },
                                    {}
                                );

                                return Object.entries(disastersGrouped).map(
                                    ([disasterId, damageRows], dIndex) => {
                                        const allColumns = [
                                            {
                                                key: "description",
                                                label: "Description",
                                            },
                                            { key: "value", label: "Value" },
                                            { key: "source", label: "Source" },
                                        ];

                                        const columnRenderers = {
                                            description: (row) => (
                                                <span className="text-gray-700">
                                                    {row.description}
                                                </span>
                                            ),
                                            value: (row) => (
                                                <span className="font-bold text-green-600">
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
                                            damageRows[0].disaster_name;
                                        const disasterYear = damageRows[0].year;

                                        const totalValue = damageRows.reduce(
                                            (sum, r) => sum + r.value,
                                            0
                                        );
                                        const totalRow = {
                                            disaster_id: null,
                                            disaster_name: null,
                                            year: null,
                                            description: "Total Damage Value",
                                            value: totalValue,
                                            source: "",
                                        };

                                        const rowsWithTotal = [
                                            ...damageRows,
                                            totalRow,
                                        ];

                                        return (
                                            <TableSection
                                                key={`${bIndex}-${disasterId}`}
                                                icon={<Sprout />}
                                                color="emerald"
                                                title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                                description={`Total damage value: ${totalValue}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: rowsWithTotal,
                                                    allColumns,
                                                    columnRenderers,
                                                    visibleColumns: allColumns.map(
                                                        (c) => c.key
                                                    ),
                                                    showTotal: true,
                                                    tableHeight: "400px",
                                                }}
                                            />
                                        );
                                    }
                                );
                            })
                        )}
                </div>
            </div>
        </AdminLayout>
    );
}
