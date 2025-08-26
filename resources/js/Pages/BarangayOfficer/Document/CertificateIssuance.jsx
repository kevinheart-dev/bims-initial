import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Eye,
    FilePlus2,
    FileText,
    FileUp,
    PrinterIcon,
    RotateCcw,
    Search,
    SquarePlus,
    Trash2,
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

    const { data, setData, post, errors, setError, reset, clearErrors } =
        useForm({
            resident_id: null,
            resident_name: "",
            document_id: null,
            document_name: "",
            birthdate: null,
            age: null,
            civil_status: "",
            resident_image: "",
            ethnicity: "",
            purok_number: null,
            street_name: "",
            housenumber: "",
            residency_date: "",
            residency_type: "",
            purpose: "",
            placeholders: null,
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
                    `${APP_URL}/barangay_officer/document/fetchplaceholders/${e}`
                );
                console.log("Placeholders:", response.data);

                // Optionally store the placeholders in state
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
                `${resident.firstname} ${resident.middlename} ${resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("gender", resident.gender);
            setData("birthdate", resident.birthdate);
            setData("housenumber", resident.latest_household.house_number);
            setData("civil_status", resident.civil_status);
            setData("resident_image", resident.resident_picture_path);
        }
    };

    const residentsList = residents.map((resident) => ({
        label: `${resident.firstname} ${resident.middlename ?? ""} ${resident.lastname
            }${resident.suffix ? ", " + resident.suffix : ""}`
            .replace(/\s+/g, " ")
            .trim(),
        value: resident.id,
    }));

    const documentsList = documents.map((document) => ({
        label: document.name.replace(/\s+/g, " ").trim(),
        value: document.id.toString(),
    }));

    // handles document issuance
    const handleIssue = async () => {
        setError({});
        setDisableSubmit(true);
        const newErrors = {};

        // Basic required fields
        if (!data.resident_id)
            newErrors.resident_id = "Please select a resident.";
        if (!data.document_id)
            newErrors.document_id = "Please select a certificate.";
        if (!data.purpose || data.purpose.trim() === "")
            newErrors.purpose = "Purpose is required.";

        // Validate dynamic placeholders
        (data.placeholders || [])
            .filter(
                (placeholder) =>
                    ![
                        "fullname",
                        "day",
                        "month",
                        "year",
                        "ctrl_no",
                        "civil_status",
                        "purpose",
                        "purok",
                    ].includes(placeholder)
            )
            .forEach((placeholder) => {
                if (!data[placeholder] || data[placeholder].trim() === "") {
                    newErrors[placeholder] = `${placeholder
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                        )} is required.`;
                }
            });

        // Set errors and stop if any
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

        // Prepare payload
        const payload = {
            document_id: data.document_id,
            resident_id: data.resident_id,
            purpose: data.purpose,
            ...Object.fromEntries(
                (data.placeholders || [])
                    .filter(
                        (placeholder) =>
                            ![
                                "fullname",
                                "day",
                                "month",
                                "year",
                                "ctrl_no",
                                "civil_status",
                                "purpose",
                                "purok",
                            ].includes(placeholder)
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
                { responseType: "blob" }
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
    const toggleShowFilters = () => setShowFilters((prev) => !prev);
    const handlePrint = () => {
        window.print();
    };
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

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
            const fullName = `${r.firstname ?? ""} ${r.middlename ?? ""} ${r.lastname ?? ""
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
                className={`text-xs font-medium ${CONSTANTS.CERTIFICATE_REQUEST_STATUS_CLASS[
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
            <span className="text-xs text-gray-600">{row.issued_at}</span>
        ),

        control_number: (row) => (
            <span className="text-xs text-gray-600">{row.control_number}</span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Download",
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
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDelete(row.id),
                    },
                ]}
            />
        ),
    };

    // adding of certificate
    const handleAddCertificate = () => {
        setModalState("add");
        setIsModalOpen(true);
    };

    //handle print
    const handleCertificatePrint = async (id) => {
        try {
            const response = await axios.get(route("certificate.print", id), {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);

            // Open in new tab and auto-print
            const printWindow = window.open(url);
            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                };
            }

            // Cleanup after some time
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 2000);
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to load PDF.";
            toast.error(msg, {
                description: "Operation failed!",
                duration: 3000,
                className: "bg-red-100 text-red-800",
            });
        }
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
                                queryParams={queryParams}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
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
                        title={
                            modalState === "add"
                                ? "Issue a Certificate"
                                : "View Resident Details"
                        }
                    >
                        {modalState === "add" && (
                            <div className="flex justify-between overflow-hidden shadow-sm rounded-xl sm:rounded-lg p-4 my-8 bg-gray-100">
                                <div className="w-full">
                                    <p className="text-4xl font-bold text-center text-gray-800 mb-4">
                                        Certificate Issuance
                                    </p>

                                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                                        Certificate Information
                                    </h2>
                                    <p className="text-xs text-gray-600">
                                        Kindly check the provided personal
                                        information of the resident required.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-full">
                                            <DropdownInputField
                                                label={"Select a Certificate"}
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
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <DropdownInputField
                                                label={"Select a Resident"}
                                                items={residentsList}
                                                value={data.resident_name || ""}
                                                onChange={(e) =>
                                                    handleResidentChange(e)
                                                }
                                            />
                                            <InputError
                                                message={errors.resident_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5">
                                            <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                                                <InputLabel
                                                    htmlFor={`resident_image`}
                                                    value="Profile Photo"
                                                />
                                                <img
                                                    src={
                                                        data.resident_image
                                                            ? `/storage/${data.resident_image}`
                                                            : "/images/default-avatar.jpg"
                                                    }
                                                    alt={`Resident Image`}
                                                    className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                                />
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                                <div className="w-full">
                                                    <DropdownInputField
                                                        label="Purpose"
                                                        value={
                                                            data.purpose || ""
                                                        }
                                                        name="purpose"
                                                        placeholder="Enter the purpose of the certificate"
                                                        onChange={(e) =>
                                                            setData(
                                                                "purpose",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.purpose}
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <InputField
                                                            label="Birthdate"
                                                            name="birthdate"
                                                            value={
                                                                data.birthdate
                                                            }
                                                            placeholder="Select a resident"
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div>
                                                        <InputField
                                                            label="Gender"
                                                            name="gender"
                                                            value={data.gender}
                                                            placeholder="Select a resident"
                                                            readOnly={true}
                                                        />
                                                    </div>{" "}
                                                    <InputField
                                                        label="Civil Status"
                                                        name="civil_status"
                                                        value={
                                                            CONSTANTS
                                                                .RESIDENT_CIVIL_STATUS_TEXT[
                                                            data
                                                                .civil_status
                                                            ] || ""
                                                        }
                                                        readOnly
                                                    />
                                                    <InputField
                                                        label="House Number"
                                                        name="housenumber"
                                                        value={
                                                            data.housenumber ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid-cols-1 sm:grid-cols-3 gap-4">
                                            {data.placeholders
                                                ?.filter(
                                                    (placeholder) =>
                                                        ![
                                                            "fullname",
                                                            "day",
                                                            "month",
                                                            "year",
                                                            "ctrl_no",
                                                            "civil_status",
                                                            "purpose",
                                                            "purok",
                                                        ].includes(placeholder)
                                                )
                                                .map((placeholder, index) => (
                                                    <div>
                                                        <InputField
                                                            key={index}
                                                            label={placeholder}
                                                            name={placeholder}
                                                            value={
                                                                data[
                                                                placeholder
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [placeholder]:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                placeholder
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="flex w-full justify-between items-center mt-7">
                                            <Button
                                                type="button"
                                                onClick={() => reset()}
                                            >
                                                <RotateCcw /> Reset
                                            </Button>

                                            <Button
                                                onClick={handleIssue}
                                                className="bg-blue-700 hover:bg-blue-400"
                                                disabled={disableSubmit}
                                            >
                                                Issue Certificate
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </SidebarModal>
                    {/*
                     */}
                </div>
            </div>
        </AdminLayout>
    );
}
