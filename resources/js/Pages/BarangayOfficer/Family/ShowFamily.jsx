import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import {
    HousePlus,
    Network,
    Search,
    SquarePen,
    SquarePlus,
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
    HOUSEHOLD_POSITION_TEXT,
    INCOME_BRACKETS,
    MEDICAL_PWD_TEXT,
    RELATIONSHIP_TO_HEAD_TEXT,
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
        router.get(
            route("family.showfamily", {
                family: family_details.id,
                ...queryParams,
            })
        );
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
        { key: "relationship_to_head", label: "Relationship to Head" },
        { key: "household_position", label: "Household Position" },
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
        relationship_to_head: (member) =>
            RELATIONSHIP_TO_HEAD_TEXT[
                member.household_residents?.[0]?.relationship_to_head
            ] || "",
        household_position: (member) =>
            HOUSEHOLD_POSITION_TEXT[
                member.household_residents?.[0]?.household_position
            ] || "",
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
                                {family_details.family_name} Family
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
                                    <div>
                                        Household Head
                                        {family_details.members.filter(
                                            (m) => m.is_household_head
                                        ).length > 1
                                            ? "s"
                                            : ""}
                                        :{" "}
                                        <span className="font-medium text-gray-800">
                                            {family_details.members
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
                                        Total Members:{" "}
                                        <span>
                                            {family_details.members.length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-3">
                        <div className="my-1 mb-3 flex justify-between items-center">
                            <div className="flex w-full max-w-sm items-center space-x-1">
                                <Link href={route("family.create")}>
                                    <Button className="bg-blue-700 hover:bg-blue-500 ">
                                        <SquarePlus /> Add a Relationship
                                    </Button>
                                </Link>
                                <Link href={route("family.create")}>
                                    <Button className="bg-blue-700 hover:bg-blue-500 ">
                                        <Network /> Show Family Tree
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex w-full justify-end items-end space-x-1">
                                {/* Search Bar */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Family Member Name"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e.target.value)
                                        }
                                        className="ml-4"
                                    />
                                    <Button type="submit">
                                        <Search />
                                    </Button>
                                </form>
                            </div>
                        </div>
                        <DynamicTable
                            passedData={members}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            showTotal={true}
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="flex gap-2 w-full">
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("gender", value)
                                        }
                                        value={queryParams.gender}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="male">
                                                Male
                                            </SelectItem>
                                            <SelectItem value="female">
                                                Female
                                            </SelectItem>
                                            <SelectItem value="LGBTQ">
                                                LGBTQ+
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("age_group", value)
                                        }
                                        value={queryParams.age_group}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Age Group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="child">
                                                0 - 12 (Child)
                                            </SelectItem>
                                            <SelectItem value="teen">
                                                13 - 17 (Teen)
                                            </SelectItem>
                                            <SelectItem value="young_adult">
                                                18 - 25 (Young Adult)
                                            </SelectItem>
                                            <SelectItem value="adult">
                                                26 - 59 (Adult)
                                            </SelectItem>
                                            <SelectItem value="senior">
                                                60+ (Senior)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("relation", value)
                                        }
                                        value={queryParams.relation}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Relationship to Head" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="self">
                                                Self
                                            </SelectItem>
                                            <SelectItem value="child">
                                                Child
                                            </SelectItem>
                                            <SelectItem value="spouse">
                                                Spouse
                                            </SelectItem>
                                            <SelectItem value="parent">
                                                Parent
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName(
                                                "household_position",
                                                value
                                            )
                                        }
                                        value={queryParams.household_position}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Household Position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="primary">
                                                Nuclear/Primary
                                            </SelectItem>
                                            <SelectItem value="extended">
                                                Extended
                                            </SelectItem>
                                            <SelectItem value="boarder">
                                                Boarder
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("estatus", value)
                                        }
                                        value={queryParams.estatus}
                                    >
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="Employment Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="student">
                                                Student
                                            </SelectItem>
                                            <SelectItem value="employed">
                                                Employed
                                            </SelectItem>
                                            <SelectItem value="unemployed">
                                                Unemployed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName(
                                                "voter_status",
                                                value
                                            )
                                        }
                                        value={queryParams.voter_status}
                                    >
                                        <SelectTrigger className="w-[170px]">
                                            <SelectValue placeholder="Voter Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="1">
                                                Registered Voter
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Unregistered Voter
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        onValueChange={(value) =>
                                            searchFieldName("is_pwd", value)
                                        }
                                        value={queryParams.is_pwd}
                                    >
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Is PWD" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">
                                                All
                                            </SelectItem>
                                            <SelectItem value="1">
                                                PWD
                                            </SelectItem>
                                            <SelectItem value="0">
                                                Not PWD
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex justify-end">
                                    <ClearFilterButton
                                        routeName="family.showfamily"
                                        routeParams={{
                                            family: family_details.id,
                                        }}
                                    />
                                </div>
                            </div>
                        </DynamicTable>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
