import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import EditPersonalInformation from "@/Components/ResidentInput/EditPersonalInformation";
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
    resident = null,
    familyHeads,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Edit Resident", showOnMobile: true },
    ];
    const props = usePage().props;
    const error = props?.error ?? null;
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        {/* <pre>{JSON.stringify(resident.data, null, 2)}</pre> */}
                        <div className=" my-2 p-5">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <EditPersonalInformation
                                puroks={puroks}
                                occupationTypes={occupationTypes}
                                streets={streets}
                                households={households}
                                barangays={barangays}
                                resident={resident.data}
                                familyHeads={familyHeads}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
