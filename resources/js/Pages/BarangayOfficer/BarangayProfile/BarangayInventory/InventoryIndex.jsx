import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
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

const InventoryIndex = () => {
    const APP_URL = useAppUrl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [itemDetails, setItemDetails] = useState(null);
    const props = usePage().props;
    const Toasterror = props?.error ?? null;
    const [queryParams, setQueryParams] = useState({});
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [itemToDelete, setItemToDelete] = useState(null); //delete

    const {
        data: getData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["inventory_items", queryParams],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/inventory`,
                { params: queryParams }
            );
            return data;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const inventory_items = getData?.inventory_items;
    const categories = getData?.categories;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "item_name", label: "Item" },
        { key: "item_category", label: "Category" },
        { key: "quantity", label: "Quantity" },
        { key: "unit", label: "Unit" },
        { key: "status", label: "Status" },
        { key: "received_date", label: "Date Recieved" },
        { key: "supplier", label: "Supplier" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("inventory_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["inventory_status", "item_category", "date_recieved"].includes(
                key
            ) &&
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
            "inventory_visible_columns",
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

        item_name: (row) => (
            <span className="font-medium text-gray-900">
                {row.item_name || "—"}
            </span>
        ),

        item_category: (row) => (
            <span className="text-sm text-gray-700">
                {row.item_category || "—"}
            </span>
        ),

        quantity: (row) => (
            <span className="text-sm text-gray-700">{row.quantity ?? "—"}</span>
        ),

        year_established: (row) => (
            <span className="text-sm text-gray-700">
                {row.year_established || "—"}
            </span>
        ),

        unit: (row) => (
            <span className="text-sm text-gray-700">{row.unit || "—"}</span>
        ),

        status: (row) => {
            const statusColors = {
                available: "bg-green-100 text-green-800",
                low_stock: "bg-yellow-100 text-yellow-800",
                out_of_stock: "bg-red-100 text-red-800",
            };

            return (
                <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[row.status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                    {row.status || "—"}
                </span>
            );
        },

        received_date: (row) => (
            <span className="text-sm text-gray-500">
                {row.received_date
                    ? new Date(row.received_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                      })
                    : "—"}
            </span>
        ),

        supplier: (row) => (
            <span className="text-sm text-gray-700">{row.supplier || "—"}</span>
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
        inventory_items: [[]],
        _method: undefined,
        item_id: null,
    });

    const addItem = () => {
        setData("inventory_items", [...(data.inventory_items || []), {}]);
    };
    const removeItem = (instiIdx) => {
        const updated = [...(data.inventory_items || [])];
        updated.splice(instiIdx, 1);
        setData("inventory_items", updated);
        toast.warning("Item removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setItemDetails(null);
        reset();
        clearErrors();
    };

    const handleInventoryFieldChange = (value, instIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.inventory_items];

            // make sure the institution entry exists
            if (!updated[instIdx]) {
                updated[instIdx] = {};
            }

            updated[instIdx] = {
                ...updated[instIdx],
                [field]: value,
            };

            return { ...prevData, inventory_items: updated };
        });
    };
    const handleSubmitInventory = (e) => {
        e.preventDefault();
        post(route("inventory.store"), {
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
                `${APP_URL}/barangay_officer/inventory/details/${id}`
            );

            const inventory = response.data.item;
            //console.log(inventory);

            setItemDetails(inventory);
            setData({
                inventory_items: [
                    {
                        item_name: inventory.item_name || "",
                        item_category: inventory.item_category || "",
                        quantity: inventory.quantity || "",
                        unit: inventory.unit || "",
                        received_date: inventory.received_date || "",
                        supplier: inventory.supplier || "",
                        status: inventory.status || "",
                    },
                ],
                _method: "PUT",
                item_id: inventory.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching inventory details:", error);
        }
    };
    const handleUpdateInventory = (e) => {
        e.preventDefault();
        post(route("inventory.update", data.item_id), {
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
            onSuccess: () => {
                refetch();
                handleModalClose();
            },
        });
    };

    // delete
    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("inventory.destroy", itemToDelete), {
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

    const handlePrint = () => {
        window.print();
    };

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
                {/* <pre>{JSON.stringify(inventory_items, undefined, 3)}</pre> */}
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
                                placeholder="Search Inventory Items"
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
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    {showFilters && (
                        <FilterToggle
                            queryParams={queryParams}
                            searchFieldName={searchFieldName}
                            visibleFilters={[
                                "inventory_status",
                                "item_category",
                                "date_recieved",
                            ]}
                            showFilters={true}
                            inventory_items={inventory_items.data}
                            setQueryParams={setQueryParams}
                            setQuery={setQuery}
                            clearRouteAxios={true}
                            types={categories}
                        />
                    )}
                    <DynamicTable
                        passedData={inventory_items}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                    />
                </div>
            </div>
            <SidebarModal
                isOpen={isModalOpen}
                onClose={() => {
                    handleModalClose();
                }}
                title={modalState == "add" ? "Add Item/s" : "Edit Item"}
            >
                <form
                    className="bg-gray-50 p-4 rounded-lg"
                    onSubmit={
                        itemDetails
                            ? handleUpdateInventory
                            : handleSubmitInventory
                    }
                >
                    <h3 className="text-2xl font-medium text-gray-700">
                        Barangay Inventory
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                        Please provide details about the barangay’s inventory
                        items.
                    </p>

                    {Array.isArray(data.inventory_items) &&
                        data.inventory_items.map((inventory, invIdx) => (
                            <div
                                key={invIdx}
                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-6 mb-6 gap-4">
                                    {/* Item Name */}
                                    <div className="md:col-span-3">
                                        <InputField
                                            label="Item Name"
                                            name="item_name"
                                            value={inventory.item_name || ""}
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "item_name"
                                                )
                                            }
                                            placeholder="e.g. Rice, Medicine, Generator"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.item_name`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Item Category */}
                                    <div className="md:col-span-3">
                                        <DropdownInputField
                                            label="Category"
                                            name="item_category"
                                            value={
                                                inventory.item_category || ""
                                            }
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "item_category"
                                                )
                                            }
                                            placeholder="Select category"
                                            items={[
                                                {
                                                    label: "Food",
                                                    value: "food",
                                                },
                                                {
                                                    label: "Medicine",
                                                    value: "medicine",
                                                },
                                                {
                                                    label: "Equipment",
                                                    value: "equipment",
                                                },
                                                {
                                                    label: "Relief Goods",
                                                    value: "relief_goods",
                                                },
                                                {
                                                    label: "Other",
                                                    value: "other",
                                                },
                                            ]}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.item_category`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Quantity"
                                            name="quantity"
                                            type="number"
                                            value={inventory.quantity || ""}
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "quantity"
                                                )
                                            }
                                            placeholder="Enter quantity"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.quantity`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Unit */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Unit"
                                            name="unit"
                                            value={inventory.unit || ""}
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "unit"
                                                )
                                            }
                                            placeholder="e.g. kg, pcs, box"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.unit`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="md:col-span-2">
                                        <SelectField
                                            label="Status"
                                            name="status"
                                            value={inventory.status || ""}
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "status"
                                                )
                                            }
                                            items={[
                                                {
                                                    label: "Available",
                                                    value: "available",
                                                },
                                                {
                                                    label: "Low Stock",
                                                    value: "low_stock",
                                                },
                                                {
                                                    label: "Out of Stock",
                                                    value: "out_of_stock",
                                                },
                                            ]}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.status`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Received Date */}
                                    <div className="md:col-span-3">
                                        <InputField
                                            label="Date Received"
                                            name="received_date"
                                            type="date"
                                            value={
                                                inventory.received_date || ""
                                            }
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "received_date"
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.received_date`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Supplier */}
                                    <div className="md:col-span-3">
                                        <InputField
                                            label="Supplier"
                                            name="supplier"
                                            value={inventory.supplier || ""}
                                            onChange={(e) =>
                                                handleInventoryFieldChange(
                                                    e.target.value,
                                                    invIdx,
                                                    "supplier"
                                                )
                                            }
                                            placeholder="e.g. Local Distributor, DOH"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `inventory_items.${invIdx}.supplier`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Remove button */}
                                {itemDetails === null && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(invIdx)}
                                        className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                    >
                                        <IoIosCloseCircleOutline className="text-2xl" />
                                    </button>
                                )}
                            </div>
                        ))}

                    {/* Footer */}
                    <div className="flex justify-between items-center p-3">
                        {itemDetails === null ? (
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                            >
                                <IoIosAddCircleOutline className="text-2xl" />
                                <span>Add Item</span>
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <div className="flex justify-end items-center text-end mt-5 gap-4">
                            {itemDetails == null && (
                                <Button type="button" onClick={() => reset()}>
                                    <RotateCcw /> Reset
                                </Button>
                            )}

                            <Button
                                className="bg-blue-700 hover:bg-blue-400"
                                type={"submit"}
                            >
                                {itemDetails ? "Update" : "Add"}{" "}
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
                residentId={itemToDelete}
            />
        </div>
    );
};

export default InventoryIndex;
