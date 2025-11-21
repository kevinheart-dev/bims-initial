import { Wrench, Building2 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

const nf = new Intl.NumberFormat();

export default function DamageToProperty({
    damagePropertyData = [],
    overallDamagePropertyData = [],
    barangays = [],
    selectedBarangay,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    const isBarangayView = !!selectedBarangay;
    const isBarangayDataNull = !damagePropertyData.length;
    const isOverallDataNull = !overallDamagePropertyData.length;

    const isDataNull =
        (isBarangayView && isBarangayDataNull) ||
        (!isBarangayView && isOverallDataNull);

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.damageproperty"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const toPascalCase = (str) => {
        if (!str) return "—";
        return str
            .replace(/_/g, " ")
            .replace(
                /\w\S*/g,
                (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            );
    };

    const toNumber = (v) => {
        if (!v) return 0;

        let str = String(v).trim();

        // Handle accounting negative (e.g., "(200,000)")
        const isNegative = /^\(.*\)$/.test(str);
        if (isNegative) {
            str = str.replace(/[()]/g, "");
        }

        // Remove currency symbols + spaces (₱, PHP, P, etc)
        str = str.replace(/(?:php|₱|p)/gi, "");

        // Remove commas
        str = str.replace(/,/g, "");

        // If contains 'k' or 'K' convert (200k -> 200000)
        if (/k$/i.test(str)) {
            return parseFloat(str) * 1000 * (isNegative ? -1 : 1);
        }

        // Keep only numbers and decimal
        const matches = str.match(/\d+(\.\d+)?/g);
        if (!matches) return 0;

        const total = matches.reduce((sum, num) => sum + parseFloat(num), 0);
        return isNegative ? -total : total;
    };

    const allColumns = [
        { key: "damage_type", label: "Damage Type" },
        { key: "category", label: "Category" },
        { key: "description", label: "Description" },
        { key: "value", label: "Value" },
        { key: "source", label: "Source" },
    ];

    const columnRenderers = {
        damage_type: (row) => (
            <span className="text-gray-800 font-medium">
                {toPascalCase(row.damage_type)}
            </span>
        ),
        category: (row) => (
            <span className="text-gray-800">{row.category || "—"}</span>
        ),
        description: (row) => (
            <span className="text-gray-700">{row.description || "—"}</span>
        ),
        value: (row) => {
            const numericValue = toNumber(row.value);
            const hasNumbers = numericValue > 0;

            return (
                <span
                    className={`font-semibold ${
                        hasNumbers ? "text-red-600" : "text-gray-700 italic"
                    }`}
                >
                    {row.value || "—"}
                </span>
            );
        },
        source: (row) => (
            <span className="text-gray-700">{row.source || "—"}</span>
        ),
    };

    const renderTable = (title, data, isBarangay = false) => {
        // Exclude "description" column for overall view
        const visibleColumns = isBarangay
            ? allColumns.map((c) => c.key) // show all for barangay
            : allColumns
                  .filter((c) => c.key !== "description")
                  .map((c) => c.key);

        return (
            <TableSection
                key={title}
                icon={isBarangay ? <Wrench /> : <Building2 />}
                color="red"
                title={title}
                description="Breakdown of property damages by category" // static text
                tableProps={{
                    component: DynamicTable,
                    passedData: data,
                    allColumns,
                    columnRenderers,
                    visibleColumns,
                    showTotal: false,
                    tableHeight: "400px",
                }}
            />
        );
    };

    return (
        <AdminLayout>
            <Head title="Damage to Property Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    <BarangayFilterCard
                        selectedBarangay={selectedBarangay}
                        handleBarangayChange={handleBarangayChange}
                        barangays={barangays}
                    />
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
                        damagePropertyData.flatMap((barangay) =>
                            barangay.disasters.map((disaster) =>
                                renderTable(
                                    `${disaster.disaster_name} in ${
                                        barangay.barangay_name
                                    } (${disaster.damages[0]?.year ?? "N/A"})`,
                                    disaster.damages,
                                    true
                                )
                            )
                        )
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
