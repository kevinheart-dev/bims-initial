import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import DynamicTable from "@/Components/DynamicTable";
import { useState, useEffect } from "react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import {
    HousePlus,
    MoveRight,
    Search,
    SquarePen,
    Trash2,
    User,
    UserPlus,
    UserRoundPlus,
    UsersRound,
    GraduationCap,
    BookOpen,
    School,
    RotateCcw,
} from "lucide-react";

import {
    FAMILY_TYPE_TEXT,
    INCOME_BRACKET_TEXT,
    INCOME_BRACKETS,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import InputLabel from "@/Components/InputLabel";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { Toaster, toast } from "sonner";

export default function Index({
    families,
    queryParams = null,
    puroks,
    residents,
    members,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Families",
            href: route("family.index"),
            showOnMobile: true,
        },
    ];
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        { key: "family_id", label: "Family ID" },
        { key: "name", label: "Name of Family Head" },
        { key: "family_name", label: "Family Name" },
        { key: "income_bracket", label: "Income Bracket" },
        { key: "income_category", label: "Income Category" },
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

    const viewFamily = (id) => {
        router.get(route("family.showfamily", id));
    };

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "famtype", "household_head", "income_bracket"].includes(
                key
            ) &&
            value &&
            value !== " "
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);

    const handlePrint = () => {
        window.print();
    };
    const columnRenderers = {
        family_id: (row) => row.id,
        name: (row) =>
            row.latest_head
                ? `${row.latest_head.firstname ?? ""} ${
                      row.latest_head.middlename ?? ""
                  } ${row.latest_head.lastname ?? ""} ${
                      row.latest_head.suffix ?? ""
                  }`
                : "Unknown",
        is_household_head: (row) =>
            row.is_household_head ? (
                <span className="py-1 px-2 rounded-xl bg-green-100 text-green-800">
                    Yes
                </span>
            ) : (
                <span className="py-1 px-2 rounded-xl bg-red-100 text-red-800">
                    No
                </span>
            ),
        family_name: (row) => (
            <Link
                href={route("family.showfamily", row?.id ?? 0)}
                className="hover:text-blue-500 hover:underline"
            >
                {(row?.family_name ?? "Unnamed") + " Family"}
            </Link>
        ),

        family_member_count: (row) => (
            <span className="flex items-center">
                {row?.members_count ?? 0} <User className="ml-2 h-5 w-5" />
            </span>
        ),

        income_bracket: (row) => {
            const bracketKey = row?.income_bracket;
            const bracketText = INCOME_BRACKET_TEXT?.[bracketKey];
            const bracketMeta = INCOME_BRACKETS?.[bracketKey];

            return bracketText ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        bracketMeta?.className ?? ""
                    }`}
                >
                    {bracketText}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        income_category: (row) => {
            const bracketMeta = INCOME_BRACKETS?.[row?.income_bracket];

            return bracketMeta ? (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${bracketMeta.className}`}
                >
                    {bracketMeta.label}
                </span>
            ) : (
                <span className="text-gray-500 italic">Unknown</span>
            );
        },

        family_type: (row) => FAMILY_TYPE_TEXT?.[row?.family_type] ?? "Unknown",

        house_number: (row) => {
            const houseNumber =
                row?.latest_head?.household_residents?.[0]?.household
                    ?.house_number;
            return houseNumber ?? "Unknown";
        },

        purok_number: (row) =>
            row?.latest_head?.street?.purok?.purok_number ?? "Unknown",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row?.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(row?.id),
                    },
                    {
                        label: "View Family",
                        icon: <UsersRound className="w-4 h-4 text-blue-600" />,
                        onClick: () => viewFamily(row?.id),
                    },
                ]}
            />
        ),
    };

    // add family
    const handleAddFamily = () => {
        setIsModalOpen(true);
    };
    const defaultMember = {
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: "",
        purok_number: "",
        relationship_to_head: "",
        household_position: "",
    };

    const residentsList = residents.map((res) => ({
        label: `${res.resident.firstname} ${res.resident.middlename} ${
            res.resident.lastname
        } ${res.resident.suffix ?? ""}`,
        value: res.resident.id.toString(),
    }));

    const memberList = members.map((mem) => ({
        label: `${mem.firstname} ${mem.middlename} ${mem.lastname} ${
            mem.suffix ?? ""
        }`,
        value: mem.id.toString(),
    }));

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        house_number: null,
        members: [defaultMember],
    });

    const handleModalClose = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const addMember = () => {
        setData("members", [...(data.members || []), { ...defaultMember }]);
    };
    const removeMember = (memberIndex) => {
        const updated = [...(data.members || [])];
        updated.splice(memberIndex, 1);
        setData("members", updated);
        toast.warning("Member removed.", {
            duration: 2000,
        });
    };
    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = members.find((r) => r.id == e.target.value);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("purok_number", resident.purok_number);
            setData("house_number", resident.latest_household.house_number);
            setData("birthdate", resident.birthdate);
            setData("resident_image", resident.resident_picture_path);
        }
    };
    const handleDynamicResidentChange = (e, index) => {
        const updatedMembers = [...data.members];
        const selected = members.find((r) => r.id == e.target.value);

        if (selected) {
            updatedMembers[index] = {
                ...updatedMembers[index],
                resident_id: selected.id ?? "",
                resident_name: `${selected.firstname ?? ""} ${
                    selected.middlename ?? ""
                } ${selected.lastname ?? ""} ${selected.suffix ?? ""}`,
                purok_number: selected.purok_number ?? "",
                birthdate: selected.birthdate ?? "",
                resident_image: selected.image ?? null,
            };
            setData({ ...data, members: updatedMembers });
        }
    };
    const handleMemberFieldChange = (e, index) => {
        const { name, value } = e.target;
        const updatedMembers = [...data.members];
        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: value,
        };
        setData("members", updatedMembers);
    };
    const handleSubmitFamily = (e) => {
        e.preventDefault();
        post(route("family.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        {/* <pre>{JSON.stringify(residents, undefined, 3)}</pre> */}
                        <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <DynamicTableControls
                                    allColumns={allColumns}
                                    visibleColumns={visibleColumns}
                                    setVisibleColumns={setVisibleColumns}
                                    onPrint={handlePrint}
                                    showFilters={showFilters}
                                    toggleShowFilters={() =>
                                        setShowFilters((prev) => !prev)
                                    }
                                />
                            </div>
                            {/* Search, and other buttons */}
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-[300px] max-w-lg items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search Family or House No."
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e.target.value)
                                        }
                                        className="w-full"
                                    />
                                    <div className="relative group z-50">
                                        <Button
                                            type="submit"
                                            className="border active:bg-blue-900 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white flex items-center gap-2 bg-transparent"
                                            variant="outline"
                                        >
                                            <Search />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Search
                                        </div>
                                    </div>
                                </form>
                                <div className="relative group z-50">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        onClick={handleAddFamily}
                                    >
                                        <UserRoundPlus className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        Add a Family
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showFilters && (
                            <FilterToggle
                                queryParams={queryParams}
                                searchFieldName={searchFieldName}
                                visibleFilters={[
                                    "purok",
                                    "famtype",
                                    "household_head",
                                    "income_bracket",
                                ]}
                                puroks={puroks}
                                showFilters={true}
                                clearRouteName="family.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={families}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            queryParams={queryParams}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                            // showTotal={true}
                        />
                    </div>
                    <SidebarModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            handleModalClose();
                        }}
                        title={"Add a Family"}
                    >
                        <form
                            className="bg-gray-50 p-4 rounded-lg"
                            onSubmit={handleSubmitFamily}
                        >
                            <h3 className="text-xl font-medium text-gray-700 mb-8">
                                Household Head Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                                <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                    <InputLabel
                                        htmlFor={`resident_image`}
                                        value="Profile Photo"
                                    />
                                    <img
                                        src={
                                            data.resident_image
                                                ? `/storage/${data.resident_image}`
                                                : "/images/default-avatar.jpg"
                                        }
                                        alt={`Resident Image`}
                                        className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                    />
                                </div>
                                <div className="md:col-span-4 space-y-2">
                                    <div className="w-full">
                                        <DropdownInputField
                                            label="Full Name"
                                            name="resident_name"
                                            value={data.resident_name || ""}
                                            placeholder="Select a resident"
                                            onChange={(e) =>
                                                handleResidentChange(e)
                                            }
                                            items={memberList}
                                        />
                                        <InputError
                                            message={errors.resident_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <div>
                                            <InputField
                                                label="Birthdate"
                                                name="birthdate"
                                                value={data.birthdate || ""}
                                                readOnly={true}
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Purok Number"
                                                name="purok_number"
                                                value={data.purok_number}
                                                readOnly={true}
                                            />
                                        </div>
                                        <div>
                                            <InputField
                                                label="House Number"
                                                name="house_number"
                                                value={data.house_number}
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-700">
                                Family Members
                            </h3>
                            <div className="space-y-4 mt-4">
                                {(data.members || []).map(
                                    (member, memberIndex) => (
                                        <div
                                            key={memberIndex}
                                            className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                        >
                                            {/* Left: input fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                                                <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                                    <InputLabel
                                                        htmlFor={`resident_image`}
                                                        value="Profile Photo"
                                                    />
                                                    <img
                                                        src={
                                                            member.resident_image
                                                                ? `/storage/${member.resident_image}`
                                                                : "/images/default-avatar.jpg"
                                                        }
                                                        alt={`Resident Image`}
                                                        className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                                    />
                                                </div>
                                                <div className="md:col-span-4 space-y-2">
                                                    <div className="w-full">
                                                        <DropdownInputField
                                                            label="Full Name"
                                                            name="resident_name"
                                                            value={
                                                                member.resident_name ||
                                                                ""
                                                            }
                                                            placeholder="Select a resident"
                                                            onChange={(e) =>
                                                                handleDynamicResidentChange(
                                                                    e,
                                                                    memberIndex
                                                                )
                                                            }
                                                            items={memberList}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.resident_id
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <div>
                                                            <InputField
                                                                label="Birthdate"
                                                                name="birthdate"
                                                                value={
                                                                    member.birthdate ||
                                                                    ""
                                                                }
                                                                readOnly={true}
                                                            />
                                                        </div>

                                                        <div>
                                                            <InputField
                                                                label="Purok Number"
                                                                name="purok_number"
                                                                value={
                                                                    member.purok_number
                                                                }
                                                                readOnly={true}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="w-full">
                                                    <DropdownInputField
                                                        label="Relationship to Head"
                                                        name="relationship_to_head"
                                                        onChange={(e) =>
                                                            handleMemberFieldChange(
                                                                e,
                                                                memberIndex
                                                            )
                                                        }
                                                        value={
                                                            member.relationship_to_head
                                                        }
                                                        items={[
                                                            {
                                                                label: "Spouse",
                                                                value: "spouse",
                                                            },
                                                            {
                                                                label: "Child",
                                                                value: "child",
                                                            },
                                                            {
                                                                label: "Sibling",
                                                                value: "sibling",
                                                            },
                                                            {
                                                                label: "Parent",
                                                                value: "parent",
                                                            },
                                                            {
                                                                label: "Parent-in-law",
                                                                value: "parent_in_law",
                                                            },
                                                            {
                                                                label: "Grandparent",
                                                                value: "grandparent",
                                                            },
                                                        ]}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `members.${memberIndex}.relationship_to_head`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <DropdownInputField
                                                        label="Household Position"
                                                        name="household_position"
                                                        onChange={(e) =>
                                                            handleMemberFieldChange(
                                                                e,
                                                                memberIndex
                                                            )
                                                        }
                                                        value={
                                                            member.household_position
                                                        }
                                                        items={[
                                                            {
                                                                label: "Primary/Nuclear",
                                                                value: "primary",
                                                            },
                                                            {
                                                                label: "Extended",
                                                                value: "extended",
                                                            },
                                                            {
                                                                label: "Boarder",
                                                                value: "boarder",
                                                            },
                                                        ]}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `members.${memberIndex}.household_position`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Right: remove button */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeMember(memberIndex)
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                title="Remove"
                                            >
                                                <IoIosCloseCircleOutline />
                                            </button>
                                        </div>
                                    )
                                )}
                                <div className="flex justify-between items-center p-3">
                                    <button
                                        type="button"
                                        onClick={() => addMember()}
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                        title="Add vehicle"
                                    >
                                        <IoIosAddCircleOutline className="text-4xl" />
                                        <span className="ml-1">Add Member</span>
                                    </button>
                                    <div className="flex justify-end items-center gap-2">
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                        <Button
                                            className="bg-blue-700 hover:bg-blue-400 "
                                            type={"submit"}
                                        >
                                            Add <MoveRight />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </SidebarModal>
                </div>
            </div>
        </AdminLayout>
    );
}
