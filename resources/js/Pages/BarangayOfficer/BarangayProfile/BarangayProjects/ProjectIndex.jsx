import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Eye, Plus, RotateCcw, Search, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";
import DynamicTableControls from "@/Components/FilterButtons/DynamicTableControls";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import FilterToggle from "@/Components/FilterButtons/FillterToggle";
import { PROJECT_STATUS_CLASS, PROJECT_STATUS_TEXT } from "@/constants";
import SidebarModal from "@/Components/SidebarModal";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import DropdownInputField from "@/Components/DropdownInputField";
import { Textarea } from "@/Components/ui/textarea";
import SelectField from "@/Components/SelectField";
import {
    IoIosAddCircleOutline,
    IoIosArrowForward,
    IoIosCloseCircleOutline,
} from "react-icons/io";
import { Toaster, toast } from "sonner";
import DeleteConfirmationModal from "@/Components/DeleteConfirmationModal";
import InputLabel from "@/Components/InputLabel";

const ProjectIndex = () => {
    const APP_URL = useAppUrl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalState, setModalState] = useState("");
    const [projectDetails, setProjectDetails] = useState(null);
    const props = usePage().props;
    const Toasterror = props?.error ?? null;
    const [queryParams, setQueryParams] = useState({});
    const [query, setQuery] = useState(queryParams["name"] ?? "");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //delete
    const [projectToDelete, setProjectToDelete] = useState(null); //delete

    const {
        data: getData,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["projects", queryParams],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_project`,
                { params: queryParams }
            );
            return data; // should already include "institution"
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const projects = getData?.projects;
    const institutions = getData?.institutions;
    const categories = getData?.categories;

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
        { key: "image", label: "Project Image" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
        { key: "category", label: "Category" },
        { key: "responsible_institution", label: "Responsible Institution" },
        { key: "budget", label: "Budget" },
        { key: "funding_source", label: "Funding Source" },
        { key: "start_date", label: "Start Date" },
        { key: "end_date", label: "End Date" },
        { key: "actions", label: "Actions" },
    ];

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("projects_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    const hasActiveFilter = Object.entries(queryParams || {}).some(
        ([key, value]) =>
            [
                "project_status",
                "project_category",
                "responsible_inti",
                "start_date",
                "end_date",
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
            "projects_visible_columns",
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

            if (value && value.trim() !== "" && value !== "All") {
                updated[field] = value;
            } else {
                delete updated[field]; // remove filter if blank or "All"
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
        id: (row) => <span className="text-gray-600 text-sm">{row.id}</span>,
        image: (row) => (
            <img
                src={
                    row.project_image
                        ? `/storage/${row.project_image}`
                        : "/images/default-avatar.jpg"
                }
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-avatar.jpg";
                }}
                alt="Resident"
                className="w-16 h-16 min-w-16 min-h-16 object-cover rounded-sm border"
            />
        ),

        title: (row) => (
            <span className="font-semibold text-gray-900">
                {row.title || "—"}
            </span>
        ),

        description: (row) => (
            <span className="text-gray-700 text-sm">
                {row.description
                    ? row.description.length > 50
                        ? row.description.substring(0, 50) + "..."
                        : row.description
                    : "—"}
            </span>
        ),

        status: (row) => {
            const statusKey = row.status?.toLowerCase();
            return (
                <span
                    className={
                        PROJECT_STATUS_CLASS[statusKey] ||
                        "bg-gray-100 px-2 py-1 rounded-lg text-gray-800 text-xs"
                    }
                >
                    {PROJECT_STATUS_TEXT[statusKey] || row.status || "—"}
                </span>
            );
        },

        category: (row) => (
            <span className="text-gray-800 text-sm">{row.category || "—"}</span>
        ),

        responsible_institution: (row) => (
            <span className="text-gray-700">
                {row.responsible_institution || "—"}
            </span>
        ),

        budget: (row) => (
            <span className="font-medium text-indigo-700">
                {row.budget
                    ? `₱${parseFloat(row.budget).toLocaleString()}`
                    : "—"}
            </span>
        ),

        funding_source: (row) => (
            <span className="text-gray-600">{row.funding_source || "—"}</span>
        ),

        start_date: (row) => (
            <span className="text-gray-500 text-sm">
                {row.start_date || "—"}
            </span>
        ),

        end_date: (row) => (
            <span className="text-gray-500 text-sm">{row.end_date || "—"}</span>
        ),

        actions: (row) => (
            <ActionMenu
                actions={[
                    {
                        label: "View",
                        icon: <Eye className="w-4 h-4 text-indigo-600" />,
                        onClick: () => handleView(row.id),
                    },
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
    const handlePrint = () => {
        window.print();
    };

    // add
    const handleAddProject = () => {
        setModalState("add");
        setIsModalOpen(true);
    };
    const { data, setData, post, errors, reset, clearErrors } = useForm({
        projects: [[]],
        _method: undefined,
        project_id: null,
    });
    const addProject = () => {
        setData("projects", [...(data.projects || []), {}]);
    };
    const removeProject = (projectIdx) => {
        const updated = [...(data.projects || [])];
        updated.splice(projectIdx, 1);
        setData("projects", updated);
        toast.warning("Project removed.", {
            duration: 2000,
        });
    };
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalState("");
        setProjectDetails(null);
        setProjectToDelete(null);
        reset();
        clearErrors();
    };

    const handleProjectFieldChange = (value, projIdx, field) => {
        setData((prevData) => {
            const updated = [...prevData.projects];

            // if updating file input
            if (field === "project_image" && value instanceof File) {
                updated[projIdx] = {
                    ...updated[projIdx],
                    project_image: value, // store file for submission
                    previewImage: URL.createObjectURL(value), // generate preview URL
                };
            } else {
                // for other fields or preview assignment
                updated[projIdx] = {
                    ...updated[projIdx],
                    [field]: value,
                };
            }

            return { ...prevData, projects: updated };
        });
    };

    const handleSubmitProject = (e) => {
        e.preventDefault();
        post(route("barangay_project.store"), {
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
                `${APP_URL}/barangay_officer/barangay_project/details/${id}`
            );

            const project = response.data.project;
            console.log(project);

            setProjectDetails(project); // store for modal display if needed

            setData({
                projects: [
                    {
                        title: project.title || "",
                        description: project.description || "",
                        project_image: project.project_image || null, // keep original DB filename
                        previewImage: null, // no preview yet
                        status: project.status || "planning",
                        category: project.category || "",
                        responsible_institution:
                            project.responsible_institution || "",
                        budget: project.budget || 0,
                        funding_source: project.funding_source || "",
                        start_date: project.start_date || "",
                        end_date: project.end_date || "",
                    },
                ],
                _method: "PUT",
                project_id: project.id,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching project details:", error);
        }
    };
    const handleUpdateProject = (e) => {
        e.preventDefault();
        post(route("barangay_project.update", data.project_id), {
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
        setProjectToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("barangay_project.destroy", projectToDelete), {
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
                {/* <pre>{JSON.stringify(projects, undefined, 3)}</pre> */}
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
                                placeholder="Search title or description "
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
                                onClick={handleAddProject}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1.5 rounded-md bg-blue-700 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                Add a Project
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
                                "project_status",
                                "project_category",
                                "responsible_inti",
                                "start_date",
                                "end_date",
                            ]}
                            showFilters={true}
                            categories={categories}
                            institutions={institutions}
                            setQueryParams={setQueryParams}
                            setQuery={setQuery}
                            clearRouteAxios={true}
                        />
                    )}
                    <DynamicTable
                        passedData={projects}
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
                title={modalState == "add" ? "Add Project" : "Edit Project"}
            >
                <form
                    className="bg-gray-50 p-4 rounded-lg"
                    onSubmit={
                        projectDetails
                            ? handleUpdateProject
                            : handleSubmitProject
                    }
                >
                    <h3 className="text-2xl font-medium text-gray-700">
                        Barangay Development Projects
                    </h3>
                    <p className="text-sm text-gray-500 mb-8">
                        Please provide details about barangay projects, their
                        status, funding, and responsible institutions.
                    </p>

                    {Array.isArray(data.projects) &&
                        data.projects.map((project, projIdx) => (
                            <div
                                key={projIdx}
                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-6 mb-6 gap-4">
                                    {/* Title */}
                                    <div className="md:col-span-2 flex flex-col items-center space-y-2">
                                        <InputLabel
                                            htmlFor={`facility_image_${projIdx}`}
                                            value="Facility Photo"
                                        />

                                        <img
                                            src={
                                                project.previewImage
                                                    ? project.previewImage // If user selected new file (preview)
                                                    : project.project_image
                                                    ? `/storage/${project.project_image}` // If existing image in DB
                                                    : "/images/default-avatar.jpg" // Fallback placeholder
                                            }
                                            alt="Facility Image"
                                            className="w-32 h-32 object-cover rounded-sm border border-gray-200"
                                        />

                                        <input
                                            id={`facility_image_${projIdx}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    handleProjectFieldChange(
                                                        file,
                                                        projIdx,
                                                        "project_image"
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
                                                    `projects.${projIdx}.project_image`
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-4">
                                        <div className="md:col-span-3">
                                            <InputField
                                                label="Project Title"
                                                name="title"
                                                value={project.title || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "title"
                                                    )
                                                }
                                                placeholder="e.g. Barangay Health Center Construction"
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.title`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="md:col-span-3">
                                            <DropdownInputField
                                                label="Category"
                                                name="category"
                                                value={project.category || ""}
                                                onChange={(e) =>
                                                    handleProjectFieldChange(
                                                        e.target.value,
                                                        projIdx,
                                                        "category"
                                                    )
                                                }
                                                placeholder="Select category"
                                                items={[
                                                    {
                                                        label: "Infrastructure",
                                                        value: "infrastructure",
                                                    },
                                                    {
                                                        label: "Health",
                                                        value: "health",
                                                    },
                                                    {
                                                        label: "Education",
                                                        value: "education",
                                                    },
                                                    {
                                                        label: "Livelihood",
                                                        value: "livelihood",
                                                    },
                                                    {
                                                        label: "Others",
                                                        value: "others",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `projects.${projIdx}.category`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                    {/* Description */}
                                    <div className="md:col-span-6">
                                        <Textarea
                                            label="Description"
                                            name="description"
                                            value={project.description || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "description"
                                                )
                                            }
                                            className={"text-gray-600"}
                                            placeholder="Brief description of the project..."
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.description`
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
                                            value={project.status || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "status"
                                                )
                                            }
                                            items={[
                                                {
                                                    label: "Planning",
                                                    value: "planning",
                                                },
                                                {
                                                    label: "Ongoing",
                                                    value: "ongoing",
                                                },
                                                {
                                                    label: "Completed",
                                                    value: "completed",
                                                },
                                                {
                                                    label: "Cancelled",
                                                    value: "cancelled",
                                                },
                                            ]}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.status`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Responsible Institution */}
                                    <div className="md:col-span-4">
                                        <DropdownInputField
                                            label="Responsible Institution"
                                            name="responsible_institution"
                                            value={
                                                project.responsible_institution ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "responsible_institution"
                                                )
                                            }
                                            placeholder="Enter institution"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.responsible_institution`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Budget */}
                                    <div className="md:col-span-2">
                                        <InputField
                                            type="number"
                                            step="0.01"
                                            label="Budget (₱)"
                                            name="budget"
                                            value={project.budget || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "budget"
                                                )
                                            }
                                            placeholder="e.g. 500000"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.budget`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Funding Source */}
                                    <div className="md:col-span-4">
                                        <InputField
                                            label="Funding Source"
                                            name="funding_source"
                                            value={project.funding_source || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "funding_source"
                                                )
                                            }
                                            placeholder="e.g. LGU, NGO, National Government"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.funding_source`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Start Date */}
                                    <div className="md:col-span-3">
                                        <InputField
                                            type="date"
                                            label="Start Date"
                                            name="start_date"
                                            value={project.start_date || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "start_date"
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.start_date`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* End Date */}
                                    <div className="md:col-span-3">
                                        <InputField
                                            type="date"
                                            label="End Date"
                                            name="end_date"
                                            value={project.end_date || ""}
                                            onChange={(e) =>
                                                handleProjectFieldChange(
                                                    e.target.value,
                                                    projIdx,
                                                    "end_date"
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `projects.${projIdx}.end_date`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Remove button */}
                                {projectDetails === null && (
                                    <button
                                        type="button"
                                        onClick={() => removeProject(projIdx)}
                                        className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                    >
                                        <IoIosCloseCircleOutline className="text-2xl" />
                                    </button>
                                )}
                            </div>
                        ))}

                    <div className="flex justify-between items-center p-3">
                        {projectDetails === null ? (
                            <button
                                type="button"
                                onClick={addProject}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                            >
                                <IoIosAddCircleOutline className="text-2xl" />
                                <span>Add Project</span>
                            </button>
                        ) : (
                            <div></div>
                        )}

                        <div className="flex justify-end items-center text-end mt-5 gap-4">
                            {projectDetails == null && (
                                <Button type="button" onClick={() => reset()}>
                                    <RotateCcw /> Reset
                                </Button>
                            )}

                            <Button
                                className="bg-blue-700 hover:bg-blue-400"
                                type={"submit"}
                            >
                                {projectDetails ? "Update" : "Add"}{" "}
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
                residentId={projectToDelete}
            />
        </div>
    );
};

export default ProjectIndex;
