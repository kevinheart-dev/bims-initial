import { useState } from "react";
import { Users, Cross, Activity } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";

export default function Dashboard({ populationData, queryParams }) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const allcol1 = [
        { key: "id", label: "No." },
        { key: "name", label: "Barangay Name" },
        { key: "total_population", label: "Total Population" },
        { key: "total_households", label: "Total Households" },
        { key: "total_families", label: "Total Families" },
    ];
    const [viscol1] = useState(allcol1.map((col) => col.key));
    const colrender1 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number}
            </span>
        ),
        name: (row) => (
            <span className="font-medium text-gray-800">
                {row.barangay_name || "—"}
            </span>
        ),
        total_population: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_population?.toLocaleString() ?? "0"}
            </span>
        ),
        total_households: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_households?.toLocaleString() ?? "0"}
            </span>
        ),
        total_families: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_families?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const isDataNull = populationData === null;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-white">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {isDataNull ? (
                        <div className="flex flex-col items-center justify-center mt-20">
                            <img
                                src="/images/chart_error.png"
                                alt="No data"
                                className="w-48 h-48 mb-4"
                            />
                            <p className="text-gray-500 text-lg text-center">
                                Please select a year to display the dashboard
                                data.
                            </p>
                        </div>
                    ) : (
                        <>
                            <TableSection
                                icon={<Users />}
                                color="blue"
                                title="General Population Overview"
                                description="Displays summarized data of total population, households, and families across all barangays. The table below provides a clear overview for monitoring and analysis purposes."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: populationData,
                                    allColumns: allcol1,
                                    columnRenderers: colrender1,
                                    queryParams,
                                    visibleColumns: viscol1,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
