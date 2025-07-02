import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FamilyTree from "@/Components/FamilyTree";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";

export default function Index() {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Add Family", showOnMobile: true },
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("family_relation.store"));
    };
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <h1 className="text-2xl font-bold mb-6">
                            <form onSubmit={onSubmit}></form>
                        </h1>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
