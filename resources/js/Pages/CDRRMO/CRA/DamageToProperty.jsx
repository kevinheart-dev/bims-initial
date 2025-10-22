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
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
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
        value: (row) => (
            <span className="text-red-600 font-semibold">
                {nf.format(toNumber(row.value))}
            </span>
        ),
        source: (row) => (
            <span className="text-gray-700">{row.source || "—"}</span>
        ),
    };

    const renderTable = (title, data, isBarangay = false) => {
        const totalValue = data.reduce((sum, r) => sum + toNumber(r.value), 0);

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
                description={`Total damage value: ${nf.format(totalValue)}`}
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
                            <NoDataPlaceholder tip="No overall property damage data available for the selected year." />
                        ) : (
                            overallDamagePropertyData.map((disaster) =>
                                renderTable(
                                    `${disaster.disaster_name} (Overall)`,
                                    disaster.damages
                                )
                            )
                        )
                    ) : isBarangayDataNull ? (
                        <NoDataPlaceholder tip="No property damage data available for the selected barangay." />
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
