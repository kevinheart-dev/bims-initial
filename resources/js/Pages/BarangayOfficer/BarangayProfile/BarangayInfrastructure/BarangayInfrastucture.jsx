import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Eye,
    HousePlus,
    ListPlus,
    Plus,
    RotateCcw,
    Search,
    SquarePen,
    Trash2,
} from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import InputField from "@/Components/InputField";
import { Button } from "@/Components/ui/button";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import ClearFilterButton2 from "@/Components/ClearFilterButton2";
import SidebarModal from "@/Components/SidebarModal";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import SelectField from "@/Components/SelectField";
import { Toaster, toast } from "sonner";
import InputLabel from "@/Components/InputLabel";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";

const BarangayInfrastucture = () => {
    const APP_URL = useAppUrl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [infrastructureDetails, setInfrastructureDetails] = useState(null);
    const props = usePage().props;
    const Toasterror = props?.error ?? null;
    const [queryParams, setQueryParams] = useState({});
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [infraToDelete, setInfraToDelete] = useState(null); //delete

    const {
        data: getdata,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["infrastructure", queryParams],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_infrastructure`,
                { params: queryParams }
            );
            return data;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const infrastructure = getdata?.infrastructure;
    const types = getdata?.types;
    const categories = getdata?.categories;

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

    const [showFilters, setShowFilters] = useState(hasActiveFilter);

    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    useEffect(() => {
        localStorage.setItem(
            "infrastructures_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFieldName("name", query);
    };
    const searchFieldName = (field, value) => {
        setQueryParams((prev) => {
            const updated = { ...prev };

            if (value && value.trim() !== "") {
                updated[field] = value;
            } else {
                delete updated[field];
            }

            // reset pagination when searching
            delete updated.page;

            return updated; // React Query will refetch automatically
        });
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
            onSuccess: () => {
                refetch();
                handleModalClose();
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
            console.log(infrastructure);

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
            onSuccess: () => {
                refetch();
                handleModalClose();
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
            onSuccess: () => {
                refetch();
                handleModalClose();
            },
        });
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        if (Toasterror) {
            toast.error(Toasterror, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [Toasterror]);

    if (isLoading) {
        return (
            <div className="gap-2 space-y-4">
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
                <Skeleton className="h-[10px] w-[100px] rounded-full" />
            </div>
        );
    }
    if (isError) {
        return <div className="text-red-500">Error: {error.message}</div>;
    }
    return (
        <div className="p-2 md:px-2 md:py-2">
            <Toaster richColors />
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                {/* <pre>{JSON.stringify(infrastructure, undefined, 3)}</pre> */}
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
                                placeholder="Search infrastructure name"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) =>
                                    onKeyPressed("name", e.target.value)
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
                                onClick={() => handleAddInfrastructure()}
                            >
                                <ListPlus className="w-4 h-4" />
                            </Button>
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Add an Infrastructure
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
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
                            showFilters={true}
                            categories={categories}
                            types={types}
                            setQueryParams={setQueryParams}
                            setQuery={setQuery}
                            clearRouteAxios={true}
                        />
                    )}
                    <DynamicTable
                        passedData={infrastructure}
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
                        Please provide details about the existing facilities,
                        utilities, and structures within the barangay.
                    </p>
                    {Array.isArray(data.infrastructures) &&
                        data.infrastructures.map((infrastructure, infraIdx) => (
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
                                                const file = e.target.files[0];
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
                                                items={infrastructure_types}
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
                                                            e.target.value,
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
                                                            e.target.value,
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
                                            removeInfrastructure(infraIdx)
                                        }
                                        className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                    >
                                        <IoIosCloseCircleOutline className="text-2xl" />
                                    </button>
                                )}
                            </div>
                        ))}
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
                                <Button type="button" onClick={() => reset()}>
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
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                }}
                onConfirm={confirmDelete}
                residentId={infraToDelete}
            />
        </div>
    );
};

export default BarangayInfrastucture;
