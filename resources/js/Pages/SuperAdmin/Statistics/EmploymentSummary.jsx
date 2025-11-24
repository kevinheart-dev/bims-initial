import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Users, FileSpreadsheet } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function EmploymentSummary({
    employmentPerBarangay = {},
    employmentCategories = [],
}) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Employment Summary", showOnMobile: true },
    ];

    // Prepare table data safely
    const employmentRows = Object.entries(employmentPerBarangay)
        .filter(([barangay, data]) => data && typeof data === "object") // remove null/undefined rows
        .map(([barangay, data], index) => ({
            no: barangay === "Total" ? "" : index + 1,
            barangay,
            employed: data.employed ?? 0,
            unemployed: data.unemployed ?? 0,
            self_employed: data.self_employed ?? 0,
            student: data.student ?? 0,
            not_applicable: data.not_applicable ?? 0,
            total: data.total ?? 0,
        }));

    // Columns definition
    const employmentColumns = [
        { key: "no", label: "No." },
        { key: "barangay", label: "Barangay" },
        { key: "employed", label: "EMPLOYED" },
        { key: "unemployed", label: "UNEMPLOYED" },
        { key: "self_employed", label: "SELF EMPLOYED" },
        { key: "student", label: "STUDENT" },
        { key: "not_applicable", label: "NOT APPLICABLE" },
        { key: "total", label: "TOTAL" },
    ];

    // Optional: renderers (if you use them)
    const employmentRenderers = {};
    employmentColumns.forEach((col) => {
        employmentRenderers[col.key] = (row) => (
            <span>{row[col.key] ?? 0}</span>
        );
    });

    const hasData = Object.keys(employmentPerBarangay).length > 0;

    const handleExportEmployment = () => {
        const baseUrl = window.location.origin;
        const exportUrl = `${baseUrl}/super_admin/statistics/employment-summary-export`;

        // 🧾 Open the generated PDF in a new tab
        window.open(exportUrl, "_blank");
    };

    return (
        <AdminLayout>
            <Head title="Employment Summary" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full space-y-8">
                    {hasData ? (
                        <TableSection
                            icon={<Users />}
                            color="blue"
                            title="Employment Summary"
                            description="Employment distribution per barangay."
                            tableProps={{
                                component: DynamicTable,
                                passedData: employmentRows,
                                allColumns: employmentColumns,
                                columnRenderers: employmentRenderers,
                                visibleColumns: employmentColumns.map(
                                    (c) => c.key
                                ),
                                showTotal: true,
                                tableHeight: "800px",
                            }}
                        >
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700 ml-2"
                                onClick={handleExportEmployment}
                            >
                                <FileSpreadsheet /> Export Employment Summary
                            </Button>
                        </TableSection>
                    ) : (
                        <NoDataPlaceholder tip="No employment data available." />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
