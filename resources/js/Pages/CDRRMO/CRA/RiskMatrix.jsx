import { useState } from "react";
import { ShieldAlert, BarChart3, Table, FileSpreadsheet } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import { Button } from "@/Components/ui/button";

export default function RiskMatrixDashboard({
    riskMatrixData = [],
    overallRiskMatrixData = [],
    overallHazardSummary = [],
    barangays = [],
    selectedBarangay,
    queryParams = {},
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.riskmatrix"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay &&
            overallHazardSummary.length === 0 &&
            overallRiskMatrixData.length === 0) ||
        (selectedBarangay && riskMatrixData.length === 0);

    const handleExport = () => {
        const year =
            sessionStorage.getItem("cra_year") || new Date().getFullYear();

        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/cdrrmo_admin/cra/risk-assessment-summary/pdf?year=${year}`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Risk Matrix Assessment" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder tip="Select a barangay to view Risk Matrix data." />
                        </div>
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />

                            {riskMatrixData?.length > 0 &&
                                riskMatrixData.map((barangay, i) => (
                                    <TableSection
                                        key={i}
                                        icon={<ShieldAlert />}
                                        color="rose"
                                        title={`Hazard Risk Assessment Matrix - ${barangay.barangay_name}`}
                                        description="Displays the detailed risk assessment for each identified hazard in the selected barangay, including people, properties, services, environment, and livelihood impact levels."
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: barangay.hazards,
                                            allColumns: [
                                                { key: "no", label: "No." },
                                                {
                                                    key: "hazard_name",
                                                    label: "Hazard",
                                                },
                                                {
                                                    key: "people",
                                                    label: "People Affected",
                                                },
                                                {
                                                    key: "properties",
                                                    label: "Properties",
                                                },
                                                {
                                                    key: "services",
                                                    label: "Services",
                                                },
                                                {
                                                    key: "environment",
                                                    label: "Environment",
                                                },
                                                {
                                                    key: "livelihood",
                                                    label: "Livelihood",
                                                },
                                            ],
                                            columnRenderers: {
                                                no: (row) => (
                                                    <span className="text-xs font-semibold text-gray-500">
                                                        {row.no}
                                                    </span>
                                                ),
                                                hazard_name: (row) => (
                                                    <span className="font-medium text-gray-800">
                                                        {row.hazard_name}
                                                    </span>
                                                ),
                                                people: (row) => (
                                                    <span className="text-gray-700">
                                                        {Number(
                                                            row.people || 0
                                                        ).toLocaleString()}
                                                    </span>
                                                ),
                                                properties: (row) => (
                                                    <span className="text-gray-700">
                                                        {row.properties}
                                                    </span>
                                                ),
                                                services: (row) => (
                                                    <span className="text-gray-700">
                                                        {row.services}
                                                    </span>
                                                ),
                                                environment: (row) => (
                                                    <span className="text-gray-700">
                                                        {row.environment}
                                                    </span>
                                                ),
                                                livelihood: (row) => (
                                                    <span className="text-gray-700">
                                                        {row.livelihood}
                                                    </span>
                                                ),
                                            },
                                            visibleColumns: [
                                                "no",
                                                "hazard_name",
                                                "people",
                                                "properties",
                                                "services",
                                                "environment",
                                                "livelihood",
                                            ],
                                            tableHeight: "480px",
                                        }}
                                    />
                                ))}

                            {overallHazardSummary?.length > 0 && (
                                <TableSection
                                    icon={<BarChart3 />}
                                    color="indigo"
                                    title="Overall Hazard Risk Summary"
                                    description="Summarizes the overall risk level of each hazard across all barangays, showing the total number of people affected and their corresponding overall rank."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: overallHazardSummary,
                                        allColumns: [
                                            { key: "no", label: "No." },
                                            {
                                                key: "hazard_name",
                                                label: "Hazard",
                                            },
                                            {
                                                key: "total_people",
                                                label: "Total People Affected",
                                            },
                                            {
                                                key: "overall_rank",
                                                label: "Overall Rank",
                                            },
                                        ],
                                        columnRenderers: {
                                            no: (row) => (
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {row.no}
                                                </span>
                                            ),
                                            hazard_name: (row) => (
                                                <span className="font-medium text-gray-800">
                                                    {row.hazard_name}
                                                </span>
                                            ),
                                            total_people: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.total_people
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            overall_rank: (row) => (
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {row.overall_rank}
                                                </span>
                                            ),
                                        },
                                        visibleColumns: [
                                            "no",
                                            "hazard_name",
                                            "total_people",
                                            "overall_rank",
                                        ],
                                        tableHeight: "450px",
                                    }}
                                />
                            )}

                            {overallRiskMatrixData?.length > 0 && (
                                <TableSection
                                    icon={<Table />}
                                    color="emerald"
                                    title="Barangay Hazard Risk Summary Matrix"
                                    description="Displays the summarized hazard risk levels per barangay, showing the number of people affected by each hazard type and their corresponding overall rank based on total population exposure."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: overallRiskMatrixData,
                                        allColumns: [
                                            { key: "no", label: "No." },
                                            {
                                                key: "barangay_name",
                                                label: "Barangay Name",
                                            },
                                            { key: "Flood", label: "Flood" },
                                            {
                                                key: "Earthquake",
                                                label: "Earthquake",
                                            },
                                            {
                                                key: "Rain-induced Landslide",
                                                label: "Rain-Induced Landslide",
                                            },
                                            { key: "Fire", label: "Fire" },
                                            {
                                                key: "Typhoon",
                                                label: "Typhoon",
                                            },
                                            {
                                                key: "Drought",
                                                label: "Drought",
                                            },
                                            {
                                                key: "Pandemic/Emerging and Re-emerging Diseases",
                                                label: "Pandemic / Emerging and Re-emerging Diseases",
                                            },
                                            {
                                                key: "total_people",
                                                label: "Total People",
                                            },
                                            {
                                                key: "overall_rank",
                                                label: "Overall Rank",
                                            },
                                        ],
                                        columnRenderers: {
                                            no: (row) => (
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {row.no}
                                                </span>
                                            ),
                                            barangay_name: (row) => (
                                                <span className="font-medium text-gray-800">
                                                    {row.barangay_name}
                                                </span>
                                            ),
                                            Flood: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.Flood || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            Earthquake: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.Earthquake || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            ["Rain-induced Landslide"]: (
                                                row
                                            ) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row[
                                                            "Rain-induced Landslide"
                                                        ] || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            Fire: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.Fire || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            Typhoon: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.Typhoon || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            Drought: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.Drought || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            ["Pandemic/Emerging and Re-emerging Diseases"]:
                                                (row) => (
                                                    <span className="text-gray-700">
                                                        {Number(
                                                            row[
                                                                "Pandemic/Emerging and Re-emerging Diseases"
                                                            ] || 0
                                                        ).toLocaleString()}
                                                    </span>
                                                ),
                                            total_people: (row) => (
                                                <span className="font-semibold text-gray-800">
                                                    {Number(
                                                        row.total_people || 0
                                                    ).toLocaleString()}
                                                </span>
                                            ),
                                            overall_rank: (row) => (
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {row.overall_rank}
                                                </span>
                                            ),
                                        },
                                        visibleColumns: [
                                            "no",
                                            "barangay_name",
                                            "Flood",
                                            "Earthquake",
                                            "Rain-induced Landslide",
                                            "Fire",
                                            "Typhoon",
                                            "Drought",
                                            "Pandemic/Emerging and Re-emerging Diseases",
                                            "total_people",
                                            "overall_rank",
                                        ],
                                        tableHeight: "500px",
                                    }}
                                >
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={handleExport}
                                        className="bg-green-600 text-white hover:bg-green-700 ml-2"
                                    >
                                        {<FileSpreadsheet />}Export Risk
                                        Assessment Summary
                                    </Button>
                                </TableSection>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
