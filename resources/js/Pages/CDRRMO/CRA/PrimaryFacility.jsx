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
    primaryFacilitiesData,
    publicTransportData,
    roadNetworksData,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull =
        !primaryFacilitiesData || primaryFacilitiesData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.primaryFacilities"),
            barangayId ? { barangay_id: barangayId } : {}
        );
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
                                {JSON.stringify(roadNetworksData, undefined, 3)}
                            </pre> */}
                            {primaryFacilitiesData.length > 0 &&
                                (() => {
                                    // Collect all unique facility names across barangays
                                    const facilitySet = new Set();
                                    primaryFacilitiesData.forEach(
                                        (barangay) => {
                                            barangay.facilities.forEach((f) =>
                                                facilitySet.add(f.facility_name)
                                            );
                                        }
                                    );
                                    const facilityColumns = Array.from(
                                        facilitySet
                                    ).map((name) => ({
                                        key: name,
                                        label: name,
                                    }));

                                    // Table columns: number, barangay_name, all facilities, total
                                    const allColumns = [
                                        { key: "number", label: "#" },
                                        {
                                            key: "barangay_name",
                                            label: "Barangay",
                                        },
                                        ...facilityColumns,
                                        { key: "total", label: "Total" },
                                    ];

                                    // Prepare row data
                                    let rowData = primaryFacilitiesData.map(
                                        (barangay) => {
                                            const row = {
                                                number: barangay.number,
                                                barangay_name:
                                                    barangay.barangay_name,
                                                total: barangay.total,
                                            };

                                            facilityColumns.forEach((col) => {
                                                const facility =
                                                    barangay.facilities.find(
                                                        (f) =>
                                                            f.facility_name ===
                                                            col.key
                                                    );
                                                row[col.key] =
                                                    facility?.quantity || 0;
                                            });

                                            return row;
                                        }
                                    );

                                    // --- Append TOTAL row if no specific barangay is selected ---
                                    if (!selectedBarangay) {
                                        const totalRow = {
                                            number: null,
                                            barangay_name: "TOTAL",
                                            total: rowData.reduce(
                                                (sum, r) => sum + r.total,
                                                0
                                            ),
                                        };

                                        facilityColumns.forEach((col) => {
                                            totalRow[col.key] = rowData.reduce(
                                                (sum, r) => sum + r[col.key],
                                                0
                                            );
                                        });

                                        rowData.push(totalRow);
                                    }

                                    // Column renderers
                                    const columnRenderers = {
                                        number: (row) => (
                                            <span className="text-gray-700">
                                                {row.number}
                                            </span>
                                        ),
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
                                            key="primary-facilities"
                                            icon={<Users />}
                                            color="green"
                                            title="Primary Facilities"
                                            description="List of primary facilities per barangay"
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rowData,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "500px",
                                            }}
                                        />
                                    );
                                })()}

                            {publicTransportData.length > 0 &&
                                (() => {
                                    // Collect all unique transport types across all barangays
                                    const transpoSet = new Set();
                                    publicTransportData.forEach((b) =>
                                        b.transportations.forEach((t) =>
                                            transpoSet.add(t.transpo_type)
                                        )
                                    );
                                    const transpoColumns = Array.from(
                                        transpoSet
                                    ).map((type) => ({
                                        key: type,
                                        label: type,
                                    }));

                                    const allColumns = [
                                        { key: "number", label: "#" },
                                        {
                                            key: "barangay_name",
                                            label: "Barangay",
                                        },
                                        ...transpoColumns,
                                        { key: "total", label: "Total" },
                                    ];

                                    // Prepare row data
                                    let rowData = publicTransportData.map(
                                        (b) => {
                                            const row = {
                                                number: b.number,
                                                barangay_name: b.barangay_name,
                                                total: b.total,
                                            };
                                            transpoColumns.forEach((col) => {
                                                const transport =
                                                    b.transportations.find(
                                                        (t) =>
                                                            t.transpo_type ===
                                                            col.key
                                                    );
                                                row[col.key] =
                                                    transport?.quantity || 0;
                                            });
                                            return row;
                                        }
                                    );

                                    // --- Append TOTAL row if no specific barangay is selected ---
                                    if (!selectedBarangay) {
                                        const totalRow = {
                                            number: null,
                                            barangay_name: "TOTAL",
                                            total: rowData.reduce(
                                                (sum, r) => sum + r.total,
                                                0
                                            ),
                                        };
                                        transpoColumns.forEach((col) => {
                                            totalRow[col.key] = rowData.reduce(
                                                (sum, r) => sum + r[col.key],
                                                0
                                            );
                                        });
                                        rowData.push(totalRow);
                                    }

                                    // Column renderers
                                    const columnRenderers = {
                                        number: (row) => (
                                            <span className="text-gray-700">
                                                {row.number}
                                            </span>
                                        ),
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
                                        ...transpoColumns.reduce((acc, col) => {
                                            acc[col.key] = (row) => (
                                                <span className="text-gray-700">
                                                    {row[col.key]}
                                                </span>
                                            );
                                            return acc;
                                        }, {}),
                                    };

                                    return (
                                        <TableSection
                                            key="public-transport"
                                            icon={<Users />}
                                            color="green"
                                            title="Public Transportations"
                                            description="Quantity of available public transport per barangay"
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rowData,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "500px",
                                            }}
                                        />
                                    );
                                })()}

                            {roadNetworksData.length > 0 &&
                                (() => {
                                    // Collect all unique road types across barangays
                                    const roadTypeSet = new Set();
                                    roadNetworksData.forEach((b) =>
                                        b.roads.forEach((r) =>
                                            roadTypeSet.add(r.road_type)
                                        )
                                    );
                                    const roadColumns = Array.from(
                                        roadTypeSet
                                    ).map((type) => ({
                                        key: type,
                                        label: type,
                                    }));

                                    // Table columns: number, barangay_name, all road types, total length
                                    const allColumns = [
                                        { key: "number", label: "#" },
                                        {
                                            key: "barangay_name",
                                            label: "Barangay",
                                        },
                                        ...roadColumns,
                                        {
                                            key: "total_length",
                                            label: "Total Length (km)",
                                        },
                                    ];

                                    // Prepare row data
                                    const rowData = roadNetworksData.map(
                                        (b) => {
                                            const row = {
                                                number: b.number,
                                                barangay_name: b.barangay_name,
                                                total_length: b.total_length,
                                            };
                                            roadColumns.forEach((col) => {
                                                const road = b.roads.find(
                                                    (r) =>
                                                        r.road_type === col.key
                                                );
                                                row[col.key] =
                                                    road?.length_km || 0;
                                            });
                                            return row;
                                        }
                                    );

                                    // Column renderers
                                    const columnRenderers = {
                                        number: (row) => (
                                            <span className="text-gray-700">
                                                {row.number}
                                            </span>
                                        ),
                                        barangay_name: (row) => (
                                            <span className="font-semibold text-gray-700">
                                                {row.barangay_name}
                                            </span>
                                        ),
                                        total_length: (row) => (
                                            <span className="font-bold text-blue-600">
                                                {Number(
                                                    row.total_length
                                                ).toFixed(2)}{" "}
                                                km
                                            </span>
                                        ),
                                        ...roadColumns.reduce((acc, col) => {
                                            acc[col.key] = (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row[col.key]
                                                    ).toFixed(2)}{" "}
                                                    km
                                                </span>
                                            );
                                            return acc;
                                        }, {}),
                                    };

                                    return (
                                        <TableSection
                                            key="road-networks"
                                            icon={<Users />}
                                            color="green"
                                            title="Road Networks"
                                            description="Length of different road types per barangay"
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rowData,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "500px",
                                            }}
                                        />
                                    );
                                })()}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
