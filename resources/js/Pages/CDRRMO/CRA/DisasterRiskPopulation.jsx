import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { AlertTriangle, FileSpreadsheet, Users } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function DisasterRiskPopulation({
    disasterRiskData = [],
    overallDisasterRiskData = [],
    overallHazardSummary = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Disaster Risk Population", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.disasterpopulation"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay &&
            (!overallDisasterRiskData ||
                overallDisasterRiskData.length === 0)) ||
        (selectedBarangay &&
            (!disasterRiskData ||
                disasterRiskData.filter(
                    (b) => b.barangay_id === selectedBarangay
                ).length === 0));

    const handleExport = () => {
        const year =
            sessionStorage.getItem("cra_year") || new Date().getFullYear();

        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/cdrrmo_admin/cra/disaster-risk-population-summary/pdf?year=${year}`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    const handleExportHazard = (hazardName) => {
        const year =
            sessionStorage.getItem("cra_year") || new Date().getFullYear();
        const baseUrl = window.location.origin;

        // Encode the hazard name to handle spaces/special characters
        const encodedHazard = encodeURIComponent(hazardName);

        const exportUrl = `${baseUrl}/cdrrmo_admin/cra/per-disaster-risk-population-summary/pdf?year=${year}&hazard=${encodedHazard}`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Disaster Risk Population" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* 🟨 Barangay Filter */}
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* 🟦 No data */}
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder
                                tip={
                                    tip ||
                                    "Select a barangay or view overall data from the dropdown above."
                                }
                            />
                        </div>
                    ) : (
                        <>
                            {/* <pre>
                                {JSON.stringify(
                                    overallHazardSummary,
                                    undefined,
                                    3
                                )}
                            </pre> */}
                            {overallHazardSummary.length > 0 && (
                                <TableSection
                                    icon={<Users />}
                                    color="blue"
                                    title="Overall Disaster Risk Population"
                                    description="Total families and individuals affected by each hazard across all barangays."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: overallHazardSummary,
                                        allColumns: [
                                            // changed from allColumns to columns
                                            { key: "no", label: "No." },
                                            {
                                                key: "hazard_name",
                                                label: "Hazard",
                                            },
                                            {
                                                key: "total_families",
                                                label: "Total Families",
                                            },
                                            {
                                                key: "total_individuals",
                                                label: "Total Individuals",
                                            },
                                            {
                                                key: "low_families",
                                                label: "Low Families",
                                            },
                                            {
                                                key: "medium_families",
                                                label: "Medium Families",
                                            },
                                            {
                                                key: "high_families",
                                                label: "High Families",
                                            },
                                            {
                                                key: "low_individuals",
                                                label: "Low Individuals",
                                            },
                                            {
                                                key: "medium_individuals",
                                                label: "Medium Individuals",
                                            },
                                            {
                                                key: "high_individuals",
                                                label: "High Individuals",
                                            },
                                        ],
                                        columnRenderers: {
                                            no: (row) => row.no,
                                            hazard_name: (row) => (
                                                <span className="font-semibold">
                                                    {row.hazard_name}
                                                </span>
                                            ),
                                            total_families: (row) =>
                                                row.total_families,
                                            total_individuals: (row) =>
                                                row.total_individuals,
                                            low_families: (row) =>
                                                row.low_families,
                                            medium_families: (row) =>
                                                row.medium_families,
                                            high_families: (row) =>
                                                row.high_families,
                                            low_individuals: (row) =>
                                                row.low_individuals,
                                            medium_individuals: (row) =>
                                                row.medium_individuals,
                                            high_individuals: (row) =>
                                                row.high_individuals,
                                        },
                                        visibleColumns: [
                                            "no",
                                            "hazard_name",
                                            "total_families",
                                            "total_individuals",
                                            "low_families",
                                            "medium_families",
                                            "high_families",
                                            "low_individuals",
                                            "medium_individuals",
                                            "high_individuals",
                                        ],
                                        showTotal: true,
                                        tableHeight: "500px",
                                    }}
                                >
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={handleExport}
                                        className="bg-green-600 text-white hover:bg-green-700 ml-2"
                                    >
                                        {<FileSpreadsheet />}Export Disaster
                                        Risk Population
                                    </Button>
                                </TableSection>
                            )}

                            {overallDisasterRiskData.length > 0 &&
                                overallDisasterRiskData.map((hazard, index) => (
                                    <TableSection
                                        key={index}
                                        icon={<Users />}
                                        color="blue"
                                        title={`Disaster Risk: ${hazard.hazard_name}`}
                                        description={`Total families and individuals affected by ${hazard.hazard_name} across barangays.`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: hazard.barangays,
                                            allColumns: [
                                                { key: "no", label: "No." },
                                                {
                                                    key: "barangay_name",
                                                    label: "Barangay",
                                                },
                                                {
                                                    key: "total_families",
                                                    label: "Total Families",
                                                },
                                                {
                                                    key: "total_individuals",
                                                    label: "Total Individuals",
                                                },
                                                {
                                                    key: "low_families",
                                                    label: "Low Families",
                                                },
                                                {
                                                    key: "medium_families",
                                                    label: "Medium Families",
                                                },
                                                {
                                                    key: "high_families",
                                                    label: "High Families",
                                                },
                                                {
                                                    key: "low_individuals",
                                                    label: "Low Individuals",
                                                },
                                                {
                                                    key: "medium_individuals",
                                                    label: "Medium Individuals",
                                                },
                                                {
                                                    key: "high_individuals",
                                                    label: "High Individuals",
                                                },
                                            ],
                                            columnRenderers: {
                                                no: (row) => row.no,
                                                barangay_name: (row) => (
                                                    <span className="font-semibold">
                                                        {row.barangay_name}
                                                    </span>
                                                ),
                                                total_families: (row) =>
                                                    row.total_families,
                                                total_individuals: (row) =>
                                                    row.total_individuals,
                                                low_families: (row) =>
                                                    row.low_families,
                                                medium_families: (row) =>
                                                    row.medium_families,
                                                high_families: (row) =>
                                                    row.high_families,
                                                low_individuals: (row) =>
                                                    row.low_individuals,
                                                medium_individuals: (row) =>
                                                    row.medium_individuals,
                                                high_individuals: (row) =>
                                                    row.high_individuals,
                                            },
                                            visibleColumns: [
                                                "no",
                                                "barangay_name",
                                                "total_families",
                                                "total_individuals",
                                                "low_families",
                                                "medium_families",
                                                "high_families",
                                                "low_individuals",
                                                "medium_individuals",
                                                "high_individuals",
                                            ],
                                            showTotal: true,
                                            tableHeight: "500px",
                                        }}
                                    >
                                        {" "}
                                        {/* Add a button in the TableSection footer or header */}
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                variant="destructive" // red style
                                                size="sm"
                                                onClick={() =>
                                                    handleExportHazard(
                                                        hazard.hazard_name
                                                    )
                                                }
                                                className="ml-2"
                                            >
                                                <FileSpreadsheet className="mr-1 h-4 w-4" />
                                                Export {hazard.hazard_name} Data
                                            </Button>
                                        </div>
                                    </TableSection>
                                ))}

                            {/* 🟩 Barangay-specific view */}
                            {disasterRiskData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .map((barangayData) =>
                                    barangayData.hazards.map(
                                        (hazard, hazardIndex) => {
                                            const tableRows = (
                                                hazard.puroks || []
                                            ).map((p) => ({
                                                purok_number:
                                                    p.purok_number ?? "-",
                                                total_families:
                                                    p.total_families ?? 0,
                                                total_individuals:
                                                    p.total_individuals ?? 0,
                                                low_families:
                                                    p.low_families ?? 0,
                                                medium_families:
                                                    p.medium_families ?? 0,
                                                high_families:
                                                    p.high_families ?? 0,
                                                low_individuals:
                                                    p.low_individuals ?? 0,
                                                medium_individuals:
                                                    p.medium_individuals ?? 0,
                                                high_individuals:
                                                    p.high_individuals ?? 0,
                                            }));

                                            const allColumns = [
                                                {
                                                    key: "purok_number",
                                                    label: "Purok",
                                                },
                                                {
                                                    key: "total_families",
                                                    label: "Total Families",
                                                },
                                                {
                                                    key: "total_individuals",
                                                    label: "Total Individuals",
                                                },
                                                {
                                                    key: "low_families",
                                                    label: "Low Families",
                                                },
                                                {
                                                    key: "medium_families",
                                                    label: "Medium Families",
                                                },
                                                {
                                                    key: "high_families",
                                                    label: "High Families",
                                                },
                                                {
                                                    key: "low_individuals",
                                                    label: "Low Individuals",
                                                },
                                                {
                                                    key: "medium_individuals",
                                                    label: "Medium Individuals",
                                                },
                                                {
                                                    key: "high_individuals",
                                                    label: "High Individuals",
                                                },
                                            ];

                                            const columnRenderers = {
                                                purok_number: (row) => (
                                                    <span className="font-semibold">
                                                        {row.purok_number}
                                                    </span>
                                                ),
                                                total_families: (row) => (
                                                    <span>
                                                        {row.total_families}
                                                    </span>
                                                ),
                                                total_individuals: (row) => (
                                                    <span>
                                                        {row.total_individuals}
                                                    </span>
                                                ),
                                                low_families: (row) => (
                                                    <span>
                                                        {row.low_families}
                                                    </span>
                                                ),
                                                medium_families: (row) => (
                                                    <span>
                                                        {row.medium_families}
                                                    </span>
                                                ),
                                                high_families: (row) => (
                                                    <span className="text-red-600 font-semibold">
                                                        {row.high_families}
                                                    </span>
                                                ),
                                                low_individuals: (row) => (
                                                    <span>
                                                        {row.low_individuals}
                                                    </span>
                                                ),
                                                medium_individuals: (row) => (
                                                    <span>
                                                        {row.medium_individuals}
                                                    </span>
                                                ),
                                                high_individuals: (row) => (
                                                    <span className="text-red-600 font-semibold">
                                                        {row.high_individuals}
                                                    </span>
                                                ),
                                            };

                                            return (
                                                <TableSection
                                                    key={`hazard-${hazardIndex}`}
                                                    icon={<AlertTriangle />}
                                                    color="red"
                                                    title={`Disaster Risk Population - ${hazard.hazard_name}`}
                                                    description={`Families and individuals affected by ${hazard.hazard_name} per purok.`}
                                                    tableProps={{
                                                        component: DynamicTable,
                                                        passedData: tableRows,
                                                        allColumns,
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
                                    )
                                )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
