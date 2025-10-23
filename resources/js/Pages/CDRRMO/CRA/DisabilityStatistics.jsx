import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { AlertTriangle, Users } from "lucide-react";

export default function DisabilityStatistics({
    disabilityData = [],
    overallDisabilityData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Disability Statistics", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.disabilities"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay &&
            (!overallDisabilityData || overallDisabilityData.length === 0)) ||
        (selectedBarangay &&
            (!disabilityData ||
                disabilityData.filter((b) => b.barangay_id === selectedBarangay)
                    .length === 0));

    return (
        <AdminLayout>
            <Head title="Disability Statistics" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <div className="w-full px-2 sm:px-4 lg:px-6">
                            {" "}
                            <NoDataPlaceholder
                                tip={
                                    tip ||
                                    "Select a barangay or view overall data from the dropdown above."
                                }
                            />
                        </div>
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {/* 🟩 Overall data view */}
                            {overallDisabilityData.length > 0 &&
                                overallDisabilityData.map(
                                    (disability, index) => {
                                        const tableRows = (
                                            disability.barangays || []
                                        ).map((b, i) => ({
                                            number: b.no ?? i + 1,
                                            barangay_name:
                                                b.barangay_name ?? "-",
                                            ...b.age_groups, // age_0_6, age_7m_2y, age_3_5, etc.
                                        }));

                                        const allColumns = [
                                            { key: "number", label: "No." },
                                            {
                                                key: "barangay_name",
                                                label: "Barangay",
                                            },
                                            {
                                                key: "age_0_6",
                                                label: "Age 0-6",
                                            },
                                            {
                                                key: "age_7m_2y",
                                                label: "Age 7m-2y",
                                            },
                                            {
                                                key: "age_3_5",
                                                label: "Age 3-5",
                                            },
                                            {
                                                key: "age_6_12",
                                                label: "Age 6-12",
                                            },
                                            {
                                                key: "age_13_17",
                                                label: "Age 13-17",
                                            },
                                            {
                                                key: "age_18_59",
                                                label: "Age 18-59",
                                            },
                                            {
                                                key: "age_60_up",
                                                label: "Age 60+",
                                            },
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

                                            // ✅ Age group renderers with Male/Female/LGBTQ
                                            age_0_6: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_0_6?.male ?? 0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_0_6?.female ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_0_6?.male ??
                                                            0) +
                                                            (row.age_0_6
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_7m_2y: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_7m_2y?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_7m_2y
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_7m_2y?.male ??
                                                            0) +
                                                            (row.age_7m_2y
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_3_5: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_3_5?.male ?? 0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_3_5?.female ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_3_5?.male ??
                                                            0) +
                                                            (row.age_3_5
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_6_12: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_6_12?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_6_12?.female ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_6_12?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_6_12?.male ??
                                                            0) +
                                                            (row.age_6_12
                                                                ?.female ?? 0) +
                                                            (row.age_6_12
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_13_17: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_13_17?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_13_17
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_13_17?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_13_17?.male ??
                                                            0) +
                                                            (row.age_13_17
                                                                ?.female ?? 0) +
                                                            (row.age_13_17
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_18_59: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_18_59?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_18_59
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_18_59?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_18_59?.male ??
                                                            0) +
                                                            (row.age_18_59
                                                                ?.female ?? 0) +
                                                            (row.age_18_59
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_60_up: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_60_up?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_60_up
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_60_up?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_60_up?.male ??
                                                            0) +
                                                            (row.age_60_up
                                                                ?.female ?? 0) +
                                                            (row.age_60_up
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                        };

                                        return (
                                            <TableSection
                                                key={`disability-${index}`}
                                                icon={<Users />}
                                                color="green"
                                                title={`Disability Statistics - ${disability.disability_type}`}
                                                description={`Disability counts per barangay for ${disability.disability_type}`}
                                                tableProps={{
                                                    component: DynamicTable,
                                                    passedData: tableRows,
                                                    allColumns,
                                                    columnRenderers,
                                                    visibleColumns:
                                                        allColumns.map(
                                                            (c) => c.key
                                                        ),
                                                    showTotal: true,
                                                    tableHeight: "500px",
                                                }}
                                            />
                                        );
                                    }
                                )}

                            {disabilityData.length > 0 && (
                                <TableSection
                                    icon={<Users />}
                                    color="green"
                                    title={`Disability Statistics - ${disabilityData[0].barangay_name}`}
                                    description={`Disability counts per age group for ${disabilityData[0].barangay_name}`}
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData:
                                            disabilityData[0].disabilities.map(
                                                (d, i) => {
                                                    const age0_6 =
                                                        d.age_groups.age_0_6 ||
                                                        {};
                                                    const age7m_2y =
                                                        d.age_groups
                                                            .age_7m_2y || {};
                                                    const age3_5 =
                                                        d.age_groups.age_3_5 ||
                                                        {};
                                                    const age6_12 =
                                                        d.age_groups.age_6_12 ||
                                                        {};
                                                    const age13_17 =
                                                        d.age_groups
                                                            .age_13_17 || {};
                                                    const age18_59 =
                                                        d.age_groups
                                                            .age_18_59 || {};
                                                    const age60_up =
                                                        d.age_groups
                                                            .age_60_up || {};

                                                    const total =
                                                        (age0_6.male ?? 0) +
                                                        (age0_6.female ?? 0) +
                                                        (age7m_2y.male ?? 0) +
                                                        (age7m_2y.female ?? 0) +
                                                        (age3_5.male ?? 0) +
                                                        (age3_5.female ?? 0) +
                                                        (age6_12.male ?? 0) +
                                                        (age6_12.female ?? 0) +
                                                        (age6_12.lgbtq ?? 0) +
                                                        (age13_17.male ?? 0) +
                                                        (age13_17.female ?? 0) +
                                                        (age13_17.lgbtq ?? 0) +
                                                        (age18_59.male ?? 0) +
                                                        (age18_59.female ?? 0) +
                                                        (age18_59.lgbtq ?? 0) +
                                                        (age60_up.male ?? 0) +
                                                        (age60_up.female ?? 0) +
                                                        (age60_up.lgbtq ?? 0);

                                                    return {
                                                        number: i + 1,
                                                        disability_type:
                                                            d.disability_type,
                                                        ...d.age_groups, // keep age groups for table
                                                        total, // ✅ correct total
                                                    };
                                                }
                                            ),
                                        allColumns: [
                                            { key: "number", label: "No." },
                                            {
                                                key: "disability_type",
                                                label: "Disability Type",
                                            },
                                            {
                                                key: "age_0_6",
                                                label: "Age 0-6",
                                            },
                                            {
                                                key: "age_7m_2y",
                                                label: "Age 7m-2y",
                                            },
                                            {
                                                key: "age_3_5",
                                                label: "Age 3-5",
                                            },
                                            {
                                                key: "age_6_12",
                                                label: "Age 6-12",
                                            },
                                            {
                                                key: "age_13_17",
                                                label: "Age 13-17",
                                            },
                                            {
                                                key: "age_18_59",
                                                label: "Age 18-59",
                                            },
                                            {
                                                key: "age_60_up",
                                                label: "Age 60+",
                                            },
                                            { key: "total", label: "Total" }, // ✅ add total column
                                        ],
                                        columnRenderers: {
                                            number: (row) => (
                                                <span className="font-semibold">
                                                    {row.number}
                                                </span>
                                            ),
                                            disability_type: (row) => (
                                                <span className="font-semibold">
                                                    {row.disability_type}
                                                </span>
                                            ),
                                            age_0_6: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_0_6?.male ?? 0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_0_6?.female ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_0_6?.male ??
                                                            0) +
                                                            (row.age_0_6
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_7m_2y: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_7m_2y?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_7m_2y
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_7m_2y?.male ??
                                                            0) +
                                                            (row.age_7m_2y
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_3_5: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_3_5?.male ?? 0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_3_5?.female ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_3_5?.male ??
                                                            0) +
                                                            (row.age_3_5
                                                                ?.female ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_6_12: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_6_12?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_6_12?.female ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_6_12?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_6_12?.male ??
                                                            0) +
                                                            (row.age_6_12
                                                                ?.female ?? 0) +
                                                            (row.age_6_12
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_13_17: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_13_17?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_13_17
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_13_17?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_13_17?.male ??
                                                            0) +
                                                            (row.age_13_17
                                                                ?.female ?? 0) +
                                                            (row.age_13_17
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_18_59: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_18_59?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_18_59
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_18_59?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_18_59?.male ??
                                                            0) +
                                                            (row.age_18_59
                                                                ?.female ?? 0) +
                                                            (row.age_18_59
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            age_60_up: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_60_up?.male ??
                                                            0}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_60_up
                                                            ?.female ?? 0}
                                                    </div>
                                                    <div>
                                                        LGBTQ:{" "}
                                                        {row.age_60_up?.lgbtq ??
                                                            0}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {(row.age_60_up?.male ??
                                                            0) +
                                                            (row.age_60_up
                                                                ?.female ?? 0) +
                                                            (row.age_60_up
                                                                ?.lgbtq ?? 0)}
                                                    </div>
                                                </div>
                                            ),
                                            total: (row) => (
                                                <span className="font-semibold">
                                                    {row.total}
                                                </span>
                                            ), // ✅ render total
                                        },
                                        visibleColumns: [
                                            "number",
                                            "disability_type",
                                            "age_0_6",
                                            "age_7m_2y",
                                            "age_3_5",
                                            "age_6_12",
                                            "age_13_17",
                                            "age_18_59",
                                            "age_60_up",
                                            "total", // ✅ show total column
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
