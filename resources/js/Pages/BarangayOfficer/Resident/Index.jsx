import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Toaster, toast } from "sonner";
import {
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    Eye,
    Table,
} from "lucide-react";
import * as CONSTANTS from "@/constants";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import ExportButton from "@/Components/ExportButton";

// Lazy load heavy components
const AdminLayout = lazy(() => import("@/Layouts/AdminLayout"));
const SidebarModal = lazy(() => import("@/Components/SidebarModal"));
const PersonDetailContent = lazy(() =>
    import("@/Components/SidebarModalContents/PersonDetailContent")
);
const BreadCrumbsHeader = lazy(() => import("@/Components/BreadcrumbsHeader"));
const DynamicTable = lazy(() => import("@/Components/DynamicTable"));
const ActionMenu = lazy(() => import("@/Components/ActionMenu"));
const FilterToggle = lazy(() =>
    import("@/Components/FilterButtons/FillterToggle")
);
const DynamicTableControls = lazy(() =>
    import("@/Components/FilterButtons/DynamicTableControls")
);
const DeleteConfirmationModal = lazy(() =>
    import("@/Components/DeleteConfirmationModal")
);
const ResidentCharts = lazy(() => import("./ResidentCharts"));

// Memoize expensive calculations or objects that don't change often
const breadcrumbs = [
    { label: "Residents Information", showOnMobile: false },
    { label: "Information Table", showOnMobile: true },
];

const allColumns = [
    { key: "resident_id", label: "ID" },
    { key: "resident_picture", label: "Resident Image" },
    { key: "name", label: "Name" },
    { key: "sex", label: "Sex" },
    { key: "age", label: "Age" },
    { key: "civil_status", label: "Civil Status" },
    { key: "employment_status", label: "Employment" },
    { key: "occupation", label: "Occupation" },
    { key: "ethnicity", label: "Ethnicity" },
    { key: "registered_voter", label: "Registered Voter" },
    { key: "contact_number", label: "Contact Number" },
    { key: "email", label: "Email" },
    { key: "purok_number", label: "Purok" },
    { key: "actions", label: "Actions" },
];

export default function Index({
    residents,
    queryParams = null,
    puroks,
    ethnicities,
}) {
    // Use useMemo for queryParams to ensure it's stable across renders if not explicitly updated
    const currentQueryParams = useMemo(() => queryParams || {}, [queryParams]);

    const { props } = usePage();
    const { success, error } = props; // Destructure directly for cleaner access
    const APP_URL = useAppUrl();

    // Use a single useEffect for toasts, clearing both success and error
    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
            // Clear success message in Inertia props to prevent re-toasting on subsequent renders
            // This requires modifying props, which is generally discouraged for direct mutation.
            // A better pattern might involve an Inertia middleware to flash messages once.
            // For now, if you must clear it client-side:
            // props.success = null; // Be cautious with direct mutation of usePage().props
        }
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
            // props.error = null; // Be cautious with direct mutation
        }
    }, [success, error]); // Depend on success and error props

    const [query, setQuery] = useState(currentQueryParams["name"] ?? "");

    // *** NEW: Extract welfare filters from queryParams ***
    const welfareFilters = useMemo(() => {
        const activeFilters = [];
        if (currentQueryParams.pwd === "1") {
            activeFilters.push("PWD");
        }
        if (currentQueryParams.fourps === "1") {
            activeFilters.push("FourPs");
        }
        if (currentQueryParams.solo_parent === "1") {
            activeFilters.push("SoloParent");
        }
        return activeFilters;
    }, [
        currentQueryParams.pwd,
        currentQueryParams.fourps,
        currentQueryParams.solo_parent,
    ]);

    // Optimize useQuery to prevent unnecessary re-fetches and improve caching
    const {
        data: chartData,
        isLoading: isChartLoading,
        isError: isChartError,
    } = useQuery({
        queryKey: ["residents-chart", currentQueryParams], // Key reflects chart data
        queryFn: async ({ signal }) => {
            const { data } = await axios.get(
                `${APP_URL}/resident/chartdata`,
                { params: queryParams, signal } // cancel old requests
            );
            return data.residents;
        },
        // Only refetch if queryParams change significantly or if explicitly told
        enabled: true, // or some condition if you only want to fetch chart data under certain circumstances
        placeholderData: (previousData) => previousData, // Show previous data while loading new
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Unused cache entries are kept for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch on component mount if data is already in cache and not stale
    });

    // Memoize search function to prevent it from recreating on every render
    const searchFieldName = useMemo(
        () => (field, value) => {
            let newQueryParams = { ...currentQueryParams };

            if (value && value.trim() !== "" && value !== "0") {
                // Added value !== "0" check for welfare filters
                newQueryParams[field] = value;
            } else {
                delete newQueryParams[field];
            }

            // Always delete page when searching to reset pagination
            delete newQueryParams.page;

            router.get(route("resident.index", newQueryParams), {
                preserveState: true, // Keep scroll position and form data
                replace: true, // Replace history entry instead of pushing a new one
            });
        },
        [currentQueryParams]
    ); // Dependency on currentQueryParams

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    // Memoize calculateAge to ensure it's only created once
    const calculateAge = useMemo(
        () => (birthdate) => {
            if (!birthdate) return "Unknown";
            const birth = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        },
        []
    );

    const handleEdit = (id) => {
        router.get(route("resident.edit", id));
    };

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

    // Memoize the check for active filters
    const hasActiveFilter = useMemo(
        () =>
            Object.entries(currentQueryParams).some(
                ([key, value]) =>
                    [
                        "purok",
                        "sex",
                        "gender",
                        "age_group",
                        "estatus",
                        "ethnic",
                        "voter_status",
                        "cstatus",
                        "pwd",
                        "fourps",
                        "solo_parent",
                    ].includes(key) &&
                    value &&
                    value !== "" && // Check for empty string
                    value !== "0" // Explicitly ignore "0" for welfare filters
            ),
        [currentQueryParams]
    );

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    useEffect(() => {
        setShowFilters(hasActiveFilter);
    }, [hasActiveFilter]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Memoize confirmDelete to ensure it's stable
    const confirmDelete = useMemo(
        () => () => {
            if (residentToDelete) {
                router.delete(route("resident.destroy", residentToDelete), {
                    onSuccess: () => {
                        toast.success("Resident deleted successfully!");
                        setIsDeleteModalOpen(false);
                        setResidentToDelete(null);
                    },
                    onError: (err) => {
                        toast.error("Failed to delete resident.", {
                            description: err.message,
                        });
                        setIsDeleteModalOpen(false);
                    },
                });
            }
        },
        [residentToDelete]
    );

    // Memoize columnRenderers to prevent unnecessary re-creation on every render
    const columnRenderers = useMemo(
        () => ({
            resident_id: (resident) => resident.id,
            resident_picture: (resident) => (
                // Use an optimized image component or service if available.
                // For now, ensure default-avatar.jpg is small and optimized.
                <img
                    src={
                        resident.resident_picture
                            ? `/storage/${resident.resident_picture}`
                            : "/images/default-avatar.jpg"
                    }
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-avatar.jpg";
                    }}
                    alt="Resident"
                    className="w-16 h-16 min-w-16 min-h-16 object-cover rounded-full border"
                    loading="lazy" // Add lazy loading for images
                />
            ),
            name: (resident) => (
                <div className="text-sm break-words whitespace-normal leading-snug">
                    {`${resident.firstname} ${
                        resident.middlename ? resident.middlename + " " : ""
                    }${resident.lastname ?? ""} ${
                        resident.suffix ? resident.suffix : ""
                    }`}
                </div>
            ),
            sex: (resident) => {
                const genderKey = resident.sex;
                const label =
                    CONSTANTS.RESIDENT_GENDER_TEXT2[genderKey] ?? "Unknown";
                const className =
                    CONSTANTS.RESIDENT_GENDER_COLOR_CLASS[genderKey] ??
                    "bg-gray-300";
                return (
                    <span
                        className={`py-1 px-2 rounded-xl text-sm font-medium whitespace-nowrap ${className}`}
                    >
                        {label}
                    </span>
                );
            },
            age: (resident) => {
                const age = calculateAge(resident.birthdate);
                if (typeof age !== "number") return "Unknown";
                return (
                    <div className="flex flex-col text-sm">
                        <span className="font-medium text-gray-800">{age}</span>
                        {age > 60 && (
                            <span className="text-xs text-rose-500 font-semibold">
                                Senior Citizen
                            </span>
                        )}
                    </div>
                );
            },
            civil_status: (resident) =>
                CONSTANTS.RESIDENT_CIVIL_STATUS_TEXT[resident.civil_status],
            employment_status: (resident) =>
                CONSTANTS.RESIDENT_EMPLOYMENT_STATUS_TEXT[
                    resident.employment_status
                ],
            occupation: (resident) => {
                const occ = resident.occupation;
                return occ ? (
                    <span className="text-sm text-gray-700">
                        {resident.occupation}
                    </span>
                ) : (
                    <span className="text-gray-400 text-[12px] italic">
                        No occupation available
                    </span>
                );
            },
            ethnicity: (resident) => resident.ethnicity,
            registered_voter: (resident) => (
                <span
                    className={`${
                        CONSTANTS.RESIDENT_REGISTER_VOTER_CLASS[
                            resident.registered_voter
                        ]
                    } whitespace-nowrap`}
                >
                    {
                        CONSTANTS.RESIDENT_REGISTER_VOTER_TEXT[
                            resident.registered_voter
                        ]
                    }
                </span>
            ),
            contact_number: (resident) => (
                <span className="whitespace-nowrap">
                    {resident.contact_number}
                </span>
            ),
            purok_number: (resident) => resident.purok_number,
            email: (resident) => resident.email,
            actions: (resident) => (
                <ActionMenu
                    actions={[
                        {
                            label: "View",
                            icon: <Eye className="w-4 h-4 text-indigo-600" />,
                            onClick: () => handleView(resident.id),
                        },
                        {
                            label: "Edit",
                            icon: (
                                <SquarePen className="w-4 h-4 text-green-500" />
                            ),
                            onClick: () => handleEdit(resident.id),
                        },
                        {
                            label: "Delete",
                            icon: <Trash2 className="w-4 h-4 text-red-600" />,
                            onClick: () => handleDeleteClick(resident.id),
                        },
                        {
                            label: "Family Tree",
                            icon: <Network className="w-4 h-4 text-blue-500" />,
                            href: route("resident.familytree", resident.id),
                            tooltip: "See Family Tree",
                        },
                    ]}
                />
            ),
        }),
        [calculateAge, handleView, handleDeleteClick, handleEdit]
    ); // Dependencies for columnRenderers

    const [showAll, setShowAll] = useState(currentQueryParams.all === "true");

    useEffect(() => {
        setShowAll(currentQueryParams.all === "true");
    }, [currentQueryParams.all]);

    const toggleShowAll = () => {
        let newQueryParams = { ...currentQueryParams };

        if (showAll) {
            delete newQueryParams.all;
        } else {
            newQueryParams.all = "true";
        }

        delete newQueryParams.page;

        router.get(route("resident.index", newQueryParams), {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Resident" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-0">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <ResidentCharts
                                residents={chartData ?? []}
                                isLoading={isChartLoading}
                                welfareFilters={welfareFilters}
                            />

                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-start gap-2 flex-wrap">
                                    <Suspense
                                        fallback={
                                            <div>Loading Controls...</div>
                                        }
                                    >
                                        <DynamicTableControls
                                            allColumns={allColumns}
                                            visibleColumns={visibleColumns}
                                            setVisibleColumns={
                                                setVisibleColumns
                                            }
                                            showFilters={showFilters}
                                            toggleShowFilters={() =>
                                                setShowFilters((prev) => !prev)
                                            }
                                        />
                                    </Suspense>
                                    <ExportButton
                                        url="report/export-residents-excel"
                                        queryParams={currentQueryParams}
                                    />
                                    <ExportButton
                                        url="report/export-resident-pdf"
                                        queryParams={currentQueryParams}
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
                                            placeholder="Search"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={onKeyPressed} // Pass the event directly
                                            className="ml-4"
                                        />
                                        <div className="relative group z-5">
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
                                    <Link href={route("resident.create")}>
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
                                            {/* Tooltip */}
                                        </div>
                                    </Link>
                                    <Link
                                        href={route("resident.createresident")}
                                    >
                                        <div className="relative group z-50">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            >
                                                <UserRoundPlus className="w-4 h-4" />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Resident
                                            </div>
                                            {/* Tooltip */}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {showFilters && (
                                <Suspense
                                    fallback={<div>Loading Filters...</div>}
                                >
                                    <FilterToggle
                                        queryParams={currentQueryParams}
                                        searchFieldName={searchFieldName}
                                        visibleFilters={[
                                            "purok",
                                            "sex",
                                            "gender",
                                            "age_group",
                                            "estatus",
                                            "ethnic",
                                            "voter_status",
                                            "cstatus",
                                            "pwd",
                                            "fourps",
                                            "solo_parent",
                                        ]}
                                        showFilters={true} // Always true when rendered here
                                        puroks={puroks}
                                        clearRouteName="resident.index"
                                        clearRouteParams={{}}
                                        ethnicities={ethnicities}
                                    />
                                </Suspense>
                            )}

                            <Suspense fallback={<div>Loading Table...</div>}>
                                <DynamicTable
                                    passedData={residents}
                                    allColumns={allColumns}
                                    columnRenderers={columnRenderers}
                                    showAll={showAll}
                                    visibleColumns={visibleColumns}
                                    showTotal={true}
                                />
                            </Suspense>
                        </div>
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
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                residentId={residentToDelete}
            />
        </AdminLayout>
    );
}
