import React from "react";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import { Skeleton } from "@/Components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

const InstitutionIndex = () => {
    const APP_URL = useAppUrl();

    const {
        data: institutions,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["institutions"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_institution`
            );
            return data.institutions; // return only what you need
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

    if (!institutions?.data?.length) {
        return <div>No institutions found</div>;
    }

    return (
        <div>
            <h1 className="text-xl font-bold">Barangay Institutions</h1>
            <ul>
                {institutions.data.map((institution) => (
                    <li key={institution.id}>
                        <strong>{institution.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InstitutionIndex;
