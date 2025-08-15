import React from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const RoadIndex = () => {
    const APP_URL = useAppUrl();

    const {
        data: roads,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["roads"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_road`
            );
            return data.roads; // return only what you need
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

    if (!roads?.data?.length) {
        return <div>No roads found</div>;
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Barangay Roads</h1>
            <ul>
                {roads.data.map((road) => (
                    <li key={road.id}>
                        <strong>{road.road_type}</strong> ---
                        <strong>{road.length}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoadIndex;
