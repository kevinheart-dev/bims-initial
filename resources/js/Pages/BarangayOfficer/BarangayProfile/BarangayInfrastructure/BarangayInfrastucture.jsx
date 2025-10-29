import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Home,
    ListPlus,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import InputField from "@/Components/InputField";
import { Button } from "@/Components/ui/button";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import SidebarModal from "@/Components/SidebarModal";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import DropdownInputField from "@/Components/DropdownInputField";
import { Toaster, toast } from "sonner";
import InputLabel from "@/Components/InputLabel";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import DynamicTable from "@/Components/DynamicTable";
import InputError from "@/Components/InputError";

export default function BarangayInfrastucture({
    infrastructure,
    types,
    categories,
    queryParams,
}) {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Infrastructures", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [infrastructureDetails, setInfrastructureDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [infraToDelete, setInfraToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Image" },
        { key: "infrastructure_type", label: "Type" },
        { key: "infrastructure_category", label: "Category" },
        { key: "quantity", label: "Quantity" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("infrastructures_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "infrastructures_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // Detect active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "infra_type",
                "infra_category",
                "created_at",
                "updated_at",
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

    const handleSearchSubmit = (e) => {
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
        router.get(route("barangay_infrastructure.index", queryParams));
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
                    row.infrastructure_image
                        ? `/storage/${row.infrastructure_image}`
                        : "/images/default-avatar.jpg"
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-avatar.jpg";
                }}
                alt="Resident"
                className="w-20 h-20 min-w-20 min-h-20 object-cover rounded-sm border"
            />
        ),
        infrastructure_type: (row) => (
            <span className="font-medium text-gray-900">
                {row.infrastructure_type || "—"}
            </span>
        ),

        infrastructure_category: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.infrastructure_category || "—"}
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
    const handleAddInfrastructure = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        infrastructures: [[]],
        _method: undefined,
        infrastructure_id: null,
    });

    const addInfrastructure = () => {
        setData("infrastructures", [...(data.infrastructures || []), {}]);
    };

    const removeInfrastructure = (infraIdx) => {
        const updated = [...(data.infrastructures || [])];
        updated.splice(infraIdx, 1);
        setData("infrastructures", updated);
        toast.warning("Infrastructure removed.", {
            duration: 2000,
        });
    };

    const handleInfrastructureFieldChange = (value, infraIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.infrastructures];

            // if updating file input
            if (field === "infrastructure_image" && value instanceof File) {
                updated[infraIdx] = {
                    ...updated[infraIdx],
                    infrastructure_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[infraIdx] = {
                    ...updated[infraIdx],
                    [field]: value,
                };
            }

            return { ...prevData, infrastructures: updated };
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setInfrastructureDetails(null);
        reset();
        clearErrors();
    };

    const infrastructure_types = [
        { label: "Evacuation Center", value: "Evacuation Center" },
        { label: "Flood Control", value: "Flood Control" },
        {
            label: "Rain Water Harvester (Communal)",
            value: "Rain Water Harvester (Communal)",
        },
        {
            label: "Barangay Disaster Operation Center",
            value: "Barangay Disaster Operation Center",
        },
        {
            label: "Public Comfort Room/Toilet",
            value: "Public Comfort Room/Toilet",
        },
        { label: "Community Garden", value: "Community Garden" },
        { label: "Barangay Health Center", value: "Barangay Health Center" },
        { label: "Hospital", value: "Hospital" },
        { label: "Maternity Clinic", value: "Maternity Clinic" },
        { label: "Child Clinic", value: "Child Clinic" },
        { label: "Private Medical Clinic", value: "Private Medical Clinic" },
        { label: "Barangay Drug Store", value: "Barangay Drug Store" },
        {
            label: "City/Municipal Public Drug Store",
            value: "City/Municipal Public Drug Store",
        },
        { label: "Private Drug Store", value: "Private Drug Store" },
        {
            label: "Quarantine/Isolation Facility",
            value: "Quarantine/Isolation Facility",
        },
        {
            label: "Child Development Center",
            value: "Child Development Center",
        },
        { label: "Preschool", value: "Preschool" },
        { label: "Elementary", value: "Elementary" },
        { label: "Secondary", value: "Secondary" },
        { label: "Vocational", value: "Vocational" },
        { label: "College/University", value: "College/University" },
        { label: "Islamic School", value: "Islamic School" },
        { label: "Rice Mill", value: "Rice Mill" },
        { label: "Corn Mill", value: "Corn Mill" },
        { label: "Feed Mill", value: "Feed Mill" },
        {
            label: "Agricultural Produce Market",
            value: "Agricultural Produce Market",
        },
    ];

    const handleSubmitInfrastruture = (e) => {
        e.preventDefault();
        post(route("barangay_infrastructure.store"), {
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
                `${APP_URL}/barangay_infrastructure/details/${id}`
            );
            const infrastructure = response.data.infra;
            setInfrastructureDetails(infrastructure);
            setData({
                infrastructures: [
                    {
                        infrastructure_image: null, // do not pass existing image
                        previewImage: infrastructure.infrastructure_image
                            ? `/storage/${infrastructure.infrastructure_image}`
                            : null, // show existing image in preview
                        infrastructure_type:
                            infrastructure.infrastructure_type || "",
                        infrastructure_category:
                            infrastructure.infrastructure_category || "",
                        quantity: infrastructure.quantity || "",
                    },
                ],
                _method: "PUT",
                infrastructure_id: infrastructure.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching infrastructure details:", error);
        }
    };

    const handleUpdateInfrastruture = (e) => {
        e.preventDefault();
        post(route("barangay_infrastructure.update", data.infrastructure_id), {
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
        setInfraToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_infrastructure.destroy", infraToDelete), {
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
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <Home className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Barangay Infrastructure Overview
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Review, filter, and manage existing
                                        barangay infrastructures efficiently.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap justify-between gap-2 mb-4">
                                <DynamicTableControls
                                    allColumns={allColumns}
                                    visibleColumns={visibleColumns}
                                    setVisibleColumns={setVisibleColumns}
                                    showFilters={showFilters}
                                    toggleShowFilters={() =>
                                        setShowFilters((prev) => !prev)
                                    }
                                />

                                <div className="flex items-center gap-2">
                                    {/* Search */}
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[300px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search infrastructure name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed("name", e)
                                            }
                                            className="ml-4"
                                        />
                                        <Button
                                            type="submit"
                                            className="border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            variant="outline"
                                        >
                                            <Search />
                                        </Button>
                                    </form>

                                    {/* Add button */}
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                        onClick={handleAddInfrastructure}
                                    >
                                        <ListPlus className="w-4 h-4" />
                                        Add Infrastructure
                                    </Button>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "infra_type",
                                        "infra_category",
                                        "created_at",
                                        "updated_at",
                                    ]}
                                    categories={categories}
                                    types={types}
                                    clearRouteName="barangay_infrastructure.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={infrastructure}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Modal for Add/Edit */}
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        handleModalClose();
                    }}
                    title={
                        modalState == "add"
                            ? "Add Infrastructure"
                            : "Edit Infrastructure"
                    }
                >
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={
                            infrastructureDetails
                                ? handleUpdateInfrastruture
                                : handleSubmitInfrastruture
                        }
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Barangay Infrastructure Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Please provide details about the existing
                            facilities, utilities, and structures within the
                            barangay.
                        </p>
                        {Array.isArray(data.infrastructures) &&
                            data.infrastructures.map(
                                (infrastructure, infraIdx) => (
                                    <div
                                        key={infraIdx}
                                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-6 mb-6">
                                            <div className="md:col-span-2 flex flex-col items-center space-y-2">
                                                <InputLabel
                                                    htmlFor={`infrastructure_image_${infraIdx}`}
                                                    value="Infrastructure Photo"
                                                />
                                                <img
                                                    src={
                                                        infrastructure.previewImage
                                                            ? infrastructure.previewImage // user-selected file or preview of existing
                                                            : "/images/default-avatar.jpg" // fallback placeholder
                                                    }
                                                    alt="Infrastructure Image"
                                                    className="w-32 h-32 object-cover rounded-sm border border-gray-200"
                                                />

                                                <input
                                                    id={`infrastructure_image_${infraIdx}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        if (file) {
                                                            handleInfrastructureFieldChange(
                                                                file,
                                                                infraIdx,
                                                                "infrastructure_image"
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
                                                            `infrastructures.${infraIdx}.infrastructure_image`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Infrastructure Details */}
                                            <div className="md:col-span-4 space-y-4">
                                                <div className="w-full">
                                                    <DropdownInputField
                                                        label="Infrastructure Type"
                                                        name="infrastructure_type"
                                                        value={
                                                            infrastructure.infrastructure_type ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleInfrastructureFieldChange(
                                                                e.target.value,
                                                                infraIdx,
                                                                "infrastructure_type"
                                                            )
                                                        }
                                                        items={
                                                            infrastructure_types
                                                        }
                                                        placeholder="Select or Enter Type"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `infrastructures.${infraIdx}.infrastructure_type`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                                    <div className="sm:col-span-2">
                                                        <DropdownInputField
                                                            label="Infrastructure Category"
                                                            name="infrastructure_category"
                                                            value={
                                                                infrastructure.infrastructure_category ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleInfrastructureFieldChange(
                                                                    e.target
                                                                        .value,
                                                                    infraIdx,
                                                                    "infrastructure_category"
                                                                )
                                                            }
                                                            placeholder="Select or Enter Category"
                                                            items={[
                                                                {
                                                                    label: "Disaster and Community Facilities",
                                                                    value: "Disaster and Community Facilities",
                                                                },
                                                                {
                                                                    label: "Health and Medical",
                                                                    value: "Health and Medical",
                                                                },
                                                                {
                                                                    label: "Educational",
                                                                    value: "Educational",
                                                                },
                                                                {
                                                                    label: "Agricultural",
                                                                    value: "Agricultural",
                                                                },
                                                            ]}
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `infrastructures.${infraIdx}.infrastructure_category`
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
                                                                infrastructure.quantity ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleInfrastructureFieldChange(
                                                                    e.target
                                                                        .value,
                                                                    infraIdx,
                                                                    "quantity"
                                                                )
                                                            }
                                                            placeholder="Enter Quantity"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `infrastructures.${infraIdx}.quantity`
                                                                ]
                                                            }
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {infrastructureDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeInfrastructure(
                                                        infraIdx
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
                            {infrastructureDetails === null ? (
                                <button
                                    type="button"
                                    onClick={addInfrastructure}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-2xl" />
                                    <span>Add Infrastructure</span>
                                </button>
                            ) : (
                                <div></div>
                            )}
                            <div className="flex justify-end items-center text-end mt-5 gap-4">
                                {infrastructureDetails == null && (
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
                                    {infrastructureDetails ? "Update" : "Add"}{" "}
                                    <IoIosArrowForward />
                                </Button>
                            </div>
                        </div>
                    </form>
                </SidebarModal>

                {/* Delete Confirmation */}
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={infraToDelete}
                />
            </div>
        </AdminLayout>
    );
}
