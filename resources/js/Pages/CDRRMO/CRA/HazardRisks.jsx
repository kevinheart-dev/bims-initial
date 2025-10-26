import { useState } from "react";
import { AlertTriangle, BarChart3, FileSpreadsheet } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import { Button } from "@/Components/ui/button";

export default function HazardRiskDashboard({
    hazardRiskData = [],
    overallHazardRiskData = [],
    barangayTopHazards = [],
    barangays = [],
    selectedBarangay,
    queryParams = {},
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.hazardrisks"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        !hazardRiskData?.length && !overallHazardRiskData?.length;

    // =======================
    // 🧮 Columns
    // =======================
    const allColumns = [
        { key: "id", label: "No." },
        { key: "hazard_name", label: "Hazard" },
        { key: "probability_no", label: "Probability" },
        { key: "effect_no", label: "Effect" },
        { key: "management_no", label: "Management" },
        { key: "average_score", label: "Average Score" },
        { key: "basis", label: "Basis" },
    ];

    const [visibleColumns] = useState(allColumns.map((col) => col.key));

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.id}
            </span>
        ),
        barangay_name: (row) => (
            <span className="font-medium text-gray-800">
                {row.barangay_name}
            </span>
        ),
        hazard_name: (row) => (
            <span className="font-semibold text-red-700">
                {row.hazard_name}
            </span>
        ),
        probability_no: (row) => (
            <span className="text-gray-700">{row.probability_no ?? "—"}</span>
        ),
        effect_no: (row) => (
            <span className="text-gray-700">{row.effect_no ?? "—"}</span>
        ),
        management_no: (row) => (
            <span className="text-gray-700">{row.management_no ?? "—"}</span>
        ),
        average_score: (row) => (
            <span
                className={`font-semibold ${
                    row.average_score >= 4
                        ? "text-red-600"
                        : row.average_score >= 3
                        ? "text-orange-500"
                        : "text-green-600"
                }`}
            >
                {Number(row.average_score).toFixed(2)}
            </span>
        ),
        basis: (row) => (
            <span className="text-sm text-gray-600">{row.basis || "—"}</span>
        ),
    };

    const handleExport = () => {
        const year =
            sessionStorage.getItem("cra_year") ||
            selectedYear ||
            new Date().getFullYear();

        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/cdrrmo_admin/cra/top-hazard/pdf?year=${year}`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    // =======================
    // 🧩 Render
    // =======================
    return (
        <AdminLayout>
            <Head title="Hazard Risk Assessment" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder tip="Select a year and barangay to view Hazard Risk data." />
                        </div>
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />

                            {/* --- Barangay-Specific Data --- */}
                            {hazardRiskData?.length > 0 && (
                                <TableSection
                                    icon={<AlertTriangle />}
                                    color="red"
                                    title="Barangay Hazard Risk Assessment"
                                    description="Displays detailed risk scores for each hazard in the selected barangay, including probability, effect, management, and computed average."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: hazardRiskData.flatMap(
                                            (barangay) =>
                                                barangay.hazards.map(
                                                    (hazard, i) => ({
                                                        id: i + 1, // ✅ Ensure this is a clean number
                                                        rank: hazard.rank,
                                                        hazard_name:
                                                            hazard.hazard_name,
                                                        probability_no:
                                                            hazard.probability_no,
                                                        effect_no:
                                                            hazard.effect_no,
                                                        management_no:
                                                            hazard.management_no,
                                                        average_score:
                                                            hazard.average_score,
                                                        basis: hazard.basis,
                                                    })
                                                )
                                        ),
                                        allColumns,
                                        columnRenderers,
                                        queryParams,
                                        visibleColumns,
                                        tableHeight: "500px",
                                    }}
                                />
                            )}

                            {/* --- Overall Aggregated Data --- */}
                            {overallHazardRiskData?.length > 0 && (
                                <TableSection
                                    icon={<BarChart3 />}
                                    color="blue"
                                    title="Overall Hazard Risk Summary"
                                    description="Shows the aggregated average scores per hazard across all barangays for the selected year, including probability, effect, management, and ranking."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: overallHazardRiskData,
                                        allColumns: [
                                            { key: "number", label: "No." },
                                            {
                                                key: "hazard_name",
                                                label: "Hazard",
                                            },
                                            {
                                                key: "avg_probability",
                                                label: "Probability",
                                            },
                                            {
                                                key: "avg_effect",
                                                label: "Effect",
                                            },
                                            {
                                                key: "avg_management",
                                                label: "Management",
                                            },
                                            {
                                                key: "avg_score",
                                                label: "Average",
                                            },
                                            { key: "rank", label: "Rank" },
                                        ],
                                        columnRenderers: {
                                            number: (row) => (
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {row.number}
                                                </span>
                                            ),
                                            hazard_name: (row) => (
                                                <span className="font-medium text-gray-800">
                                                    {row.hazard_name}
                                                </span>
                                            ),
                                            avg_probability: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.avg_probability
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            avg_effect: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.avg_effect
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            avg_management: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.avg_management
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            avg_score: (row) => (
                                                <span
                                                    className={`font-semibold ${
                                                        row.avg_score >= 4
                                                            ? "text-red-600"
                                                            : row.avg_score >= 3
                                                            ? "text-orange-500"
                                                            : "text-green-600"
                                                    }`}
                                                >
                                                    {Number(
                                                        row.avg_score
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            rank: (row) => (
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {row.rank}
                                                </span>
                                            ),
                                        },
                                        visibleColumns: [
                                            "number",
                                            "hazard_name",
                                            "avg_probability",
                                            "avg_effect",
                                            "avg_management",
                                            "avg_score",
                                            "rank",
                                        ],
                                        tableHeight: "450px",
                                    }}
                                >
                                    <Button
                                        onClick={handleExport} // define this function to export your table data
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200"
                                    >
                                        <FileSpreadsheet className="w-5 h-5" />
                                        Export Data
                                    </Button>
                                </TableSection>
                            )}

                            {barangayTopHazards?.length > 0 && (
                                <TableSection
                                    icon={<AlertTriangle />}
                                    color="amber"
                                    title="Top Hazard per Barangay"
                                    description="Lists each barangay with its highest-rated hazard, including probability, effect, management, and computed average score."
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: barangayTopHazards,
                                        allColumns: [
                                            { key: "number", label: "No." },
                                            {
                                                key: "barangay_name",
                                                label: "Barangay",
                                            },
                                            {
                                                key: "top_hazard",
                                                label: "Top Hazard",
                                            },
                                            {
                                                key: "probability_no",
                                                label: "Probability",
                                            },
                                            {
                                                key: "effect_no",
                                                label: "Effect",
                                            },
                                            {
                                                key: "management_no",
                                                label: "Management",
                                            },
                                            {
                                                key: "average_score",
                                                label: "Average Score",
                                            },
                                        ],
                                        columnRenderers: {
                                            number: (row) => (
                                                <span className="text-xs font-semibold text-gray-500">
                                                    {row.number}
                                                </span>
                                            ),
                                            barangay_name: (row) => (
                                                <span className="font-medium text-gray-800">
                                                    {row.barangay_name}
                                                </span>
                                            ),
                                            top_hazard: (row) => (
                                                <span className="font-semibold text-red-700">
                                                    {row.top_hazard}
                                                </span>
                                            ),
                                            probability_no: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.probability_no
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            effect_no: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.effect_no
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            management_no: (row) => (
                                                <span className="text-gray-700">
                                                    {Number(
                                                        row.management_no
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                            average_score: (row) => (
                                                <span
                                                    className={`font-semibold ${
                                                        row.average_score >= 4
                                                            ? "text-red-600"
                                                            : row.average_score >=
                                                              3
                                                            ? "text-orange-500"
                                                            : "text-green-600"
                                                    }`}
                                                >
                                                    {Number(
                                                        row.average_score
                                                    ).toFixed(2)}
                                                </span>
                                            ),
                                        },
                                        visibleColumns: [
                                            "number",
                                            "barangay_name",
                                            "top_hazard",
                                            "probability_no",
                                            "effect_no",
                                            "management_no",
                                            "average_score",
                                        ],
                                        tableHeight: "500px",
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
