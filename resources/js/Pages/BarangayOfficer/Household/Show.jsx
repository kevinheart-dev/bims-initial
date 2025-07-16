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
    HOUSEHOLD_CONDITION_TEXT,
    HOUSEHOLD_OWNERSHIP_TEXT,
    HOUSEHOLD_POSITION_TEXT,
    HOUSING_CONDITION_COLOR,
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
    household_details,
    household_members,
    queryParams = null,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("household.index"),
            showOnMobile: false,
        },
        {
            label: "Household Details",
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
            route("household.show", {
                household: household_details.id,
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
        resident_id: (member) => member.resident.id,
        name: (member) =>
            `${member.resident.firstname} ${member.resident.middlename ?? ""} ${
                member.resident.lastname ?? ""
            } ${member.resident.suffix ?? ""}`,
        gender: (member) => {
            const genderKey = member.resident.gender;
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
            const age = calculateAge(member.resident.birthdate);

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
            RELATIONSHIP_TO_HEAD_TEXT[member.relationship_to_head] || "Unknown",
        household_position: (member) =>
            HOUSEHOLD_POSITION_TEXT[member.household_position] || "Unknown",
        employment_status: (member) =>
            RESIDENT_EMPLOYMENT_STATUS_TEXT[member.resident.employment_status],
        registered_voter: (member) => {
            const status = member.resident.registered_voter ?? 0;
            const label = RESIDENT_REGISTER_VOTER_TEXT[status] ?? "Unknown";
            const className =
                RESIDENT_REGISTER_VOTER_CLASS[status] ??
                "p-1 bg-gray-300 text-black rounded-lg";

            return <span className={className}>{label}</span>;
        },
        is_pwd: (member) => MEDICAL_PWD_TEXT[member.resident.is_pwd],
        actions: (member) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(member.resident.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(member.resident.id),
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
                    {/* <pre>{JSON.stringify(household_members, undefined, 3)}</pre> */}
                    <div className="flex flex-row overflow-hidden bg-gray-50 shadow-md rounded-xl sm:rounded-lg m-3">
                        <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                        <div className="flex flex-col justify-start items-start p-4 w-full">
                            <p className="font-semibold text-lg md:text-3xl mb-4 md:mb-6">
                                Household Number {household_details.id}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-1 md:space-y-2 text-sm md:text-lg text-gray-600">
                                    <div>
                                        Household Head
                                        {household_details.household_residents.filter(
                                            (m) => m.resident.is_household_head
                                        ).length > 1
                                            ? "s"
                                            : ""}
                                        :{" "}
                                        <span className="font-medium text-gray-800">
                                            {household_details.household_residents
                                                .filter(
                                                    (m) =>
                                                        m.resident
                                                            .is_household_head
                                                )
                                                .map(
                                                    (m) =>
                                                        `${m.resident.firstname} ${m.resident.lastname}`
                                                )
                                                .join(", ") || "None"}
                                        </span>
                                    </div>
                                    <div>
                                        Ownership Type:{" "}
                                        <span>
                                            {
                                                HOUSEHOLD_OWNERSHIP_TEXT[
                                                    household_details
                                                        .ownership_type
                                                ]
                                            }
                                        </span>
                                    </div>

                                    <div>
                                        House Condition:{" "}
                                        <span
                                            className={`p-0 md:p-2 rounded ${
                                                HOUSING_CONDITION_COLOR[
                                                    household_details.housing_condition ??
                                                        ""
                                                ]
                                            }`}
                                        >
                                            {
                                                HOUSEHOLD_CONDITION_TEXT[
                                                    household_details.housing_condition ??
                                                        "Unknown"
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        House Structure:{" "}
                                        <span>
                                            {household_details.house_structure}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1 md:space-y-2 text-sm md:text-lg text-gray-600">
                                    <div>
                                        Year Established:{" "}
                                        <span>
                                            {household_details.year_established}
                                        </span>
                                    </div>

                                    <div>
                                        Number of Rooms:{" "}
                                        <span>
                                            {household_details.number_of_rooms}
                                        </span>
                                    </div>
                                    <div>
                                        Number of Floors:{" "}
                                        <span>
                                            {household_details.number_of_floors}
                                        </span>
                                    </div>
                                    <div>
                                        Total Household Members:{" "}
                                        <span>
                                            {
                                                household_details
                                                    .household_residents.length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex w-full overflow-hidden bg-gray-50 shadow-md rounded-xl m-3 border border-gray-100">
                            <div className="w-2 bg-blue-600 rounded-l-2xl"></div>
                            <div className="flex flex-col p-5 w-full">
                                <p className="text-xl font-semibold text-gray-800 mb-4">
                                    Household Toilets
                                </p>
                                <div className="space-y-2">
                                    {household_details.toilets.length > 0 ? (
                                        household_details.toilets.map(
                                            (toilet, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 bg-gray-50 text-gray-800 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                                                >
                                                    {toilet.toilet_type}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No toilet information available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full overflow-hidden bg-gray-50 shadow-md rounded-xl m-3 border border-gray-100">
                            <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                            <div className="flex flex-col justify-start items-start p-4 w-full">
                                <p className="font-semibold text-md md:text-lg mb-2 md:mb-4">
                                    Household Wash and Bath
                                </p>
                                <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300 w-full">
                                    {household_details.bath_and_wash_area
                                        ?.bath_and_wash_area ?? (
                                        <span className="text-gray-500 italic">
                                            No information available.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full overflow-hidden bg-gray-50 shadow-md rounded-xl m-3 border border-gray-100">
                            <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                            <div className="flex flex-col justify-start items-start p-4 w-full">
                                <p className="font-semibold text-md md:text-lg mb-2 md:mb-4">
                                    Household Electricity Types
                                </p>
                                <div className="space-y-2 w-full">
                                    {Array.isArray(
                                        household_details.electricity_types
                                    ) &&
                                    household_details.electricity_types.length >
                                        0 ? (
                                        household_details.electricity_types.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300"
                                                >
                                                    {item.electricity_type}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No electricity type information
                                            available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full overflow-hidden bg-gray-50 shadow-md rounded-xl m-3 border border-gray-100">
                            <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                            <div className="flex flex-col justify-start items-start p-4 w-full">
                                <p className="font-semibold text-md md:text-lg mb-2 md:mb-4">
                                    Household Waste Management Types
                                </p>
                                <div className="space-y-2 w-full">
                                    {Array.isArray(
                                        household_details.waste_management_types
                                    ) &&
                                    household_details.waste_management_types
                                        .length > 0 ? (
                                        household_details.waste_management_types.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-300"
                                                >
                                                    {item.waste_management_type}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No waste management information
                                            available.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full overflow-hidden bg-gray-50 shadow-md rounded-xl m-3 border border-gray-100">
                            <div className="p-1 mr-4 bg-blue-600 rounded-xl sm:rounded-lg"></div>
                            <div className="flex flex-col justify-start items-start p-4 w-full">
                                <p className="font-semibold text-md md:text-lg mb-2 md:mb-4">
                                    Household Water Sources
                                </p>
                                <div className="space-y-2 w-full">
                                    {Array.isArray(
                                        household_details.water_source_types
                                    ) &&
                                    household_details.water_source_types
                                        .length > 0 ? (
                                        household_details.water_source_types.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2  text-gray-800"
                                                >
                                                    {item.water_source_type}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No water source information
                                            available.
                                        </p>
                                    )}
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
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-sm items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Household Member Name"
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
                            passedData={household_members}
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
                                        routeName="household.show"
                                        routeParams={{
                                            household: household_details.id,
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
