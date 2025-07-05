import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import {
    HousePlus,
    Search,
    SquarePen,
    Trash2,
    User,
    UserRoundPlus,
    UsersRound,
} from "lucide-react";
import DynamicTable from "@/Components/DynamicTable";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    FAMILY_TYPE_TEXT,
    INCOME_BRACKETS,
    MEDICAL_PWD_TEXT,
    RESIDENT_EMPLOYMENT_STATUS_TEXT,
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
    RESIDENT_REGISTER_VOTER_CLASS,
    RESIDENT_REGISTER_VOTER_TEXT,
} from "@/constants";
import ClearFilterButton from "@/Components/ClearFiltersButton";

export default function Index({
    members,
    family_details,
    household_details,
    queryParams = null,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: false,
        },
        {
            label: "View Family",
            showOnMobile: true,
        },
    ];

    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };

    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("family.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "resident_id", label: "Resident ID" },
        { key: "name", label: "Resident Name" },
        { key: "gender", label: "Gender" },
        { key: "age", label: "Age" },
        { key: "employment_status", label: "Employment Status" },
        { key: "registered_voter", label: "Register Voter" },
        { key: "is_pwd", label: "Is PWD" },
        { key: "actions", label: "Actions" },
    ];

    const handleEdit = (id) => {
        // Your edit logic here
    };

    const handleDelete = (id) => {
        // Your delete logic here
    };

    const calculateAge = (birthdate) => {
        if (!birthdate) return "Unknown";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const columnRenderers = {
        resident_id: (member) => member.id,
        name: (member) =>
            `${member.firstname} ${member.middlename ?? ""} ${
                member.lastname ?? ""
            } ${member.suffix ?? ""}`,
        gender: (member) => {
            const genderKey = member.gender;
            const label = RESIDENT_GENDER_TEXT2[genderKey] ?? "Unknown";
            const className =
                RESIDENT_GENDER_COLOR_CLASS[genderKey] ?? "bg-gray-300";

            return (
                <span
                    className={`py-1 px-2 rounded-xl text-sm font-medium ${className}`}
                >
                    {label}
                </span>
            );
        },
        age: (member) => {
            const age = calculateAge(member.birthdate);

            if (typeof age !== "number") return "Unknown";

            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                        {age} years old
                    </span>
                    {age > 60 && (
                        <span className="text-xs text-rose-600 font-semibold">
                            Senior Citizen
                        </span>
                    )}
                </div>
            );
        },
        employment_status: (member) =>
            RESIDENT_EMPLOYMENT_STATUS_TEXT[member?.employment_status],
        registered_voter: (member) => {
            const status = member?.registered_voter ?? 0;
            const label = RESIDENT_REGISTER_VOTER_TEXT[status] ?? "Unknown";
            const className =
                RESIDENT_REGISTER_VOTER_CLASS[status] ??
                "p-1 bg-gray-300 text-black rounded-lg";

            return <span className={className}>{label}</span>;
        },
        is_pwd: (member) => MEDICAL_PWD_TEXT[member?.is_pwd],
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
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(members, undefined, 3)}</pre> */}
                    <div className="flex flex-row overflow-hidden bg-gray-50 shadow-md rounded-xl sm:rounded-lg m-3">
                        <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                        <div className="flex flex-col justify-start items-start p-4 w-full">
                            <p className="font-semibold text-lg md:text-3xl mb-4 md:mb-6">
                                {family_details.family_name}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-1 md:space-y-2 text-sm md:text-lg text-gray-600">
                                    <div>
                                        Family Type:{" "}
                                        <span>
                                            {
                                                FAMILY_TYPE_TEXT[
                                                    family_details.family_type
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        Family Head
                                        {members.filter((m) => m.is_family_head)
                                            .length > 1
                                            ? "s"
                                            : ""}
                                        :{" "}
                                        <span className="font-medium text-gray-800">
                                            {members
                                                .filter(
                                                    (member) =>
                                                        member.is_family_head
                                                )
                                                .map(
                                                    (member) =>
                                                        `${member.firstname} ${member.lastname}`
                                                )
                                                .join(", ")}
                                        </span>
                                    </div>
                                    <div>
                                        Income Bracket:{" "}
                                        <span
                                            className={`p-0 md:p-2 rounded ${
                                                INCOME_BRACKETS[
                                                    family_details
                                                        .income_bracket
                                                ]?.className ?? ""
                                            }`}
                                        >
                                            {INCOME_BRACKETS[
                                                family_details.income_bracket
                                            ]?.label ?? "Unknown"}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1 md:space-y-2 text-sm md:text-lg text-gray-600">
                                    <Link
                                        href={route(
                                            "household.show",
                                            family_details.household_id
                                        )}
                                        className="hover:underline text-blue-500 hover:text-blue-300"
                                    >
                                        <div>
                                            Household Number:{" "}
                                            <span>
                                                {household_details.house_number}
                                            </span>
                                        </div>
                                    </Link>
                                    <div>
                                        Household Head
                                        {members.filter(
                                            (m) => m.is_household_head
                                        ).length > 1
                                            ? "s"
                                            : ""}
                                        :{" "}
                                        <span className="font-medium text-gray-800">
                                            {members
                                                .filter(
                                                    (member) =>
                                                        member.is_household_head
                                                )
                                                .map(
                                                    (member) =>
                                                        `${member.firstname} ${member.lastname}`
                                                )
                                                .join(", ") || "None"}
                                        </span>
                                    </div>

                                    <div>
                                        Total Members:{" "}
                                        <span>{members.length}</span>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div className="p-4 bg-white shadow rounded">
                                    Detail 1
                                </div>
                                <div className="p-4 bg-white shadow rounded">
                                    Detail 2
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-3">
                        <DynamicTable
                            passedData={members}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                        ></DynamicTable>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
