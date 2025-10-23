import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function PrepositionedInventories({
    inventoryData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Prepositioned Inventories", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.prepositionedInventories"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !inventoryData || inventoryData.length === 0;

    return (
        <AdminLayout>
            <Head title="Prepositioned Inventories" />
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
                                    "Select a barangay to view prepositioned inventories."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            // Prepare table rows
                            const tableRows = inventoryData
                                .filter(
                                    (b) => b.barangay_id == selectedBarangay
                                )
                                .flatMap((barangay) =>
                                    barangay.items.map((item, index) => ({
                                        number: index + 1,
                                        item_name: item.item_name,
                                        quantity: item.quantity,
                                        remarks: item.remarks,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                { key: "item_name", label: "Item Name" },
                                { key: "quantity", label: "Quantity" },
                                { key: "remarks", label: "Remarks" },
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
                                    color="teal"
                                    title={`Prepositioned Inventories - Barangay ${selectedBarangayName}`}
                                    description={`Prepositioned inventory items for this barangay`}
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
