import { useState } from "react";
import { Activity, HeartPulse } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

const nf = new Intl.NumberFormat();

export default function DisasterLifelines({
    disasterLifelineData,
    overallDisasterLifelineData = [],
    barangays = [],
    selectedBarangay,
    tip = null,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    console.log(overallDisasterLifelineData);

    // const isBarangayView = !!selectedBarangay;
    // const isBarangayDataNull = !disasterLifelineData || disasterLifelineData.length === 0;
    // const isOverallDataNull =
    //     !overallDisasterLifelineData || overallDisasterLifelineData.length === 0;

    // const handleBarangayChange = (e) => {
    //     const barangayId = e.target.value;
    //     router.get(
    //         route("cdrrmo_admin.disasterlifelines"),
    //         barangayId ? { barangay_id: barangayId } : {}
    //     );
    // };

    // const toNumber = (v) => {
    //     const n = Number(v);
    //     return Number.isFinite(n) ? n : 0;
    // };

    return (
        <AdminLayout>
            <Head title="Disaster Lifelines Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <p>LARGE DATA SET HIRAP I LOAD</p>

            {/* <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />


                    {!isBarangayView ? (
                        isOverallDataNull ? (
                            <NoDataPlaceholder tip="No overall disaster lifeline data available for the selected year." />
                        ) : (
                            overallDisasterLifelineData.map((disaster, dIndex) => {
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
                                        <span className="text-blue-700 font-semibold">
                                            {nf.format(toNumber(row.value))}
                                        </span>
                                    ),
                                    source: (row) => (
                                        <span className="text-gray-700">
                                            {row.source || "—"}
                                        </span>
                                    ),
                                };

                                const totalValue = disaster.lifelines?.reduce(
                                    (sum, r) => sum + toNumber(r.value),
                                    0
                                );

                                return (
                                    <TableSection
                                        key={dIndex}
                                        icon={<Activity />}
                                        color="blue"
                                        title={`${disaster.disaster_name} (Overall Summary)`}
                                        description={`Total lifeline impact value across all barangays: ${nf.format(
                                            totalValue
                                        )}`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: disaster.lifelines || [],
                                            allColumns,
                                            columnRenderers,
                                            visibleColumns: allColumns.map((c) => c.key),
                                            showTotal: true,
                                            tableHeight: "400px",
                                        }}
                                    />
                                );
                            })
                        )
                    ) :
                        isBarangayDataNull ? (
                            <NoDataPlaceholder tip="No disaster lifeline data available for the selected barangay." />
                        ) : (
                            disasterLifelineData.map((barangay, bIndex) => {
                                const disastersGrouped = barangay.disasters.reduce(
                                    (acc, d) => {
                                        if (!acc[d.disaster_id]) acc[d.disaster_id] = [];
                                        acc[d.disaster_id].push(d);
                                        return acc;
                                    },
                                    {}
                                );

                                return Object.entries(disastersGrouped).map(
                                    ([disasterId, lifelineRows], dIndex) => {
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
                                                <span className="font-bold text-blue-700">
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
                                            lifelineRows[0].disaster_name;
                                        const disasterYear = lifelineRows[0].year;
                                        const totalValue = lifelineRows.reduce(
                                            (sum, r) => sum + toNumber(r.value),
                                            0
                                        );

                                        return (
                                            <TableSection
                                                key={`${bIndex}-${disasterId}`}
                                                icon={<HeartPulse />}
                                                color="blue"
                                                title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                                description={`Total lifeline impact value: ${nf.format(
                                                    totalValue
                                                )}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: lifelineRows,
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
            </div> */}
        </AdminLayout>
    );
}
