import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SquarePen, Trash2, SquarePlus, Eye } from "lucide-react";
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

export default function Index({ medicalConditions, puroks, queryParams }) {
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
        router.get(route("medical_condition.index", queryParams));
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
        { key: "condition", label: "Condition" },
        { key: "status", label: "Status" },
        { key: "diagnosed_date", label: "Diagnosed Date" },
        { key: "resolved_date", label: "Resolved Date" },
        { key: "purok_number", label: "Purok Number" },
        { key: "actions", label: "Actions" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(
        allColumns.map((col) => col.key)
    );
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["purok", "sex", "age_group", "condition_status"].includes(key) &&
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

        condition: (row) => row.condition ?? "—",

        status: (row) => {
            const key = row.status;
            const label = MEDICAL_CONDITION_STATUSES[key] ?? "Unknown";
            const style =
                MEDICAL_CONDITION_STATUS_STYLES[key] ??
                MEDICAL_CONDITION_STATUS_STYLES.default;

            return <span className={style}>{label}</span>;
        },

        diagnosed_date: (row) =>
            row.diagnosed_date
                ? new Date(row.diagnosed_date).toLocaleDateString()
                : "—",

        resolved_date: (row) =>
            row.resolved_date
                ? new Date(row.resolved_date).toLocaleDateString()
                : "—",

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
        router.delete(
            route("medical_condition.destroy", medicalConditionToDelete),
            {
                onError: (errors) => {
                    console.error("Validation Errors:", errors);

                    const allErrors = Object.values(errors).join("<br />");
                    toast.error("Validation Error", {
                        description: (
                            <span
                                dangerouslySetInnerHTML={{ __html: allErrors }}
                            />
                        ),
                        duration: 3000,
                        closeButton: true,
                    });
                },
            }
        );
        setIsDeleteModalOpen(false);
    };

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
                {/* <pre>{JSON.stringify(medicalConditions, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
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
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Condition or Resident Name"
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
                                                    className="bg-blue-700 hover:bg-blue-400 "
                                                    type={"button"}
                                                >
                                                    <SquarePlus />
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
                                        "condition_status",
                                    ]}
                                    puroks={puroks}
                                    showFilters={true}
                                    clearRouteName="medical_condition.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={medicalConditions}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
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
                    residentId={medicalConditionToDelete}
                />
            </div>
        </AdminLayout>
    );
}
