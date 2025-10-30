import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    SquarePlus,
    Eye,
    ListPlus,
    Pill,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    MEDICAL_CONDITION_STATUS_STYLES,
    MEDICAL_CONDITION_STATUSES,
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import ExportButton from "@/Components/ExportButton";

export default function Index({ medications, puroks, queryParams }) {
    const breadcrumbs = [
        { label: "Medical Information", showOnMobile: false },
        { label: "Medical Condition", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [medicalConditionToDelete, setConditionToDelete] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

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

    const handleSearchSubmit = (e) => {
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
        router.get(route("medication.index", queryParams));
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
        { key: "name", label: "Resident Name" },
        { key: "age", label: "Age" },
        { key: "sex", label: "Sex" },
        { key: "medication", label: "Medication" },
        { key: "start_date", label: "Date Started" },
        { key: "end_date", label: "Date Ended" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "sex",
                "age_group",
                "medication",
                "med_start",
                "med_end",
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
    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => {
            const r = row.resident ?? {};
            return (
                <span>
                    {r.firstname} {r.middlename ?? ""} {r.lastname}{" "}
                    {r.suffix ?? ""}
                </span>
            );
        },

        sex: (row) => {
            const genderKey = row.resident?.sex;
            const label =
                RESIDENT_GENDER_TEXT2?.[genderKey] ?? genderKey ?? "Unknown";
            const className =
                RESIDENT_GENDER_COLOR_CLASS?.[genderKey] ??
                "bg-gray-100 text-gray-800 px-2 py-1 rounded";

            return (
                <span
                    className={`py-1 px-2 rounded-xl text-sm font-medium whitespace-nowrap ${className}`}
                >
                    {label}
                </span>
            );
        },

        age: (row) => {
            const age = calculateAge(row.resident?.birthdate);

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

        medication: (row) => row.medication ?? "—",

        start_date: (row) =>
            row.start_date
                ? new Date(row.start_date).toLocaleDateString()
                : "—",

        end_date: (row) =>
            row.end_date ? new Date(row.end_date).toLocaleDateString() : "—",

        purok_number: (row) => row.resident?.purok_number ?? "—",

        actions: (medical) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(medical.resident?.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => {
                            router.get(
                                route(
                                    "medical.edit",
                                    medical?.resident?.medical_information?.id
                                )
                            );
                        },
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(medical.id),
                    },
                ]}
            />
        ),
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedResident(null);
    };

    const handleDeleteClick = (id) => {
        setConditionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("medication.destroy", medicalConditionToDelete), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
        setIsDeleteModalOpen(false);
    };

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

    useEffect(() => {
        if (success) {
            handleModalClose();
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
            <Head title="Medical Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(medications, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Pill className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Medication Records
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Manage and track residents’{" "}
                                            <span className="font-medium">
                                                medications
                                            </span>
                                            . Use the tools below to search,
                                            filter, or export records for better
                                            health monitoring.
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
                                        url="report/export-medication-pdf"
                                        queryParams={queryParams}
                                        label="Export Medical Condition Records as PDF"
                                        type="pdf"
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Medication or Resident Name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed(
                                                    "name",
                                                    e.target.value
                                                )
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
                                        <div className="relative group z-50">
                                            <Link
                                                href={route("medical.create")}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                                    type={"button"}
                                                >
                                                    <ListPlus />
                                                </Button>
                                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                    Add Medical Information
                                                </div>
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "purok",
                                        "sex",
                                        "age_group",
                                        "medication",
                                        "med_start",
                                        "med_end",
                                    ]}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="medication.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={medications}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                visibleColumns={visibleColumns}
                                showTotal={true}
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
                    residentId={medicalConditionToDelete}
                />
            </div>
        </AdminLayout>
    );
}
