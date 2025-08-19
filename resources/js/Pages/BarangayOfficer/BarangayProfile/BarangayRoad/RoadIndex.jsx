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
import { Eye, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";

const BarangayRoads = () => {
    const APP_URL = useAppUrl();

    // -------------------------------
    // ✅ State
    // -------------------------------
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

    const [showAll, setShowAll] = useState(false);
    const [isPaginated, setIsPaginated] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // const [query, setQuery] = useState(queryParams["name"] ?? "");
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     searchFieldName("name", query);
    // };

    // -------------------------------
    // ✅ Persist visibleColumns in localStorage
    // -------------------------------
    useEffect(() => {
        localStorage.setItem(
            "roads_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // -------------------------------
    // ✅ Fetch data
    // -------------------------------
    const { data: roads, isLoading, isError, error } = useQuery({
        queryKey: ["roads"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_road`
            );
            return data.roads;
        },
        staleTime: 1000 * 60 * 5,
    });

    // -------------------------------
    // ✅ Column Renderers
    // -------------------------------
    const columnRenderers = {
        id: (row) => row.id,

        road_type: (row) => (
            <span className="font-medium text-gray-900">
                {row.road_type || "—"}
            </span>
        ),

        maintained_by: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.maintained_by || "—"}
            </span>
        ),

        length: (row) => (
            <span className="text-sm text-gray-700">{row.length ?? "—"}</span>
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

    // -------------------------------
    // ✅ Filters (placeholder since queryParams not passed yet)
    // -------------------------------
    const queryParams = {}; // placeholder (replace with actual params later)
    const hasActiveFilter = Object.entries(queryParams).some(
        ([key, value]) =>
            [
                "road_type",
                "maintained_by",
            ].includes(key) &&
            value &&
            value !== ""
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const toggleShowFilters = () => setShowFilters((prev) => !prev);

    const handlePrint = () => {
        window.print();
    };

    // -------------------------------
    // ✅ Loading & Error states
    // -------------------------------
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

    if (!roads?.data?.length) {
        return <div>No roads found</div>;
    }

    // -------------------------------
    // ✅ Render
    // -------------------------------
    return (
        <div className="p-2 md:px-2 md:py-2">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    {/* <pre>{JSON.stringify(roads, undefined, 3)}</pre> */}
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
                    {/* <div className="flex items-center gap-2 flex-wrap justify-end">
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
                                onKeyDown={(e) =>
                                    onKeyPressed(
                                        "name",
                                        e.target.value
                                    )
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
                            </div>
                        </Link>
                    </div> */}
                    {/* {showFilters && (
                        <FilterToggle
                            queryParams={queryParams}
                            searchFieldName={searchFieldName}
                            visibleFilters={[
                                "road_type",
                                "maintained_by",
                            ]}
                            showFilters={true}
                            puroks={puroks}
                            clearRouteName="roads.index"
                            clearRouteParams={{}}
                        />
                    )} */}
                    <DynamicTable
                        passedData={roads}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        visibleColumns={visibleColumns}
                    />
                </div>
            </div>
        </div>
    );
};

export default BarangayRoads;
