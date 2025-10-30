import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Home,
    ListPlus,
    MapPin,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
    Waves,
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

export default function Index({ bodiesOfLand, queryParams }) {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Bodies of Land", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [landDetails, setLandDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "type", label: "Type" },
        { key: "exists", label: "Exists" },
        { key: "created_at", label: "Created At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("land_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    const landTypes = [
        "Mountain ranges",
        "Mountain",
        "Volcano",
        "Cliff",
        "Archipelago",
        "Island",
        "Plains",
        "Valley",
    ];

    useEffect(() => {
        localStorage.setItem(
            "land_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // Detect active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => [].includes(key) && value && value !== ""
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
        router.get(route("land.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <span className="font-medium text-gray-900">{row.name || "—"}</span>
        ),

        type: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.type || "—"}
            </span>
        ),

        exists: (row) => (
            <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                    row.exists
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                }`}
            >
                {row.exists ? "Yes" : "No"}
            </span>
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

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <SquarePen className="w-4 h-4 text-green-500" />,
                        onClick: () => handleEditaLand(row.id),
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

    const handleAddBodyOfLand = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        bodiesOfLand: [{}], // camelCase matches modal
        _method: undefined,
        land_id: null,
    });

    const handleLandFieldChange = (value, index, field) => {
        const updated = [...(data.bodiesOfLand || [])];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setData("bodiesOfLand", updated);
    };

    const addLand = () => {
        setData("bodiesOfLand", [
            ...(data.bodiesOfLand || []),
            { name: "", type: "", exists: false },
        ]);
    };

    const removeLand = (index) => {
        const updated = [...(data.bodiesOfLand || [])];
        updated.splice(index, 1);
        setData("bodiesOfLand", updated);

        toast.warning("Body of Land removed.", {
            duration: 2000,
        });
    };

    const handleSubmitLand = (e) => {
        e.preventDefault();
        post(route("land.store"), {
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
    const handleEditaLand = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(`${APP_URL}/land/details/${id}`);
            const land = response.data.land;
            setLandDetails(land);
            setData({
                bodiesOfLand: [
                    // ✅ use camelCase — same as form
                    {
                        name: land.name || "",
                        type: land.type || "",
                    },
                ],
                _method: "PUT",
                land_id: land.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching land details:", error);
        }
    };

    const handleUpdateLand = (e) => {
        e.preventDefault();
        post(route("land.update", data.land_id), {
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
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("land.destroy", recordToDelete), {
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
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setLandDetails(null);
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
                                    <MapPin className="w-6 h-6 text-green-600" />{" "}
                                    {/* Use lucide-react MapPin icon */}
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Bodies of Land Overview
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        View, filter, and manage mountains,
                                        hills, plains, and other land formations
                                        within your barangay.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-wrap justify-end gap-2 mb-4">
                                <div className="flex items-center gap-2">
                                    {/* Search */}
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[300px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search name"
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
                                        onClick={handleAddBodyOfLand}
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                    >
                                        <ListPlus className="w-4 h-4" />
                                        Add Body of Land
                                    </Button>
                                </div>
                            </div>

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={bodiesOfLand}
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
                    onClose={handleModalClose}
                    title={
                        modalState === "add"
                            ? "Add Body of Land"
                            : "Edit Body of Land"
                    }
                >
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={
                            landDetails ? handleUpdateLand : handleSubmitLand
                        }
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Body of Land Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-8">
                            Provide accurate information about the body of land
                            located within your barangay. This helps track
                            natural resources and manage land planning.
                        </p>

                        {Array.isArray(data.bodiesOfLand) &&
                            data.bodiesOfLand.map((land, idx) => (
                                <div
                                    key={idx}
                                    className="border p-4 mb-4 rounded-md relative bg-white shadow-sm"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 mb-6 gap-4">
                                        {/* Land Name */}
                                        <div>
                                            <InputField
                                                label="Name of Body of Land"
                                                name="name"
                                                value={land.name || ""}
                                                onChange={(e) =>
                                                    handleLandFieldChange(
                                                        e.target.value,
                                                        idx,
                                                        "name"
                                                    )
                                                }
                                                placeholder="e.g., Mountain A, Hill B, Barangay Field"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Enter the official or local name
                                                of the land formation.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `bodiesOfLand.${idx}.name`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Land Type */}
                                        <div>
                                            <DropdownInputField
                                                label="Type of Land Body"
                                                name="type"
                                                value={land.type || ""}
                                                onChange={(e) =>
                                                    handleLandFieldChange(
                                                        e.target.value,
                                                        idx,
                                                        "type"
                                                    )
                                                }
                                                items={landTypes}
                                                placeholder="Select or enter type (e.g., Mountain, Hill, Plain)"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Choose the classification that
                                                best describes this land
                                                formation.
                                            </p>
                                            <InputError
                                                message={
                                                    errors[
                                                        `bodiesOfLand.${idx}.type`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Remove button for dynamic rows */}
                                    {landDetails === null && (
                                        <button
                                            type="button"
                                            onClick={() => removeLand(idx)}
                                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 transition-colors duration-200"
                                        >
                                            <IoIosCloseCircleOutline className="text-2xl" />
                                        </button>
                                    )}
                                </div>
                            ))}

                        <div className="flex justify-between items-center p-3">
                            {landDetails === null ? (
                                <button
                                    type="button"
                                    onClick={addLand}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-2xl" />
                                    <span>Add Another Body of Land</span>
                                </button>
                            ) : null}

                            <div className="flex justify-end items-center text-end mt-5 gap-4">
                                {landDetails == null && (
                                    <Button
                                        type="button"
                                        onClick={() => reset()}
                                    >
                                        <RotateCcw /> Reset
                                    </Button>
                                )}

                                <Button
                                    className="bg-green-700 hover:bg-green-400"
                                    type="submit"
                                >
                                    {landDetails ? "Update" : "Add"}{" "}
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
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
