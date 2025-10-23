import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import DynamicTable from "@/Components/DynamicTable";
import TableSection from "@/Components/TableSection";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import { AlertTriangle, Users } from "lucide-react";

export default function PopulationExposure({
    populationExposureData = [],
    overallPopulationExposureData = [],
    overallHazardSummary = [],
    barangays = [],
    selectedBarangay,
    tip,
}) {
    const breadcrumbs = [
        { label: "CRA", showOnMobile: true },
        { label: "Population Exposure", showOnMobile: true },
    ];

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;
        router.get(
            route("cdrrmo_admin.populationexposure"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    const isDataNull =
        (!selectedBarangay &&
            (!overallPopulationExposureData ||
                overallPopulationExposureData.length === 0)) ||
        (selectedBarangay &&
            (!populationExposureData ||
                populationExposureData.filter(
                    (b) => b.barangay_id === selectedBarangay
                ).length === 0));

    return (
        <AdminLayout>
            <Head title="Population Exposure" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {/* 🟦 If no data */}
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
                            {overallPopulationExposureData.length > 0 &&
                                overallPopulationExposureData.map(
                                    (hazard, hazardIndex) => {
                                        // Flatten barangays + age_groups
                                        const tableRows = (
                                            hazard.barangays || []
                                        ).map((b, index) => ({
                                            number: b.no ?? index + 1,
                                            barangay_name:
                                                b.barangay_name ?? "-",
                                            total_families:
                                                b.total_families ?? 0,
                                            total_individuals:
                                                b.total_individuals ?? 0,
                                            male: b.male ?? 0,
                                            female: b.female ?? 0,
                                            lgbtq: b.lgbtq ?? 0,
                                            pwd: b.pwd ?? 0,
                                            diseases: b.diseases ?? 0,
                                            pregnant: b.pregnant ?? 0,
                                            ...b.age_groups, // age_0_6, age_7m_2y, etc.
                                        }));

                                        const allColumns = [
                                            { key: "number", label: "No." },
                                            {
                                                key: "barangay_name",
                                                label: "Barangay",
                                            },
                                            {
                                                key: "total_families",
                                                label: "Total Families",
                                            },
                                            {
                                                key: "total_individuals",
                                                label: "Total Individuals",
                                            },
                                            { key: "male", label: "Male" },
                                            { key: "female", label: "Female" },
                                            { key: "lgbtq", label: "LGBTQ" },
                                            { key: "pwd", label: "PWD" },
                                            {
                                                key: "diseases",
                                                label: "Diseases",
                                            },
                                            {
                                                key: "pregnant",
                                                label: "Pregnant",
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
                                            total_families: (row) => (
                                                <span>
                                                    {row.total_families}
                                                </span>
                                            ),
                                            total_individuals: (row) => (
                                                <span>
                                                    {row.total_individuals}
                                                </span>
                                            ),
                                            male: (row) => (
                                                <span>{row.male}</span>
                                            ),
                                            female: (row) => (
                                                <span>{row.female}</span>
                                            ),
                                            lgbtq: (row) => (
                                                <span>{row.lgbtq}</span>
                                            ),
                                            pwd: (row) => (
                                                <span>{row.pwd}</span>
                                            ),
                                            diseases: (row) => (
                                                <span>{row.diseases}</span>
                                            ),
                                            pregnant: (row) => (
                                                <span>{row.pregnant}</span>
                                            ),

                                            // ✅ Age group renderers
                                            age_0_6: (row) => (
                                                <div>
                                                    <div>
                                                        Male: {row.age_0_6.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_0_6.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_0_6.male +
                                                            row.age_0_6.female}
                                                    </div>
                                                </div>
                                            ),
                                            age_7m_2y: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_7m_2y.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_7m_2y.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_7m_2y.male +
                                                            row.age_7m_2y
                                                                .female}
                                                    </div>
                                                </div>
                                            ),
                                            age_3_5: (row) => (
                                                <div>
                                                    <div>
                                                        Male: {row.age_3_5.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_3_5.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_3_5.male +
                                                            row.age_3_5.female}
                                                    </div>
                                                </div>
                                            ),
                                            age_6_12: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_6_12.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_6_12.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_6_12.male +
                                                            row.age_6_12.female}
                                                    </div>
                                                </div>
                                            ),
                                            age_13_17: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_13_17.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_13_17.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_13_17.male +
                                                            row.age_13_17
                                                                .female}
                                                    </div>
                                                </div>
                                            ),
                                            age_18_59: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_18_59.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_18_59.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_18_59.male +
                                                            row.age_18_59
                                                                .female}
                                                    </div>
                                                </div>
                                            ),
                                            age_60_up: (row) => (
                                                <div>
                                                    <div>
                                                        Male:{" "}
                                                        {row.age_60_up.male}
                                                    </div>
                                                    <div>
                                                        Female:{" "}
                                                        {row.age_60_up.female}
                                                    </div>
                                                    <div className="font-semibold">
                                                        Total:{" "}
                                                        {row.age_60_up.male +
                                                            row.age_60_up
                                                                .female}
                                                    </div>
                                                </div>
                                            ),
                                        };

                                        return (
                                            <TableSection
                                                key={`hazard-${hazardIndex}`}
                                                icon={<Users />}
                                                color="blue"
                                                title={`Population Exposure - ${hazard.hazard_name}`}
                                                description={`Population exposure per barangay for ${hazard.hazard_name}`}
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

                            {populationExposureData
                                .filter(
                                    (b) => b.barangay_id === selectedBarangay
                                ) // only selected barangay
                                .map((barangayData) =>
                                    barangayData.hazards.map(
                                        (hazard, hazardIndex) => {
                                            const tableRows = (
                                                hazard.puroks || []
                                            ).map((purok, index) => ({
                                                purok_number:
                                                    purok.purok_number ?? "-",
                                                total_families:
                                                    purok.total_families ?? 0,
                                                total_individuals:
                                                    purok.total_individuals ??
                                                    0,
                                                male: purok.male ?? 0,
                                                female: purok.female ?? 0,
                                                lgbtq: purok.lgbtq ?? 0,
                                                pwd_male: purok.pwd_male ?? 0,
                                                pwd_female:
                                                    purok.pwd_female ?? 0,
                                                diseases_male:
                                                    purok.diseases_male ?? 0,
                                                diseases_female:
                                                    purok.diseases_female ?? 0,
                                                pregnant: purok.pregnant ?? 0,
                                                age_0_6: {
                                                    male:
                                                        purok.age_0_6_male ?? 0,
                                                    female:
                                                        purok.age_0_6_female ??
                                                        0,
                                                },
                                                age_7m_2y: {
                                                    male:
                                                        purok.age_7m_2y_male ??
                                                        0,
                                                    female:
                                                        purok.age_7m_2y_female ??
                                                        0,
                                                },
                                                age_3_5: {
                                                    male:
                                                        purok.age_3_5_male ?? 0,
                                                    female:
                                                        purok.age_3_5_female ??
                                                        0,
                                                },
                                                age_6_12: {
                                                    male:
                                                        purok.age_6_12_male ??
                                                        0,
                                                    female:
                                                        purok.age_6_12_female ??
                                                        0,
                                                },
                                                age_13_17: {
                                                    male:
                                                        purok.age_13_17_male ??
                                                        0,
                                                    female:
                                                        purok.age_13_17_female ??
                                                        0,
                                                },
                                                age_18_59: {
                                                    male:
                                                        purok.age_18_59_male ??
                                                        0,
                                                    female:
                                                        purok.age_18_59_female ??
                                                        0,
                                                },
                                                age_60_up: {
                                                    male:
                                                        purok.age_60_up_male ??
                                                        0,
                                                    female:
                                                        purok.age_60_up_female ??
                                                        0,
                                                },
                                            }));

                                            const allColumns = [
                                                {
                                                    key: "purok_number",
                                                    label: "Purok",
                                                },
                                                {
                                                    key: "total_families",
                                                    label: "Total Families",
                                                },
                                                {
                                                    key: "total_individuals",
                                                    label: "Total Individuals",
                                                },
                                                { key: "male", label: "Male" },
                                                {
                                                    key: "female",
                                                    label: "Female",
                                                },
                                                {
                                                    key: "lgbtq",
                                                    label: "LGBTQ",
                                                },
                                                {
                                                    key: "pwd_male",
                                                    label: "PWD Male",
                                                },
                                                {
                                                    key: "pwd_female",
                                                    label: "PWD Female",
                                                },
                                                {
                                                    key: "diseases_male",
                                                    label: "Diseases Male",
                                                },
                                                {
                                                    key: "diseases_female",
                                                    label: "Diseases Female",
                                                },
                                                {
                                                    key: "pregnant",
                                                    label: "Pregnant",
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

                                            // Column renderers to show Male/Female stacked
                                            const columnRenderers = {
                                                purok_number: (row) => (
                                                    <span className="font-semibold">
                                                        {row.purok_number}
                                                    </span>
                                                ),
                                                total_families: (row) => (
                                                    <span>
                                                        {row.total_families}
                                                    </span>
                                                ),
                                                total_individuals: (row) => (
                                                    <span>
                                                        {row.total_individuals}
                                                    </span>
                                                ),
                                                male: (row) => (
                                                    <span>{row.male}</span>
                                                ),
                                                female: (row) => (
                                                    <span>{row.female}</span>
                                                ),
                                                lgbtq: (row) => (
                                                    <span>{row.lgbtq}</span>
                                                ),
                                                pwd_male: (row) => (
                                                    <span>{row.pwd_male}</span>
                                                ),
                                                pwd_female: (row) => (
                                                    <span>
                                                        {row.pwd_female}
                                                    </span>
                                                ),
                                                diseases_male: (row) => (
                                                    <span>
                                                        {row.diseases_male}
                                                    </span>
                                                ),
                                                diseases_female: (row) => (
                                                    <span>
                                                        {row.diseases_female}
                                                    </span>
                                                ),
                                                pregnant: (row) => (
                                                    <span>{row.pregnant}</span>
                                                ),
                                                age_0_6: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_0_6.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {row.age_0_6.female}
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_0_6.male +
                                                                row.age_0_6
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_7m_2y: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_7m_2y.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {
                                                                row.age_7m_2y
                                                                    .female
                                                            }
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_7m_2y
                                                                .male +
                                                                row.age_7m_2y
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_3_5: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_3_5.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {row.age_3_5.female}
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_3_5.male +
                                                                row.age_3_5
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_6_12: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_6_12.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {
                                                                row.age_6_12
                                                                    .female
                                                            }
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_6_12.male +
                                                                row.age_6_12
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_13_17: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_13_17.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {
                                                                row.age_13_17
                                                                    .female
                                                            }
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_13_17
                                                                .male +
                                                                row.age_13_17
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_18_59: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_18_59.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {
                                                                row.age_18_59
                                                                    .female
                                                            }
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_18_59
                                                                .male +
                                                                row.age_18_59
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                                age_60_up: (row) => (
                                                    <div>
                                                        <div>
                                                            Male:{" "}
                                                            {row.age_60_up.male}
                                                        </div>
                                                        <div>
                                                            Female:{" "}
                                                            {
                                                                row.age_60_up
                                                                    .female
                                                            }
                                                        </div>
                                                        <div className="font-semibold mt-1 text-blue-600">
                                                            Total:{" "}
                                                            {row.age_60_up
                                                                .male +
                                                                row.age_60_up
                                                                    .female}
                                                        </div>
                                                    </div>
                                                ),
                                            };

                                            return (
                                                <TableSection
                                                    key={`hazard-${hazardIndex}`}
                                                    icon={<Users />}
                                                    color="blue"
                                                    title={`Population Exposure - ${hazard.hazard_name}`}
                                                    description={`Population exposure per purok for ${hazard.hazard_name}`}
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
                                    )
                                )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
