import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import OfficialCard from "@/Components/OfficialCards";
import { BARANGAY_OFFICIAL_POSITIONS_TEXT } from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";

const BarangayOfficials = () => {
    const { officials } = usePage().props; // ✅ Get data from Laravel
    const breadcrumbs = [{ label: "Barangay Officials", showOnMobile: false }];
    return (
        <AdminLayout>
            <Head title="Barangay Officials" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <pre>{JSON.stringify(officials, undefined, 3)}</pre>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                {officials.map((official) => (
                    <OfficialCard
                        key={official.id}
                        name={`${official.resident.firstname} ${official.resident.lastname}`}
                        position={BARANGAY_OFFICIAL_POSITIONS_TEXT[official.position]}
                        purok={official.designation?.purok?.purok_number || "N/A"}
                        term={`${official.designation?.started_at || "0000"} – ${official.designation?.ended_at || "0000"}`}
                        phone={official.resident.contact_number}
                        email={official.resident.email}
                        image={official.resident.resident_picture_path}
                    />
                ))}
            </div>
        </AdminLayout>
    );
};

export default BarangayOfficials;
