import { useState } from "react";
import { Activity, Zap } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function DisasterEffectImpacts({
    disasterEffectsData,
    overallDisasterEffectsData = [],
    barangays = [],
    selectedBarangay,
    tip = null,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isBarangayView = !!selectedBarangay;
    const isBarangayDataNull =
        !disasterEffectsData || disasterEffectsData.length === 0;
    const isOverallDataNull =
        !overallDisasterEffectsData || overallDisasterEffectsData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.effectimpact"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    return (
        <AdminLayout>
            <Head title="Disaster Effect & Impact Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* === CASE 1: OVERALL SUMMARY (no barangay selected) === */}
                    {!isBarangayView ? (
                        isOverallDataNull ? (
                            <NoDataPlaceholder tip="No overall disaster impact data available for the selected year." />
                        ) : (
                            overallDisasterEffectsData.map(
                                (disaster, dIndex) => {
                                    const allColumns = [
                                        {
                                            key: "effect_type",
                                            label: "Effect Type",
                                        },
                                        {
                                            key: "value",
                                            label: "Value",
                                        },
                                        { key: "source", label: "Source" },
                                    ];

                                    const columnRenderers = {
                                        effect_type: (row) => (
                                            <span
                                                className={`${
                                                    row.effect_type ===
                                                    "Total Impact Value"
                                                        ? "font-bold text-gray-900"
                                                        : "text-gray-700"
                                                }`}
                                            >
                                                {row.effect_type}
                                            </span>
                                        ),
                                        value: (row) => (
                                            <span
                                                className={`${
                                                    row.effect_type ===
                                                    "Total Impact Value"
                                                        ? "font-bold text-blue-700"
                                                        : "text-blue-600"
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
                                            e.effect_type ===
                                            "Total Impact Value"
                                    )?.value;

                                    return (
                                        <TableSection
                                            key={dIndex}
                                            icon={<Activity />}
                                            color="blue"
                                            title={`${disaster.disaster_name} (Overall Summary)`}
                                            description={`Total impact value across all barangays: ${totalValue}`}
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
                                }
                            )
                        )
                    ) : // === CASE 2: BARANGAY VIEW ===
                    isBarangayDataNull ? (
                        <NoDataPlaceholder tip="No disaster effect and impact data available for the selected barangay." />
                    ) : (
                        disasterEffectsData.map((barangay, bIndex) => {
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
                                ([disasterId, effectRows], dIndex) => {
                                    const allColumns = [
                                        {
                                            key: "effect_type",
                                            label: "Effect Type",
                                        },
                                        {
                                            key: "value",
                                            label: "Value",
                                        },
                                        { key: "source", label: "Source" },
                                    ];

                                    const columnRenderers = {
                                        effect_type: (row) => (
                                            <span className="text-gray-700">
                                                {row.effect_type}
                                            </span>
                                        ),
                                        value: (row) => (
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
                                        effectRows[0].disaster_name;
                                    const disasterYear = effectRows[0].year;

                                    const totalValue = effectRows.reduce(
                                        (sum, r) => sum + r.value,
                                        0
                                    );
                                    const totalRow = {
                                        disaster_id: null,
                                        disaster_name: null,
                                        year: null,
                                        effect_type: "Total Impact Value",
                                        value: totalValue,
                                        source: "",
                                    };

                                    const rowsWithTotal = [
                                        ...effectRows,
                                        totalRow,
                                    ];

                                    return (
                                        <TableSection
                                            key={`${bIndex}-${disasterId}`}
                                            icon={<Zap />}
                                            color="purple"
                                            title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                            description={`Total impact value: ${totalValue}`}
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
