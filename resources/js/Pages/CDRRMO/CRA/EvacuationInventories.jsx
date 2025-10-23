import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function EvacuationInventories({
    inventoryData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Evacuation Inventories", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.evacuationinven"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !inventoryData || inventoryData.length === 0;

    return (
        <AdminLayout>
            <Head title="Evacuation Inventories" />
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
                                    "Select a barangay to view evacuation inventory per purok."
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
                                    barangay.puroks.map((purok, index) => ({
                                        number: index + 1,
                                        purok_number: purok.purok_number,
                                        total_families: purok.total_families,
                                        total_individuals:
                                            purok.total_individuals,
                                        families_at_risk:
                                            purok.families_at_risk,
                                        individuals_at_risk:
                                            purok.individuals_at_risk,
                                        plan_a_center: purok.plan_a_center,
                                        plan_a_capacity_families:
                                            purok.plan_a_capacity_families,
                                        plan_a_capacity_individuals:
                                            purok.plan_a_capacity_individuals,
                                        plan_a_unaccommodated_families:
                                            purok.plan_a_unaccommodated_families,
                                        plan_a_unaccommodated_individuals:
                                            purok.plan_a_unaccommodated_individuals,
                                        plan_b_center: purok.plan_b_center,
                                        plan_b_unaccommodated_families:
                                            purok.plan_b_unaccommodated_families,
                                        plan_b_unaccommodated_individuals:
                                            purok.plan_b_unaccommodated_individuals,
                                        remarks: purok.remarks,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                { key: "purok_number", label: "Purok" },
                                {
                                    key: "total_families",
                                    label: "Total Families",
                                },
                                {
                                    key: "total_individuals",
                                    label: "Total Individuals",
                                },
                                {
                                    key: "families_at_risk",
                                    label: "Families at Risk",
                                },
                                {
                                    key: "individuals_at_risk",
                                    label: "Individuals at Risk",
                                },
                                {
                                    key: "plan_a_center",
                                    label: "Plan A Center",
                                },
                                {
                                    key: "plan_a_capacity_families",
                                    label: "Plan A Families Accommodated",
                                },
                                {
                                    key: "plan_a_capacity_individuals",
                                    label: "Plan A Individuals Accommodated",
                                },
                                {
                                    key: "plan_a_unaccommodated_families",
                                    label: "Plan A Families Unaccommodated",
                                },
                                {
                                    key: "plan_a_unaccommodated_individuals",
                                    label: "Plan A Individuals Unaccommodated",
                                },
                                {
                                    key: "plan_b_center",
                                    label: "Plan B Center",
                                },
                                {
                                    key: "plan_b_unaccommodated_families",
                                    label: "Plan B Families Unaccommodated",
                                },
                                {
                                    key: "plan_b_unaccommodated_individuals",
                                    label: "Plan B Individuals Unaccommodated",
                                },
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
                                    color="blue"
                                    title={`Evacuation Inventory - Barangay ${selectedBarangayName}`}
                                    description={`Evacuation inventory for all Puroks in this barangay`}
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
