import { useState } from "react";
import { Users, Pickaxe, BarChart3 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function Dashboard({
    humanResourcesData,
    overallHumanResourcesData,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !humanResourcesData || humanResourcesData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.humanResources"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />{" "}
                            {/* <pre>
                                {JSON.stringify(
                                    humanResourcesData,
                                    undefined,
                                    2
                                )}
                            </pre> */}
                            {!selectedBarangay &&
                                overallHumanResourcesData.length > 0 && (
                                    <TableSection
                                        icon={<BarChart3 />}
                                        color="blue"
                                        title="Overall Human Resources Summary"
                                        description="Aggregated totals of human resources across all barangays"
                                        tableProps={{
                                            component: DynamicTable,
                                            passedData:
                                                overallHumanResourcesData,
                                            allColumns: [
                                                { key: "number", label: "#" },
                                                {
                                                    key: "resource_name",
                                                    label: "Resource Name",
                                                }, // <-- updated
                                                {
                                                    key: "male_without_disability",
                                                    label: "Male (No Disability)",
                                                },
                                                {
                                                    key: "male_with_disability",
                                                    label: "Male (With Disability)",
                                                },
                                                {
                                                    key: "female_without_disability",
                                                    label: "Female (No Disability)",
                                                },
                                                {
                                                    key: "female_with_disability",
                                                    label: "Female (With Disability)",
                                                },
                                                {
                                                    key: "lgbtq_without_disability",
                                                    label: "LGBTQ (No Disability)",
                                                },
                                                {
                                                    key: "lgbtq_with_disability",
                                                    label: "LGBTQ (With Disability)",
                                                },
                                                {
                                                    key: "total",
                                                    label: "Total",
                                                },
                                            ],
                                            columnRenderers: {
                                                number: (row) => (
                                                    <span className="text-gray-700">
                                                        {row.number}
                                                    </span>
                                                ),
                                                resource_name: (
                                                    row // <-- updated
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {row.resource_name}
                                                    </span>
                                                ),
                                                male_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.male_without_disability
                                                        }
                                                    </span>
                                                ),
                                                male_with_disability: (row) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.male_with_disability
                                                        }
                                                    </span>
                                                ),
                                                female_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.female_without_disability
                                                        }
                                                    </span>
                                                ),
                                                female_with_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.female_with_disability
                                                        }
                                                    </span>
                                                ),
                                                lgbtq_without_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.lgbtq_without_disability
                                                        }
                                                    </span>
                                                ),
                                                lgbtq_with_disability: (
                                                    row
                                                ) => (
                                                    <span className="text-gray-700">
                                                        {
                                                            row.lgbtq_with_disability
                                                        }
                                                    </span>
                                                ),
                                                total: (row) => (
                                                    <span className="font-bold text-blue-600">
                                                        {row.total}
                                                    </span>
                                                ),
                                            },
                                            visibleColumns: [
                                                "number",
                                                "resource_name", // <-- updated
                                                "male_without_disability",
                                                "male_with_disability",
                                                "female_without_disability",
                                                "female_with_disability",
                                                "lgbtq_without_disability",
                                                "lgbtq_with_disability",
                                                "total",
                                            ],
                                            showTotal: true,
                                            tableHeight: "400px",
                                        }}
                                    />
                                )}
                            {humanResourcesData.length > 0 &&
                                humanResourcesData.map((barangay, index) => {
                                    const allColumns = [
                                        { key: "category", label: "Category" },
                                        {
                                            key: "resource_name",
                                            label: "Resource Name",
                                        },
                                        {
                                            key: "male_without_disability",
                                            label: "Male (No Disability)",
                                        },
                                        {
                                            key: "male_with_disability",
                                            label: "Male (With Disability)",
                                        },
                                        {
                                            key: "female_without_disability",
                                            label: "Female (No Disability)",
                                        },
                                        {
                                            key: "female_with_disability",
                                            label: "Female (With Disability)",
                                        },
                                        {
                                            key: "lgbtq_without_disability",
                                            label: "LGBTQ (No Disability)",
                                        },
                                        {
                                            key: "lgbtq_with_disability",
                                            label: "LGBTQ (With Disability)",
                                        },
                                        { key: "total", label: "Total" },
                                    ];

                                    const rowData = barangay.resources.map(
                                        (res) => ({ ...res })
                                    );

                                    const columnRenderers = {
                                        category: (row) => (
                                            <span className="text-gray-700">
                                                {row.category}
                                            </span>
                                        ),
                                        resource_name: (row) => (
                                            <span className="font-semibold text-gray-700">
                                                {row.resource_name}
                                            </span>
                                        ),
                                        male_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.male_without_disability}
                                            </span>
                                        ),
                                        male_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.male_with_disability}
                                            </span>
                                        ),
                                        female_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.female_without_disability}
                                            </span>
                                        ),
                                        female_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.female_with_disability}
                                            </span>
                                        ),
                                        lgbtq_without_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.lgbtq_without_disability}
                                            </span>
                                        ),
                                        lgbtq_with_disability: (row) => (
                                            <span className="text-gray-700">
                                                {row.lgbtq_with_disability}
                                            </span>
                                        ),
                                        total: (row) => (
                                            <span className="font-bold text-blue-600">
                                                {row.total}
                                            </span>
                                        ),
                                    };

                                    return (
                                        <TableSection
                                            key={index}
                                            icon={<Pickaxe />}
                                            color="green"
                                            title={`Human Resources in ${barangay.barangay_name}`}
                                            description={`List of human resources and totals in ${barangay.barangay_name}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rowData,
                                                allColumns,
                                                columnRenderers,
                                                visibleColumns: allColumns.map(
                                                    (c) => c.key
                                                ),
                                                showTotal: true, // This will sum the 'total' column if DynamicTable supports it
                                                tableHeight: "500px",
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
