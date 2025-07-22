import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DynamicTable from "@/Components/DynamicTable";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { useState, useEffect } from "react";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import * as CONSTANTS from "@/constants";
import { Eye, SquarePen, Trash2, Network, Search, Share2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu"; // You forgot to import this before
import useAppUrl from "@/hooks/useAppUrl";

export default function Index({
    household_details,
    household_members,
    queryParams: initialQueryParams = null,
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

    // ✅ Ensure queryParams is defined before use
    const queryParams = initialQueryParams || {};
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
    // === FOR RESIDENT SIDE MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const APP_URL = useAppUrl();

    const handleView = async (resident) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/resident/showresident/${resident}`
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
    };
    // ===

    // === BEING ADDED

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );

    useEffect(() => {
        if (visibleColumns.length === 0) {
            setVisibleColumns(allColumns.map((col) => col.key));
        }
    }, []);

    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "gender",
                "age_group",
                "relation",
                "household_position",
                "estatus",
                "voter_status",
                "is_pwd",
            ].includes(key) &&
            value &&
            value !== ""
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

    // === AP TO HERE

    const handleEdit = (id) => {
        // Edit logic here
    };

    const handleDelete = (id) => {
        // Delete logic here
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
            const label =
                CONSTANTS.RESIDENT_GENDER_TEXT2[genderKey] ?? "Unknown";
            const className =
                CONSTANTS.RESIDENT_GENDER_COLOR_CLASS[genderKey] ??
                "bg-gray-300";

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
            CONSTANTS.RELATIONSHIP_TO_HEAD_TEXT[member.relationship_to_head] ||
            "",
        household_position: (member) =>
            CONSTANTS.HOUSEHOLD_POSITION_TEXT[member.household_position] || "",
        employment_status: (member) =>
            CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[
                member.resident.employment_status
            ],
        registered_voter: (member) => {
            const status = member.resident?.registered_voter ?? 0;
            const label =
                CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT[status] ?? "Unknown";

            const className =
                CONSTANTS.RESIDENT_REGISTER_VOTER_CLASS[status] ??
                "p-1 bg-gray-300 text-black rounded-lg";

            return <span className={className}>{label}</span>;
        },
        is_pwd: (member) => CONSTANTS.MEDICAL_PWD_TEXT[member.resident?.is_pwd],
        actions: (member) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(member.resident_id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(member.resident_id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(member.resident_id),
                    },
                ]}
            />
        ),
    };

    return (
        <AdminLayout>
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            {/* <pre>{JSON.stringify(household_details, undefined, 3)}</pre> */}
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
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
                            {/* Right Controls */}
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-[300px] max-w-lg items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Household Member Name"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            onKeyPressed("name", e)
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

                                <Link href={route("family.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add Relationship
                                        </div>
                                    </div>
                                </Link>

                                <Link href={route("family.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <Network className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Family Tree
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {showFilters && (
                            <FilterToggle
                                queryParams={queryParams}
                                searchFieldName={searchFieldName}
                                visibleFilters={[
                                    "gender",
                                    "age_group",
                                    "relation",
                                    "household_position",
                                    "estatus",
                                    "voter_status",
                                    "is_pwd",
                                ]}
                                showFilters={true}
                                clearRouteName="household.show"
                                clearRouteParams={{
                                    household: household_details.id,
                                }}
                            />
                        )}

                        {/* Data Table */}
                        <DynamicTable
                            passedData={household_members}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>
                </div>
            </div>
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Resident Details"
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
            </SidebarModal>
        </AdminLayout>
    );
}
