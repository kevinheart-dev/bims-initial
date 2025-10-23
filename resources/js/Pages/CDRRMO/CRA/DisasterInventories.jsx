import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function DisasterInventories({
    inventoryData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Disaster Inventories", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.disasterinventory"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull = !inventoryData || inventoryData.length === 0;

    return (
        <AdminLayout>
            <Head title="Disaster Inventories" />
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
                                    "Select a barangay to view disaster inventory data."
                                }
                            />
                        </div>
                    ) : (
                        // Render barangay-specific data
                        // <pre>{JSON.stringify(inventoryData, undefined, 3)}</pre>
                        inventoryData
                            .filter((b) => b.barangay_id === selectedBarangay)
                            .map((barangayData) =>
                                barangayData.hazards.map(
                                    (hazard, hazardIndex) => {
                                        const tableRows = hazard.items.map(
                                            (item) => ({
                                                category: item.category,
                                                item_name: item.item_name,
                                                total_in_barangay:
                                                    item.total_in_barangay ?? 0,
                                                percentage_at_risk:
                                                    item.percentage_at_risk ??
                                                    "0%",
                                                location: item.location ?? "-",
                                            })
                                        );

                                        const allColumns = [
                                            {
                                                key: "category",
                                                label: "Category",
                                            },
                                            {
                                                key: "item_name",
                                                label: "Item Name",
                                            },
                                            {
                                                key: "total_in_barangay",
                                                label: "Total in Barangay",
                                            },
                                            {
                                                key: "percentage_at_risk",
                                                label: "Percentage at Risk",
                                            },
                                            {
                                                key: "location",
                                                label: "Location",
                                            },
                                        ];

                                        const columnRenderers = {
                                            category: (row) => (
                                                <span className="font-semibold">
                                                    {row.category}
                                                </span>
                                            ),
                                            item_name: (row) => (
                                                <span>{row.item_name}</span>
                                            ),
                                            total_in_barangay: (row) => (
                                                <span>
                                                    {row.total_in_barangay}
                                                </span>
                                            ),
                                            percentage_at_risk: (row) => (
                                                <span
                                                    className={
                                                        row.percentage_at_risk &&
                                                        parseInt(
                                                            row.percentage_at_risk
                                                        ) >= 5
                                                            ? "text-red-600 font-semibold"
                                                            : ""
                                                    }
                                                >
                                                    {row.percentage_at_risk}
                                                </span>
                                            ),
                                            location: (row) => (
                                                <span>{row.location}</span>
                                            ),
                                        };

                                        return (
                                            <TableSection
                                                key={`hazard-${hazardIndex}`}
                                                icon={<Archive />}
                                                color="red"
                                                title={`Disaster Inventory - ${hazard.hazard_name}`}
                                                description={`Items affected by ${hazard.hazard_name} per category.`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: tableRows,
                                                    allColumns,
                                                    columnRenderers,
                                                    visibleColumns:
                                                        allColumns.map(
                                                            (c) => c.key
                                                        ),
                                                    showTotal: false,
                                                    tableHeight: "500px",
                                                }}
                                            />
                                        );
                                    }
                                )
                            )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
