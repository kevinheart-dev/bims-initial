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
    const isDataNull =
        (selectedBarangay && isBarangayDataEmpty) ||
        (!selectedBarangay && isOverallDataEmpty);

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
                        <div className="flex flex-col items-center justify-center mt-15 bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-3xl shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                            <img
                                src="/images/chart_error.png"
                                alt="No data"
                                className="w-48 h-48 mb-6 animate-bounce"
                            />
                            <h2 className="text-3xl font-extrabold text-gray-800 mb-3 text-center">
                                No Data Available
                            </h2>
                            <p className="text-gray-700 text-center mb-3 max-w-xl text-base leading-relaxed">
                                To view disaster population impact data, please{" "}
                                <span className="font-bold text-blue-600">
                                    select a barangay
                                </span>{" "}
                                from the dropdown above. Only barangays with
                                recorded disaster impact data for the chosen
                                year will display results.
                            </p>
                            <p className="text-gray-600 text-center mb-6 max-w-xl text-sm italic leading-relaxed">
                                Ensure the data for the selected barangay has
                                been properly recorded in the system. Once
                                selected, the dashboard will display accurate
                                statistics and affected population information.
                            </p>
                            <button
                                onClick={() => router.reload()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg"
                            >
                                Refresh Page
                            </button>
                        </div>
                    ) : isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                        </div>
                    ) : (
                        disasterLifelineData.map((barangay, bIndex) =>
                            barangay.disasters.map((disaster, dIndex) => {
                                // ⛔ Remove the total calculation
                                // const total = disaster.lifelines.reduce(
                                //     (sum, r) => sum + toNumber(r.value),
                                //     0
                                // );

                                const disasterName = disaster.disaster_name;
                                const disasterYear =
                                    disaster.lifelines[0]?.year || "—";

                                return (
                                    <TableSection
                                        key={`${bIndex}-${dIndex}`}
                                        icon={<HeartPulse />}
                                        color="blue"
                                        title={`${disasterName} in ${barangay.barangay_name} (${disasterYear})`}
                                        // ⬅️ New description without total
                                        description={`Lifeline impact records for this disaster event.`}
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData: disaster.lifelines,
                                            allColumns,
                                            columnRenderers,
                                            visibleColumns: allColumns.map(
                                                (c) => c.key
                                            ),
                                            showTotal: false, // ⛔ turn off totals
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
