import ActionMenu from "@/Components/ActionMenu";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DynamicTable from "@/Components/DynamicTable";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    Eye,
    GraduationCap,
    HousePlus,
    ListPlus,
    MoveRight,
    RotateCcw,
    Search,
    SquarePen,
    SquarePlus,
    Trash2,
    UserPlus,
    UserRoundPlus,
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
    EDUCATION_LEVEL_TEXT,
    EDUCATION_SCHOOL_TYPE,
    EDUCATION_STATUS_TEXT,
} from "@/constants";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import ExportButton from "@/Components/ExportButton";

export default function Index({
    educations,
    puroks,
    queryParams = null,
    residents,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Residents Education", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const [query, setQuery] = useState(queryParams["name"] ?? "");

    // filter form handling
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
        router.get(route("education.index", queryParams));
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

    // active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "purok",
                "educational_attainment",
                "educational_status",
                "school_type",
                "year_started",
                "year_ended",
                "latest_education",
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
        { key: "id", label: "Histoy ID" },
        { key: "name", label: "Name" },
        { key: "educational_attainment", label: "Educational Attainment" },
        { key: "education_status", label: "Education Status" },
        { key: "school_name", label: "School Name" },
        { key: "school_type", label: "School Type" },
        { key: "year_started", label: "Year Started" },
        { key: "year_ended", label: "Year Ended" },
        { key: "program", label: "Program (Course)" },
        { key: "purok_number", label: "Purok" },
        { key: "actions", label: "Actions" },
    ];

    // action buttons
    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);
    const handlePrint = () => {
        window.print();
    };
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);
    const [educationHistory, setEducationHistory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [deleteHistoryID, setDeleteHistoryID] = useState(null); //delete

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("education_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "education_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // list of residents for dropdown
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

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

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => {
            const r = row?.resident;
            if (!r) return "Unknown";
            return `${r.firstname ?? ""} ${r.middlename ?? ""} ${
                r.lastname ?? ""
            } ${r.suffix ?? ""}`.trim();
        },

        educational_attainment: (row) =>
            EDUCATION_LEVEL_TEXT[row.educational_attainment] || "—",

        education_status: (row) => {
            const status = row.education_status;
            const label = EDUCATION_STATUS_TEXT[status] || "N/A";

            const badgeMap = {
                graduated: "bg-green-100 text-green-800",
                enrolled: "bg-blue-100 text-blue-800",
                incomplete: "bg-yellow-100 text-yellow-800",
                dropped_out: "bg-red-100 text-red-800",
            };

            const badgeClass = badgeMap[status] || "bg-gray-100 text-gray-600";

            return (
                <span
                    className={`px-2 py-1 text-xs font-medium rounded ${badgeClass}`}
                >
                    {label}
                </span>
            );
        },

        school_name: (row) => row.school_name ?? "—",

        school_type: (row) => (
            <span
                className={`px-2 py-1 text-xs rounded ${
                    row.school_type === "private"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                }`}
            >
                {EDUCATION_SCHOOL_TYPE[row.school_type] ?? "—"}
            </span>
        ),

        year_started: (row) => row.year_started ?? "—",

        year_ended: (row) => row.year_ended ?? "—",

        program: (row) =>
            row.program ?? <span className="text-gray-400 italic">N/A</span>,

        purok_number: (row) => row?.resident?.purok_number ?? "—",

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row?.resident?.id),
                    },
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEdit(row?.id),
                    },
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row?.id),
                    },
                ]}
            />
        ),
    };

    // Form handling
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: null,
        purok_number: null,
        educational_histories: [[]],
        history_id: null,
        _method: undefined,
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);

    const handleAddEducation = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        post(route("education.store"), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
    };
    const handleEditSubmit = (e) => {
        e.preventDefault();
        post(route("education.update", data.history_id), {
            onError: () => {
                console.error("Validation Errors:", errors);
            },
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setEducationHistory(null);
        reset();
        clearErrors();
    };
    useEffect(() => {
        if (success) {
            handleModalClose();
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

    const addEducation = () => {
        setData("educational_histories", [
            ...(data.educational_histories || []),
            {},
        ]);
    };

    const removeEducation = (occIndex) => {
        const updated = [...(data.educational_histories || [])];
        updated.splice(occIndex, 1);
        setData("educational_histories", updated);
        toast.warning("History removed.", {
            duration: 2000,
        });
    };

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    const handleEdit = async (id) => {
        setModalState("add");
        setEducationHistory(null);
        try {
            const response = await axios.get(
                `${APP_URL}/education/history/${id}`
            );
            const history = response.data.history;
            setEducationHistory(history);
            setData("resident_id", history.resident.id);
            setData(
                "resident_name",
                `${history.resident.firstname} ${history.resident.middlename} ${
                    history.resident.lastname
                } ${history.resident.suffix ?? ""}`
            );
            setData("purok_number", history.resident.purok_number);
            setData("birthdate", history.resident.birthdate);
            setData("resident_image", history.resident.resident_picture_path);
            setData("educational_histories", [
                {
                    education: history.educational_attainment || "",
                    education_status: history.education_status || "",
                    school_name: history.school_name || "",
                    program: history.program || "",
                    school_type: history.school_type || "",
                    year_ended: history.year_ended || "",
                    year_started: history.year_started || "",
                },
            ]);
            setData("history_id", history.id);
            setData("_method", "PUT");
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteHistoryID(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("education.destroy", deleteHistoryID));
        setIsDeleteModalOpen(false);
    };

    return (
        <AdminLayout>
            <Head title="Resident Education" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(educations, undefined, 3)}</pre> */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <GraduationCap className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Education Records
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Track resident education levels and
                                        related data. Use the tools below to
                                        <span className="font-medium">
                                            {" "}
                                            search, filter, and export
                                        </span>{" "}
                                        education records for reports and
                                        community planning.
                                    </p>
                                </div>
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
                                    url="report/export-education-excel"
                                    queryParams={queryParams}
                                    label="Export Resident Educations as XLSX"
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
                                        onClick={handleAddEducation}
                                    >
                                        <ListPlus className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        Add an Education
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
                                    "educational_attainment",
                                    "educational_status",
                                    "school_type",
                                    "year_started",
                                    "year_ended",
                                    "latest_education",
                                ]}
                                puroks={puroks}
                                showFilters={true}
                                clearRouteName="education.index"
                                clearRouteParams={{}}
                            />
                        )}
                        <DynamicTable
                            passedData={educations}
                            allColumns={allColumns}
                            columnRenderers={columnRenderers}
                            queryParams={queryParams}
                            visibleColumns={visibleColumns}
                            showTotal={true}
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
                    modalState === "add"
                        ? educationHistory
                            ? "Edit Education History"
                            : "Add Education History"
                        : "View Resident Details"
                }
            >
                {modalState === "add" && (
                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                        <form
                            onSubmit={
                                educationHistory
                                    ? handleEditSubmit
                                    : handleAddSubmit
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
                                            readOnly={educationHistory}
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
                            <div className="space-y-4 mt-4">
                                {Array.isArray(data.educational_histories) &&
                                    data.educational_histories.map(
                                        (edu_history, edIndex) => (
                                            <div
                                                key={edIndex}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                <div className="grid md:grid-cols-3 gap-10 mt-4">
                                                    <div>
                                                        <DropdownInputField
                                                            label="Educational Attainment"
                                                            name="education"
                                                            value={
                                                                edu_history.education ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "education",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            items={[
                                                                {
                                                                    label: "No Education Yet",
                                                                    value: "no_education_yet",
                                                                },
                                                                {
                                                                    label: "No Formal Education",
                                                                    value: "no_formal_education",
                                                                },
                                                                {
                                                                    label: "Prep School",
                                                                    value: "prep_school",
                                                                },
                                                                {
                                                                    label: "Kindergarten",
                                                                    value: "kindergarten",
                                                                },
                                                                {
                                                                    label: "Elementary",
                                                                    value: "elementary",
                                                                },
                                                                {
                                                                    label: "High School",
                                                                    value: "high_school",
                                                                },
                                                                {
                                                                    label: "Senior High School",
                                                                    value: "senior_high_school",
                                                                },
                                                                {
                                                                    label: "College",
                                                                    value: "college",
                                                                },
                                                                {
                                                                    label: "ALS (Alternative Learning System)",
                                                                    value: "als",
                                                                },
                                                                {
                                                                    label: "TESDA",
                                                                    value: "tesda",
                                                                },
                                                                {
                                                                    label: "Vocational",
                                                                    value: "vocational",
                                                                },
                                                                {
                                                                    label: "Post Graduate",
                                                                    value: "post_graduate",
                                                                },
                                                            ]}
                                                            placeholder="Select your Educational Attainment"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.education`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <SelectField
                                                            label="Educational Status"
                                                            name="education_status"
                                                            items={[
                                                                {
                                                                    label: "Currently Enrolled",
                                                                    value: "enrolled",
                                                                },
                                                                {
                                                                    label: "Graduated",
                                                                    value: "graduated",
                                                                },
                                                                {
                                                                    label: "Incomplete",
                                                                    value: "incomplete",
                                                                },
                                                                {
                                                                    label: "Dropped Out",
                                                                    value: "dropped_out",
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                edu_history.education_status ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "education_status",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            disabled={
                                                                edu_history.education ===
                                                                    "no_formal_education" ||
                                                                edu_history.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.education_status`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputField
                                                            label="School Name"
                                                            name="school_name"
                                                            type="text"
                                                            value={
                                                                edu_history.school_name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "school_name",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            placeholder="Enter school name"
                                                            disabled={
                                                                edu_history.education ===
                                                                    "no_formal_education" ||
                                                                edu_history.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.school_name`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-3 gap-4 mt-4">
                                                    <div>
                                                        <RadioGroup
                                                            label="School Type"
                                                            name="school_type"
                                                            options={[
                                                                {
                                                                    label: "Public",
                                                                    value: "public",
                                                                },
                                                                {
                                                                    label: "Private",
                                                                    value: "private",
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                edu_history.school_type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "school_type",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            disabled={
                                                                edu_history.education ===
                                                                    "no_formal_education" ||
                                                                edu_history.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.school_type`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <YearDropdown
                                                            label="Year Started"
                                                            name="year_started"
                                                            value={
                                                                edu_history.year_started ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "year_started",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            disabled={
                                                                edu_history.education ===
                                                                    "no_formal_education" ||
                                                                edu_history.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.year_started`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <YearDropdown
                                                            label="Year Ended"
                                                            name="year_ended"
                                                            value={
                                                                edu_history.year_ended ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayValues(
                                                                    e,
                                                                    edIndex,
                                                                    "year_ended",
                                                                    "educational_histories"
                                                                )
                                                            }
                                                            disabled={
                                                                edu_history.education ===
                                                                    "no_formal_education" ||
                                                                edu_history.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `educational_histories.${edIndex}.year_ended`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    {edu_history.education ===
                                                        "college" && (
                                                        <div>
                                                            <InputField
                                                                label={
                                                                    edu_history.education_status ===
                                                                    "graduated"
                                                                        ? "Finished Course"
                                                                        : "Current Course"
                                                                }
                                                                name="program"
                                                                type="text"
                                                                value={
                                                                    edu_history.program ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleArrayValues(
                                                                        e,
                                                                        edIndex,
                                                                        "program",
                                                                        "educational_histories"
                                                                    )
                                                                }
                                                                placeholder="Enter your course"
                                                                disabled={
                                                                    edu_history.education ===
                                                                    "no_formal_education"
                                                                }
                                                            />
                                                            <InputError
                                                                message={
                                                                    errors[
                                                                        `educational_histories.${edIndex}.program`
                                                                    ]
                                                                }
                                                                className="mt-2"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                {educationHistory === null && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeEducation(
                                                                edIndex
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
                                    {educationHistory === null ? (
                                        <button
                                            type="button"
                                            onClick={addEducation}
                                            className="flex items-center gap-1 text-sm mb-4 text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                        >
                                            <IoIosAddCircleOutline className="text-2xl" />
                                            <span>Add Edicational History</span>
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    <div className="flex justify-end items-center gap-2">
                                        {educationHistory == null && (
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
                                            {educationHistory
                                                ? "Update"
                                                : "Add"}{" "}
                                            <MoveRight />
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
                residentId={deleteHistoryID}
            />
        </AdminLayout>
    );
}
