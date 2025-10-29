import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Eye,
    Home,
    ListPlus,
    Plus,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import DropdownInputField from "@/Components/DropdownInputField";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import { Toaster, toast } from "sonner";
import InputLabel from "@/Components/InputLabel";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";

const FacilityIndex = ({ facilities, names, types, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Facilities", showOnMobile: true },
    ];

    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [facilityDetails, setFacilityDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [facilityToDelete, setFacilityToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Image" },
        { key: "name", label: "Name" },
        { key: "facility_type", label: "Facilitiy Type" },
        { key: "quantity", label: "Quantity" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("facilities_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "facilities_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["faci_name", "faci_type"].includes(key) && value && value !== ""
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
        router.get(route("barangay_facility.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const columnRenderers = {
        id: (row) => row.id,
        image: (row) => (
            <img
                src={
                    row.facility_image
                        ? `/storage/${row.facility_image}`
                        : "/images/default-avatar.jpg"
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-avatar.jpg";
                }}
                alt="Resident"
                className="w-16 h-16 min-w-16 min-h-16 object-cover rounded-sm border"
            />
        ),

        name: (row) => (
            <span className="font-medium text-gray-900">{row.name || "—"}</span>
        ),

        facility_type: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.facility_type || "—"}
            </span>
        ),

        quantity: (row) => (
            <span className="text-sm text-gray-700">{row.quantity ?? "—"}</span>
        ),
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
    const handleAddFacility = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        facilities: [[]],
        _method: undefined,
        facility_id: null,
    });

    const addFacility = () => {
        setData("facilities", [...(data.facilities || []), {}]);
    };

    const removeFacility = (facIdx) => {
        const updated = [...(data.facilities || [])];
        updated.splice(facIdx, 1);
        setData("facilities", updated);
        toast.warning("Facility removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setFacilityDetails(null);
        reset();
        clearErrors();
    };

    const handleFacilityFieldChange = (value, facIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.facilities];

            // if updating file input
            if (field === "facility_image" && value instanceof File) {
                updated[facIdx] = {
                    ...updated[facIdx],
                    facility_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[facIdx] = {
                    ...updated[facIdx],
                    [field]: value,
                };
            }

            return { ...prevData, facilities: updated };
        });
    };

    const handleSubmitFacility = (e) => {
        e.preventDefault();
        post(route("barangay_facility.store"), {
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
                `${APP_URL}/barangay_facility/details/${id}`
            );
            const facility = response.data.facility;

            // Set the form data
            setData({
                facilities: [
                    {
                        facility_image: null, // Do not send existing image by default
                        previewImage: facility.facility_image
                            ? `/storage/${facility.facility_image}`
                            : null, // For showing in the form
                        name: facility.name || "",
                        facility_type: facility.facility_type || "",
                        quantity: facility.quantity || 1,
                    },
                ],
                _method: "PUT",
                facility_id: facility.id,
            });

            setFacilityDetails(facility); // Keep original facility if needed elsewhere
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching facility details:", error);
        }
    };

    const handleUpdateFacility = (e) => {
        e.preventDefault();
        post(route("barangay_facility.update", data.facility_id), {
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

    // delete
    const handleDeleteClick = (id) => {
        setFacilityToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_facility.destroy", facilityToDelete), {
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
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <Home className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Barangay Facilities Overview
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Review, filter, and manage all barangay
                                        facilities including health centers,
                                        schools, public spaces, and other
                                        essential services. Monitor their types,
                                        availability, and details efficiently to
                                        ensure proper community management.
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
                                            placeholder="Search facility name"
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
                                            onClick={handleAddFacility}
                                        >
                                            <ListPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add a Facility
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["faci_name", "faci_type"]}
                                    showFilters={true}
                                    types={types}
                                    names={names}
                                    clearRouteName="barangay_facility.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                queryParams={queryParams}
                                passedData={facilities}
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
                        modalState == "add" ? "Add Facility" : "Edit Facility"
                    }
                >
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={
                            facilityDetails
                                ? handleUpdateFacility
                                : handleSubmitFacility
                        }
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Barangay Facility Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Please provide details about the existing facilities
                            in the barangay.
                        </p>

                        {Array.isArray(data.facilities) &&
                            data.facilities.map((facility, facIdx) => (
                                <div
                                    key={facIdx}
                                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-6 mb-6">
                                        {/* Facility Details */}
                                        <div className="md:col-span-2 flex flex-col items-center space-y-2">
                                            <InputLabel
                                                htmlFor={`facility_image_${facIdx}`}
                                                value="Facility Photo"
                                            />

                                            <img
                                                src={
                                                    facility.previewImage ||
                                                    "/images/default-avatar.jpg"
                                                }
                                                alt="Facility Image"
                                                className="w-32 h-32 object-cover rounded-sm border border-gray-200"
                                            />

                                            <input
                                                id={`facility_image_${facIdx}`}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        handleFacilityFieldChange(
                                                            file,
                                                            facIdx,
                                                            "facility_image"
                                                        );
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500
                                                                                            file:mr-2 file:py-1 file:px-3
                                                                                            file:rounded file:border-0
                                                                                            file:text-xs file:font-semibold
                                                                                            file:bg-blue-50 file:text-blue-700
                                                                                            hover:file:bg-blue-100"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `facilities.${facIdx}.facility_image`
                                                    ]
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-4">
                                            {/* Facility Name */}
                                            <InputField
                                                label="Facility Name"
                                                type="text"
                                                name="name"
                                                value={facility.name || ""}
                                                onChange={(e) =>
                                                    handleFacilityFieldChange(
                                                        e.target.value,
                                                        facIdx,
                                                        "name"
                                                    )
                                                }
                                                placeholder="Enter Facility Name"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `facilities.${facIdx}.name`
                                                    ]
                                                }
                                                className="mt-1"
                                            />

                                            {/* Facility Type + Quantity */}
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                <div className="sm:col-span-2">
                                                    <DropdownInputField
                                                        label="Facility Type"
                                                        name="facility_type"
                                                        value={
                                                            facility.facility_type ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleFacilityFieldChange(
                                                                e.target.value,
                                                                facIdx,
                                                                "facility_type"
                                                            )
                                                        }
                                                        items={[
                                                            {
                                                                label: "Government",
                                                                value: "government",
                                                            },
                                                            {
                                                                label: "Protection",
                                                                value: "protection",
                                                            },
                                                            {
                                                                label: "Security",
                                                                value: "security",
                                                            },
                                                            {
                                                                label: "Finance",
                                                                value: "finance",
                                                            },
                                                            {
                                                                label: "Service",
                                                                value: "service",
                                                            },
                                                            {
                                                                label: "Commerce",
                                                                value: "commerce",
                                                            },
                                                        ]}
                                                        placeholder="Select Facility Type"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `facilities.${facIdx}.facility_type`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputField
                                                        type="number"
                                                        label="Quantity"
                                                        name="quantity"
                                                        value={
                                                            facility.quantity ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleFacilityFieldChange(
                                                                e.target.value,
                                                                facIdx,
                                                                "quantity"
                                                            )
                                                        }
                                                        placeholder="Enter Quantity"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `facilities.${facIdx}.quantity`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {facilityDetails === null && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeFacility(facIdx)
                                            }
                                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                        >
                                            <IoIosCloseCircleOutline className="text-2xl" />
                                        </button>
                                    )}
                                </div>
                            ))}

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center p-3">
                            {facilityDetails === null ? (
                                <button
                                    type="button"
                                    onClick={addFacility}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-2xl" />
                                    <span>Add Facility</span>
                                </button>
                            ) : (
                                <div></div>
                            )}

                            <div className="flex justify-end items-center text-end mt-5 gap-4">
                                {facilityDetails == null && (
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
                                    {facilityDetails ? "Update" : "Add"}{" "}
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
                    residentId={facilityToDelete}
                />
            </div>
        </AdminLayout>
    );
};

export default FacilityIndex;
