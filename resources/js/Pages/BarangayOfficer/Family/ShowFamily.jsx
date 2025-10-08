import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ActionMenu from "@/components/ActionMenu"; // your custom action component
import DynamicTable from "@/Components/DynamicTable";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import * as CONSTANTS from "@/constants";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import SidebarModal from "@/Components/SidebarModal";
import {
    Home,
    Eye,
    Share2,
    Network,
    Search,
    SquarePen,
    Trash2,
    X,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { Toaster, toast } from "sonner";

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
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [householdHeadId, setHouseholdHeadId] = useState(null);

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
        router.get(route("resident.edit", id));
    };

    // ==== delete modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.get(route("family.remove", residentToDelete));
        setIsDeleteModalOpen(false);
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

    // === FOR RESIDENT SIDE MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleView = async (resident) => {
        try {
            const response = await axios.get(
                `${APP_URL}/resident/showresident/${resident}`
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
            value !== "All"
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
    useEffect(() => {
        if (!Array.isArray(members)) return;

        const head = members.find((member) =>
            member.household_residents?.some(
                (hr) => hr.relationship_to_head === "self"
            )
        );

        setHouseholdHeadId(head?.id ?? null);
    }, [members]);

    // === AP TO HERE

    const columnRenderers = {
        resident_id: (member) => member.id,
        name: (member) =>
            `${member.firstname} ${member.middlename ?? ""} ${
                member.lastname ?? ""
            } ${member.suffix ?? ""}`,
        gender: (member) => {
            const genderKey = member.gender;
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
            CONSTANTS.RELATIONSHIP_TO_HEAD_TEXT[
                member.household_residents?.[0]?.relationship_to_head
            ] || "",
        household_position: (member) =>
            CONSTANTS.HOUSEHOLD_POSITION_TEXT[
                member.household_residents?.[0]?.household_position
            ] || "",
        employment_status: (member) =>
            CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[
                member?.employment_status
            ],
        registered_voter: (member) => {
            const status = member?.registered_voter ?? 0;
            const label =
                CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT[status] ?? "Unknown";
            const className =
                CONSTANTS.RESIDENT_REGISTER_VOTER_CLASS[status] ??
                "p-1 bg-gray-300 text-black rounded-lg";

            return <span className={className}>{label}</span>;
        },
        is_pwd: (member) => CONSTANTS.MEDICAL_PWD_TEXT[member?.is_pwd],
        actions: (member) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(member.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(member.id),
                    },
                    {
                        label: "Remove",
                        icon: <X className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(member.id),
                    },
                ]}
            />
        ),
    };

    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    }, [success]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Family" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4">
                {/* <pre>{JSON.stringify(members, undefined, 3)}</pre> */}
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Home className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Family Details
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        View and manage the records of this
                                        specific family, including members,
                                        relationships, and household links.
                                    </p>
                                </div>
                            </div>
                        </div>
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
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                {/* Search Bar */}
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
                                {householdHeadId && (
                                    <Link
                                        href={route("resident.familytree", {
                                            resident: householdHeadId,
                                        })}
                                    >
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
                                )}
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
                                clearRouteName="family.showfamily"
                                clearRouteParams={{ family: family_details.id }}
                            />
                        )}
                        <DynamicTable
                            passedData={members}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            // showTotal={true}
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
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                }}
                onConfirm={confirmDelete}
                residentId={residentToDelete}
                title={"Confirm Removal"}
                message={
                    "Are you sure you want to remove resident from this household? This action cannot be undone."
                }
                buttonLabel={"I UNDERSTAND, REMOVE"}
            />
        </AdminLayout>
    );
}
