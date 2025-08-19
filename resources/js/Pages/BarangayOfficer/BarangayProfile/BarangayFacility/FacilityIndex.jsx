import React, { useState, useEffect } from "react";
import DynamicTable from "@/Components/DynamicTable";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Eye, SquarePen, Trash2 } from "lucide-react";
import ActionMenu from "@/Components/ActionMenu";

const FacilityIndex = () => {
    const APP_URL = useAppUrl();


    const { data: facilities, isLoading, isError, error } = useQuery({
        queryKey: ["facilities"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_facility`
            );
            return data.facilities;
        },
        staleTime: 1000 * 60 * 5,
    });

    const allColumns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "facility_type", label: "Facilitiy Type" },
        { key: "quantity", label: "Quantity" },
        { key: "actions", label: "Actions" },
    ];

    const columnRenderers = {
        id: (row) => row.id,

        name: (row) => (
            <span className="font-medium text-gray-900">
                {row.name || "—"}
            </span>
        ),

        facility_type: (row) => (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium capitalize">
                {row.facility_type || "—"}
            </span>
        ),

        quantity: (row) => (
            <span className="text-sm text-gray-700">{row.quantity ?? "—"}</span>
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


    const defaultVisibleCols = allColumns.map((col) => col.key);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("facilities_visible_columns");
        return saved ? JSON.parse(saved) : defaultVisibleCols;
    });

    useEffect(() => {
        localStorage.setItem(
            "facilities_visible_columns",
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

    if (!facilities?.data?.length) {
        return <div>No facilities found</div>;
    }

    return (
        <div className="p-2 md:px-2 md:py-2">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                {/* <pre>{JSON.stringify(facilities, undefined, 3)}</pre> */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    <DynamicTable
                        passedData={facilities}
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

export default FacilityIndex;
