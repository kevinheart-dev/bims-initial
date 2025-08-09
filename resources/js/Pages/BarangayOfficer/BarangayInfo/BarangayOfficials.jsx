import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import OfficialCard from "@/Components/OfficialCards";

const BarangayOfficials = () => {
    const breadcrumbs = [{ label: "Barangay Officials", showOnMobile: false }];

    return (
        <AdminLayout>
            <Head title="Barangay Officials" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                <OfficialCard />
            </div>

        </AdminLayout>
    );
};

export default BarangayOfficials;
