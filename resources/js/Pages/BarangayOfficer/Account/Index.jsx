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
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import {
    ACCOUNT_ROLE_TEXT,
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
import SelectField from "@/Components/SelectField";

export default function Index({ accounts, queryParams, residents }) {
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
    const [accountDetails, setAccountDetails] = useState(null); //delete
    const [recordToDelete, setRecordToDelete] = useState(null); //delete

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [selectedResident, setSelectedResident] = useState(null);
    const [passwordError, setPasswordError] = useState("");

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
        router.get(route("user.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };
    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "resident_name", label: "Full Name" },
        { key: "name", label: "User Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "status", label: "Session Status" },
        { key: "account_status", label: "Account Status" },
        { key: "logged_in", label: "Last Logged In" },
        { key: "created_at", label: "Date Added" },
        { key: "actions", label: "Actions" },
    ];

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            ["session_status", "account_status"].includes(key) &&
            value &&
            value !== ""
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
    const [accountEnabledMap, setAccountEnabledMap] = useState(
        accounts.data.reduce((acc, a) => {
            acc[a.id] = !a.is_disabled; // initial state
            return acc;
        }, {})
    );

    const columnRenderers = {
        id: (row) => (
            <span className="text-xs text-gray-500 font-medium">{row.id}</span>
        ),

        resident_name: (row) => {
            const r = row.resident ?? {};
            const fullName = `${r.firstname ?? ""} ${r.middlename ?? ""} ${
                r.lastname ?? ""
            } ${r.suffix ?? ""}`.trim();

            return (
                <span className="text-sm font-semibold text-gray-800">
                    {fullName || "—"}
                </span>
            );
        },

        name: (row) => (
            <span className="text-sm font-medium text-gray-800">
                {row.username ?? "—"}
            </span>
        ),

        email: (row) => (
            <span className="text-xs text-gray-600">{row.email ?? "—"}</span>
        ),

        role: (row) => (
            <span
                className={`text-xs font-medium ${
                    row.role === "barangay_officer"
                        ? "text-indigo-600"
                        : row.role === "resident"
                        ? "text-green-600"
                        : "text-gray-400"
                }`}
            >
                {ACCOUNT_ROLE_TEXT[row.role] ?? "—"}
            </span>
        ),

        status: (row) => {
            const isActive = row.status === "active";

            return (
                <span
                    className={`
                    text-xs font-semibold px-3 py-1 rounded-full transition
                    ${
                        isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }
                    hover:shadow-sm
                `}
                >
                    {row.status?.toUpperCase() ?? "—"}
                </span>
            );
        },

        logged_in: (row) => {
            const date = row.updated_at
                ? new Date(row.updated_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                  })
                : "—";

            return <span className="text-xs text-gray-500">{date}</span>;
        },

        account_status: (row) => {
            const enabled = accountEnabledMap[row.id] ?? true;

            const handleToggle = (checked) => {
                setAccountEnabledMap((prev) => ({
                    ...prev,
                    [row.id]: checked,
                }));

                axios
                    .patch(`/user/${row.id}/toggle-account`, {
                        is_disabled: checked ? 0 : 1, // if switch is checked → enabled → not disabled
                    })
                    .then((res) => {
                        if (res.data.success) {
                            toast.success(res.data.message, {
                                duration: 3000,
                                closeButton: true,
                            });
                        } else {
                            toast.error(
                                res.data.message || "Something went wrong.",
                                {
                                    duration: 3000,
                                    closeButton: true,
                                }
                            );
                        }
                    })
                    .catch(() => {
                        // fallback for unexpected errors
                        toast.error("Failed to update account status.", {
                            duration: 3000,
                            closeButton: true,
                        });

                        // revert toggle on error
                        setAccountEnabledMap((prev) => ({
                            ...prev,
                            [row.id]: !checked,
                        }));
                    });
            };

            return (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={enabled}
                        onCheckedChange={handleToggle}
                        className="bg-gray-200 hover:bg-gray-300"
                    />
                    <span
                        className={`text-xs font-semibold ${
                            enabled ? "text-green-700" : "text-red-700"
                        }`}
                    >
                        {enabled ? "ENABLED" : "DISABLED"}
                    </span>
                </div>
            );
        },

        created_at: (row) => {
            const date = row.created_at
                ? new Date(row.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "—";

            return <span className="text-xs text-gray-500">{date}</span>;
        },

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Edit",
                        icon: <Pencil className="w-4 h-4 text-blue-600" />,
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

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        resident_image: null,
        birthdate: "",
        purok_number: "",
        sex: "",

        // Account fields
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",

        // Optional admin controls
        status: "active", // default active
        is_disabled: false,
        account_id: null,
        _method: undefined,
    });
    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("accounts_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "accounts_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const handleModalClose = () => {
        setModalState(null);
        setIsModalOpen(false);
        setSelectedResident(null);
        setAccountDetails(null);
        reset();
        clearErrors();
    };

    const handleAddAccount = () => {
        setModalState("add");
        setIsModalOpen(true);
    };
    const handleAddAccountSubmit = (e) => {
        e.preventDefault();
        post(route("user.store"), {
            onSuccess: () => {
                toast.success("User account saved successfully!", {
                    description: "The changes have been saved.",
                    duration: 3000,
                    closeButton: true,
                });
                handleModalClose(); // close modal
            },
            onError: (errors) => {
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
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

    const handleEdit = async (accountId) => {
        try {
            const res = await axios.get(`${APP_URL}/user/${accountId}`);
            const account = res.data;

            const resident = account.resident; // assuming backend includes resident relation

            setModalState("edit");
            setIsModalOpen(true);

            // Populate form data
            setData({
                resident_id: account.resident_id,
                resident_name: resident
                    ? `${resident.firstname} ${resident.middlename} ${
                          resident.lastname
                      } ${resident.suffix ?? ""}`.trim()
                    : "",
                resident_image: resident?.image || null,
                birthdate: resident?.birthdate || "",
                purok_number: resident?.purok_number || "",
                sex: resident?.sex || "",
                username: account.username,
                email: account.email,
                role: account.role,
                originalEmail: account.email,
                password: "",
                password_confirmation: "",
                account_id: account.id, // needed for update
                _method: "PUT",
            });
        } catch (error) {
            console.error("Error fetching account details:", error);
            toast.error("Failed to fetch account details.");
        }
    };
    const handleEditAccountSubmit = (e) => {
        e.preventDefault();

        if (!data.account_id) return; // safety check

        post(route("user.update", data.account_id), {
            onSuccess: () => {
                toast.success("User account updated successfully!", {
                    description: "The changes have been saved.",
                    duration: 3000,
                    closeButton: true,
                });
                handleModalClose(); // close modal
            },
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
    // delete
    const handleDeleteClick = (id) => {
        setRecordToDelete(id);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        router.delete(route("user.destroy", recordToDelete));
        setIsDeleteModalOpen(false);
    };
    const handlePrint = () => {
        window.print();
    };

    return (
        <AdminLayout>
            <Head title="Resident Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                {/* <pre>{JSON.stringify(accounts, undefined, 2)}</pre> */}
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <CircleUser className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            User Accounts
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Manage and monitor{" "}
                                            <span className="font-medium">
                                                user accounts
                                            </span>{" "}
                                            within the system. Use the tools
                                            below to{" "}
                                            <span className="font-medium">
                                                create, update, filter, or
                                                export
                                            </span>{" "}
                                            information for administration and
                                            reports.
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
                                            placeholder="Search Resident Name"
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
                                                onClick={handleAddAccount}
                                            >
                                                <SquarePlus />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Add Account
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "session_status",
                                        "account_status",
                                        "account_role",
                                    ]}
                                    showFilters={true}
                                    clearRouteName="user.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={accounts}
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
                        modalState === "add"
                            ? accountDetails
                                ? "Edit Account Details"
                                : "Add Account Details"
                            : "View Resident Details"
                    }
                >
                    {(modalState === "add" || modalState === "edit") && (
                        <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                            <form
                                onSubmit={
                                    modalState === "add"
                                        ? handleAddAccountSubmit
                                        : handleEditAccountSubmit
                                }
                                className="space-y-6"
                            >
                                {/* Header */}
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        {modalState === "add"
                                            ? "Create User Account – "
                                            : "Edit User Account – "}
                                        {data.resident_name ||
                                            "Select a Resident"}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {modalState === "add"
                                            ? "Please select a resident and provide the account credentials (username, email, and password)."
                                            : "Update the account credentials and status (password cannot be changed here)."}
                                    </p>
                                </div>
                                {/* Resident Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl shadow-sm">
                                    {/* Profile Photo */}
                                    <div className="flex flex-col items-center space-y-3">
                                        <InputLabel
                                            htmlFor="resident_image"
                                            value="Profile Photo"
                                        />
                                        <img
                                            src={
                                                data.resident_image
                                                    ? `/storage/${data.resident_image}`
                                                    : "/images/default-avatar.jpg"
                                            }
                                            alt="Resident Image"
                                            className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow"
                                        />
                                        <p className="text-sm text-gray-500 text-center">
                                            {data.resident_id
                                                ? "Preview of the selected resident"
                                                : "Select a resident to view details"}
                                        </p>
                                    </div>

                                    {/* Resident Selection & Info */}
                                    <div className="md:col-span-2 space-y-5">
                                        {/* Resident Dropdown */}
                                        <div>
                                            <DropdownInputField
                                                label="Full Name"
                                                name="resident_name"
                                                value={data.resident_name || ""}
                                                placeholder="Select a resident"
                                                onChange={handleResidentChange}
                                                items={residentsList}
                                                disabled={modalState === "edit"} // Cannot change resident when editing
                                            />
                                            <InputError
                                                message={errors.resident_id}
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Show read-only info only if a resident is selected */}
                                        {data.resident_id && (
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <InputField
                                                        label="Birthdate"
                                                        name="birthdate"
                                                        value={
                                                            data.birthdate || ""
                                                        }
                                                        readOnly
                                                    />
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Resident's birthdate
                                                    </p>
                                                </div>
                                                <div>
                                                    <InputField
                                                        label="Purok Number"
                                                        name="purok_number"
                                                        value={
                                                            data.purok_number ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Resident's assigned
                                                        Purok
                                                    </p>
                                                </div>
                                                <div>
                                                    <InputField
                                                        label="Sex"
                                                        name="sex"
                                                        value={
                                                            RESIDENT_GENDER_TEXT2[
                                                                data.sex
                                                            ] || ""
                                                        }
                                                        readOnly
                                                    />
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Resident's gender
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Account Credentials Section */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm space-y-6">
                                    <h4 className="text-xl font-semibold text-gray-800">
                                        Account Credentials
                                    </h4>

                                    {/* Username, Email, and Role Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Username */}
                                        <div>
                                            <InputField
                                                label="Username"
                                                name="username"
                                                value={data.username || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "username",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Enter a unique username for
                                                login (letters, numbers,
                                                underscores allowed).
                                            </p>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <EmailValidationInput
                                                data={data}
                                                setData={setData}
                                                originalEmail={
                                                    data.originalEmail ?? null
                                                }
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Enter a valid email address.
                                                This will be used for
                                                notifications and login.
                                            </p>
                                        </div>

                                        {/* Role Select Field */}
                                        <div>
                                            <SelectField
                                                label="Role"
                                                name="role"
                                                value={data.role || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                                items={[
                                                    {
                                                        value: "barangay_officer",
                                                        label: "Barangay Officer",
                                                    },
                                                    {
                                                        value: "resident",
                                                        label: "Resident",
                                                    },
                                                ]}
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Select the account role.
                                                "Barangay Officer" has admin
                                                privileges; "Resident" has
                                                limited access.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Password fields only for add mode */}
                                    {modalState === "add" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <InputField
                                                    label="Password"
                                                    name="password"
                                                    type="password"
                                                    value={data.password || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Use at least 8 characters,
                                                    including uppercase,
                                                    lowercase, numbers, and
                                                    symbols.
                                                </p>
                                            </div>
                                            <div>
                                                <InputField
                                                    label="Confirm Password"
                                                    name="password_confirmation"
                                                    type="password"
                                                    value={
                                                        data.password_confirmation ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Re-enter the password to
                                                    confirm.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Password validation checklist for add mode */}
                                    {modalState === "add" && (
                                        <PasswordValidationChecklist
                                            data={data}
                                        />
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end">
                                    <Button
                                        className="bg-blue-700 hover:bg-blue-400 flex justify-end"
                                        type="submit"
                                        disabled={
                                            modalState === "add" &&
                                            (!!passwordError ||
                                                !data.password ||
                                                !data.password_confirmation)
                                        }
                                    >
                                        {modalState === "add"
                                            ? "Create Account"
                                            : "Update Account"}{" "}
                                        <MoveRight />
                                    </Button>
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
                    residentId={recordToDelete}
                />
            </div>
        </AdminLayout>
    );
}
