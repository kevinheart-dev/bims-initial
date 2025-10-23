import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function BdrrmcDirectories({
    directoryData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "BDRRMC Directories", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.bdrrmcDirectories"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !directoryData || directoryData.length === 0;

    return (
        <AdminLayout>
            <Head title="BDRRMC Directories" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* Barangay Filter */}
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* No data */}
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder
                                tip={
                                    tip ||
                                    "Select a barangay to view BDRRMC directory members."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            // Prepare table rows
                            const tableRows = directoryData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .flatMap((barangay) =>
                                    barangay.members.map((member, index) => ({
                                        number: index + 1,
                                        designation_team:
                                            member.designation_team,
                                        name: member.name,
                                        contact_no: member.contact_no,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                {
                                    key: "designation_team",
                                    label: "Designation / Team",
                                },
                                { key: "name", label: "Member Name" },
                                { key: "contact_no", label: "Contact No." },
                            ];

                            const columnRenderers = {};
                            allColumns.forEach((col) => {
                                columnRenderers[col.key] = (row) => (
                                    <span>{row[col.key]}</span>
                                );
                            });

                            return (
                                <TableSection
                                    icon={<Archive />}
                                    color="green"
                                    title={`BDRRMC Directories - Barangay ${selectedBarangayName}`}
                                    description={`List of BDRRMC team members for this barangay`}
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: tableRows,
                                        allColumns,
                                        columnRenderers,
                                        visibleColumns: allColumns.map(
                                            (c) => c.key
                                        ),
                                        showTotal: false,
                                        tableHeight: "700px",
                                    }}
                                />
                            );
                        })()
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
