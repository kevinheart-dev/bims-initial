import ActionMenu from "@/Components/ActionMenu";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    Badge,
    Briefcase,
    Eye,
    HousePlus,
    MoveRight,
    Pencil,
    RotateCcw,
    Search,
    SquarePen,
    SquarePlus,
    Trash2,
    User,
    UserPlus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
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
    EMPLOYMENT_TYPE_TEXT,
    OCCUPATION_STATUS_TEXT,
    RESIDENT_EMPLOYMENT_STATUS_TEXT,
    WORK_ARRANGEMENT_TEXT,
} from "@/constants";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import LivelihoodSection from "@/Components/ResidentInput/Section6";

export default function Index({
    livelihoods,
    puroks,
    queryParams = null,
    residents = [],
    livelihood_types,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Livelihoods", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

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
        router.get(route("livelihood.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [livelihoodDetails, setLivelihood] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [residentToDelete, setResidentToDelete] = useState(null); //delete

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "livelihood_type",
                "livelihood_status",
                "is_main",
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
        { key: "id", label: "Livelihood ID" },
        { key: "name", label: "Resident Name" },
        { key: "livelihood_type", label: "Livelihood" },
        { key: "description", label: "Description" },
        { key: "status", label: "Livelihood Status" },
        { key: "started_at", label: "Year Started" },
        { key: "ended_at", label: "Year Ended" },
        { key: "is_main_livelihood", label: "Is Main Livelihood" },
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
    const [selectedResident, setSelectedResident] = useState(null);
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("livelihood_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "livelihood_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => {
            const { firstname, middlename, lastname, suffix } =
                row.resident ?? {};
            const fullName = `${firstname ?? ""} ${middlename ?? ""} ${
                lastname ?? ""
            } ${suffix ?? ""}`.trim();
            return fullName || "—";
        },

        livelihood_type: (row) => (
            <span className="text-xs font-medium">
                {row.livelihood_type || "—"}
            </span>
        ),

        description: (row) => (
            <span className="text-xs text-gray-600">
                {row.description || "—"}
            </span>
        ),

        status: (row) => {
            const value = row.status ?? "—";
            const statusColor =
                value === "active"
                    ? "bg-green-100 text-green-800"
                    : value === "inactive"
                    ? "bg-red-100 text-red-800"
                    : value === "seasonal"
                    ? "bg-yellow-100 text-yellow-800"
                    : value === "ended"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-100 text-gray-700";

            return (
                <span
                    className={`${statusColor} px-2 py-0.5 rounded-md text-xs font-medium capitalize`}
                >
                    {value.replaceAll("_", " ")}
                </span>
            );
        },

        started_at: (row) => (
            <span className="text-xs text-gray-700">
                {row.started_at ?? "—"}
            </span>
        ),

        ended_at: (row) => (
            <span className="text-xs text-gray-700">{row.ended_at ?? "—"}</span>
        ),

        average_monthly_income: (row) => (
            <span className="text-xs text-gray-800">
                {row.monthly_income
                    ? `₱${parseFloat(row.monthly_income).toLocaleString()}`
                    : "—"}
            </span>
        ),

        is_main_livelihood: (row) => (
            <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    row.is_main_livelihood
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                }`}
            >
                {row.is_main_livelihood ? "Yes" : "No"}
            </span>
        ),

        purok_number: (row) => (
            <span className="text-xs text-gray-800">
                {row.resident?.street?.purok?.purok_number ?? "—"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row.resident.id),
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

    const handleView = async (resident) => {
        setModalState("view");
        setSelectedResident(null);
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

    // list of residents for dropdown
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    // Handle Occupation Actions
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        livelihoods: [[]],
        _method: undefined,
        livelihood_id: null,
    });

    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const addLivelihood = () => {
        setData("livelihoods", [...(data.livelihoods || []), {}]);
    };
    const removeLivelihood = (lvlhdIdx) => {
        const updated = [...(data.livelihoods || [])];
        updated.splice(lvlhdIdx, 1);
        setData("livelihoods", updated);
        toast.warning("Livelihood removed.", {
            duration: 2000,
        });
    };
    const handleLivelihoodFieldChange = (e, lvlhdIdx, fieldName) => {
        const updated = [...(data.livelihoods || [])];

        updated[lvlhdIdx] = {
            ...updated[lvlhdIdx],
            [fieldName]: e.target.value,
        };

        setData("livelihoods", updated);
    };
    const livelihoodTypesList = livelihood_types.map((type) => ({
        label: type,
        value: type,
    }));

    const handleAddLivelihood = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        setModalState("add");

        try {
            const response = await axios.get(
                `${APP_URL}/livelihood/details/${id}`
            );
            const livelihood = response.data.livelihood;
            console.log(livelihood);

            setLivelihood(livelihood);
            setData({
                resident_id: livelihood.resident.id,
                resident_name: `${livelihood.resident.firstname} ${
                    livelihood.resident.middlename ?? ""
                } ${livelihood.resident.lastname}`,
                resident_image: livelihood.resident.image ?? null,
                birthdate: livelihood.resident.birthdate ?? null,
                purok_number: livelihood.resident.purok_number ?? null,
                employment_status: livelihood.resident.employment_status,
                livelihoods: [
                    {
                        livelihood_type: livelihood.livelihood_type || "",
                        description: livelihood.description || "",
                        status: livelihood.status || "",
                        employer: livelihood.employer || "",
                        is_main_livelihood: livelihood.is_main_livelihood
                            ? livelihood.is_main_livelihood.toString()
                            : "0",
                        income: livelihood.monthly_income || 0,
                        income_frequency: "monthly",
                        started_at: livelihood.started_at || "",
                        ended_at: livelihood.ended_at || "",
                    },
                ],
                _method: "PUT",
                livelihood_id: livelihood.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching livelihood details:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setLivelihood(null);
        reset();
        clearErrors();
    };

    const handleSubmitOccupation = (e) => {
        e.preventDefault();
        post(route("livelihood.store"), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
    };
    const handleUpdateLivelihood = (e) => {
        e.preventDefault();
        post(route("livelihood.update", data.livelihood_id), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("livelihood.destroy", residentToDelete));
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
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
            <Head title="Residents Livelihood" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(livelihoods, undefined, 3)}</pre> */}
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
                                <div className="relative group z-50">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        onClick={handleAddLivelihood}
                                    >
                                        <SquarePlus className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        Add a Livelihood
                                    </div>
                                </div>
                            </div>
                        </div>
                        {showFilters && (
                            <FilterToggle
                                queryParams={queryParams}
                                searchFieldName={searchFieldName}
                                visibleFilters={[
                                    "purok",
                                    "livelihood_type",
                                    "livelihood_status",
                                    "is_main",
                                ]}
                                puroks={puroks}
                                showFilters={true}
                                clearRouteName="livelihood.index"
                                clearRouteParams={{}}
                                livelihood_types={livelihood_types}
                            />
                        )}
                        <DynamicTable
                            passedData={livelihoods}
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
                title={
                    modalState === "add" && livelihoodDetails
                        ? "Edit Livelihood"
                        : modalState === "add"
                        ? "Add Livelihood"
                        : "View Resident"
                }
            >
                {modalState === "add" && (
                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                        <form
                            onSubmit={
                                livelihoodDetails
                                    ? handleUpdateLivelihood
                                    : handleSubmitOccupation
                            }
                        >
                            <h3 className="text-xl font-medium text-gray-700 mb-8">
                                Resident's Info
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
                                        <DropdownInputField
                                            label="Full Name"
                                            name="resident_name"
                                            value={data.resident_name || ""}
                                            placeholder="Select a resident"
                                            onChange={(e) =>
                                                handleResidentChange(e)
                                            }
                                            items={residentsList}
                                            readOnly={livelihoodDetails}
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
                            <div>
                                <div className="flex flex-col mt-12">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-1 mt-1">
                                        Livelihood Information
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Please provide the resident's livelihood
                                        background.
                                    </p>
                                </div>

                                {Array.isArray(data.livelihoods) &&
                                    data.livelihoods.map(
                                        (livelihood, lvlhdIdx) => (
                                            <div
                                                key={lvlhdIdx}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                <div
                                                    className={`grid md:grid-cols-3 gap-4`}
                                                >
                                                    <div>
                                                        <DropdownInputField
                                                            label="Livelihood"
                                                            name="livelihood_type"
                                                            value={
                                                                livelihood.livelihood_type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "livelihood_type"
                                                                )
                                                            }
                                                            placeholder="Select or Enter Livelihood"
                                                            items={
                                                                livelihoodTypesList
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.livelihood_type`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <SelectField
                                                            label="Livelihood Status"
                                                            name="status"
                                                            value={
                                                                livelihood.status ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "status"
                                                                )
                                                            }
                                                            items={[
                                                                {
                                                                    label: "Active",
                                                                    value: "active",
                                                                },
                                                                {
                                                                    label: "Inactive",
                                                                    value: "inactive",
                                                                },
                                                                {
                                                                    label: "Seasonal",
                                                                    value: "seasonal",
                                                                },
                                                                {
                                                                    label: "Ended",
                                                                    value: "ended",
                                                                },
                                                            ]}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.status`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <RadioGroup
                                                            label="Is Main Livelihood"
                                                            name="is_main_livelihood"
                                                            selectedValue={
                                                                livelihood.is_main_livelihood ||
                                                                ""
                                                            }
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
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "is_main_livelihood"
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.is_main_livelihood`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputField
                                                            label="Description"
                                                            name="description"
                                                            type="text"
                                                            value={
                                                                livelihood.description ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "description"
                                                                )
                                                            }
                                                            placeholder="Enter livelihood description"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.description`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputField
                                                            label="Date Started"
                                                            name="started_at"
                                                            type="date"
                                                            value={
                                                                livelihood.started_at ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "started_at"
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.started_at`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputField
                                                            label="Date Ended"
                                                            name="ended_at"
                                                            type="date"
                                                            value={
                                                                livelihood.ended_at ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "ended_at"
                                                                )
                                                            }
                                                            disabled={
                                                                livelihood.occupation_status ===
                                                                "active"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.ended_at`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    <div>
                                                        <InputField
                                                            type="number"
                                                            label="Income"
                                                            name="income"
                                                            value={
                                                                livelihood.income
                                                                    ? livelihood.income ||
                                                                      ""
                                                                    : livelihood.monthly_income ||
                                                                      ""
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "income"
                                                                )
                                                            }
                                                            placeholder="Enter Income"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.income`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <SelectField
                                                            label="Income Frequency"
                                                            name="income_frequency"
                                                            value={
                                                                livelihood.income_frequency
                                                            }
                                                            onChange={(e) =>
                                                                handleLivelihoodFieldChange(
                                                                    e,
                                                                    lvlhdIdx,
                                                                    "income_frequency"
                                                                )
                                                            }
                                                            items={[
                                                                {
                                                                    label: "Daily",
                                                                    value: "daily",
                                                                },
                                                                {
                                                                    label: "Bi-weekly",
                                                                    value: "bi_weekly",
                                                                },
                                                                {
                                                                    label: "Weekly",
                                                                    value: "weekly",
                                                                },
                                                                {
                                                                    label: "Monthly",
                                                                    value: "monthly",
                                                                },
                                                                {
                                                                    label: "Annually",
                                                                    value: "annually",
                                                                },
                                                            ]}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `livelihoods.${lvlhdIdx}.income_frequency`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                                {livelihoodDetails ? (
                                                    <></>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeLivelihood(
                                                                lvlhdIdx
                                                            )
                                                        }
                                                        className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                    >
                                                        <IoIosCloseCircleOutline className="text-2xl" />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                <div className="flex justify-between items-center p-3">
                                    {livelihoodDetails === null ? (
                                        <button
                                            type="button"
                                            onClick={addLivelihood}
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                        >
                                            <IoIosAddCircleOutline className="text-2xl" />
                                            <span>Add Livelihood</span>
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                    <div className="flex justify-end items-center text-end mt-5 gap-4">
                                        {livelihoodDetails == null && (
                                            <Button
                                                type="button"
                                                onClick={() => reset()}
                                            >
                                                <RotateCcw /> Reset
                                            </Button>
                                        )}

                                        <Button
                                            className="bg-blue-700 hover:bg-blue-400 "
                                            type={"submit"}
                                        >
                                            {livelihoodDetails
                                                ? "Update"
                                                : "Add"}{" "}
                                            <IoIosArrowForward />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                {modalState === "view" ? (
                    selectedResident ? (
                        <PersonDetailContent person={selectedResident} />
                    ) : null
                ) : null}
            </SidebarModal>
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                }}
                onConfirm={confirmDelete}
                residentId={residentToDelete}
            />
        </AdminLayout>
    );
}
