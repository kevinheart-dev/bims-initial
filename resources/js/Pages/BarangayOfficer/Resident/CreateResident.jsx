import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import PersonalInformation from "@/Components/ResidentInput/PersonalInformation";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";

export default function Index({
    auth,
    puroks,
    occupationTypes,
    streets,
    households,
    barangays,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Create a New Resident", showOnMobile: true },
    ];
    const { props } = usePage();
    const error = props.error;
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-2 p-5">
                            {error && error.length > 0 && (
                                <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
                                    {error}
                                </div>
                            )}
                            <PersonalInformation
                                puroks={puroks}
                                occupationTypes={occupationTypes}
                                streets={streets}
                                households={households}
                                barangays={barangays}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
