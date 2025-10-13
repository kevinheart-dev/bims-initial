import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCheck2, FilePlus2, ListPlus, Search, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import InputField from "@/Components/InputField";
import useAppUrl from "@/hooks/useAppUrl";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import SidebarModal from "@/Components/SidebarModal";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { useMemo } from "react";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import SelectField from "@/Components/SelectField";
import { SPECIFIC_PURPOSE_TEXT } from "@/constants";

export default function Index({ documents, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Documents", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [residentToDelete, setResidentToDelete] = useState(null);

    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const fileInputRef = useRef(null);

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
        router.get(route("document.index", queryParams));
    };
    const onKeyPressed = (field, e) => {
        if (e.key === "Enter") {
            searchFieldName(field, e.target.value);
        } else {
            return;
        }
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         console.log("Selected file:", file);
    //         const formData = new FormData();
    //         formData.append("file", file);

    //         router.post(route("document.store"), formData, {
    //             forceFormData: true,
    //             onSuccess: () => {
    //                 console.log("Upload successful!");
    //             },
    //             onError: (errors) => {
    //                 console.error("Upload failed:", errors);
    //             },
    //         });
    //     }
    // };

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Document Name" },
        { key: "specific_purpose", label: "Specific Purpose" },
        { key: "created_at", label: "Date Added" },
        { key: "actions", label: "Actions" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const columnRenderers = {
        id: (row) => row.id,
        name: (row) => row.name,
        specific_purpose: (row) => SPECIFIC_PURPOSE_TEXT[row.specific_purpose],
        created_at: (row) => new Date(row.created_at).toLocaleDateString(),
        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "Delete",
                        icon: <Trash2 className="w-4 h-4 text-red-600" />,
                        onClick: () => handleDeleteClick(row.id),
                    },
                ]}
            />
        ),
    };

    const handleAddDocument = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        reset();
    };

    const { data, setData, post, errors, processing, reset } = useForm({
        name: "",
        description: "",
        file: null,
    });

    const handleSubmitDocument = (e) => {
        e.preventDefault();

        post(route("document.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);

                // Optional: Show toast
                toast.error("Action Failed", {
                    description: errors
                        ? JSON.stringify(errors)
                        : "Unable to add document.",
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const handleDeleteClick = (id) => {
        setResidentToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Memoize confirmDelete to ensure it's stable
    const confirmDelete = useMemo(
        () => () => {
            if (residentToDelete) {
                router.delete(route("document.destroy", residentToDelete), {
                    onSuccess: () => {
                        toast.success("Document deleted successfully!");
                        setIsDeleteModalOpen(false);
                        setResidentToDelete(null);
                    },
                    onError: (err) => {
                        toast.error("Failed to delete resident.", {
                            description: err.message,
                        });
                        setIsDeleteModalOpen(false);
                    },
                });
            }
        },
        [residentToDelete]
    );

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
            toast.error("Action Failed", {
                description:
                    typeof error === "string"
                        ? error
                        : "An unexpected error occurred.",
                duration: 3000,
                closeButton: true,
            });

            if (props.setError) props.setError(null);
        }
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Documents Dashboard" />
            <div>
                {/* <pre>{JSON.stringify(documents, undefined, 3)}</pre> */}
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    <div className="overflow-hidden bg-gray-50 shadow-sm rounded-xl sm:rounded-lg p-4 my-8 ">
                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full mb-4">
                                {/* Title + Description */}
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        List of Documents
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Manage, search, and upload documents
                                        within the system.
                                    </p>
                                </div>

                                {/* Search & Add Button */}
                                <div className="flex items-center gap-2 flex-wrap justify-end">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex w-[280px] max-w-lg items-center space-x-1"
                                    >
                                        <Input
                                            type="text"
                                            placeholder="Search by name"
                                            value={query}
                                            onChange={(e) =>
                                                setQuery(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                onKeyPressed("name", e)
                                            }
                                            className="w-full"
                                        />
                                        <div className="relative group">
                                            <Button
                                                type="submit"
                                                className="border border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white active:bg-blue-900 flex items-center gap-2 bg-transparent"
                                                variant="outline"
                                            >
                                                <Search />
                                            </Button>
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                                Search
                                            </div>
                                        </div>
                                    </form>

                                    <div className="relative group">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white"
                                            onClick={handleAddDocument}
                                        >
                                            <ListPlus className="w-4 h-4" />
                                        </Button>
                                        <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            Add a Document
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DynamicTable
                                passedData={documents}
                                columnRenderers={columnRenderers}
                                allColumns={allColumns}
                                is_paginated={isPaginated}
                                toggleShowAll={() => setShowAll(!showAll)}
                                showAll={showAll}
                                visibleColumns={allColumns.map(
                                    (col) => col.key
                                )} // always show all
                            />
                        </div>
                    </div>
                </div>
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    title="Add Document"
                >
                    <div className="w-full p-4 bg-gray-50 rounded-md">
                        <form
                            onSubmit={handleSubmitDocument}
                            className="space-y-6"
                        >
                            {/* Section Header */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Document Details
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Fill out the form below to upload a new
                                    document.
                                </p>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="file"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Upload File
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) =>
                                        setData(
                                            "file",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                    className="hidden"
                                />
                                <div
                                    onClick={handleDivClick}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.add(
                                            "border-blue-400",
                                            "bg-blue-50"
                                        );
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove(
                                            "border-blue-400",
                                            "bg-blue-50"
                                        );
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove(
                                            "border-blue-400",
                                            "bg-blue-50"
                                        );

                                        if (
                                            e.dataTransfer.files &&
                                            e.dataTransfer.files.length > 0
                                        ) {
                                            const file =
                                                e.dataTransfer.files[0];
                                            setData("file", file);

                                            if (fileInputRef.current) {
                                                fileInputRef.current.files =
                                                    e.dataTransfer.files;
                                            }

                                            e.dataTransfer.clearData();
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition ${
                                        data.file
                                            ? "border-blue-400 bg-blue-50"
                                            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                                    }`}
                                >
                                    {data.file ? (
                                        <>
                                            <FileCheck2 className="h-10 w-10 text-blue-500" />
                                            <p className="mt-2 text-sm text-gray-700">
                                                {data.file.name}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <FilePlus2 className="h-10 w-10 text-blue-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Click or drag & drop to upload
                                            </p>
                                        </>
                                    )}
                                </div>

                                {errors.file && (
                                    <p className="text-xs text-red-600">
                                        {errors.file}
                                    </p>
                                )}
                            </div>

                            {/* Document Name */}
                            <div className="flex justify-between gap-4">
                                <div className="space-y-2 w-full">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Document Name
                                    </label>
                                    <InputField
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., Barangay Clearance"
                                        className="w-full"
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 w-full">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Specific Purpose
                                    </label>
                                    <SelectField
                                        name="specific_purpose"
                                        value={data.specific_purpose || ""}
                                        onChange={(e) =>
                                            setData(
                                                "specific_purpose",
                                                e.target.value
                                            )
                                        }
                                        items={[
                                            {
                                                label: "Certification",
                                                value: "certification",
                                            },
                                            {
                                                label: "Blotter Report Form",
                                                value: "blotter",
                                            },
                                            {
                                                label: "Summon Report Form",
                                                value: "summon",
                                            },
                                            {
                                                label: "File to Action Form",
                                                value: "file_action",
                                            },
                                        ]}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Brief description of the document"
                                    rows={4}
                                    className="w-full text-gray-600"
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 rounded-lg text-gray-500 hover:text-black"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </SidebarModal>
                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    residentId={residentToDelete}
                />
            </div>
        </AdminLayout>
    );
}
