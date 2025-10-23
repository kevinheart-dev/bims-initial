import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function ReliefDistributions({
    distributionData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Relief Distributions", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.reliefDistributions"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !distributionData || distributionData.length === 0;

    return (
        <AdminLayout>
            <Head title="Relief Distributions" />
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
                                    "Select a barangay to view relief distributions."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            // Prepare table rows
                            const tableRows = distributionData
                                .filter(
                                    (b) => b.barangay_id == selectedBarangay
                                )
                                .flatMap((barangay, index) =>
                                    barangay.items.map((item, i) => ({
                                        number: i + 1,
                                        evacuation_center:
                                            item.evacuation_center,
                                        relief_good: item.relief_good,
                                        quantity: item.quantity,
                                        unit: item.unit,
                                        beneficiaries: item.beneficiaries,
                                        address: item.address,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                {
                                    key: "evacuation_center",
                                    label: "Evacuation Center",
                                },
                                { key: "relief_good", label: "Relief Good" },
                                { key: "quantity", label: "Quantity" },
                                { key: "unit", label: "Unit" },
                                {
                                    key: "beneficiaries",
                                    label: "Beneficiaries",
                                },
                                { key: "address", label: "Address" },
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
                                    title={`Relief Distributions - Barangay ${selectedBarangayName}`}
                                    description={`Relief goods distributed to beneficiaries in this barangay.`}
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: tableRows,
                                        allColumns,
                                        columnRenderers,
                                        visibleColumns: allColumns.map(
                                            (c) => c.key
                                        ),
                                        showTotal: false,
                                        tableHeight: "900px",
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
