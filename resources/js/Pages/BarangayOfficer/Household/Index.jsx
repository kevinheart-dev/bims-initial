import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    UserRoundPlus,
    HousePlus,
    SquarePen,
    Trash2,
    Network,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import ResidentTable from "@/Components/ResidentTable";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import ResidentFilterBar from "@/Components/ResidentFilterBar";
import * as CONSTANTS from "@/constants";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";


export default function Index({ households, puroks, streets, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Households", showOnMobile: true },
    ];
    queryParams = queryParams || {};

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
        { key: "name", label: "Name of Household Head" },
        { key: "house_number", label: "House Number" },
        { key: "purok_number", label: "Purok" },
        { key: "street_name", label: "Street" },
        { key: "ownership_type", label: "Ownership Type" },
        { key: "housing_condition", label: "Housing Condition" },
        { key: "year_established", label: "Year Established" },
        { key: "house_structure", label: "House Structure" },
        { key: "number_of_rooms", label: "Number of Rooms" },
        { key: "number_of_floors", label: "Number of Floors" },
        { key: "actions", label: "Actions" },
    ];

    // ===== CODED I ADDED
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "street",
                "own_type",
                "condition",
                "structure",
            ].includes(key) &&
            value &&
            value !== "All"
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


    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("household_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem("household_visible_columns", JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    //===
    const columnRenderers = {
        id: (house) => house.id,
        name: (house) => {
            const head = house.residents?.[0];
            return head ? (
                <Link
                    href={route("resident.show", head.id)}
                    className="hover:text-blue-500 hover:underline"
                >
                    {head.firstname} {head.middlename ?? ""}{" "}
                    {head.lastname ?? ""} {head.suffix ?? ""}
                </Link>
            ) : (
                <span className="text-gray-400 italic">No household head</span>
            );
        },
        house_number: (house) => (
            <Link
                href={route("household.show", house.id)}
                className="hover:text-blue-500 hover:underline"
            >
                {" "}
                {house.house_number}
            </Link>
        ),
        purok_number: (house) => house.purok.purok_number,
        street_name: (house) => house.street.street_name,
        ownership_type: (house) => (
            <span>{CONSTANTS.HOUSEHOLD_OWNERSHIP_TEXT[house.ownership_type]}</span>
        ),
        housing_condition: (house) => (
            <span
                className={`px-2 py-1 text-sm rounded-lg ${CONSTANTS.HOUSING_CONDITION_COLOR[house.housing_condition] ??
                    "bg-gray-100 text-gray-700"
                    }`}
            >
                {CONSTANTS.HOUSEHOLD_CONDITION_TEXT[house.housing_condition]}
            </span>
        ),
        year_established: (house) => house.year_established ?? "Unknown",
        house_structure: (house) => (
            <span>{CONSTANTS.HOUSEHOLD_STRUCTURE_TEXT[house.house_structure]}</span>
        ),
        number_of_rooms: (house) => house.number_of_rooms ?? "N/A",
        number_of_floors: (house) => house.number_of_floors ?? "N/A",
        actions: (house) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(house.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(house.id),
                    },
                ]}
            />
        ),
    };

    // const ownershipOptions = [
    //     { label: "Owned", value: "owned" },
    //     { label: "Rented", value: "rented" },
    //     { label: "Shared", value: "shared" },
    //     { label: "Government Provided", value: "government_provided" },
    //     { label: "Inherited", value: "inherited" },
    //     { label: "Others", value: "others" },
    // ];
    // const houseingConditions = [
    //     { label: "Good", value: "good" },
    //     { label: "Needs Repair", value: "needs_repair" },
    //     { label: "Delapitated", value: "delapitated" },
    // ];
    // const structureOptions = [
    //     { label: "Concrete", value: "concrete" },
    //     { label: "Semi Concrete", value: "semi_concrete" },
    //     { label: "Wood", value: "wood" },
    //     { label: "Makeshift", value: "makeshift" },
    // ];

    return (
        <AdminLayout>
            <Head title="Households Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            {/* <pre>{JSON.stringify(households, undefined, 2)}</pre> */}
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
                                    toggleShowFilters={() => setShowFilters((prev) => !prev)}
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
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => onKeyPressed("name", e)}
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
                                    "structure"
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
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
                            is_paginated={isPaginated}
                            toggleShowAll={() => setShowAll(!showAll)}
                            showAll={showAll}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        >
                        </DynamicTable>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
