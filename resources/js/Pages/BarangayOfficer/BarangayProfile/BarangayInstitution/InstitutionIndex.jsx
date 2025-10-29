import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import AdminLayout from "@/Layouts/AdminLayout";
import useAppUrl from "@/hooks/useAppUrl";
import ActionMenu from "@/Components/ActionMenu";
import {
    Eye,
    HousePlus,
    ListPlus,
    Plus,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
    UsersRound,
} from "lucide-react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { INSTITUTION_STATUS_TEXT, INSTITUTION_TYPE_TEXT } from "@/constants";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import DropdownInputField from "@/Components/DropdownInputField";
import YearDropdown from "@/Components/YearDropdown";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import SidebarModal from "@/Components/SidebarModal";
import { Textarea } from "@/Components/ui/textarea";
import { Toaster, toast } from "sonner";
import SelectField from "@/Components/SelectField";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";

const InstitutionIndex = ({ institutions, institutionNames, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Insititutions", showOnMobile: true },
    ];

    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [institutionDetails, setInstitutionDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [institutionToDelete, setInstitutionToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Institution Type" },
        { key: "head", label: "Head of Institution" },
        { key: "description", label: "Description" },
        { key: "year_established", label: "Year Established" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("instutions_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "instutions_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => ["institution"].includes(key) && value && value !== ""
    );

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const [showFilters, setShowFilters] = useState(hasActiveFilter);

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
        router.get(route("barangay_institution.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <Link href={route("barangay_institution.show", row.id)}>
                <span className="font-medium text-gray-900 hover:text-blue-500 hover:underline">
                    {row.name || "—"}
                </span>
            </Link>
        ),

        type: (row) => (
            <span className="text-sm text-gray-700">
                {INSTITUTION_TYPE_TEXT[row.type] || "—"}
            </span>
        ),
        head: (row) => {
            const res = row?.head?.resident;
            return res
                ? `${res.firstname} ${res.middlename ?? ""} ${res.lastname} ${
                      res.suffix ?? ""
                  }`
                : "No assigned head";
        },

        description: (row) => (
            <span className="text-sm text-gray-500 line-clamp-2">
                {row.description || "—"}
            </span>
        ),

        year_established: (row) => (
            <span className="text-sm text-gray-700">
                {row.year_established || "—"}
            </span>
        ),

        status: (row) => {
            const statusColors = {
                active: "bg-green-100 text-green-800",
                inactive: "bg-yellow-100 text-yellow-800",
                dissolved: "bg-red-100 text-red-800",
            };
            return (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[row.status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                    {INSTITUTION_STATUS_TEXT[row.status] || "—"}
                </span>
            );
        },

        created_at: (row) => (
            <span className="text-sm text-gray-500">
                {row.created_at
                    ? new Date(row.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "—"}
            </span>
        ),

        updated_at: (row) => (
            <span className="text-sm text-gray-500">
                {row.updated_at
                    ? new Date(row.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "—"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
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

    // add
    const handleAddInstitution = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        institutions: [[]],
        _method: undefined,
        institution_id: null,
    });

    const addInstitution = () => {
        setData("institutions", [...(data.institutions || []), {}]);
    };
    const removeInstitution = (instiIdx) => {
        const updated = [...(data.institutions || [])];
        updated.splice(instiIdx, 1);
        setData("institutions", updated);
        toast.warning("Institution removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setInstitutionDetails(null);
        reset();
        clearErrors();
    };

    const handleInstitutionFieldChange = (value, instIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.institutions];

            // make sure the institution entry exists
            if (!updated[instIdx]) {
                updated[instIdx] = {};
            }

            updated[instIdx] = {
                ...updated[instIdx],
                [field]: value,
            };

            return { ...prevData, institutions: updated };
        });
    };
    const handleSubmitInstitution = (e) => {
        e.preventDefault();
        post(route("barangay_institution.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
    };

    // edit
    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_institution/details/${id}`
            );
            const institution = response.data.institution;
            console.log(institution);
            setInstitutionDetails(institution);
            setData({
                institutions: [
                    {
                        name: institution.name || "",
                        type: institution.type || "",
                        status: institution.status || "",
                        description: institution.description || "",
                        year_established: institution.year_established || "",
                    },
                ],
                _method: "PUT",
                institution_id: institution.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching institution details:", error);
        }
    };
    const handleUpdateInstitution = (e) => {
        e.preventDefault();
        post(route("barangay_institution.update", data.institution_id), {
            onError: (errors) => {
                //console.error("Validation Errors:", errors);

                const allErrors = Object.values(errors).join("<br />");
                toast.error("Validation Error", {
                    description: (
                        <span dangerouslySetInnerHTML={{ __html: allErrors }} />
                    ),
                    duration: 3000,
                    closeButton: true,
                });
            },
        });
    };

    // delete
    const handleDeleteClick = (id) => {
        setInstitutionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(
            route("barangay_institution.destroy", institutionToDelete),
            {
                onError: (errors) => {
                    console.error("Validation Errors:", errors);

                    const allErrors = Object.values(errors).join("<br />");
                    toast.error("Validation Error", {
                        description: (
                            <span
                                dangerouslySetInnerHTML={{ __html: allErrors }}
                            />
                        ),
                        duration: 3000,
                        closeButton: true,
                    });
                },
            }
        );
        setIsDeleteModalOpen(false);
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
    return (
        <AdminLayout>
            <Head title="Barangay Infrastructure" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />
            <div className="pt-4 mb-10">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <UsersRound className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Barangay Institution Overview
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Review, filter, and manage existing
                                        barangay institutions efficiently.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
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

                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            onClick={handleAddInstitution}
                                        >
                                            <ListPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add an Institution
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["institution"]}
                                    institutions={institutionNames}
                                    clearRouteName="barangay_institution.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}
                            <DynamicTable
                                queryParams={queryParams}
                                passedData={institutions}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
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
                        modalState == "add"
                            ? "Add Institution"
                            : "Edit Institution"
                    }
                >
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={
                            institutionDetails
                                ? handleUpdateInstitution
                                : handleSubmitInstitution
                        }
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Barangay Institutions / Groups
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Please provide details about existing institutions,
                            organizations, or groups within the barangay.
                        </p>

                        {Array.isArray(data.institutions) &&
                            data.institutions.map((institution, instIdx) => (
                                <div
                                    key={instIdx}
                                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-6 mb-6 gap-4">
                                        {/* Institution Name */}
                                        <div className="md:col-span-3">
                                            <InputField
                                                label="Institution Name"
                                                name="name"
                                                value={institution.name || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "name"
                                                    )
                                                }
                                                placeholder="e.g. Fisherfolk Association"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.name`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Type */}
                                        <div className="md:col-span-3">
                                            <DropdownInputField
                                                label="Institution Type"
                                                name="type"
                                                value={institution.type || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "type"
                                                    )
                                                }
                                                placeholder="Select or enter type"
                                                items={[
                                                    {
                                                        label: "Youth Organization",
                                                        value: "youth_org",
                                                    },
                                                    {
                                                        label: "Cooperative",
                                                        value: "coop",
                                                    },
                                                    {
                                                        label: "Religious Group",
                                                        value: "religious",
                                                    },
                                                    {
                                                        label: "Farmers Association",
                                                        value: "farmers",
                                                    },
                                                    {
                                                        label: "Transport Group",
                                                        value: "transport",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.type`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-6">
                                            <Textarea
                                                label="Description"
                                                name="description"
                                                value={
                                                    institution.description ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "description"
                                                    )
                                                }
                                                className={"text-gray-600"}
                                                placeholder="Brief description of the institution..."
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.description`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Year & Status */}
                                        <div className="md:col-span-3">
                                            <YearDropdown
                                                label="Year Established"
                                                name="year_established"
                                                value={
                                                    institution.year_established ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
                                                        "year_established"
                                                    )
                                                }
                                                placeholder="YYYY"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.year_established`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        <div className="md:col-span-3">
                                            <SelectField
                                                label="Status"
                                                name="status"
                                                value={institution.status || ""}
                                                onChange={(e) =>
                                                    handleInstitutionFieldChange(
                                                        e.target.value,
                                                        instIdx,
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
                                                        label: "Dissolved",
                                                        value: "dissolved",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `institutions.${instIdx}.status`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Remove button */}
                                    {institutionDetails === null && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeInstitution(instIdx)
                                            }
                                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                        >
                                            <IoIosCloseCircleOutline className="text-2xl" />
                                        </button>
                                    )}
                                </div>
                            ))}

                        <div className="flex justify-between items-center p-3">
                            {institutionDetails === null ? (
                                <button
                                    type="button"
                                    onClick={addInstitution}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-2xl" />
                                    <span>Add Institution</span>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            <div className="flex justify-end items-center text-end mt-5 gap-4">
                                {institutionDetails == null && (
                                    <Button
                                        type="button"
                                        onClick={() => reset()}
                                    >
                                        <RotateCcw /> Reset
                                    </Button>
                                )}

                                <Button
                                    className="bg-blue-700 hover:bg-blue-400"
                                    type={"submit"}
                                >
                                    {institutionDetails ? "Update" : "Add"}{" "}
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </form>
                </SidebarModal>
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                    }}
                    onConfirm={confirmDelete}
                    residentId={institutionToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default InstitutionIndex;
