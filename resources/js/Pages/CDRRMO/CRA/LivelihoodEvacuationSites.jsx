import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function LivelihoodEvacuationSites({
    livelihoodData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Livelihood Evacuation Sites", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.livelihoodEvacuationSites"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !livelihoodData || livelihoodData.length === 0;

    return (
        <AdminLayout>
            <Head title="Livelihood Evacuation Sites" />
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
                                    "Select a barangay to view livelihood groups and their assigned evacuation sites."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            const tableRows = livelihoodData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .flatMap((barangay, bIndex) =>
                                    barangay.groups.map((group, index) => ({
                                        number: index + 1,
                                        livelihood_type: group.livelihood_type,
                                        evacuation_site: group.evacuation_site,
                                        place_of_origin: group.place_of_origin,
                                        capacity_description:
                                            group.capacity_description,
                                    }))
                                );

                            const allColumns = [
                                { key: "number", label: "No." },
                                {
                                    key: "livelihood_type",
                                    label: "Livelihood Type",
                                },
                                {
                                    key: "evacuation_site",
                                    label: "Evacuation Site",
                                },
                                {
                                    key: "place_of_origin",
                                    label: "Place of Origin",
                                },
                                {
                                    key: "capacity_description",
                                    label: "Capacity Description",
                                },
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
                                    color="orange"
                                    title={`Livelihood Evacuation Sites - Barangay ${selectedBarangayName}`}
                                    description={`Assigned evacuation sites for livelihood groups in this barangay`}
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
