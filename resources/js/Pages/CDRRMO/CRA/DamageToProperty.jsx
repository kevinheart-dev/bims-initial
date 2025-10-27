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

        // Convert to string
        const str = String(v);

        // Replace all non-digit/dot characters with spaces (this will handle ; , () etc.)
        const cleanStr = str.replace(/[^0-9.]+/g, " ");

        // Match all numbers (integers or decimals)
        const matches = cleanStr.match(/\d+(\.\d+)?/g);

        // Sum them
        return matches ? matches.reduce((sum, n) => sum + parseFloat(n), 0) : 0;
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
                    {!isBarangayView ? (
                        isOverallDataNull ? (
                            <div className="w-full px-2 sm:px-4 lg:px-6">
                                <NoDataPlaceholder tip="No overall property damage data available for the selected year." />
                            </div>
                        ) : (
                            overallDamagePropertyData.map((disaster) =>
                                renderTable(
                                    `${disaster.disaster_name} (Overall)`,
                                    disaster.damages
                                )
                            )
                        )
                    ) : isBarangayDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder tip="No property damage data available for the selected barangay." />
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
