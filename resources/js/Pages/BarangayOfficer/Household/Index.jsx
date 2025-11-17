import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Home,
    Eye,
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    User,
    FileUser,
    MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import * as CONSTANTS from "@/constants";

import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import ExportButton from "@/Components/ExportButton";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";

export default function Index({ households, puroks, streets, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Households", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [houseToDelete, setHouseToDelete] = useState(null); //delete

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
        router.get(route("household.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Household Head" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok" },
        { key: "street_name", label: "Street" },
        { key: "ownership_type", label: "Ownership Type" },
        { key: "housing_condition", label: "Housing Condition" },
        { key: "year_established", label: "Year Established" },
        { key: "house_structure", label: "House Structure" },
        { key: "number_of_rooms", label: "Number of Rooms" },
        { key: "number_of_floors", label: "Number of Floors" },
        { key: "number_of_occupants", label: "Number of Occupants" },
        { key: "actions", label: "Actions" },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    // Use useCallback for event handlers to prevent unnecessary re-renders of child components
    const handleView = async (residentId) => {
        try {
            // Using template literals for route if APP_URL is needed, or just route() helper
            const response = await axios.get(
                route("resident.showresident", residentId) // Assuming you have a route 'resident.showresident'
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching resident details:", error);
            toast.error("Failed to load resident details.", {
                description: error.message,
            });
        }
        setIsModalOpen(true);
    };

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
            ["purok", "street", "own_type", "condition", "structure"].includes(
                key
            ) &&
            value &&
            value !== ""
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const columnRenderers = {
        id: (house) =>
            house.household?.id ?? (
                <span className="text-gray-400 italic">N/A</span>
            ),

        name: (entry) => {
            const head = entry.resident;
            return head ? (
                <span
                    className="font-medium text-blue-600 hover:underline cursor-pointer"
                    onClick={() => handleView(head.id)}
                >
                    {head.firstname} {head.middlename ?? ""}{" "}
                    {head.lastname ?? ""} {head.suffix ?? ""}
                </span>
            ) : (
                <span className="text-gray-400 italic">No household head</span>
            );
        },

        house_number: (house) =>
            house.household?.house_number ? (
                <Link
                    href={route("household.show", house.household?.id)}
                    className="text-gray-700 hover:text-blue-600 hover:underline font-medium"
                >
                    {house.household.house_number}
                </Link>
            ) : (
                <span className="text-gray-400 italic">N/A</span>
            ),

        purok_number: (house) => {
            const purok = house.household?.purok?.purok_number;
            return purok ? (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    Purok {purok}
                </span>
            ) : (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
                    No Purok
                </span>
            );
        },

        street_name: (house) => {
            const street = house.household?.street?.street_name;
            return street ? (
                <span className="text-gray-700 font-medium">{street}</span>
            ) : (
                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <MapPin size={14} /> No street assigned
                </span>
            );
        },

        ownership_type: (house) => {
            const type = house.household?.ownership_type;
            const text = CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[type];

            return text ? (
                <span className="text-gray-700 font-medium">{text}</span>
            ) : (
                <span className="text-gray-400 italic">Unknown</span>
            );
        },

        housing_condition: (house) => {
            const condition = house.household?.housing_condition;
            const color =
                CONSTANTS.HOUSING_CONDITION_COLOR[condition] ??
                "bg-gray-100 text-gray-500";
            const text =
                CONSTANTS.HOUSEHOLD_CONDITION_TEXT[condition] ?? "Unknown";

            return (
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-lg ${color}`}
                >
                    {text}
                </span>
            );
        },

        year_established: (house) =>
            house.household?.year_established ? (
                <span className="text-gray-700 font-medium">
                    {house.household.year_established}
                </span>
            ) : (
                <span className="text-gray-400 italic">Unknown</span>
            ),

        house_structure: (house) => {
            const structure = house.household?.house_structure;
            const text = CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[structure];

            return text ? (
                <span className="text-gray-700 font-medium">{text}</span>
            ) : (
                <span className="text-gray-400 italic">Unknown</span>
            );
        },

        number_of_rooms: (house) =>
            house.household?.number_of_rooms ?? (
                <span className="text-gray-400 italic">N/A</span>
            ),

        number_of_floors: (house) =>
            house.household?.number_of_floors ?? (
                <span className="text-gray-400 italic">N/A</span>
            ),

        number_of_occupants: (house) => (
            <span className="flex items-center gap-1 font-medium text-gray-700">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    {house?.household?.residents_count?.[0]?.aggregate ?? 0}
                </span>
                <User className="h-4 w-4" />
            </span>
        ),

        actions: (house) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () =>
                            router.visit(
                                route("household.show", house.household?.id)
                            ),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () =>
                            router.visit(
                                route("household.edit", house.household?.id)
                            ),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(house.household?.id),
                    },
                ]}
            />
        ),
    };

    const handleDeleteClick = (id) => {
        setHouseToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("household.destroy", houseToDelete));
        setIsDeleteModalOpen(false);
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
            <Head title="Households Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            {/* <pre>{JSON.stringify(households, undefined, 2)}</pre> */}
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <Home className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Households Records
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Manage all registered households in the
                                        barangay. Search, filter, or export
                                        data, and add new households for
                                        accurate community tracking.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                            <div className="flex items-start gap-2 flex-wrap">
                                <DynamicTableControls
                                    allColumns={allColumns}
                                    visibleColumns={visibleColumns}
                                    setVisibleColumns={setVisibleColumns}
                                    showFilters={showFilters}
                                    toggleShowFilters={() =>
                                        setShowFilters((prev) => !prev)
                                    }
                                />
                                <ExportButton
                                    url="report/export-household-excel"
                                    queryParams={queryParams}
                                    label="Export Households as XLSX"
                                />
                                <ExportButton
                                    url="report/export-household-pdf"
                                    queryParams={queryParams}
                                    label="Export Households as PDF"
                                    type="pdf"
                                />
                                <ExportButton
                                    url="report/export-householdmembers-excel"
                                    queryParams={queryParams}
                                    icon={<FileUser />}
                                    label="Export Household Members as XLSX"
                                />
                                <ExportButton
                                    url="report/export-householdmembers-pdf"
                                    queryParams={queryParams}
                                    label="Export Households as PDF"
                                    type="pdf"
                                />
                            </div>

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
                                <Link href={route("household.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <HousePlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add Household
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
                                    "purok",
                                    "street",
                                    "own_type",
                                    "condition",
                                    "structure",
                                ]}
                                showFilters={true}
                                puroks={puroks}
                                streets={streets}
                                clearRouteName="household.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={households}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            queryParams={queryParams}
                            visibleColumns={visibleColumns}
                            showTotal={true}
                        />
                        <DeleteConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => {
                                setIsDeleteModalOpen(false);
                            }}
                            onConfirm={confirmDelete}
                            residentId={houseToDelete}
                        />
                        <SidebarModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            title="Resident Details"
                        >
                            {selectedResident && (
                                <PersonDetailContent
                                    person={selectedResident}
                                />
                            )}
                        </SidebarModal>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
