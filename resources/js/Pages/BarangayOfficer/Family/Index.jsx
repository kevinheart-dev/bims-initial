import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FamiliesTable from "@/Components/FamiliesTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import { SquarePen, Trash2 } from "lucide-react";

export default function Index({ families }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("resident.index"),
            showOnMobile: true,
        },
    ];

    const allColumns = [
        { key: "family_id", label: "Family ID" },
        { key: "name", label: "Name" },
        { key: "is_household_head", label: "Household Head" },
        { key: "is_family_head", label: "Family Head" },
        { key: "family_name", label: "Family Name" },
        { key: "income_bracket", label: "Income Bracket" },
        { key: "family_type", label: "Family Type" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const columnRenderers = {
        family_id: (family) => family.family_id,
        name: (family) =>
            `${family.firstname} ${family.middlename ?? ""} ${
                family.lastname ?? ""
            }`,
        is_household_head: (family) =>
            family.is_household_head ? (
                <span className="text-green-600">Yes</span>
            ) : (
                <span className="text-red-600">No</span>
            ),
        is_family_head: (family) =>
            family.is_family_head ? (
                <span className="text-green-600">Yes</span>
            ) : (
                <span className="text-red-600">No</span>
            ),
        family_name: (family) => family.family?.family_name,
        income_bracket: (family) => family.family?.income_bracket,
        family_type: (family) => family.family?.family_type,
        house_number: (family) => family.household?.house_number,
        purok_number: (family) => family.household?.purok?.purok_number,
        actions: (family) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: SquarePen,
                        onClick: () => handleEdit(family.id),
                    },
                    {
                        label: "Delete",
                        icon: Trash2,
                        onClick: () => handleDelete(family.id),
                    },
                ]}
            />
        ),
    };

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-white border border-gray-400 shadow-sm rounded-xl sm:rounded-lg p-4">
                        {/* <pre>{JSON.stringify(families, undefined, 3)}</pre> */}
                        <FamiliesTable
                            passedData={families}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
