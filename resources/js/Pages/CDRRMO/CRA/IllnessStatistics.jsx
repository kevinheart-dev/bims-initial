import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { AlertTriangle, Users } from "lucide-react";

export default function IllnessStatistics({
    illnessData = [],
    overallIllnessData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Illness Statistics", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.illnessesstats"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay &&
            (!overallIllnessData || overallIllnessData.length === 0)) ||
        (selectedBarangay &&
            (!illnessData ||
                illnessData.filter((b) => b.barangay_id === selectedBarangay)
                    .length === 0));

    return (
        <AdminLayout>
            <Head title="Illness Statistics" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            <NoDataPlaceholder
                                tip={
                                    tip ||
                                    "Select a barangay or view overall data from the dropdown above."
                                }
                            />
                        </div>
                    ) : (
                        <>
                            {/* 🟨 Barangay Filter */}
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {/* 🟩 Overall data view */}
                            {overallIllnessData.length > 0 &&
                                overallIllnessData.map((illness, index) => {
                                    const tableRows = (
                                        illness.barangays || []
                                    ).map((b, i) => ({
                                        number: b.no ?? i + 1,
                                        barangay_name: b.barangay_name ?? "-",
                                        children: b.children ?? 0,
                                        adults: b.adults ?? 0,
                                        total:
                                            (b.children ?? 0) + (b.adults ?? 0),
                                    }));

                                    const allColumns = [
                                        { key: "number", label: "No." },
                                        {
                                            key: "barangay_name",
                                            label: "Barangay",
                                        },
                                        { key: "children", label: "Children" },
                                        { key: "adults", label: "Adults" },
                                        { key: "total", label: "Total" },
                                    ];

                                    const columnRenderers = {
                                        number: (row) => (
                                            <span className="font-semibold">
                                                {row.number}
                                            </span>
                                        ),
                                        barangay_name: (row) => (
                                            <span className="font-semibold">
                                                {row.barangay_name}
                                            </span>
                                        ),
                                        children: (row) => (
                                            <span>{row.children}</span>
                                        ),
                                        adults: (row) => (
                                            <span>{row.adults}</span>
                                        ),
                                        total: (row) => (
                                            <span className="font-semibold">
                                                {row.total}
                                            </span>
                                        ),
                                    };

                                    return (
                                        <TableSection
                                            key={`illness-${index}`}
                                            icon={<Users />}
                                            color="red"
                                            title={`Illness Statistics - ${illness.illness}`}
                                            description={`Illness counts per barangay for ${illness.illness}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: tableRows,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "500px",
                                            }}
                                        />
                                    );
                                })}

                            {/* 🟩 Barangay-specific view */}
                            {illnessData.length > 0 && (
                                <TableSection
                                    icon={<Users />}
                                    color="red"
                                    title={`Illness Statistics - ${illnessData[0].barangay_name}`}
                                    description={`Illness counts for ${illnessData[0].barangay_name}`}
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData:
                                            illnessData[0].illnesses.map(
                                                (i, index) => ({
                                                    number: index + 1,
                                                    illness: i.illness,
                                                    children: i.children,
                                                    adults: i.adults,
                                                    total: i.total,
                                                })
                                            ),
                                        allColumns: [
                                            { key: "number", label: "No." },
                                            {
                                                key: "illness",
                                                label: "Illness",
                                            },
                                            {
                                                key: "children",
                                                label: "Children",
                                            },
                                            { key: "adults", label: "Adults" },
                                            { key: "total", label: "Total" },
                                        ],
                                        columnRenderers: {
                                            number: (row) => (
                                                <span className="font-semibold">
                                                    {row.number}
                                                </span>
                                            ),
                                            illness: (row) => (
                                                <span className="font-semibold">
                                                    {row.illness}
                                                </span>
                                            ),
                                            children: (row) => (
                                                <span>{row.children}</span>
                                            ),
                                            adults: (row) => (
                                                <span>{row.adults}</span>
                                            ),
                                            total: (row) => (
                                                <span className="font-semibold">
                                                    {row.total}
                                                </span>
                                            ),
                                        },
                                        visibleColumns: [
                                            "number",
                                            "illness",
                                            "children",
                                            "adults",
                                            "total",
                                        ],
                                        showTotal: true,
                                        tableHeight: "600px",
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
