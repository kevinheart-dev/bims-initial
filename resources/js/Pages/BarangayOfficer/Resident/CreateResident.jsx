import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import PersonalInformation from "@/Components/ResidentInput/PersonalInformation";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";

export default function Index({ auth }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Create a New Resident", showOnMobile: true },
    ];
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-7 p-5">
                            <PersonalInformation />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
