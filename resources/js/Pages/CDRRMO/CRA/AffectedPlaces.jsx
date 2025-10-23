import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Archive } from "lucide-react";

export default function AffectedPlaces({
    affectedData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Affected Places", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.affectedPlaces"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull = !affectedData || affectedData.length === 0;

    return (
        <AdminLayout>
            <Head title="Affected Places" />
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
                                    "Select a barangay to view affected places per hazard."
                                }
                            />
                        </div>
                    ) : (
                        (() => {
                            const barangayData = affectedData.find(
                                (b) => b.barangay_id === selectedBarangay
                            );

                            if (!barangayData) return null;

                            // Group by hazard
                            const hazardsMap = {};
                            barangayData.places.forEach((place) => {
                                if (!hazardsMap[place.hazard_name]) {
                                    hazardsMap[place.hazard_name] = [];
                                }
                                hazardsMap[place.hazard_name].push(place);
                            });

                            const allColumns = [
                                { key: "purok_number", label: "Purok" },
                                { key: "risk_level", label: "Risk Level" },
                                {
                                    key: "total_families",
                                    label: "Total Families",
                                },
                                {
                                    key: "total_individuals",
                                    label: "Total Individuals",
                                },
                                {
                                    key: "at_risk_families",
                                    label: "Families at Risk",
                                },
                                {
                                    key: "at_risk_individuals",
                                    label: "Individuals at Risk",
                                },
                                {
                                    key: "safe_evacuation_area",
                                    label: "Safe Evacuation Area",
                                },
                            ];

                            const columnRenderers = {};
                            allColumns.forEach((col) => {
                                columnRenderers[col.key] = (row) => (
                                    <span>{row[col.key]}</span>
                                );
                            });

                            return Object.keys(hazardsMap).map(
                                (hazardName, hazardIndex) => {
                                    const tableRows = hazardsMap[
                                        hazardName
                                    ].map((place, index) => ({
                                        number: index + 1,
                                        ...place,
                                    }));

                                    return (
                                        <TableSection
                                            key={`hazard-${hazardIndex}`}
                                            icon={<Archive />}
                                            color="green"
                                            title={`Affected Places - ${hazardName}`}
                                            description={`Affected places for hazard "${hazardName}" in Barangay`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: tableRows,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: false,
                                                tableHeight: "500px",
                                            }}
                                        />
                                    );
                                }
                            );
                        })()
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
