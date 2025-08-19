import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import ActionMenu from "@/Components/ActionMenu";
import { Eye, HousePlus, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";

const InstitutionIndex = () => {
    const APP_URL = useAppUrl();
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const {
        data: institutions,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["institutions", queryParams],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_institution`,
                { params: queryParams }
            );
            return data.institutions;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("instutions_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => ["institution"].includes(key) && value && value !== ""
    );

    const [showFilters, setShowFilters] = useState(hasActiveFilter);

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    useEffect(() => {
        localStorage.setItem(
            "instutions_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };

    const searchFieldName = (field, value) => {
        setQueryParams((prev) => {
            const updated = { ...prev };

            if (value && value.trim() !== "") {
                updated[field] = value;
            } else {
                delete updated[field];
            }

            // reset pagination when searching
            delete updated.page;

            return updated; // React Query will refetch automatically
        });
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <span className="font-medium text-gray-900">{row.name || "—"}</span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };

    if (isLoading) {
        return (
            <div className="gap-2 space-y-4">
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
                <Skeleton className="h-[10px] w-[100px] rounded-full" />
            </div>
        );
    }

    if (isError) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }

    const handlePrint = () => {
        window.print();
    };
    // if (!institutions?.data?.length) {
    //     return <div>No institutions found</div>;
    // }

    return (
        <div className="p-2 md:px-2 md:py-2">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                {/* <pre>{JSON.stringify(institutions, undefined, 3)}</pre> */}
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
                                placeholder="Search institutions"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) =>
                                    onKeyPressed("name", e.target.value)
                                }
                                className="ml-4"
                            />
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
                        </form>
                        <Link href={route("barangay_infrastructure.create")}>
                            <div className="relative group z-50">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                    Add an Institution
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    {showFilters && (
                        <FilterToggle
                            queryParams={queryParams}
                            searchFieldName={searchFieldName}
                            visibleFilters={["institution"]}
                            showFilters={true}
                            institutions={institutions.data}
                            setQueryParams={setQueryParams}
                            setQuery={setQuery}
                            clearRouteAxios={true}
                        />
                    )}
                    <DynamicTable
                        passedData={institutions}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                    />
                </div>
            </div>
        </div>
    );
};

export default InstitutionIndex;
