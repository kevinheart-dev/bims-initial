import ActionMenu from "@/Components/ActionMenu";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Eye, HousePlus, Search, SquarePen, Trash2, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import SidebarModal from "@/Components/SidebarModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";


export default function Index({ seniorCitizens, puroks, queryParams = null }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Senior Citizen", showOnMobile: true },
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
        router.get(route("senior_citizen.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

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

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Senior Name" },
        { key: "birthdate", label: "Birthdate" },
        { key: "age", label: "Age" },
        { key: "osca_id_number", label: "OSCA Number" },
        { key: "is_pensioner", label: "Is Pensioner?" },
        { key: "pension_type", label: "Pension Type" },
        { key: "living_alone", label: "Living Alone" },
        { key: "purok_number", label: "Purok" },
        { key: "registered_senior", label: "Is Registered Senior?" },
        { key: "actions", label: "Actions" },
    ];
    // === FOR RESIDENT SIDE MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleView = (resident) => {
        setSelectedResident(resident);
        setIsModalOpen(true);
    };
    // ===
    // ===== CODED I ADDED
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "is_pensioner",
                "pension_type",
                "living_alone",
                "birth_month"
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
        id: (resident) => resident.id,
        name: (resident) => {
            return (
                <Link
                    href={route("resident.show", resident.id)}
                    className="hover:text-blue-500 hover:underline"
                >
                    {resident.firstname} {resident.middlename ?? ""}{" "}
                    {resident.lastname ?? ""}
                    {resident.suffix ? `, ${resident.suffix}` : ""}
                </Link>
            );
        },
        birthdate: (resident) => {
            const date = resident.birthdate;
            if (!date) return <span className="text-gray-400 italic">N/A</span>;

            const birthdate = new Date(date);
            return birthdate.toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
        age: (resident) => {
            const birthdate = resident.birthdate;
            return calculateAge(birthdate);
        },
        osca_id_number: (resident) =>
            resident.seniorcitizen?.osca_id_number ? (
                <span className="text-gray-800">
                    {resident.seniorcitizen.osca_id_number}
                </span>
            ) : (
                <span className="text-gray-400 italic">Not Assigned</span>
            ),
        is_pensioner: (resident) =>
            resident.seniorcitizen?.is_pensioner?.toLowerCase() === "yes" ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500">No</span>
            ),
        pension_type: (resident) =>
            resident.seniorcitizen?.pension_type ? (
                <span className="text-gray-800">
                    {resident.seniorcitizen.pension_type}
                </span>
            ) : (
                <span className="text-gray-400 italic">None</span>
            ),
        living_alone: (resident) =>
            resident.seniorcitizen?.living_alone == 1 ? (
                <span className="text-red-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500">No</span>
            ),
        purok_number: (resident) => (
            <span className="text-gray-800">{resident.purok_number}</span>
        ),
        registered_senior: (resident) =>
            resident.seniorcitizen ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <div className="flex items-center gap-2">
                    <span className="text-red-500 italic">No</span>
                    <Link
                        href={route("senior_citizen.create", {
                            resident_id: resident.id,
                        })}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                        Register
                    </Link>
                </div>
            ),

        actions: (resident) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(resident),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(resident.seniorcitizen.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(resident.seniorcitizen.id),
                    },
                ]}
            />
        ),
    };

    const pensionTypes = [
        { label: "SSS", value: "SSS" },
        { label: "GSIS", value: "GSIS" },
        { label: "DSWD", value: "DSWD" },
        { label: "Private", value: "private" },
        { label: "None", value: "none" },
    ];

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    return (
        <AdminLayout>
            <Head title="Senior Citizen" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(seniorCitizens, undefined, 3)}</pre> */}
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
                                        placeholder="Search Name"
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
                                <Link href={route("senior_citizen.create")}>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add Senior
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
                                    "is_pensioner",
                                    "pension_type",
                                    "living_alone",
                                    "birth_month"
                                ]}
                                showFilters={true}
                                pensionTypes={pensionTypes}
                                months={months}
                                clearRouteName="senior_citizen.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={seniorCitizens}
                            columnRenderers={columnRenderers}
                            allColumns={allColumns}
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
                onClose={() => setIsModalOpen(false)}
                title="Resident Details"
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
            </SidebarModal>
        </AdminLayout>
    );
}
