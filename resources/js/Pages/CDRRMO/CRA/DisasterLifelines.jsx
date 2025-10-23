import { HeartPulse } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

const nf = new Intl.NumberFormat();

export default function DisasterLifelines({
    disasterLifelineData,
    overallDisasterLifelineData,
    barangays = [],
    selectedBarangay,
    queryParams,
    tip,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const toNumber = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.disasterlifelines"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isBarangayDataEmpty =
        !disasterLifelineData || disasterLifelineData.length === 0;
    const isOverallDataEmpty =
        !overallDisasterLifelineData ||
        overallDisasterLifelineData.length === 0;

    // Common table column definitions
    const allColumns = [
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        { key: "value", label: "Value" },
        { key: "source", label: "Source" },
    ];

    const columnRenderers = {
        category: (row) => (
            <span className="text-gray-800 font-medium">
                {row.category || "—"}
            </span>
        ),
        description: (row) => (
            <span className="text-gray-700">{row.description || "—"}</span>
        ),
        value: (row) => (
            <span className="font-bold text-blue-700">
                {nf.format(toNumber(row.value))}
            </span>
        ),
        source: (row) => (
            <span className="text-gray-700">{row.source || "—"}</span>
        ),
    };

    return (
        <AdminLayout>
            <Head title="Disaster Lifelines Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />

                    {/* === CASE 1: OVERALL VIEW === */}
                    {!selectedBarangay ? (
                        isOverallDataEmpty ? (
                            <div className="w-full px-2 sm:px-4 lg:px-6">
                                <NoDataPlaceholder
                                    tip={
                                        tip ||
                                        "No overall disaster lifeline data available."
                                    }
                                />
                            </div>
                        ) : (
                            overallDisasterLifelineData.map(
                                (disaster, index) => {
                                    const total = disaster.lifelines.reduce(
                                        (sum, r) => sum + toNumber(r.value),
                                        0
                                    );

                                    return (
                                        <TableSection
                                            key={index}
                                            icon={<HeartPulse />}
                                            color="blue"
                                            title={`${disaster.disaster_name}`}
                                            description={`Total lifeline impact value: ${nf.format(
                                                total
                                            )}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: disaster.lifelines,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "400px",
                                            }}
                                        />
                                    );
                                }
                            )
                        )
                    ) : // === CASE 2: BARANGAY-SPECIFIC VIEW ===
                    isBarangayDataEmpty ? (
                        <NoDataPlaceholder tip="No disaster lifeline data available for the selected barangay." />
                    ) : (
                        disasterLifelineData.map((barangay, bIndex) =>
                            barangay.disasters.map((disaster, dIndex) => {
                                const total = disaster.lifelines.reduce(
                                    (sum, r) => sum + toNumber(r.value),
                                    0
                                );
                                const disasterName = disaster.disaster_name;
                                const disasterYear =
                                    disaster.lifelines[0]?.year || "—";

                                return (
                                    <TableSection
                                        key={`${bIndex}-${dIndex}`}
                                        icon={<HeartPulse />}
                                        color="blue"
                                        title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                        description={`Total lifeline impact value: ${nf.format(
                                            total
                                        )}`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: disaster.lifelines,
                                            allColumns,
                                            columnRenderers,
                                            visibleColumns: allColumns.map(
                                                (c) => c.key
                                            ),
                                            showTotal: true,
                                            tableHeight: "400px",
                                        }}
                                    />
                                );
                            })
                        )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
