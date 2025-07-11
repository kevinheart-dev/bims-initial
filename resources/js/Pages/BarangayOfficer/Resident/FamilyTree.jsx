import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FamilyTree from "@/Components/FamilyTree";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";

export default function Index({ family_tree }) {
    console.log('Family Tree JSON:', family_tree);
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Family Tree", showOnMobile: true },
    ];
    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <>
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <h2 className="text-xl font-bold mb-3">
                            Dynamic Family Tree
                        </h2>
                        {/* <pre>{JSON.stringify(family_tree, undefined, 3)}</pre> */}
                        <div className="h-[600px] w-full">
                            <FamilyTree familyData={family_tree} />
                        </div>

                    </div>
                </div>
            </>
        </AdminLayout>
    );

}
