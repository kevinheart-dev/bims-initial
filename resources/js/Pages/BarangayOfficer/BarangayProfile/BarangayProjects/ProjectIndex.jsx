import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";

const ProjectIndex = () => {
    const APP_URL = useAppUrl();
    const [isPaginated, setIsPaginated] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const {
        data: projects,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_project`
            );
            return data.projects; // should already include "institution"
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title" },
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

    const columnRenderers = {
        id: (row) => row.id,

        title: (row) => (
            <span className="font-medium text-gray-900">
                {row.title || "—"}
            </span>
        ),
        description: (row) => (
            <span>
                {row.description
                    ? row.description.length > 10
                        ? row.description.substring(0, 50) + "..."
                        : row.description
                    : "—"}
            </span>
        ),
        status: (row) => <span>{row.status || "—"}</span>,

        category: (row) => <span>{row.category || "—"}</span>,

        responsible_institution: (row) => (
            <span>{row.institution?.name || "—"}</span>
        ),

        budget: (row) => <span>{row.budget || "—"}</span>,

        funding_source: (row) => <span>{row.funding_source || "—"}</span>,

        start_date: (row) => <span>{row.start_date || "—"}</span>,

        end_date: (row) => <span>{row.end_date || "—"}</span>,

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

    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("projects_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "projects_visible_columns",
            JSON.stringify(visibleColumns)
        );
    }, [visibleColumns]);

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

    if (!projects?.data?.length) {
        return <div>No projects found</div>;
    }

    return (
        <div className="p-2 md:px-2 md:py-2">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                {/* <pre>{JSON.stringify(projects, undefined, 3)}</pre> */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    <DynamicTable
                        passedData={projects}
                        allColumns={allColumns}
                        columnRenderers={columnRenderers}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectIndex;
