import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    SquarePlus,
    Eye,
    Cross,
    MoveRight,
    UsersRound,
    Pencil,
    CircleUser,
    MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    RESIDENT_GENDER_COLOR_CLASS,
    RESIDENT_GENDER_TEXT2,
} from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import PersonDetailContent from "@/Components/SidebarModalContents/PersonDetailContent";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import InputField from "@/Components/InputField";
import PasswordValidationChecklist from "@/Components/PasswordValidationChecklist";
import EmailValidationInput from "@/Components/EmailValidationInput";
import { Switch } from "@/Components/ui/switch";

export default function Index({ queryParams, barangays }) {
    const breadcrumbs = [
        { label: "Barangay Information", showOnMobile: false },
        { label: "Accounts", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");

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
        router.get(route("barangay.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };
    const allColumns = [
        { key: "id", label: "ID" },
        { key: "logo_path", label: "Logo" },
        { key: "barangay_name", label: "Barangay Name" },
        { key: "contact_number", label: "Contact Number" },
        { key: "area_sq_km", label: "Area (sq km)" },
        { key: "email", label: "Email" },
        { key: "founded_year", label: "Founded Year" },
        { key: "barangay_code", label: "Barangay Code" },
        { key: "barangay_type", label: "Type" },
        { key: "actions", label: "Actions" }, // for buttons like edit/delete
    ];

    ///================ FILTER SHOW ===================\\\
    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) => ["brgy_type"].includes(key) && value && value !== ""
    );
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);
    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const toggleShowFilters = () => setShowFilters((prev) => !prev);
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs text-gray-500 font-medium">{row.id}</span>
        ),

        logo_path: (row) => (
            <img
                src={
                    row.logo_path
                        ? `/storage/${row.logo_path}`
                        : "/images/city-of-ilagan.png"
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/city-of-ilagan.png";
                }}
                alt={row.barangay_name || "Barangay Logo"}
                className="w-16 h-16 min-w-16 min-h-16 object-cover rounded-full border"
                loading="lazy"
            />
        ),

        barangay_name: (row) => (
            <span className="text-sm font-semibold text-gray-800">
                {row.barangay_name ?? "—"}
            </span>
        ),

        contact_number: (row) => (
            <span className="text-xs text-gray-600">
                {row.contact_number ?? "—"}
            </span>
        ),

        area_sq_km: (row) => (
            <span className="text-xs text-gray-600">
                {row.area_sq_km ?? "—"}
            </span>
        ),

        email: (row) => (
            <span className="text-xs text-gray-600">{row.email ?? "—"}</span>
        ),

        founded_year: (row) => (
            <span className="text-xs text-gray-600">
                {row.founded_year ?? "—"}
            </span>
        ),

        barangay_code: (row) => (
            <span className="text-xs text-gray-600">
                {row.barangay_code ?? "—"}
            </span>
        ),

        barangay_type: (row) => {
            const type = row.barangay_type ?? "—";
            const isUrban = type === "urban";
            return (
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        isUrban
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {type.toUpperCase()}
                </span>
            );
        },

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <Pencil className="w-4 h-4 text-blue-600" />,
                        onClick: () => handleEditBarangay(row.id),
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
    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        // Basic fields
        barangay_name: "",
        contact_number: "",
        area_sq_km: "",
        email: "",
        logo_path: "",
        founded_year: "",
        barangay_code: "",
        barangay_type: "urban", // default value

        // Meta
        barangay_id: null, // for editing
        _method: undefined, // for PUT/PATCH requests
    });
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("barangays_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "barangays_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const handleModalClose = () => {
        setModalState(null);
        setIsModalOpen(false);
        reset();
        clearErrors();
        setRecordToDelete(null);
    };

    const handleAddBarangay = () => {
        setModalState("add");
        setIsModalOpen(true);
    };
    const handleSubmitStore = (e) => {
        e.preventDefault();
        post(route("barangay.store"), {
            onError: (errors) => {
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}>${msg}</div>`
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        put(route("barangay.update", data.barangay_id), {
            onError: (errors) => {
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}>${msg}</div>`
                );

                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleEditBarangay = async (barangayId) => {
        try {
            const res = await axios.get(
                `${APP_URL}/super_admin/barangay_details/${barangayId}`
            );
            console.log(res);
            const barangay = res.data;

            setModalState("edit");
            setIsModalOpen(true);

            // Build logo URL or fallback
            const logoUrl = barangay.logo_path
                ? `${APP_URL}/storage/${barangay.logo_path}`
                : "/images/default-logo.png"; // <-- your default logo path

            // Populate form data
            setData({
                barangay_id: barangay.id,
                barangay_name: barangay.barangay_name || "",
                barangay_type: barangay.barangay_type || "",
                barangay_code: barangay.barangay_code || "",
                city: barangay.city || "",
                province: barangay.province || "",
                zip_code: barangay.zip_code || "",
                contact_number: barangay.contact_number || "",
                email: barangay.email || "",
                founded_year: barangay.founded_year || "",
                area_sq_km: barangay.area_sq_km || "",
                logo_path: null, // <-- important! don't put string here
                previewImage: logoUrl, // keep preview separately
                originalLogo: barangay.logo_path || "", // store original path
                originalEmail: barangay.email || "",
                _method: "PUT",
            });
        } catch (error) {
            console.error("Error fetching barangay details:", error);
            toast.error("Failed to fetch barangay details.");
        }
    };

    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("barangay.destroy", recordToDelete));
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
            handleModalClose();
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Barangay Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(barangays, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl shadow-sm">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>

                                    {/* Header Text */}
                                    <div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                            Barangays
                                        </h1>
                                        <p className="mt-1 md:mt-2 text-gray-600 text-sm md:text-base">
                                            Manage and monitor{" "}
                                            <span className="font-medium text-gray-800">
                                                barangays
                                            </span>{" "}
                                            within the system. Use the tools
                                            below to{" "}
                                            <span className="font-medium text-gray-800">
                                                create, update, filter, or
                                                export
                                            </span>{" "}
                                            barangay information for
                                            administrative and operational
                                            purposes.
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
                                        onPrint={handlePrint}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex w-[380px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Barangay Name"
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
                                        <div className="relative group z-50">
                                            <Button
                                                className="bg-blue-700 hover:bg-blue-400 "
                                                type={"button"}
                                                onClick={handleAddBarangay}
                                            >
                                                <SquarePlus />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Barangay
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={["brgy_type"]}
                                    showFilters={true}
                                    clearRouteName="barangay.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={barangays}
                                allColumns={allColumns}
                                columnRenderers={columnRenderers}
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={visibleColumns}
                            />
                        </div>
                    </div>
                </div>
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    title={
                        modalState === "add" ? "Add Barangay" : "Edit Barangay"
                    }
                >
                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-6 space-y-6">
                        <form
                            onSubmit={
                                modalState === "add"
                                    ? handleSubmitStore
                                    : handleSubmitUpdate
                            }
                            className="space-y-6"
                        >
                            {/* Header */}
                            <div className="space-y-1">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {modalState === "add"
                                        ? "Create New Barangay"
                                        : "Edit Barangay Details"}
                                </h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    {modalState === "add"
                                        ? "Fill in the details below to add a new barangay. Ensure all required information is accurate."
                                        : "Update the barangay details. Any changes will reflect immediately in the system."}
                                </p>
                            </div>

                            {/* Basic Info Section */}
                            <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 w-full space-y-6">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Basic Information
                                </h4>
                                <p className="text-gray-500 text-sm">
                                    Enter the general information of the
                                    barangay. Fields marked with{" "}
                                    <span className="font-medium">*</span> are
                                    required.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="barangay_name"
                                            value="Barangay Name *"
                                        />
                                        <InputField
                                            id="barangay_name"
                                            name="barangay_name"
                                            value={data.barangay_name || ""}
                                            placeholder="Enter barangay name"
                                            onChange={(e) =>
                                                setData(
                                                    "barangay_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.barangay_name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="contact_number"
                                            value="Contact Number"
                                        />
                                        <InputField
                                            id="contact_number"
                                            name="contact_number"
                                            value={data.contact_number || ""}
                                            placeholder="Optional: e.g., 0999-123-4567"
                                            onChange={(e) =>
                                                setData(
                                                    "contact_number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Format: +63XXXXXXXXX or 0XXXXXXXXX
                                        </p>
                                        <InputError
                                            message={errors.contact_number}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="area_sq_km"
                                            value="Area (sq km)"
                                        />
                                        <InputField
                                            id="area_sq_km"
                                            name="area_sq_km"
                                            value={data.area_sq_km || ""}
                                            placeholder="Optional"
                                            type="number"
                                            onChange={(e) =>
                                                setData(
                                                    "area_sq_km",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            Total land area of the barangay in
                                            square kilometers.
                                        </p>
                                        <InputError
                                            message={errors.area_sq_km}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <EmailValidationInput
                                            isSuperAdmin={true}
                                            data={data}
                                            setData={setData}
                                            originalEmail={
                                                data.originalEmail ?? null
                                            }
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Logo Upload */}
                                <div className="md:col-span-2 flex flex-col items-center space-y-2">
                                    <InputLabel
                                        htmlFor="barangay_logo"
                                        value="Barangay Logo"
                                    />
                                    <img
                                        src={
                                            data.logo_path
                                                ? URL.createObjectURL(
                                                      data.logo_path
                                                  ) // if new file uploaded
                                                : data.originalLogo
                                                ? `${APP_URL}/storage/${data.originalLogo}` // existing logo
                                                : "/images/city-of-ilagan.png" // fallback
                                        }
                                        alt="Barangay Logo"
                                        className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/images/city-of-ilagan.png";
                                        }}
                                    />
                                    <input
                                        id="barangay_logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file)
                                                setData("logo_path", file);
                                        }}
                                        className="block w-full text-sm text-gray-500
                            file:mr-2 file:py-1 file:px-3
                            file:rounded file:border-0
                            file:text-xs file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-400 text-center">
                                        Upload a clear logo or image
                                        representing the barangay.
                                    </p>
                                    <InputError
                                        message={errors.logo_path}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="founded_year"
                                            value="Founded Year"
                                        />
                                        <InputField
                                            id="founded_year"
                                            name="founded_year"
                                            type="number"
                                            value={data.founded_year || ""}
                                            placeholder="Optional: e.g., 1933"
                                            onChange={(e) =>
                                                setData(
                                                    "founded_year",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.founded_year}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="barangay_code"
                                            value="Barangay Code"
                                        />
                                        <InputField
                                            id="barangay_code"
                                            name="barangay_code"
                                            value={data.barangay_code || ""}
                                            placeholder="Optional"
                                            onChange={(e) =>
                                                setData(
                                                    "barangay_code",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.barangay_code}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="barangay_type"
                                            value="Barangay Type"
                                        />
                                        <select
                                            id="barangay_type"
                                            value={
                                                data.barangay_type || "urban"
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "barangay_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-md p-2"
                                        >
                                            <option value="urban">Urban</option>
                                            <option value="rural">Rural</option>
                                        </select>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Select whether the barangay is
                                            classified as urban or rural.
                                        </p>
                                        <InputError
                                            message={errors.barangay_type}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    className="bg-blue-700 hover:bg-blue-500 flex justify-end px-6 py-2 rounded-md font-semibold"
                                    type="submit"
                                >
                                    {modalState === "add"
                                        ? "Add Barangay"
                                        : "Update Barangay"}{" "}
                                    <MoveRight />
                                </Button>
                            </div>
                        </form>
                    </div>
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
