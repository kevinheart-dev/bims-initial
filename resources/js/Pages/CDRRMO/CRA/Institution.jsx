import { useState } from "react";
import { Users, Building2 } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import BarangayFilterCard from "@/Components/BarangayFilterCard";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";

export default function Dashboard({
    institutionsData,
    barangays = [],
    selectedBarangay,
    queryParams,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const isDataNull = !institutionsData || institutionsData.length === 0;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.institutions"),
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
                                {JSON.stringify(institutionsData, undefined, 2)}
                            </pre> */}
                            {institutionsData.length > 0 &&
                                institutionsData.map((barangay, index) => {
                                    const allColumns = [
                                        {
                                            key: "name",
                                            label: "Institution Name",
                                        },
                                        {
                                            key: "male_members",
                                            label: "Male Members",
                                        },
                                        {
                                            key: "female_members",
                                            label: "Female Members",
                                        },
                                        {
                                            key: "lgbtq_members",
                                            label: "LGBTQ Members",
                                        },
                                        {
                                            key: "total_members",
                                            label: "Total Members",
                                        },
                                        {
                                            key: "head_name",
                                            label: "Head Name",
                                        },
                                        {
                                            key: "contact_no",
                                            label: "Contact No.",
                                        },
                                        {
                                            key: "registered",
                                            label: "Registered",
                                        },
                                        {
                                            key: "programs_services",
                                            label: "Programs/Services",
                                        },
                                    ];

                                    const rowData = barangay.institutions.map(
                                        (inst) => ({
                                            ...inst,
                                        })
                                    );

                                    const columnRenderers = {
                                        name: (row) => (
                                            <span className="font-semibold text-gray-700">
                                                {row.name}
                                            </span>
                                        ),
                                        male_members: (row) => (
                                            <span className="text-gray-700">
                                                {row.male_members}
                                            </span>
                                        ),
                                        female_members: (row) => (
                                            <span className="text-gray-700">
                                                {row.female_members}
                                            </span>
                                        ),
                                        lgbtq_members: (row) => (
                                            <span className="text-gray-700">
                                                {row.lgbtq_members}
                                            </span>
                                        ),
                                        total_members: (row) => (
                                            <span className="font-bold text-blue-600">
                                                {row.total_members}
                                            </span>
                                        ),
                                        head_name: (row) => (
                                            <span className="text-gray-700">
                                                {row.head_name}
                                            </span>
                                        ),
                                        contact_no: (row) => (
                                            <span className="text-gray-700">
                                                {row.contact_no}
                                            </span>
                                        ),
                                        registered: (row) => (
                                            <span className="text-gray-700">
                                                {row.registered}
                                            </span>
                                        ),
                                        programs_services: (row) => (
                                            <span className="text-gray-700">
                                                {row.programs_services}
                                            </span>
                                        ),
                                    };

                                    return (
                                        <TableSection
                                            key={index}
                                            icon={<Building2 />}
                                            color="green"
                                            title={`Institutions in ${barangay.barangay_name}`}
                                            description={`List of institutions and total members in ${barangay.barangay_name}`}
                                            tableProps={{
                                                component: DynamicTable,
                                                passedData: rowData,
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
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
