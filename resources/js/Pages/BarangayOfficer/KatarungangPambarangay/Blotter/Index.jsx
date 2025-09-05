import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Eye,
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    User,
    ListPlus,
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

export default function Index({ blotters, queryParams, incident_types }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        { label: "Blotter Reports", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

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
        router.get(route("blotter_report.index", queryParams));
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
        { key: "type_of_incident", label: "Type of Incident" },
        { key: "latest_complainant", label: "Complainant" },
        { key: "report_status", label: "Status" },
        { key: "incident_date", label: "Incident Date" },
        { key: "narrative_details", label: "Narrative Details" },
        { key: "actions_taken", label: "Actions Taken" },
        { key: "recommendations", label: "Recommendations" },
        { key: "recorded_by", label: "Recorded By" },
        { key: "actions", label: "Actions" },
    ];

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
            ["incident_type", "incident_date"].includes(key) &&
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
        id: (blotter) => blotter.id,
        type_of_incident: (blotter) => (
            <span className="font-medium text-gray-800">
                {blotter.type_of_incident}
            </span>
        ),

        narrative_details: (blotter) => (
            <span className="line-clamp-2 text-gray-600">
                {blotter.narrative_details}
            </span>
        ),
        recommendations: (blotter) => (
            <span className="line-clamp-2 text-gray-600">
                {blotter.recommendations}
            </span>
        ),

        actions_taken: (blotter) => blotter.actions_taken ?? "—",

        report_status: (blotter) => {
            const statusClasses = {
                pending: "bg-yellow-100 text-yellow-700",
                on_going: "bg-blue-100 text-blue-700",
                resolved: "bg-green-100 text-green-700",
                elevated: "bg-red-100 text-red-700",
            };

            return (
                <span
                    className={`px-2 py-1 text-sm rounded-lg ${
                        statusClasses[blotter.report_status] ??
                        "bg-gray-100 text-gray-700"
                    }`}
                >
                    {CONSTANTS.BLOTTER_REPORT_STATUS[blotter.report_status]}
                </span>
            );
        },

        incident_date: (blotter) =>
            blotter.incident_date
                ? new Date(blotter.incident_date).toLocaleDateString()
                : "—",

        recorded_by: (blotter) => {
            const c = blotter.recorded_by;
            if (!c) return "—";
            return (
                `${c.resident?.firstname ?? ""} ${
                    c.resident?.middlename ?? ""
                } ${c.resident?.lastname ?? ""} ${c.resident?.suffix ?? ""}` ??
                "—"
            );
        },

        latest_complainant: (blotter) => {
            const c = blotter.latest_complainant;
            if (!c) return "—";
            return (
                `${c.resident?.firstname ?? ""} ${
                    c.resident?.middlename ?? ""
                } ${c.resident?.lastname ?? ""} ${c.resident?.suffix ?? ""}` ??
                "—"
            );
        },

        actions: (blotter) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () =>
                            router.visit(
                                route("blotter_reports.show", blotter.id)
                            ),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(blotter.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(blotter.id),
                    },
                ]}
            />
        ),
    };

    // delete
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("blotter_report.destroy", recordToDelete));
        setIsDeleteModalOpen(false);
    };

    const handleEdit = (id) => {
        router.get(route("blotter_report.edit", id));
    };

    // feedback
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
            <Head title="Blotter Reports Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            {/* <pre>{JSON.stringify(blotters, undefined, 2)}</pre> */}
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

                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-[300px] max-w-lg items-center space-x-1"
                                >
                                    <Input
                                        type="text"
                                        placeholder="Search for Complainant"
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
                                <Link href={route("blotter_report.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <ListPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add a Blotter Report
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
                                    "incident_type",
                                    "incident_date",
                                ]}
                                showFilters={true}
                                types={incident_types}
                                clearRouteName="blotter_report.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={blotters}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        ></DynamicTable>
                        <DeleteConfirmationModal
                            isOpen={isDeleteModalOpen}
                            onClose={() => {
                                setIsDeleteModalOpen(false);
                            }}
                            onConfirm={confirmDelete}
                            residentId={recordToDelete}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
