import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    Eye,
    FilePlus2,
    FileText,
    FileUp,
    PrinterIcon,
    RotateCcw,
    Search,
    SquarePlus,
    Trash2,
    XCircle,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import * as CONSTANTS from "@/constants";
import useAppUrl from "@/hooks/useAppUrl";
import axios from "axios";
import { Toaster, toast } from "sonner";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import SidebarModal from "@/Components/SidebarModal";
import ExportButton from "@/Components/ExportButton";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";

export default function Index({
    documents,
    residents,
    certificates,
    queryParams = null,
    success = null,
    error = null,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Certificate Issuance", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();
    const [disableSubmit, setDisableSubmit] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [certToDelete, setCertToDelete] = useState(null); //delete
    const defaultPlacehodlers = [
        "fullname",
        "fullname_2",
        "day",
        "month",
        "year",
        "age",
        "birthdate",
        "ctrl_no",
        "civil_status",
        "civil_status_2",
        "purpose",
        "purpose_2",
        "purok",
        "day_2",
        "month_2",
        "year_2",
        "issued_on",
    ];

    const toPascalCase = (str) =>
        str
            .toLowerCase()
            .replace(/_/g, " ") // replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize each word

    const { data, setData, errors, setError, reset, clearErrors } = useForm({
        resident_id: null,
        resident_name: "",
        document_id: null,
        document_name: "",
        birthdate: null,
        age: null,
        civil_status: "",
        resident_image: "",
        purpose: "",
        placeholders: null,

        // second resident support
        resident_id_2: null,
        resident_name_2: "",
        civil_status_2: "",
        resident_image_2: "",
        purpose_2: "",
    });

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const handleDocumentChange = async (e) => {
        const cert = documents.find((c) => c.id == e);
        if (cert) {
            setData("document_name", cert.name);
            setData("document_id", cert.id);
            try {
                const response = await axios.get(
                    `${APP_URL}/document/fetchplaceholders/${e}`
                );
                setData("placeholders", response.data.placeholders);
            } catch (error) {
                console.error("Error fetching placeholders:", error);
            }
        }
    };

    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = residents.find((r) => r.id == resident_id);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "resident_name",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("gender", resident.gender);
            setData("birthdate", resident.birthdate);
            setData("civil_status", resident.civil_status);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const handleSecondResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = residents.find((r) => r.id == resident_id);
        if (resident) {
            setData("resident_id_2", resident.id);
            setData(
                "resident_name_2",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("civil_status_2", resident.civil_status);
            setData("resident_image_2", resident.resident_picture_path);
        }
    };

    const residentsList = residents.map((resident) => ({
        label: `${resident.firstname} ${resident.middlename ?? ""} ${
            resident.lastname
        }${resident.suffix ? ", " + resident.suffix : ""}`
            .replace(/\s+/g, " ")
            .trim(),
        value: resident.id,
    }));

    const documentsList = documents.map((document) => ({
        label: document.name.replace(/\s+/g, " ").trim(),
        value: document.id.toString(),
    }));

    const isDualTemplate = (data.placeholders || []).some((ph) =>
        ph.endsWith("_2")
    );

    // handles document issuance
    const handleIssue = async () => {
        setError({});
        setDisableSubmit(true);
        const newErrors = {};

        if (!data.resident_id)
            newErrors.resident_id = "Please select a resident.";
        if (!data.document_id)
            newErrors.document_id = "Please select a certificate.";
        if (!data.purpose || data.purpose.trim() === "")
            newErrors.purpose = "Purpose is required.";

        // if (isDualTemplate) {
        //     if (!data.resident_id_2)
        //         newErrors.resident_id_2 = "Please select a second resident.";
        //     if (!data.purpose_2 || data.purpose_2.trim() === "")
        //         newErrors.purpose_2 = "Purpose for 2nd resident is required.";
        // }

        (data.placeholders || [])
            .filter((placeholder) => !defaultPlacehodlers.includes(placeholder))
            .forEach((placeholder) => {
                if (!data[placeholder] || data[placeholder].trim() === "") {
                    newErrors[placeholder] = `${placeholder
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                        )} is required.`;
                }
            });

        if (Object.keys(newErrors).length > 0) {
            setError(newErrors);
            toast.error("Validation failed", {
                description: "Please fill in all required fields.",
                duration: 4000,
                className: "bg-red-100 text-red-800",
            });
            setDisableSubmit(false);
            return;
        }

        const payload = {
            document_id: data.document_id,
            resident_id: data.resident_id,
            purpose: data.purpose,
            ...(isDualTemplate
                ? {
                      resident_id_2: data.resident_id_2,
                      purpose_2: data.purpose_2,
                  }
                : {}),
            ...Object.fromEntries(
                (data.placeholders || [])
                    .filter(
                        (placeholder) =>
                            !defaultPlacehodlers.includes(placeholder)
                    )
                    .map((placeholder) => [
                        placeholder,
                        data[placeholder] || "",
                    ])
            ),
        };

        try {
            toast.loading("Issuing document...", {
                duration: 5000,
                className: "bg-blue-100 text-blue-800",
            });
            const response = await axios.post(
                route("certificate.store"),
                payload,
                { responseType: "blob", withCredentials: true }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            const match = contentDisposition?.match(/filename="?([^"]+)"?/);
            const filename = match ? match[1] : "certificate.docx";

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            router.get(route("certificate.index", { success: true }));
        } catch (error) {
            console.error("Issuance failed", error);
            const serverMessage =
                error?.response?.data?.message || "Unknown error occurred.";
            toast.error("Failed to issue document", {
                description: serverMessage,
                duration: 5000,
                className: "bg-red-100 text-red-800",
            });
        }
    };

    // for resident approval
    const handleCertificateIssue = async (id) => {
        try {
            const response = await axios.post(
                route("certificate.issue", id),
                {},
                {
                    responseType: "blob",
                    withCredentials: true, // ✅ REQUIRED for Laravel session
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            const match = contentDisposition?.match(/filename="?([^"]+)"?/);
            const filename = match ? match[1] : "certificate.docx";

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Document issued successfully!");

            // ✅ This is optional but okay
            router.get(route("certificate.index", { success: true }));
        } catch (error) {
            console.error("Issuance failed", error);
            toast.error("Failed to issue certificate", {
                description:
                    error?.response?.data?.message || "Unknown error occurred.",
            });
        }
    };

    // tables and modals
    queryParams = queryParams || {};

    const [query, setQuery] = useState(queryParams["name"] ?? "");
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
        router.get(route("certificate.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "certificate_type",
                "request_status",
                "issued_by",
                "issued_at",
            ].includes(key) &&
            value &&
            value !== ""
    );
    useEffect(() => {
        if (hasActiveFilter) {
            setShowFilters(true);
        }
    }, [hasActiveFilter]);

    const allColumns = [
        { key: "id", label: "Issued ID" },
        { key: "name", label: "Name" },
        { key: "certificate", label: "Certificate" },
        { key: "purpose", label: "Purpose" },
        { key: "request_status", label: "Request Status" },
        { key: "issued_by", label: "Issued By" },
        { key: "issued_at", label: "Issued At" },
        { key: "control_number", label: "Control Number" },
        { key: "actions", label: "Actions" },
    ];

    const [showFilters, setShowFilters] = useState(hasActiveFilter);
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("certificate_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "certificate_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const columnRenderers = {
        id: (row) => <span className="text-xs text-gray-700">{row.id}</span>,

        name: (row) => {
            const r = row.resident ?? {};
            const fullName = `${r.firstname ?? ""} ${r.middlename ?? ""} ${
                r.lastname ?? ""
            } ${r.suffix ?? ""}`.trim();
            return (
                <span className="text-sm font-medium text-gray-800">
                    {fullName || "—"}
                </span>
            );
        },

        certificate: (row) => (
            <span className="text-xs text-indigo-700 font-medium">
                {row.document?.name ?? "—"}
            </span>
        ),

        purpose: (row) => (
            <span className="text-xs text-gray-700">{row.purpose ?? "—"}</span>
        ),
        request_status: (row) => (
            <span
                className={`text-xs font-medium ${
                    CONSTANTS.CERTIFICATE_REQUEST_STATUS_CLASS[
                        row.request_status
                    ]
                }`}
            >
                {CONSTANTS.CERTIFICATE_REQUEST_STATUS_TEXT[
                    row.request_status
                ] ?? "—"}
            </span>
        ),

        issued_by: (row) => (
            <span className="text-xs text-gray-700">
                {CONSTANTS.BARANGAY_OFFICIAL_POSITIONS_TEXT[
                    row.issued_by?.position
                ] ?? "—"}
            </span>
        ),

        issued_at: (row) => (
            <span className="text-xs text-gray-600">
                {row.issued_at ?? "—"}
            </span>
        ),

        control_number: (row) => (
            <span className="text-xs text-gray-600">
                {row.control_number ?? "—"}
            </span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    ...(row.request_status === "pending"
                        ? [
                              {
                                  label: "Issue",
                                  icon: (
                                      <CheckCircle className="w-4 h-4 text-blue-600" />
                                  ),
                                  onClick: () => handleCertificateIssue(row.id),
                              },
                              {
                                  label: "Deny",
                                  icon: (
                                      <XCircle className="w-4 h-4 text-orange-600" />
                                  ),
                                  onClick: () => handleCertificateDeny(row.id),
                              },
                          ]
                        : []),
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                    {
                        label: "Download as DOCX",
                        icon: <FileText className="w-4 h-4 text-green-600" />,
                        onClick: () => handleCertificateDownload(row.id),
                    },
                    {
                        label: "Print",
                        icon: (
                            <PrinterIcon className="w-4 h-4 text-indigo-600" />
                        ),
                        onClick: () => handleCertificatePrint(row.id),
                    },
                ]}
            />
        ),
    };

    const handleCertificateDeny = (id) => {
        router.delete(route("certificate.deny", id));
    };

    // adding of certificate
    const handleAddCertificate = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    //handle print
    const handleCertificatePrint = (id) => {
        const printUrl = route("certificate.print", id);
        window.open(printUrl, "_blank");
    };

    // handle download
    const handleCertificateDownload = async (id) => {
        try {
            const response = await axios.get(
                route("certificate.download", id),
                {
                    responseType: "blob",
                }
            );

            // Extract filename from headers if possible
            const contentDisposition = response.headers["content-disposition"];
            const match = contentDisposition?.match(/filename="?([^"]+)"?/);
            const filename = match ? match[1] : `certificate_${id}.docx`;

            // Create a blob for download
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            const url = window.URL.createObjectURL(blob);

            // Trigger browser download
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => window.URL.revokeObjectURL(url), 1000);

            toast.success("Certificate downloaded successfully.", {
                description: "Operation successful!",
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
        } catch (error) {
            const msg = error.response?.data?.error || "Download failed.";
            toast.error(msg, {
                description: "Operation failed!",
                duration: 3000,
                className: "bg-red-100 text-red-800",
            });
        }
    };

    // handle modal closing
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        reset();
        clearErrors();
        setDisableSubmit(false);
    };

    // delete
    const handleDeleteClick = (id) => {
        setCertToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("certificate.destroy", certToDelete), {
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

    // success catching
    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
            const url = new URL(window.location.href);
            url.searchParams.delete("success");
            window.history.replaceState({}, "", url.pathname + url.search);
        }
    }, [success]);

    // error catching
    useEffect(() => {
        if (!error) return;

        handleModalClose();

        const message =
            typeof error === "string"
                ? error
                : error.message || "An error occurred.";

        toast.error(message, {
            description: "Operation failed!",
            duration: 3000,
            className: "bg-red-100 text-red-800",
        });

        // Optionally clear the error so it doesn't re-fire if the prop sticks around
        if (typeof clearError === "function") {
            clearError(); // e.g., a prop or state setter to reset `error`
        }
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Certificate Issuance" />
            <div>
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <Toaster richColors />
                <div className="p-2 md:p-4">
                    <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                        {/* <pre>{JSON.stringify(certificates, undefined, 3)}</pre> */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl shadow-sm">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                                            Certificate Issuance
                                        </h1>
                                        <p className="text-sm text-gray-500">
                                            Manage the{" "}
                                            <span className="font-medium">
                                                issuance of certificates{" "}
                                            </span>
                                            for residents. Use the tools below
                                            to search, filter, export, or issue
                                            new certificates as needed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <div className="flex items-start gap-2 flex-wrap">
                                    <DynamicTableControls
                                        allColumns={allColumns}
                                        visibleColumns={visibleColumns}
                                        setVisibleColumns={setVisibleColumns}
                                        showFilters={showFilters}
                                        toggleShowFilters={() =>
                                            setShowFilters((prev) => !prev)
                                        }
                                    />
                                    <ExportButton
                                        url="/certificate/export-certificates-excel"
                                        queryParams={queryParams}
                                        label="Export Certificates as XLSX"
                                    />
                                    <ExportButton
                                        url="/certificate/export-certificates-pdf"
                                        queryParams={queryParams}
                                        label="Export Certificates as PDF"
                                        type="pdf"
                                    />
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex w-[300px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search Name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed("name", e)
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
                                    </form>
                                    <div className="relative group z-50">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            onClick={handleAddCertificate}
                                        >
                                            <SquarePlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Issue Certificate
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {showFilters && (
                                <FilterToggle
                                    queryParams={queryParams}
                                    searchFieldName={searchFieldName}
                                    visibleFilters={[
                                        "certificate_type",
                                        "request_status",
                                        "issued_by",
                                        "issued_at",
                                    ]}
                                    certificateTypes={documentsList}
                                    showFilters={true}
                                    months={months}
                                    clearRouteName="certificate.index"
                                    clearRouteParams={{}}
                                />
                            )}
                            <DynamicTable
                                passedData={certificates}
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
                            modalState === "add"
                                ? "Issue a Certificate"
                                : "View Resident Details"
                        }
                    >
                        {modalState === "add" && (
                            <div className="bg-white shadow-xl rounded-2xl p-8 my-10 space-y-10 border border-gray-100">
                                {/* Certificate & Resident Selection */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        Certificate & Resident Selection
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Choose the type of certificate to issue
                                        and select the resident(s) for whom it
                                        will be generated.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Certificate */}
                                        <div>
                                            <DropdownInputField
                                                label="Select a Certificate"
                                                items={documentsList}
                                                value={data.document_name || ""}
                                                onChange={(e) =>
                                                    handleDocumentChange(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.document_id}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                Example: Certificate of
                                                Indigency, Residency, etc.
                                            </p>
                                        </div>

                                        {/* Resident */}
                                        <div>
                                            <DropdownInputField
                                                label="Select a Resident"
                                                items={residentsList}
                                                value={data.resident_name || ""}
                                                onChange={handleResidentChange}
                                            />
                                            <InputError
                                                message={errors.resident_id}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                The resident for whom this
                                                certificate will be issued.
                                            </p>
                                        </div>

                                        {/* Dual Resident */}
                                        {isDualTemplate && (
                                            <div className="md:col-span-2">
                                                <DropdownInputField
                                                    label="Select Second Resident"
                                                    items={residentsList}
                                                    value={
                                                        data.resident_name_2 ||
                                                        ""
                                                    }
                                                    onChange={
                                                        handleSecondResidentChange
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.resident_id_2
                                                    }
                                                    className="mt-1"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Some certificates require
                                                    two residents (e.g., joint
                                                    certification).
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Purpose Section */}
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        Purpose
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        Provide the purpose of the certificate.
                                        This will appear in the certification
                                        document.
                                    </p>

                                    <div className="space-y-5">
                                        <div>
                                            <InputField
                                                label="Purpose"
                                                value={data.purpose || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "purpose",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.purpose}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                Example: Scholarship
                                                requirement, job application,
                                                financial assistance.
                                            </p>
                                        </div>

                                        {isDualTemplate && (
                                            <div>
                                                <InputField
                                                    label="Purpose (Second Resident)"
                                                    value={data.purpose_2 || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "purpose_2",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.purpose_2}
                                                    className="mt-1"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Provide a separate purpose
                                                    if the second resident
                                                    requires one.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dynamic Placeholders */}
                                {data.placeholders?.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                                            Additional Information
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Some templates require extra
                                            details. Fill out the fields below
                                            if they are present in the template.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {data.placeholders
                                                .filter(
                                                    (p) =>
                                                        !defaultPlacehodlers.includes(
                                                            p
                                                        )
                                                )
                                                .map((placeholder, i) => (
                                                    <div key={i}>
                                                        <InputField
                                                            label={toPascalCase(
                                                                placeholder
                                                            )}
                                                            value={
                                                                data[
                                                                    placeholder
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    placeholder,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    placeholder
                                                                ]
                                                            }
                                                            className="mt-1"
                                                        />
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Provide information
                                                            for{" "}
                                                            <span className="font-medium">
                                                                {toPascalCase(
                                                                    placeholder
                                                                )}
                                                            </span>
                                                            .
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex justify-between items-center border-t pt-6">
                                    <Button
                                        type="button"
                                        onClick={() => reset()}
                                        variant="outline"
                                        className="flex items-center gap-2 text-gray-500"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Reset
                                    </Button>
                                    <Button
                                        onClick={handleIssue}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md"
                                        disabled={disableSubmit}
                                    >
                                        Issue Certificate
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SidebarModal>
                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={confirmDelete}
                        residentId={certToDelete}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
