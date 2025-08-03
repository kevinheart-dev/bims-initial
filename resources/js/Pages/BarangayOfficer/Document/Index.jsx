import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileCheck2,
    FilePlus2,
    FileUp,
    Search,
    SquarePen,
    SquarePlus,
    Trash2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import DynamicTable from "@/Components/DynamicTable";
import ActionMenu from "@/Components/ActionMenu";
import SidebarModal from "@/Components/SidebarModal";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";

export default function Index({ documents, success = null, queryParams }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        { label: "Documents", showOnMobile: true },
    ];
    queryParams = queryParams || {};
    const APP_URL = useAppUrl();

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
        { key: "created_at", label: "Date Added" },
        { key: "actions", label: "Actions" },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResident, setSelectedResident] = useState(null);

    const handleView = async (resident) => {
        try {
            const response = await axios.get(
                `${APP_URL}/barangay_officer/resident/showresident/${resident}`
            );
            setSelectedResident(response.data.resident);
        } catch (error) {
            console.error("Error fetching placeholders:", error);
        }
        setIsModalOpen(true);
    };
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("document_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });
    useEffect(() => {
        localStorage.setItem(
            "document_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

    const columnRenderers = {
        id: (row) => row.id,
        name: (row) => row.name,
        created_at: (row) => new Date(row.created_at).toLocaleDateString(),
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
                        onClick: () => handleDelete(row.id),
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
            onError: () => {
                toast.error("Failed to add document", {
                    description: "Please check the form for errors.",
                    duration: 3000,
                    className: "bg-red-100 text-red-800",
                });
                console.error("Validation Errors:", errors);
            },
        });
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                className: "bg-green-100 text-green-800",
            });
        }
    }, [success]);

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
                            <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                                <h2 className="text-lg font-semibold">
                                    List of Documents
                                </h2>

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
                                            onClick={handleAddDocument}
                                        >
                                            <SquarePlus className="w-4 h-4" />
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
                                visibleColumns={visibleColumns}
                                setVisibleColumns={setVisibleColumns}
                            />
                        </div>
                    </div>
                </div>
                <SidebarModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        handleModalClose();
                    }}
                    title={"Add Document"}
                >
                    <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
                        <form onSubmit={handleSubmitDocument}>
                            <h3 className="text-xl font-medium text-gray-700 mb-8">
                                Document Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                                <div className="md:row-span-2 md:col-span-2 flex flex-col space-y-2">
                                    <label
                                        htmlFor="file"
                                        className="text-sm font-medium"
                                    >
                                        File
                                    </label>

                                    <input
                                        id="file"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            setData(
                                                "file",
                                                e.target.files?.[0] || null
                                            );
                                        }}
                                        className="w-full text-sm hidden"
                                    />
                                    <div
                                        className={`flex items-center justify-center h-full border-2 border-blue-300 border-dashed rounded-md cursor-pointer${
                                            data.file
                                                ? " bg-blue-300"
                                                : " bg-gray-50"
                                        }`}
                                        onClick={handleDivClick}
                                        type="button"
                                    >
                                        <div className="flex flex-col items-center">
                                            {data.file ? (
                                                <FileCheck2 className="h-10 w-10 text-blue-500" />
                                            ) : (
                                                <FilePlus2 className="h-10 w-10 text-blue-500" />
                                            )}
                                            <p className="text-lg text-gray-600 mt-1 block">
                                                {data.file
                                                    ? data.file.name
                                                    : "No file selected"}
                                            </p>
                                        </div>
                                    </div>
                                    {/* {data.file && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Selected: {data.file.name}
                                        </p>
                                    )} */}
                                    {errors.file && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.file}
                                        </p>
                                    )}
                                </div>

                                {/* Name & Description */}
                                <div className="md:col-span-4 flex flex-col space-y-4">
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium"
                                        >
                                            Name
                                        </label>
                                        <InputField
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Document Name"
                                            className="mt-1 w-full"
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium"
                                        >
                                            Description
                                        </label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter description"
                                            rows={4}
                                            className="mt-1 w-full border border-gray-400 rounded-md shadow-sm "
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end items-center gap-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-700 hover:bg-blue-400"
                                >
                                    {processing ? "Submitting..." : "Submit"}
                                </Button>
                                {/* <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        reset("name", "description", "file")
                                    }
                                >
                                    Reset
                                </Button> */}
                            </div>
                        </form>
                    </div>
                </SidebarModal>
            </div>
        </AdminLayout>
    );
}
