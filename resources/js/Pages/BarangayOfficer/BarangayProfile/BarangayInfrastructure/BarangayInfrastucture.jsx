import React, { useState, useEffect } from 'react';
import DynamicTable from "@/Components/DynamicTable";
import DynamicTableControls from '@/Components/FilterButtons/DynamicTableControls';
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/Components/ui/skeleton";
const BarangayInfrastucture = ({ }) => {
    const APP_URL = useAppUrl();

    const {
        data: infrastructure,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["infrastructure"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_infrastructure`
            );
            return data.infrastructure; // return only what you need
        },
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

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

    if (!infrastructure?.data?.length) {
        return <div>No infrastructure found</div>;
    }

    // const allColumns = [
    //     { key: "id", label: "ID" },
    //     { key: "title", label: "Title" },
    //     { key: "description", label: "Description" },
    //     { key: "project_category", label: "Category" },
    //     { key: "budget", label: "Budget" },
    //     { key: "founding_source", label: "Source" },
    //     { key: "start_date", label: "Start" },
    //     { key: "end_date", label: "End" },
    //     { key: "actions", label: "Actions" },
    // ];
    return (
        <div className="p-2 md:p-4">
            <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 m-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 w-full mb-0">
                        <pre>{JSON.stringify(infrastructure, undefined, 3)}</pre>
                        {/* <div className="flex items-center gap-2 flex-wrap">
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
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarangayInfrastucture
