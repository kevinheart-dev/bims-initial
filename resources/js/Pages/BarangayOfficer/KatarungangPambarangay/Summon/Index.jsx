import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Eye,
    Search,
    UserRoundPlus,
    FileText,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
    User,
    ListPlus,
    FileUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import * as CONSTANTS from "@/constants";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import SidebarModal from "@/Components/SidebarModal";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import ExportButton from "@/Components/ExportButton";

export default function Index({ summons, queryParams, incident_types }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        { label: "Summons", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const APP_URL = useAppUrl();
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
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

    const searchFieldName = (field, value) => {
        if (value && value.trim() !== "") {
            queryParams[field] = value;
        } else {
            delete queryParams[field];
        }

        if (queryParams.page) {
            delete queryParams.page;
        }
        router.get(route("summon.index", queryParams));
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
        { key: "complainants", label: "Complainant(s)" },
        { key: "respondents", label: "Respondent(s)" },
        { key: "status", label: "Summon Status" },
        { key: "incident_date", label: "Incident Date" },
        { key: "hearing_info", label: "Hearing Details" }, // <-- combined number + date
        { key: "remarks", label: "Remarks" },
        { key: "issued_by", label: "Issued By" },
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
            [
                "incident_type",
                "incident_date",
                "summon_status",
                "hearing_number",
                "hearing_status",
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

    const columnRenderers = {
        id: (summon) => summon.id,

        type_of_incident: (summon) => (
            <span
                className="font-medium text-blue-600 hover:underline hover:cursor-pointer  text-wrap"
                onClick={() =>
                    router.visit(
                        route("blotter_report.show", summon.blotter.id)
                    )
                }
            >
                {summon.blotter?.type_of_incident ?? "—"}
            </span>
        ),
        complainants: (summon) => {
            const complainants =
                summon.blotter?.participants?.filter(
                    (p) => p.role_type === "complainant"
                ) || [];
            if (complainants.length === 0) return "—";

            return (
                <div className="flex flex-wrap gap-x-1 text-sm">
                    {complainants.map((c, idx) => {
                        // Use resident name if available, otherwise use name/display_name
                        const fullName = c.resident
                            ? `${c.resident.firstname ?? ""} ${c.resident.middlename ?? ""
                                } ${c.resident.lastname ?? ""} ${c.resident.suffix ?? ""
                                }`.trim()
                            : c.name ?? c.display_name ?? "—";

                        return (
                            <span
                                key={c.id}
                                className="text-blue-600 hover:underline hover:cursor-pointer"
                                onClick={() => handleView(c.resident?.id)}
                            >
                                {fullName}
                                {idx < complainants.length - 1 && ","}
                            </span>
                        );
                    })}
                </div>
            );
        },

        respondents: (summon) => {
            const respondents =
                summon.blotter?.participants?.filter(
                    (p) => p.role_type === "respondent"
                ) || [];
            if (respondents.length === 0) return "—";

            return (
                <div className="flex flex-wrap gap-x-1 text-sm">
                    {respondents.map((r, idx) => {
                        const fullName = r.resident
                            ? `${r.resident.firstname ?? ""} ${r.resident.middlename ?? ""
                                } ${r.resident.lastname ?? ""} ${r.resident.suffix ?? ""
                                }`.trim()
                            : r.name ?? r.display_name ?? "—";

                        return (
                            <span
                                key={r.id}
                                className="text-red-600 hover:underline hover:cursor-pointer"
                                onClick={() => handleView(r.resident?.id)}
                            >
                                {fullName}
                                {idx < respondents.length - 1 && ","}
                            </span>
                        );
                    })}
                </div>
            );
        },

        status: (summon) => {
            return (
                <span
                    className={`px-2 py-1 text-sm rounded-lg ${CONSTANTS.SUMMON_STATUS_CLASS[summon.status] ??
                        "bg-gray-100 text-gray-700"
                        }`}
                >
                    {CONSTANTS.SUMMON_STATUS_TEXT[summon.status]}
                </span>
            );
        },

        incident_date: (summon) =>
            summon.blotter?.incident_date
                ? new Date(summon.blotter.incident_date).toLocaleDateString()
                : "—",

        hearing_info: (summon) => {
            const latestTake = summon.latest_take;
            if (!latestTake) return "—";

            return (
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-900">
                        Hearing {latestTake.session_number}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                            {latestTake.hearing_date
                                ? new Date(
                                    latestTake.hearing_date
                                ).toLocaleDateString()
                                : "No Date Set"}
                        </span>
                        <span
                            className={`text-xs ${CONSTANTS.SESSION_STATUS_CLASS[
                                latestTake.session_status
                            ]
                                }`}
                        >
                            {
                                CONSTANTS.SESSION_STATUS_TEXT[
                                latestTake.session_status
                                ]
                            }
                        </span>
                    </div>
                </div>
            );
        },

        issued_by: (summon) => {
            const o = summon.issued_by?.resident;
            if (!o) return "—";
            const res = `${o.firstname ?? ""} ${o.middlename ?? ""} ${o.lastname ?? ""
                } ${o.suffix ?? ""}`.trim();
            return <span className="text-wrap text-gray-600">{res}</span>;
        },

        remarks: (summon) => (
            <span className="line-clamp-2 text-gray-600 text-wrap">
                {summon.latest_take.session_remarks ?? "—"}
            </span>
        ),

        actions: (summon) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () =>
                            router.visit(
                                route("summon.show", summon.blotter_id)
                            ),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(summon.blotter_id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(summon.id),
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
        router.delete(route("summon.destroy", recordToDelete));
        setIsDeleteModalOpen(false);
    };

    const handleEdit = (id) => {
        router.get(route("summon.elevate", id));
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
            {/* <pre>{JSON.stringify(summons, undefined, 2)}</pre> */}
            <div className="pt-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="flex items-center gap-3 p-4 mb-6 bg-gray-50 rounded-xl shadow-sm">
                            <div className="p-3 bg-green-100 rounded-full">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                    Summon Records
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Track and manage summons issued in relation to blotter cases.
                                    Monitor hearing schedules, statuses, and ensure proper documentation
                                    for transparent case resolution.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                            <div className="flex items-start gap-2 flex-wrap">
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
                                <ExportButton
                                    url="report/export-summon-excel"
                                    queryParams={queryParams}
                                    label="Export Summon Records as XLSX"
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
                                            Add Blotter Report
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
                                    "summon_status",
                                    "hearing_number",
                                    "hearing_status",
                                ]}
                                showFilters={true}
                                types={incident_types}
                                clearRouteName="summon.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={summons}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        ></DynamicTable>
                        <SidebarModal
                            isOpen={isModalOpen}
                            onClose={() => {
                                setIsModalOpen(false);
                                setSelectedResident(null);
                            }}
                            title="Resident Details"
                        >
                            {selectedResident && (
                                <PersonDetailContent
                                    person={selectedResident}
                                />
                            )}
                        </SidebarModal>
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
