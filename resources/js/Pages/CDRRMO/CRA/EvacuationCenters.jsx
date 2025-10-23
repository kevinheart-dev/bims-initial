import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function EvacuationCenters({
    centerData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Evacuation Centers", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.evacuationcenters"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull = !centerData || centerData.length === 0;

    return (
        <AdminLayout>
            <Head title="Evacuation Centers" />
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
                                    "Select a barangay to view evacuation centers."
                                }
                            />
                        </div>
                    ) : (
                        centerData
                            .filter((b) => b.barangay_id === selectedBarangay)
                            .map((barangay) => {
                                const tableRows = barangay.centers.map(
                                    (center) => ({
                                        number: center.number,
                                        name: center.name,
                                        capacity_families:
                                            center.capacity_families,
                                        capacity_individuals:
                                            center.capacity_individuals,
                                        owner_type: center.owner_type,
                                        inspected_by_engineer:
                                            center.inspected_by_engineer
                                                ? "Yes"
                                                : "No",
                                        has_mou: center.has_mou ? "Yes" : "No",
                                    })
                                );

                                const allColumns = [
                                    { key: "number", label: "No." },
                                    { key: "name", label: "Center Name" },
                                    {
                                        key: "capacity_families",
                                        label: "Capacity (Families)",
                                    },
                                    {
                                        key: "capacity_individuals",
                                        label: "Capacity (Individuals)",
                                    },
                                    { key: "owner_type", label: "Owner Type" },
                                    {
                                        key: "inspected_by_engineer",
                                        label: "Inspected by Engineer",
                                    },
                                    { key: "has_mou", label: "Has MOU" },
                                ];

                                const columnRenderers = {
                                    number: (row) => <span>{row.number}</span>,
                                    name: (row) => (
                                        <span className="font-semibold">
                                            {row.name}
                                        </span>
                                    ),
                                    capacity_families: (row) => (
                                        <span>{row.capacity_families}</span>
                                    ),
                                    capacity_individuals: (row) => (
                                        <span>{row.capacity_individuals}</span>
                                    ),
                                    owner_type: (row) => (
                                        <span>{row.owner_type}</span>
                                    ),
                                    inspected_by_engineer: (row) => (
                                        <span>{row.inspected_by_engineer}</span>
                                    ),
                                    has_mou: (row) => (
                                        <span>{row.has_mou}</span>
                                    ),
                                };

                                return (
                                    <TableSection
                                        key={barangay.barangay_id}
                                        icon={<Archive />}
                                        color="blue"
                                        title={`Evacuation Centers - ${barangay.barangay_name}`}
                                        description={`Details of all evacuation centers in ${barangay.barangay_name}`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: tableRows,
                                            allColumns,
                                            columnRenderers,
                                            visibleColumns: allColumns.map(
                                                (c) => c.key
                                            ),
                                            showTotal: false,
                                            tableHeight: "400px",
                                        }}
                                    />
                                );
                            })
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
