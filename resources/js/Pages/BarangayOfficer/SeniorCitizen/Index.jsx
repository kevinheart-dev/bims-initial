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

export default function Index({
    seniorCitizens,
    puroks,
    queryParams = null,
    success,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Senior Citizen", showOnMobile: true },
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
        { key: "is_pensioner", label: "Is Pensioner?" },
        { key: "osca_id_number", label: "OSCA Number" },
        { key: "pension_type", label: "Pension Type" },
        { key: "living_alone", label: "Living Alone" },
        { key: "purok_number", label: "Purok" },
        { key: "registered_senior", label: "Is Registered Senior?" },
        { key: "actions", label: "Actions" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [registerSenior, setRegisterSenior] = useState(null);

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
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "is_pensioner",
                "pension_type",
                "living_alone",
                "birth_month",
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
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("household_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "household_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

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
        is_pensioner: (resident) =>
            resident.seniorcitizen == null ? (
                <span className="text-yellow-600 font-medium">Pending</span>
            ) : resident.seniorcitizen.is_pensioner?.toLowerCase() === "yes" ? (
                <span className="text-green-600 font-medium">Yes</span>
            ) : (
                <span className="text-gray-500">No</span>
            ),
        osca_id_number: (resident) =>
            resident.seniorcitizen?.osca_id_number ? (
                <span className="text-gray-800">
                    {resident.seniorcitizen.osca_id_number}
                </span>
            ) : (
                <span className="text-gray-400 italic">Not Assigned</span>
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
                    <Button
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        onClick={() => handleRegister(resident.id)}
                    >
                        Register
                    </Button>
                </div>
            ),

        actions: (resident) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(resident.id),
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

    // modal register
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        osca_id_number: "",
        resident_image: null,
        resident_name: "",
        birthdate: null,
        purok_number: null,
        is_pensioner: null,
        pension_type: null,
        living_alone: null,
    });

    const handleRegister = (id) => {
        const resident = seniorCitizens.find((r) => r.id == id);
        if (resident) {
            setIsModalOpen(true);
            setRegisterSenior(resident);
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("purok_number", resident.purok_number);
            setData("birthdate", resident.birthdate);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const handleSubmitRegistration = (e) => {
        e.preventDefault();
        post(route("senior_citizen.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
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
                                    "is_pensioner",
                                    "pension_type",
                                    "living_alone",
                                    "birth_month",
                                ]}
                                puroks={puroks}
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
                onClose={() => {
                    handleModalClose();
                }}
                title={
                    selectedResident != null
                        ? "Resident Details"
                        : "Register Senior Citizen"
                }
            >
                {selectedResident && (
                    <PersonDetailContent person={selectedResident} />
                )}
                {registerSenior && (
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={handleSubmitRegistration}
                    >
                        <h3 className="text-xl font-medium text-gray-700 mb-8">
                            Senior Citizen Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                            <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                <InputLabel
                                    htmlFor={`resident_image`}
                                    value="Profile Photo"
                                />
                                <img
                                    src={
                                        data.resident_image
                                            ? `/storage/${data.resident_image}`
                                            : "/images/default-avatar.jpg"
                                    }
                                    alt={`Resident Image`}
                                    className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                />
                            </div>
                            <div className="md:col-span-4 space-y-2">
                                <div className="w-full">
                                    <InputField
                                        label="Full Name"
                                        name="resident_name"
                                        value={data.resident_name || ""}
                                        placeholder="Select a resident"
                                        readOnly={true}
                                    />
                                    <InputError
                                        message={errors.resident_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                        <InputField
                                            label="Birthdate"
                                            name="birthdate"
                                            value={data.birthdate || ""}
                                            readOnly={true}
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            label="Purok Number"
                                            name="purok_number"
                                            value={data.purok_number}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-4">
                            <div className="w-full">
                                <RadioGroup
                                    label="Pensioner?"
                                    name="is_pensioner"
                                    selectedValue={data.is_pensioner || ""}
                                    options={[
                                        {
                                            label: "Yes",
                                            value: "yes",
                                        },
                                        {
                                            label: "No",
                                            value: "no",
                                        },
                                        {
                                            label: "Pending",
                                            value: "pending",
                                        },
                                    ]}
                                    onChange={(e) =>
                                        setData("is_pensioner", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.is_pensioner}
                                    className="mt-2"
                                />
                            </div>
                            <div className="w-full">
                                <RadioGroup
                                    label="Living Alone?"
                                    name="living_alone"
                                    selectedValue={data.living_alone}
                                    options={[
                                        {
                                            label: "Yes",
                                            value: 1,
                                        },
                                        {
                                            label: "No",
                                            value: 0,
                                        },
                                    ]}
                                    onChange={(e) =>
                                        setData("living_alone", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.living_alone}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        {data.is_pensioner === "yes" && (
                            <div className="flex justify-between col-span-2 gap-4">
                                <div className="w-full">
                                    <InputField
                                        label="OSCA ID"
                                        name="osca_id_number"
                                        type="number"
                                        value={data.osca_id_number}
                                        onChange={(e) =>
                                            setData(
                                                "osca_id_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="OSCA ID number"
                                    />
                                    <InputError
                                        message={errors.osca_id_number}
                                        className="mt-2"
                                    />
                                </div>
                                <div className="w-full">
                                    <DropdownInputField
                                        label="Pension Type"
                                        name="pension_type"
                                        value={data.pension_type}
                                        items={[
                                            "SSS",
                                            "DSWD",
                                            "GSIS",
                                            "private",
                                            "none",
                                        ]}
                                        onChange={(e) =>
                                            setData(
                                                "pension_type",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Select type"
                                    />
                                    <InputError
                                        message={errors.pension_type}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="justify-end text-end mt-5">
                            <Button
                                className="bg-blue-700 hover:bg-blue-400"
                                type={"submit"}
                            >
                                Register <MoveRight />
                            </Button>
                        </div>
                    </form>
                )}
            </SidebarModal>
        </AdminLayout>
    );
}
