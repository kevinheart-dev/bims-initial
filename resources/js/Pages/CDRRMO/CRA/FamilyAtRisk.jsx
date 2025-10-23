import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { Users } from "lucide-react";

export default function FamilyAtRisk({
    familyAtRiskData = [],
    overallFamilyAtRiskData = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Family at Risk", showOnMobile: true },
    ];

    const overallData = Array.isArray(overallFamilyAtRiskData)
        ? overallFamilyAtRiskData
        : Object.values(overallFamilyAtRiskData || []);

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.familiesatrisk"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay && (!overallData || overallData.length === 0)) ||
        (selectedBarangay &&
            (!familyAtRiskData ||
                familyAtRiskData.filter(
                    (b) => b.barangay_id === selectedBarangay
                ).length === 0));

    return (
        <AdminLayout>
            <Head title="Family at Risk" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* <pre>{JSON.stringify(familyAtRiskData, undefined, 2)}</pre> */}

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
                            {/* Barangay Filter */}
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {/* Overall view: one table per barangay */}
                            {overallData.length > 0 && (
                                <TableSection
                                    icon={<Users />}
                                    color="red"
                                    title="Family at Risk - Overall"
                                    description="Indicators for all barangays"
                                    tableProps={{
                                        component: DynamicTable,
                                        passedData: overallData.map(
                                            (barangay, idx) => {
                                                const row = {
                                                    no: idx + 1,
                                                    barangay_name:
                                                        barangay.barangay_name,
                                                };

                                                // ✅ Map indicator names to consistent keys
                                                const indicatorKeyMap = {
                                                    "Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)":
                                                        "number_of_families_with_access_to_information",
                                                    "Number of Employed Individuals":
                                                        "number_of_employed_individuals",
                                                    "Number of Families Aware of the Effects of Risks and Hazards":
                                                        "number_of_families_aware_of_the_effects_of_risks_and_hazards",
                                                    "Number of Families with Access to Early Warning System":
                                                        "number_of_families_with_access_to_early_warning_system",
                                                    "Number of Families who received Financial Assistance":
                                                        "number_of_families_who_received_financial_assistance",
                                                    "Number of Informal Settler Families":
                                                        "number_of_informal_settler_families",
                                                };

                                                barangay.indicators.forEach(
                                                    (indicator) => {
                                                        const key =
                                                            indicatorKeyMap[
                                                                indicator
                                                                    .indicator
                                                            ];
                                                        if (key)
                                                            row[key] =
                                                                indicator.total_count ??
                                                                0;
                                                    }
                                                );

                                                return row;
                                            }
                                        ),
                                        allColumns: [
                                            { key: "no", label: "No." },
                                            {
                                                key: "barangay_name",
                                                label: "Barangay Name",
                                            },
                                            {
                                                key: "number_of_families_with_access_to_information",
                                                label: "Number of Families with Access to Information (radio/TV/newspaper/social media, etc.)",
                                            },
                                            {
                                                key: "number_of_employed_individuals",
                                                label: "Number of Employed Individuals",
                                            },
                                            {
                                                key: "number_of_families_aware_of_the_effects_of_risks_and_hazards",
                                                label: "Number of Families Aware of the Effects of Risks and Hazards",
                                            },
                                            {
                                                key: "number_of_families_with_access_to_early_warning_system",
                                                label: "Number of Families with Access to Early Warning System",
                                            },
                                            {
                                                key: "number_of_families_who_received_financial_assistance",
                                                label: "Number of Families who received Financial Assistance",
                                            },
                                            {
                                                key: "number_of_informal_settler_families",
                                                label: "Number of Informal Settler Families",
                                            },
                                            { key: "total", label: "Total" },
                                        ],
                                        columnRenderers: {
                                            no: (row) => (
                                                <span className="font-semibold">
                                                    {row.no}
                                                </span>
                                            ),
                                            barangay_name: (row) => (
                                                <span className="font-semibold">
                                                    {row.barangay_name}
                                                </span>
                                            ),
                                            number_of_families_with_access_to_information:
                                                (row) => (
                                                    <span>
                                                        {row.number_of_families_with_access_to_information ??
                                                            0}
                                                    </span>
                                                ),
                                            number_of_employed_individuals: (
                                                row
                                            ) => (
                                                <span>
                                                    {row.number_of_employed_individuals ??
                                                        0}
                                                </span>
                                            ),
                                            number_of_families_aware_of_the_effects_of_risks_and_hazards:
                                                (row) => (
                                                    <span>
                                                        {row.number_of_families_aware_of_the_effects_of_risks_and_hazards ??
                                                            0}
                                                    </span>
                                                ),
                                            number_of_families_with_access_to_early_warning_system:
                                                (row) => (
                                                    <span>
                                                        {row.number_of_families_with_access_to_early_warning_system ??
                                                            0}
                                                    </span>
                                                ),
                                            number_of_families_who_received_financial_assistance:
                                                (row) => (
                                                    <span>
                                                        {row.number_of_families_who_received_financial_assistance ??
                                                            0}
                                                    </span>
                                                ),
                                            number_of_informal_settler_families:
                                                (row) => (
                                                    <span>
                                                        {row.number_of_informal_settler_families ??
                                                            0}
                                                    </span>
                                                ),
                                            total: (row) => {
                                                const sum = Object.keys(row)
                                                    .filter(
                                                        (k) =>
                                                            k !== "no" &&
                                                            k !==
                                                                "barangay_name"
                                                    )
                                                    .reduce(
                                                        (acc, key) =>
                                                            acc +
                                                            (row[key] ?? 0),
                                                        0
                                                    );
                                                return (
                                                    <span className="font-semibold">
                                                        {sum}
                                                    </span>
                                                );
                                            },
                                        },
                                        visibleColumns: [
                                            "no",
                                            "barangay_name",
                                            "number_of_families_with_access_to_information",
                                            "number_of_employed_individuals",
                                            "number_of_families_aware_of_the_effects_of_risks_and_hazards",
                                            "number_of_families_with_access_to_early_warning_system",
                                            "number_of_families_who_received_financial_assistance",
                                            "number_of_informal_settler_families",
                                            "total",
                                        ],
                                        showTotal: true,
                                        tableHeight: "600px",
                                    }}
                                />
                            )}

                            {/* Detailed view per barangay: per indicator and purok */}
                            {familyAtRiskData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                )
                                .map((barangayData) => {
                                    // Define the order of indicators you want as columns
                                    const indicatorOrder = [
                                        "Number of Families with Access to Information (radio/TV/ newspaper/ social media, etc.)",
                                        "Number of Employed Individuals",
                                        "Number of Families Aware of the Effects of Risks and Hazards",
                                        "Number of Families with Access to Early Warning System",
                                        "Number of Families who received Financial Assistance",
                                        "Number of Informal Settler Families",
                                    ];

                                    // Map puroks to rows
                                    const tableRows = {};
                                    barangayData.indicators.forEach(
                                        (indicator) => {
                                            indicator.puroks.forEach(
                                                (purok) => {
                                                    if (
                                                        !tableRows[
                                                            purok.purok_number
                                                        ]
                                                    ) {
                                                        tableRows[
                                                            purok.purok_number
                                                        ] = {
                                                            purok_number:
                                                                purok.purok_number ??
                                                                "-",
                                                        };
                                                    }
                                                    const key =
                                                        indicator.indicator
                                                            .replace(
                                                                /\s+/g,
                                                                "_"
                                                            )
                                                            .toLowerCase();
                                                    tableRows[
                                                        purok.purok_number
                                                    ][key] = purok.count ?? 0;
                                                }
                                            );
                                        }
                                    );

                                    const rows = Object.values(tableRows).map(
                                        (row, idx) => ({
                                            no: idx + 1,
                                            ...row,
                                        })
                                    );

                                    // Build columns in defined order
                                    const allColumns = [
                                        {
                                            key: "purok_number",
                                            label: "Purok",
                                        },
                                        ...indicatorOrder.map((indicator) => ({
                                            key: indicator
                                                .replace(/\s+/g, "_")
                                                .toLowerCase(),
                                            label: indicator,
                                        })),
                                        { key: "total", label: "Total" },
                                    ];

                                    // Column renderers
                                    const columnRenderers = {
                                        purok_number: (row) => (
                                            <span>{row.purok_number}</span>
                                        ),
                                    };

                                    indicatorOrder.forEach((indicator) => {
                                        const key = indicator
                                            .replace(/\s+/g, "_")
                                            .toLowerCase();
                                        columnRenderers[key] = (row) => (
                                            <span>{row[key] ?? 0}</span>
                                        );
                                    });

                                    columnRenderers.total = (row) => {
                                        const sum = indicatorOrder
                                            .map((i) =>
                                                i
                                                    .replace(/\s+/g, "_")
                                                    .toLowerCase()
                                            )
                                            .reduce(
                                                (acc, key) =>
                                                    acc + (row[key] ?? 0),
                                                0
                                            );
                                        return (
                                            <span className="font-semibold">
                                                {sum}
                                            </span>
                                        );
                                    };

                                    return (
                                        <TableSection
                                            key={`barangay-${barangayData.barangay_id}`}
                                            icon={<Users />}
                                            color="red"
                                            title={`Family at Risk - ${barangayData.barangay_name}`}
                                            description="Purok-level indicators"
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rows,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true,
                                                tableHeight: "600px",
                                            }}
                                        />
                                    );
                                })}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
