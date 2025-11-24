import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Users, Home, FileSpreadsheet } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function PopulationSummary({
    ageGroupsPerBarangay = {},
    purokPerBarangay = {},
    sexPerBarangay = {},
    ageGroups = [],
}) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Population Summary", showOnMobile: true },
    ];

    const hasAgeGroupData = Object.keys(ageGroupsPerBarangay).length > 0;
    const hasPurokData = Object.keys(purokPerBarangay).length > 0;
    const hasSexData = Object.keys(sexPerBarangay).length > 0;

    // Prepare Age Group table
    const ageGroupColumns = [
        { key: "number", label: "No." },
        { key: "barangay_name", label: "Barangay" },
        ...ageGroups.map((ag) => ({ key: ag, label: ag })),
    ];

    const ageGroupRenderers = {};
    ageGroupColumns.forEach((col) => {
        ageGroupRenderers[col.key] = (row) => <span>{row[col.key]}</span>;
    });

    const ageGroupRows = Object.entries(ageGroupsPerBarangay).map(
        ([name, data], index) => ({
            number: index + 1,
            barangay_name: name,
            ...data,
        })
    );

    // Prepare Purok table
    const purokColumns = [
        { key: "number", label: "No." },
        { key: "barangay_name", label: "Barangay" },
        ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
            key: n.toString(),
            label: `Purok ${n}`,
        })),
        { key: "total", label: "Total" },
    ];

    const purokRenderers = {};
    purokColumns.forEach((col) => {
        purokRenderers[col.key] = (row) => <span>{row[col.key]}</span>;
    });

    // Prepare rows
    const purokRows = Object.entries(purokPerBarangay).map(
        ([barangayName, puroks], index) => {
            // Ensure all columns 1-7 exist
            const row = { number: index + 1, barangay_name: barangayName };
            [1, 2, 3, 4, 5, 6, 7].forEach((n) => {
                row[n] = puroks[n] ?? 0;
            });
            row.total =
                puroks.total ??
                Object.values(puroks).reduce((sum, v) => sum + v, 0);
            return row;
        }
    );

    const sexColumns = [
        { key: "number", label: "No." },
        { key: "barangay_name", label: "Barangay" },
        { key: "Male", label: "Male" },
        { key: "Female", label: "Female" },
        { key: "Total", label: "Total" },
    ];
    const sexRenderers = {};
    sexColumns.forEach((col) => {
        sexRenderers[col.key] = (row) => <span>{row[col.key]}</span>;
    });

    const sexRows = Object.entries(sexPerBarangay).map(
        ([name, data], index) => ({
            number: index + 1,
            barangay_name: name,
            ...data,
        })
    );

    const handleExportAgeGroup = () => {
        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/super_admin/statistics/population-summary-export`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };
    const handleExportPurok = () => {
        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/super_admin/statistics/purok-population-summary-export`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };
    const handleExportSex = () => {
        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/super_admin/statistics/sex-population-summary-export`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Population Summary" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full space-y-8">
                    {/* Age Group Table */}
                    {hasAgeGroupData ? (
                        <TableSection
                            icon={<Users />}
                            color="blue"
                            title="Population Summary by Age Group"
                            description="Total population and age group distribution per barangay."
                            tableProps={{
                                component: DynamicTable,
                                passedData: ageGroupRows,
                                allColumns: ageGroupColumns,
                                columnRenderers: ageGroupRenderers,
                                visibleColumns: ageGroupColumns.map(
                                    (c) => c.key
                                ),
                                showTotal: true,
                                tableHeight: "600px",
                            }}
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700 ml-2"
                                onClick={handleExportAgeGroup}
                            >
                                {<FileSpreadsheet />}Export Age Group Summary
                            </Button>
                        </TableSection>
                    ) : (
                        <NoDataPlaceholder tip="No age group data available." />
                    )}

                    {/* Purok Table */}
                    {hasPurokData ? (
                        <TableSection
                            icon={<Home />}
                            color="green"
                            title="Population Summary by Purok"
                            description="Population distribution per purok in each barangay."
                            tableProps={{
                                component: DynamicTable,
                                passedData: purokRows,
                                allColumns: purokColumns,
                                columnRenderers: purokRenderers,
                                visibleColumns: purokColumns.map((c) => c.key),
                                showTotal: true,
                                tableHeight: "600px",
                            }}
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700 ml-2"
                                onClick={handleExportPurok}
                            >
                                {<FileSpreadsheet />}Export Purok Summary
                            </Button>
                        </TableSection>
                    ) : (
                        <NoDataPlaceholder tip="No purok data available." />
                    )}

                    {/* Sex Table */}
                    {hasSexData ? (
                        <TableSection
                            icon={<Users />}
                            color="purple"
                            title="Population Summary by Sex"
                            description="Male and female population per barangay."
                            tableProps={{
                                component: DynamicTable,
                                passedData: sexRows,
                                allColumns: sexColumns,
                                columnRenderers: sexRenderers,
                                visibleColumns: sexColumns.map((c) => c.key),
                                showTotal: true,
                                tableHeight: "600px",
                            }}
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700 ml-2"
                                onClick={handleExportSex}
                            >
                                {<FileSpreadsheet />}Export Sex Summary
                            </Button>
                        </TableSection>
                    ) : (
                        <NoDataPlaceholder tip="No sex distribution data available." />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
