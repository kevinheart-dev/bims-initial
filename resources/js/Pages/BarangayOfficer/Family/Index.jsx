import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FamiliesTable from "@/Components/FamiliesTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import { SquarePen, Trash2, User } from "lucide-react";

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
        { key: "name", label: "Name of Family Head" },
        { key: "is_household_head", label: "Household Head" },
        { key: "family_name", label: "Family Name" },
        { key: "income_bracket", label: "Income Bracket" },
        { key: "family_type", label: "Family Type" },
        { key: "family_member_count", label: "Members" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const handleEdit = (id) => {
        // Your edit logic here
    };

    const handleDelete = (id) => {
        // Your delete logic here
    };

    const columnRenderers = {
        family_id: (family) => family.family_id,
        name: (family) =>
            `${family.firstname} ${family.middlename ?? ""} ${
                family.lastname ?? ""
            }`,
        is_household_head: (family) =>
            family.is_household_head ? (
                <span className="py-1 px-2 rounded-xl bg-green-600 text-white">
                    Yes
                </span>
            ) : (
                <span className="py-1 px-2 rounded-xl bg-red-600 text-white">
                    No
                </span>
            ),
        family_name: (family) => family.family?.family_name,
        family_member_count: (family) => (
            <span className="flex items-center">
                {family.family_member_count} <User className="ml-2 h-5 w-5" />
            </span>
        ),
        income_bracket: (family) => family.family?.income_bracket,
        family_type: (family) => family.family?.family_type,
        house_number: (family) => family.household?.house_number,
        purok_number: (family) => family.household?.purok?.purok_number,
        actions: (family) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(family.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
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
