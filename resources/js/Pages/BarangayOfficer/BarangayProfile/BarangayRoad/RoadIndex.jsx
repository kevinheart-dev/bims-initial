import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Home,
    ListPlus,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { ROAD_TYPE_TEXT } from "@/constants";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import SelectField from "@/Components/SelectField";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import SidebarModal from "@/Components/SidebarModal";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import InputLabel from "@/Components/InputLabel";
import AdminLayout from "@/Layouts/AdminLayout";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";

const BarangayRoads = ({ roads, types, maintains, queryParams }) => {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Infrastructures", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [roadDetails, setRoadDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [roadToDelete, setRoadToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "image", label: "Road Image" },
        { key: "road_type", label: "Road Type" },
        { key: "maintained_by", label: "Maintained By" },
        { key: "length", label: "Length" },
        { key: "status", label: "Status" },
        { key: "condition", label: "Condition" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("roads_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    const hasActiveFilter = Object.entries(queryParams).some(
        ([key, value]) =>
            [
                "road_type",
                "maintained_by",
                "road_status",
                "road_condition",
            ].includes(key) &&
            value &&
            value !== ""
    );

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    useEffect(() => {
        localStorage.setItem(
            "roads_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);
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
        router.get(route("barangay_road.index", queryParams));
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
                    row.road_image
                        ? `/storage/${row.road_image}`
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

        road_type: (row) => (
            <span className="font-medium text-gray-900">
                {ROAD_TYPE_TEXT[row.road_type] || "—"}
            </span>
        ),

        maintained_by: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.maintained_by || "—"}
            </span>
        ),

        length: (row) => (
            <span className="text-sm text-gray-700">
                {row.length != null ? `${row.length} Km` : "—"}
            </span>
        ),
        condition: (row) => {
            const colorMap = {
                good: "bg-green-100 text-green-800",
                fair: "bg-yellow-100 text-yellow-800",
                poor: "bg-red-100 text-red-800",
            };

            return (
                <span
                    className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                        colorMap[row.condition] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {row.condition || "—"}
                </span>
            );
        },

        status: (row) => {
            const colorMap = {
                active: "bg-blue-100 text-blue-800",
                under_maintenance: "bg-orange-100 text-orange-800",
                closed: "bg-gray-200 text-gray-700",
            };

            return (
                <span
                    className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                        colorMap[row.status] || "bg-gray-100 text-gray-600"
                    }`}
                >
                    {row.status || "—"}
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
    const handleAddRoad = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        roads: [[]],
        _method: undefined,
        road_id: null,
    });

    const addRoad = () => {
        setData("roads", [...(data.roads || []), {}]);
    };
    const removeRoad = (roadIdx) => {
        const updated = [...(data.roads || [])];
        updated.splice(roadIdx, 1);
        setData("roads", updated);
        toast.warning("Road removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setRoadDetails(null);
        reset();
        clearErrors();
    };
    const handleRoadFieldChange = (value, roadIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.roads];

            // if updating file input
            if (field === "road_image" && value instanceof File) {
                updated[roadIdx] = {
                    ...updated[roadIdx],
                    road_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[roadIdx] = {
                    ...updated[roadIdx],
                    [field]: value,
                };
            }

            return { ...prevData, roads: updated };
        });
    };
    const handleSubmitRoad = (e) => {
        e.preventDefault();
        post(route("barangay_road.store"), {
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

    // edit road
    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(
                `${APP_URL}/barangay_road/details/${id}`
            );
            const road = response.data.road;
            console.log(road);

            setRoadDetails(road);

            setData({
                roads: [
                    {
                        road_image: null, // keep original DB filename
                        previewImage: road.road_image
                            ? `/storage/${road.road_image}`
                            : null, // For showing in the form
                        road_type: road.road_type || "",
                        length: road.length || "",
                        condition: road.condition || "",
                        status: road.status || "",
                        maintained_by: road.maintained_by || "",
                    },
                ],
                _method: "PUT",
                road_id: road.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching road details:", error);
        }
    };
    const handleUpdateRoad = (e) => {
        e.preventDefault();
        post(route("barangay_road.update", roadDetails.id), {
            _method: "PUT",
            roads: data.roads,
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    // delete
    const handleDeleteClick = (id) => {
        setRoadToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("barangay_road.destroy", roadToDelete), {
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
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            {/* Header */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-indigo-100 rounded-full">
                                        <Home className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Barangay Roads Overview
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Review, filter, and manage existing
                                            barangay roads efficiently. Keep
                                            track of road types, conditions, and
                                            maintenance details.
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                                            placeholder="Search road lengths"
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
                                            onClick={handleAddRoad}
                                        >
                                            <ListPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add a Road
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "road_type",
                                        "maintained_by",
                                        "road_status",
                                        "road_condition",
                                    ]}
                                    types={types}
                                    names={maintains}
                                    clearRouteName="barangay_road.index"
                                    clearRouteParams={{}}
                                    showFilters={showFilters}
                                />
                            )}

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={roads}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                visibleColumns={visibleColumns}
                                showTotal={true}
                            />
                        </div>
                    </div>
                    <SidebarModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            handleModalClose();
                        }}
                        title={modalState == "add" ? "Add Road" : "Edit Road"}
                    >
                        <form
                            className="bg-gray-50 p-4 rounded-lg"
                            onSubmit={
                                roadDetails
                                    ? handleUpdateRoad
                                    : handleSubmitRoad
                            }
                        >
                            <h3 className="text-2xl font-medium text-gray-700">
                                Barangay Roads
                            </h3>
                            <p className="text-sm text-gray-500 mb-8">
                                Please provide details about roads within the
                                barangay.
                            </p>

                            {Array.isArray(data.roads) &&
                                data.roads.map((road, roadIdx) => (
                                    <div
                                        key={roadIdx}
                                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-6 mb-6 gap-4">
                                            <div className="md:col-span-2 flex flex-col items-center space-y-2">
                                                <InputLabel
                                                    htmlFor={`facility_image_${roadIdx}`}
                                                    value="Road Image"
                                                />

                                                <img
                                                    src={
                                                        road.previewImage ||
                                                        "/images/default-avatar.jpg"
                                                    }
                                                    alt="Road Image"
                                                    className="w-32 h-32 object-cover rounded-sm border border-gray-200"
                                                />

                                                <input
                                                    id={`facility_image_${roadIdx}`}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files[0];
                                                        if (file) {
                                                            handleRoadFieldChange(
                                                                file,
                                                                roadIdx,
                                                                "road_image"
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
                                                            `roads.${roadIdx}.road_image`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div className="md:col-span-4 space-y-4">
                                                {/* Road Type */}
                                                <div className="md:col-span-3">
                                                    <DropdownInputField
                                                        label="Road Type"
                                                        name="road_type"
                                                        value={
                                                            road.road_type || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "road_type"
                                                            )
                                                        }
                                                        placeholder="Select road type"
                                                        items={[
                                                            {
                                                                label: "Asphalt",
                                                                value: "asphalt",
                                                            },
                                                            {
                                                                label: "Concrete",
                                                                value: "concrete",
                                                            },
                                                            {
                                                                label: "Gravel",
                                                                value: "gravel",
                                                            },
                                                            {
                                                                label: "Natural Earth Surface",
                                                                value: "natural_earth_surface",
                                                            },
                                                        ]}
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.road_type`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>

                                                {/* Length */}
                                                <div className="md:col-span-3">
                                                    <InputField
                                                        label="Length (km)"
                                                        name="length"
                                                        type="number"
                                                        step="0.01"
                                                        value={
                                                            road.length || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleRoadFieldChange(
                                                                e.target.value,
                                                                roadIdx,
                                                                "length"
                                                            )
                                                        }
                                                        placeholder="e.g. 2.50"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `roads.${roadIdx}.length`
                                                            ]
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Condition */}
                                            <div className="md:col-span-3">
                                                <DropdownInputField
                                                    label="Condition"
                                                    name="condition"
                                                    value={road.condition || ""}
                                                    onChange={(e) =>
                                                        handleRoadFieldChange(
                                                            e.target.value,
                                                            roadIdx,
                                                            "condition"
                                                        )
                                                    }
                                                    placeholder="Select condition"
                                                    items={[
                                                        {
                                                            label: "Good",
                                                            value: "good",
                                                        },
                                                        {
                                                            label: "Fair",
                                                            value: "fair",
                                                        },
                                                        {
                                                            label: "Poor",
                                                            value: "poor",
                                                        },
                                                        {
                                                            label: "Under Construction",
                                                            value: "under_construction",
                                                        },
                                                        {
                                                            label: "Impassable",
                                                            value: "impassable",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `roads.${roadIdx}.condition`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Status */}
                                            <div className="md:col-span-3">
                                                <SelectField
                                                    label="Status"
                                                    name="status"
                                                    value={road.status || ""}
                                                    onChange={(e) =>
                                                        handleRoadFieldChange(
                                                            e.target.value,
                                                            roadIdx,
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
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `roads.${roadIdx}.status`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Maintained By */}
                                            <div className="md:col-span-6">
                                                <InputField
                                                    label="Maintained By"
                                                    name="maintained_by"
                                                    value={
                                                        road.maintained_by || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleRoadFieldChange(
                                                            e.target.value,
                                                            roadIdx,
                                                            "maintained_by"
                                                        )
                                                    }
                                                    placeholder="e.g. Barangay Government"
                                                />
                                                <InputError
                                                    message={
                                                        errors[
                                                            `roads.${roadIdx}.maintained_by`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Remove button */}
                                        {roadDetails === null && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeRoad(roadIdx)
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                            >
                                                <IoIosCloseCircleOutline className="text-2xl" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                            {/* Add / Submit */}
                            <div className="flex justify-between items-center p-3">
                                {roadDetails === null ? (
                                    <button
                                        type="button"
                                        onClick={addRoad}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Road</span>
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                <div className="flex justify-end items-center text-end mt-5 gap-4">
                                    {roadDetails == null && (
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                    )}
                                    <Button
                                        className="bg-blue-700 hover:bg-blue-400"
                                        type="submit"
                                    >
                                        {roadDetails ? "Update" : "Add"}{" "}
                                        <IoIosArrowForward />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </SidebarModal>{" "}
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                        }}
                        onConfirm={confirmDelete}
                        residentId={roadToDelete}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default BarangayRoads;
