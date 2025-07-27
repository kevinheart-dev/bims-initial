import ActionMenu from "@/Components/ActionMenu";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Eye,
    HousePlus,
    MoveRight,
    Search,
    SquarePen,
    Trash2,
    UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import SidebarModal from "@/Components/SidebarModal";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import InputLabel from "@/Components/InputLabel";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import RadioGroup from "@/Components/RadioGroup";
import DropdownInputField from "@/Components/DropdownInputField";
import { Toaster, toast } from "sonner";
import {
    EDUCATION_LEVEL_TEXT,
    EDUCATION_SCHOOL_TYPE,
    EDUCATION_STATUS_TEXT,
} from "@/constants";

export default function Index({
    educations,
    puroks,
    queryParams = null,
    success,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Education", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();

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
        router.get(route("education.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "educational_attainment",
                "educational_status",
                "school_type",
                "year_started",
                "year_ended",
            ].includes(key) &&
            value &&
            value !== ""
    );
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const allColumns = [
        { key: "id", label: "Histoy ID" },
        { key: "name", label: "Name" },
        { key: "educational_attainment", label: "Educational Attainment" },
        { key: "education_status", label: "Education Status" },
        { key: "school_name", label: "School Name" },
        { key: "school_type", label: "School Type" },
        { key: "year_started", label: "Year Started" },
        { key: "year_ended", label: "Year Ended" },
        { key: "program", label: "Program (Course)" },
        { key: "purok_number", label: "Purok" },
        { key: "actions", label: "Actions" },
    ];

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);
    const handlePrint = () => {
        window.print();
    };
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("education_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "education_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => {
            const r = row?.resident;
            if (!r) return "Unknown";
            return `${r.firstname ?? ""} ${r.middlename ?? ""} ${
                r.lastname ?? ""
            } ${r.suffix ?? ""}`.trim();
        },

        educational_attainment: (row) =>
            EDUCATION_LEVEL_TEXT[row.educational_attainment] || "—",

        education_status: (row) => {
            const status = row.education_status;
            const label = EDUCATION_STATUS_TEXT[status] || "N/A";

            const badgeMap = {
                graduated: "bg-green-100 text-green-800",
                enrolled: "bg-blue-100 text-blue-800",
                incomplete: "bg-yellow-100 text-yellow-800",
                dropped_out: "bg-red-100 text-red-800",
            };

            const badgeClass = badgeMap[status] || "bg-gray-100 text-gray-600";

            return (
                <span
                    className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}
                >
                    {label}
                </span>
            );
        },

        school_name: (row) => row.school_name ?? "—",

        school_type: (row) => (
            <span
                className={`px-2 py-1 text-xs rounded ${
                    row.school_type === "private"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                }`}
            >
                {EDUCATION_SCHOOL_TYPE[row.school_type] ?? "—"}
            </span>
        ),

        year_started: (row) => row.year_started ?? "—",

        year_ended: (row) => row.year_ended ?? "—",

        program: (row) =>
            row.program ?? <span className="text-gray-400 italic">N/A</span>,

        purok_number: (row) => row?.resident?.purok_number ?? "—",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row?.id),
                    },
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
                ]}
            />
        ),
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        reset(); // Reset form data
        clearErrors(); // Clear validation errors
        setRegisterSenior(null);
        setSelectedResident(null);
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
        }
    }, [success]);

    return (
        <AdminLayout>
            <Head title="Senior Citizen" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    di pa tapos add
                    {/* <pre>{JSON.stringify(educations, undefined, 3)}</pre> */}
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
                                    onSubmit={handleSubmit}
                                    className="flex w-[300px] max-w-lg items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search Name"
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
                            </div>
                        </div>
                        {showFilters && (
                            <FilterToggle
                                queryParams={queryParams}
                                searchFieldName={searchFieldName}
                                visibleFilters={[
                                    "purok",
                                    "educational_attainment",
                                    "educational_status",
                                    "school_type",
                                    "year_started",
                                    "year_ended",
                                ]}
                                puroks={puroks}
                                showFilters={true}
                                clearRouteName="education.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={educations}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            queryParams={queryParams}
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
                onClose={() => {
                    handleModalClose();
                }}
                title="Add Education History"
            ></SidebarModal>
        </AdminLayout>
    );
}
