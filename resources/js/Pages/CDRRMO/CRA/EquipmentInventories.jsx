import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function EquipmentInventories({
    inventoryData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Equipment Inventories", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.equipmentInventories"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !inventoryData || inventoryData.length === 0;

    return (
        <AdminLayout>
            <Head title="Equipment Inventories" />
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
                                    "Select a barangay to view equipment inventories."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            // Prepare table rows
                            const tableRows = inventoryData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .flatMap((barangay) =>
                                    barangay.items.map((item, index) => ({
                                        number: index + 1,
                                        item: item.item,
                                        availability: item.availability,
                                        quantity: item.quantity,
                                        location: item.location,
                                        remarks: item.remarks,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                { key: "item", label: "Item" },
                                { key: "availability", label: "Availability" },
                                { key: "quantity", label: "Quantity" },
                                { key: "location", label: "Location" },
                                { key: "remarks", label: "Remarks" },
                            ];

                            const columnRenderers = {};
                            allColumns.forEach((col) => {
                                columnRenderers[col.key] = (row) => {
                                    // Optionally color-code availability
                                    if (col.key === "availability") {
                                        return (
                                            <span
                                                className={
                                                    row.availability ===
                                                    "checked"
                                                        ? "text-green-600 font-bold"
                                                        : "text-red-600 font-bold"
                                                }
                                            >
                                                {row.availability === "checked"
                                                    ? "✓"
                                                    : "✗"}
                                            </span>
                                        );
                                    }
                                    return <span>{row[col.key]}</span>;
                                };
                            });

                            return (
                                <TableSection
                                    icon={<Archive />}
                                    color="teal"
                                    title={`Equipment Inventories - Barangay ${selectedBarangayName}`}
                                    description={`List of equipment and resources available in this barangay`}
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
