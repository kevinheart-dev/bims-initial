import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/Components/ui/skeleton";
import { Eye, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { ROAD_TYPE_TEXT } from "@/constants";

const BarangayRoads = () => {
    const APP_URL = useAppUrl();
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [queryParams, setQueryParams] = useState({});
    const [query, setQuery] = useState(queryParams["name"] ?? "");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["roads", queryParams],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_road`,
                { params: queryParams }
            );
            return data;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const roads = data?.roads;
    const types = data?.types;
    const maintains = data?.maintains;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "road_type", label: "Road Type" },
        { key: "maintained_by", label: "Maintained By" },
        { key: "length", label: "Length" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("roads_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    const hasActiveFilter = Object.entries(queryParams).some(
        ([key, value]) =>
            ["road_type", "maintained_by"].includes(key) &&
            value &&
            value !== ""
    );

    const [showFilters, setShowFilters] = useState(hasActiveFilter);

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    useEffect(() => {
        localStorage.setItem(
            "roads_visible_columns",
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

            if (value && value.trim() !== "" && value !== "All") {
                updated[field] = value;
            } else {
                delete updated[field]; // remove filter if blank or "All"
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

        road_type: (row) => (
            <span className="font-medium text-gray-900">
                {ROAD_TYPE_TEXT[row.road_type] || "—"}
            </span>
        ),

        maintained_by: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.maintained_by || "—"}
            </span>
        ),

        length: (row) => (
            <span className="text-sm text-gray-700">
                {row.length != null ? `${row.length} Km` : "—"}
            </span>
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

    const handlePrint = () => {
        window.print();
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

    return (
        <div className="p-2 md:px-2 md:py-2">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    {/* <pre>{JSON.stringify(roads, undefined, 3)}</pre> */}
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
                                    placeholder="Search road lengths"
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
                            <Link
                                href={route("barangay_infrastructure.create")}
                            >
                                <div className="relative group z-50">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        Add a Road
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
                                visibleFilters={["road_type", "maintained_by"]}
                                showFilters={true}
                                types={types}
                                names={maintains}
                                setQueryParams={setQueryParams}
                                setQuery={setQuery}
                                clearRouteAxios={true}
                            />
                        )}

                        <DynamicTable
                            passedData={roads}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            visibleColumns={visibleColumns}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BarangayRoads;
