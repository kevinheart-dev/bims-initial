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
    streets,
    queryParams,
    puroks,
}) {
    const breadcrumbs = [
        { label: "Barangay Resources", showOnMobile: false },
        { label: "Street List", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    queryParams = queryParams || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [streetDetails, setStreetDetails] = useState(null);
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [streetToDelete, setStreetToDelete] = useState(null); //delete

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    // delete
    const handleDeleteClick = (id) => {
        setStreetToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "street_name", label: "Street Name" },
        { key: "purok_number", label: "Purok" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("street_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "street_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    // Detect active filters
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => ["purok"].includes(key) && value && value !== ""
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
        router.get(route("street.index", queryParams));
    };

    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        }
    };

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        street_name: "",
        purok_id: "",
        _method: undefined,
        street_id: null,
    });

    const columnRenderers = {
        id: (row) => row.id,

        street_name: (row) => (
            <span className="font-medium text-gray-900">
                {row.street_name || "—"}
            </span>
        ),

        purok_number: (row) => (
            <span className="text-sm text-gray-700">
                {row.purok?.purok_number
                    ? `Purok ${row.purok.purok_number}`
                    : "—"}
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

    const handleEdit = async (id) => {
        setModalState("edit");

        try {
            const response = await axios.get(`${APP_URL}/street/details/${id}`);
            const street = response.data.data;

            setStreetDetails(street);
            console.log(purok_numbers);
            // Find the matching dropdown item
            const selectedPurok = purok_numbers.find(
                (p) => p.value === street.purok_id.toString()
            );

            setData({
                street_name: street.street_name || "",
                purok_id: selectedPurok?.value || "", // ✅ set value for dropdown
                _method: "PUT",
                street_id: street.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching street details:", error);
            toast.error("Failed to fetch street details.");
        }
    };

    const confirmDelete = () => {
        router.delete(route("street.destroy", streetToDelete), {
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

    // add
    const handleAddStreet = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    const handleSubmitStreet = (e) => {
        e.preventDefault();

        post(route("street.store"), {
            preserveScroll: true,
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

    const handleUpdateStreet = (e) => {
        e.preventDefault();
        post(route("street.update", data.street_id), {
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

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setStreetDetails(null);
        reset();
        clearErrors();
    };

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok.purok_number,
        value: purok.id.toString(),
    }));

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
                                <div className="p-2 bg-green-100 rounded-full">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                        Street Directory
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        View, add, and manage all streets and
                                        zones in the barangay.
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
                                            placeholder="Search Street name"
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
                                        onClick={() => handleAddStreet()}
                                        className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                    >
                                        <ListPlus className="w-4 h-4" />
                                        Add Street
                                    </Button>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["purok"]}
                                    clearRouteName="street.index"
                                    clearRouteParams={{}}
                                    puroks={puroks}
                                    showFilters={showFilters}
                                />
                            )}

                            <DynamicTable
                                queryParams={queryParams}
                                passedData={streets}
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
                    title={modalState === "add" ? "Add Street" : "Edit Street"}
                >
                    <form
                        className="bg-gray-50 p-4 rounded-lg"
                        onSubmit={
                            streetDetails
                                ? handleUpdateStreet
                                : handleSubmitStreet
                        }
                    >
                        <h3 className="text-2xl font-medium text-gray-700">
                            Barangay Street Information
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Please enter the street information below.
                        </p>

                        {/* Street Fields */}
                        <div className="space-y-4">
                            {/* Street Name */}
                            <InputField
                                label="Street Name"
                                name="street_name"
                                value={data.street_name || ""}
                                onChange={(e) =>
                                    setData("street_name", e.target.value)
                                }
                                placeholder="Enter Street Name"
                            />
                            <InputError
                                message={errors.street_name}
                                className="mt-1"
                            />

                            {/* Purok Dropdown */}
                            <DropdownInputField
                                label="Purok"
                                name="purok_id"
                                value={data.purok_id || ""}
                                onChange={(e) =>
                                    setData("purok_id", e.target.value)
                                }
                                placeholder="Select Purok"
                                items={purok_numbers}
                            />
                            <InputError
                                message={errors.purok_id}
                                className="mt-1"
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-between items-center p-3 mt-6">
                            {streetDetails === null ? (
                                <Button
                                    type="button"
                                    onClick={() => reset()}
                                    className="flex items-center gap-1"
                                >
                                    <RotateCcw /> Reset
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            <Button
                                className="bg-blue-700 hover:bg-blue-500"
                                type="submit"
                            >
                                {streetDetails ? "Update" : "Add"}{" "}
                                <IoIosArrowForward />
                            </Button>
                        </div>
                    </form>
                </SidebarModal>
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={streetToDelete}
                />
            </div>
        </AdminLayout>
    );
}
