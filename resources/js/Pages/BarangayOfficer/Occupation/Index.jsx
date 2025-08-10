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

export default function Index({
    occupations,
    puroks,
    queryParams = null,
    residents = [],
    occupationTypes = [],
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Occupation", showOnMobile: true },
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
        router.get(route("occupation.index", queryParams));
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
    const [occupationDetails, setOccupation] = useState(null);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "employment_type",
                "work_arrangement",
                "occupation_status",
                "is_ofw",
                "year_started",
                "year_ended",
                "latest_occupation",
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
        { key: "id", label: "Occupation ID" },
        { key: "name", label: "Name" },
        { key: "occupation", label: "Occupation" },
        { key: "employment_type", label: "Employment Type" },
        { key: "work_arrangement", label: "Work Arrangement" },
        { key: "occupation_status", label: "Status" },
        { key: "started_at", label: "Year Started" },
        { key: "ended_at", label: "Year Ended" },
        { key: "is_ofw", label: "Is OFW?" },
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
        const saved = localStorage.getItem("occupation_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "occupation_visible_columns",
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

        occupation: (row) => (
            <span className="text-xs font-medium">{row.occupation || "—"}</span>
        ),

        employment_type: (row) => (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {EMPLOYMENT_TYPE_TEXT[row.employment_type] || "—"}
            </span>
        ),

        work_arrangement: (row) => (
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {WORK_ARRANGEMENT_TEXT[row.work_arrangement] || "—"}
            </span>
        ),

        occupation_status: (row) => {
            const value = row.occupation_status ?? "—";
            const statusColor =
                value === "active"
                    ? "bg-green-100 text-green-800"
                    : value === "inactive"
                    ? "bg-red-100 text-red-800"
                    : value === "retired"
                    ? "bg-gray-100 text-gray-700"
                    : value === "ended"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-700";

            return (
                <span
                    className={`${statusColor} px-2 py-0.5 rounded-md text-xs font-medium capitalize`}
                >
                    {OCCUPATION_STATUS_TEXT[value] ||
                        value.replaceAll("_", " ")}
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

        is_ofw: (row) => (
            <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    row.is_ofw
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                }`}
            >
                {row.is_ofw ? "Yes" : "No"}
            </span>
        ),

        purok_number: (row) => (
            <span className="text-xs text-gray-800">
                {row.resident?.purok_number ?? "—"}
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
                        onClick: () => handleDelete(row.id),
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
                `${APP_URL}/barangay_officer/resident/showresident/${resident}`
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
        employment_status: null,
        occupations: [[]],
        _method: undefined,
        occupation_id: null,
    });

    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
        toast.warning("Occupation removed.", {
            duration: 2000,
        });
    };

    const handleOccupationFieldChange = (e, occIndex, fieldName) => {
        const updated = [...(data.occupations || [])];
        updated[occIndex] = {
            ...updated[occIndex],
            [fieldName]: e.target.value,
        };
        setData("occupations", updated);
    };

    const handleAddOccupation = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleEdit = async (id) => {
        setModalState("add");

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/occupation/details/${id}`
            );
            const occupation = response.data.occupation;
            console.log(occupation);
            setOccupation(occupation);
            setData({
                resident_id: occupation.resident.id,
                resident_name: `${occupation.resident.firstname} ${
                    occupation.resident.middlename ?? ""
                } ${occupation.resident.lastname}`,
                resident_image: occupation.resident.image ?? null,
                birthdate: occupation.resident.birthdate ?? null,
                purok_number: occupation.resident.purok_number ?? null,
                employment_status: occupation.resident.employment_status,
                occupations: [
                    {
                        employer: occupation.employer || "",
                        occupation: occupation.occupation || "",
                        occupation_status: occupation.occupation_status || "",
                        employment_type: occupation.employment_type || "",
                        is_ofw: occupation.is_ofw
                            ? occupation.is_ofw.toString()
                            : "",
                        work_arrangement: occupation.work_arrangement || "",
                        income: occupation.monthly_income || 0,
                        income_frequency: "monthly",
                        started_at: occupation.started_at || "",
                        ended_at: occupation.ended_at || "",
                    },
                ],
                _method: "PUT",
                occupation_id: occupation.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching occupation details:", error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setOccupation(null);
        reset();
        clearErrors();
    };

    const handleSubmitOccupation = (e) => {
        e.preventDefault();
        post(route("occupation.store"), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleUpdateOccupation = (e) => {
        e.preventDefault();
        post(route("occupation.update", data.occupation_id), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
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
            <Head title="Residents Occupations" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(occupations, undefined, 3)}</pre> */}
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
                                        onClick={handleAddOccupation}
                                    >
                                        <SquarePlus className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        Add an Occupation
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
                                    "employment_type",
                                    "work_arrangement",
                                    "occupation_status",
                                    "is_ofw",
                                    "year_started",
                                    "year_ended",
                                    "latest_occupation",
                                ]}
                                puroks={puroks}
                                showFilters={true}
                                clearRouteName="occupation.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={occupations}
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
                    modalState === "add" && occupationDetails
                        ? "Edit Occupation"
                        : modalState === "add"
                        ? "Add Occupation"
                        : "View Resident"
                }
            >
                {modalState === "add" && (
                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                        <form
                            onSubmit={
                                occupationDetails
                                    ? handleUpdateOccupation
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
                                            readOnly={occupationDetails}
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
                                    <div className="w-[200px] mb-4">
                                        <SelectField
                                            label="Current Employment Status"
                                            name="employment_status"
                                            value={data.employment_status || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "employment_status",
                                                    e.target.value
                                                )
                                            }
                                            items={[
                                                {
                                                    label: "Employed",
                                                    value: "employed",
                                                },
                                                {
                                                    label: "Unemployed",
                                                    value: "unemployed",
                                                },
                                                {
                                                    label: "Underemployed",
                                                    value: "under_employed",
                                                },
                                                {
                                                    label: "Retired",
                                                    value: "retired",
                                                },
                                                {
                                                    label: "Student",
                                                    value: "student",
                                                },
                                            ]}
                                        />
                                        <InputError
                                            message={errors.employment_status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            {Array.isArray(data.occupations) &&
                                data.occupations.map((occupation, occIndex) => (
                                    <div
                                        key={occIndex}
                                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {/* <div>
                                                <SelectField
                                                    label="Employment Status"
                                                    name="employment_status"
                                                    value={
                                                        occupation.employment_status ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "employment_status"
                                                        )
                                                    }
                                                    items={[
                                                        {
                                                            label: "Employed",
                                                            value: "employed",
                                                        },
                                                        {
                                                            label: "Unemployed",
                                                            value: "unemployed",
                                                        },
                                                        {
                                                            label: "Underemployed",
                                                            value: "under_employed",
                                                        },
                                                        {
                                                            label: "Retired",
                                                            value: "retired",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.employment_status`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div> */}
                                            <div>
                                                <DropdownInputField
                                                    label="Occupation"
                                                    name="occupation"
                                                    value={
                                                        occupation.occupation ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "occupation"
                                                        )
                                                    }
                                                    placeholder="Select or Enter Occupation"
                                                    items={occupationTypes}
                                                    disabled={
                                                        occupation.employment_status ===
                                                        "unemployed"
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.occupation`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <SelectField
                                                    label="Employment Type"
                                                    name="employment_type"
                                                    value={
                                                        occupation.employment_type ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "employment_type"
                                                        )
                                                    }
                                                    items={[
                                                        {
                                                            label: "Full-time",
                                                            value: "full_time",
                                                        },
                                                        {
                                                            label: "Part-time",
                                                            value: "part_time",
                                                        },
                                                        {
                                                            label: "Seasonal",
                                                            value: "seasonal",
                                                        },
                                                        {
                                                            label: "Contractual",
                                                            value: "contractual",
                                                        },
                                                        {
                                                            label: "Self-employed",
                                                            value: "self_employed",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.employment_type`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <SelectField
                                                    label="Occupation Status"
                                                    name="occupation_status"
                                                    value={
                                                        occupation.occupation_status ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "occupation_status"
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
                                                            label: "Ended",
                                                            value: "ended",
                                                        },
                                                        {
                                                            label: "Retired",
                                                            value: "retired",
                                                        },
                                                        {
                                                            label: "Terminated",
                                                            value: "terminated",
                                                        },
                                                        {
                                                            label: "Resigned",
                                                            value: "resigned",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.occupation_status`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <SelectField
                                                    label="Work Arrangement"
                                                    name="work_arrangement"
                                                    items={[
                                                        {
                                                            label: "Remote",
                                                            value: "remote",
                                                        },
                                                        {
                                                            label: "On-site",
                                                            value: "on_site",
                                                        },
                                                        {
                                                            label: "Hybrid",
                                                            value: "hybrid",
                                                        },
                                                    ]}
                                                    value={
                                                        occupation.work_arrangement ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "work_arrangement"
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.work_arrangement`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Employer name"
                                                    name="employer"
                                                    type="text"
                                                    value={
                                                        occupation.employer ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "employer"
                                                        )
                                                    }
                                                    placeholder="Enter employer name"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.employer`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div>
                                                <YearDropdown
                                                    label="Year Started"
                                                    name="started_at"
                                                    value={
                                                        occupation.started_at ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "started_at"
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.started_at`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <YearDropdown
                                                    label="Year Ended"
                                                    name="ended_at"
                                                    value={
                                                        occupation.ended_at ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "ended_at"
                                                        )
                                                    }
                                                    disabled={
                                                        occupation.occupation_status ===
                                                        "active"
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.ended_at`
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
                                                        occupation.income || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "income"
                                                        )
                                                    }
                                                    placeholder="Enter Income"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.income`
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
                                                        occupation.income_frequency ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
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
                                                            `occupations.${occIndex}.income_frequency`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <RadioGroup
                                                    label="Overseas Filipino Worker"
                                                    name="is_ofw"
                                                    selectedValue={
                                                        occupation.is_ofw || ""
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
                                                        handleOccupationFieldChange(
                                                            e,
                                                            occIndex,
                                                            "is_ofw"
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `occupations.${occIndex}.is_ofw`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        {occupationDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeOccupation(occIndex)
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                            >
                                                <IoIosCloseCircleOutline className="text-2xl" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            <div className="flex justify-between items-center p-3">
                                {occupationDetails === null ? (
                                    <button
                                        type="button"
                                        onClick={addOccupation}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Occupation</span>
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                                <div className="flex justify-end items-center text-end mt-5 gap-4">
                                    {occupationDetails == null && (
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
                                        {occupationDetails ? "Update" : "Add"}{" "}
                                        <IoIosArrowForward />
                                    </Button>
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
        </AdminLayout>
    );
}
