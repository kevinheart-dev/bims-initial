import { useState } from "react";
import { Building2, Wrench } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

const nf = new Intl.NumberFormat(); // default locale formatting

export default function DamageToProperty({
    damagePropertyData,
    overallDamagePropertyData = [],
    barangays = [],
    selectedBarangay,
    tip = null,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isBarangayView = !!selectedBarangay;
    const isBarangayDataNull =
        !damagePropertyData || damagePropertyData.length === 0;
    const isOverallDataNull =
        !overallDamagePropertyData || overallDamagePropertyData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.damageproperty"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };
    // safely coerce numbers
    const toNumber = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    return (
        <AdminLayout>
            <Head title="Damage to Property Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* === CASE 1: OVERALL SUMMARY === */}
                    {!isBarangayView ? (
                        isOverallDataNull ? (
                            <NoDataPlaceholder tip="No overall property damage data available for the selected year." />
                        ) : (
                            overallDamagePropertyData.map(
                                (disaster, dIndex) => {
                                    const allColumns = [
                                        { key: "category", label: "Category" },
                                        { key: "description", label: "Description" },
                                        { key: "value", label: "Value" },
                                        { key: "source", label: "Source" },
                                    ];

                                    const columnRenderers = {
                                        category: (row) => (
                                            <span className="text-gray-800 font-medium">
                                                {row.category || "—"}
                                            </span>
                                        ),
                                        description: (row) => (
                                            <span className="text-gray-700">
                                                {row.description || "—"}
                                            </span>
                                        ),
                                        value: (row) => (
                                            <span
                                                className={`${row.category === "Total Damage Value"
                                                    ? "font-bold text-red-700"
                                                    : "text-red-600"
                                                    }`}
                                            >
                                                {nf.format(toNumber(row.value))}
                                            </span>
                                        ),
                                        source: (row) => (
                                            <span className="text-gray-700">
                                                {row.source || "—"}
                                            </span>
                                        ),
                                    };

                                    const totalValue = disaster.damages?.reduce(
                                        (sum, r) => sum + toNumber(r.value),
                                        0
                                    );

                                    return (
                                        <TableSection
                                            key={dIndex}
                                            icon={<Building2 />}
                                            color="red"
                                            title={`${disaster.disaster_name} (Overall Summary)`}
                                            description={`Total property damage value across all barangays:${nf.format(
                                                totalValue
                                            )}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: disaster.damages || [],
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
                            )
                        )
                    ) : // === CASE 2: BARANGAY VIEW ===
                        isBarangayDataNull ? (
                            <NoDataPlaceholder tip="No property damage data available for the selected barangay." />
                        ) : (
                            damagePropertyData.map((barangay, bIndex) => {
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
                                            { key: "category", label: "Category" },
                                            { key: "description", label: "Description" },
                                            { key: "value", label: "Value" },
                                            { key: "source", label: "Source" },
                                        ];

                                        const columnRenderers = {
                                            category: (row) => (
                                                <span className="text-gray-800 font-medium">
                                                    {row.category || "—"}
                                                </span>
                                            ),
                                            description: (row) => (
                                                <span className="text-gray-700">
                                                    {row.description || "—"}
                                                </span>
                                            ),
                                            value: (row) => (
                                                <span className="font-bold text-red-600">
                                                    {nf.format(toNumber(row.value))}
                                                </span>
                                            ),
                                            source: (row) => (
                                                <span className="text-gray-700">
                                                    {row.source || "—"}
                                                </span>
                                            ),
                                        };

                                        const disasterName =
                                            damageRows[0].disaster_name;
                                        const disasterYear = damageRows[0].year;
                                        const totalValue = damageRows.reduce(
                                            (sum, r) => sum + toNumber(r.value),
                                            0
                                        );

                                        return (
                                            <TableSection
                                                key={`${bIndex}-${disasterId}`}
                                                icon={<Wrench />}
                                                color="red"
                                                title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                                description={`Total property damage value: ${nf.format(
                                                    totalValue
                                                )}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: damageRows,
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
