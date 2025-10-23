import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function EvacuationPlans({
    planData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Evacuation Plans", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.evacuationPlans"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const selectedBarangayName =
        barangays.find((b) => b.id == selectedBarangay)?.name || "Unknown";

    const isDataNull = !planData || planData.length === 0;

    return (
        <AdminLayout>
            <Head title="Evacuation Plans" />
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
                                    "Select a barangay to view evacuation plans."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            // Prepare table rows
                            const tableRows = planData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .flatMap((barangay) =>
                                    barangay.activities.map(
                                        (activity, index) => ({
                                            activity_no: activity.activity_no,
                                            things_to_do: activity.things_to_do,
                                            responsible_person:
                                                activity.responsible_person,
                                            remarks: activity.remarks,
                                        })
                                    )
                                );

                            const allColumns = [
                                { key: "activity_no", label: "Activity No." },
                                { key: "things_to_do", label: "Things To Do" },
                                {
                                    key: "responsible_person",
                                    label: "Responsible Person",
                                },
                                { key: "remarks", label: "Remarks" },
                            ];
                            const columnRenderers = {};
                            allColumns.forEach((col) => {
                                columnRenderers[col.key] = (row) => (
                                    <span
                                        className={
                                            col.key === "activity_no"
                                                ? "w-16 inline-block"
                                                : ""
                                        }
                                        style={
                                            col.key === "activity_no"
                                                ? { width: "20px" }
                                                : {}
                                        }
                                    >
                                        {row[col.key]}
                                    </span>
                                );
                            });

                            return (
                                <TableSection
                                    icon={<Archive />}
                                    color="blue"
                                    title={`Evacuation Plans - Barangay ${selectedBarangayName}`}
                                    description={`Step-by-step evacuation plans for this barangay`}
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
