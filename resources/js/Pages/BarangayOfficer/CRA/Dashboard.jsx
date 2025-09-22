import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";

export default function Dashboard() {
    const breadcrumbs = [
        { label: "Community Risk Assessment (CRA)", showOnMobile: false },
    ];
    const APP_URL = useAppUrl();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["datacollection"],
        queryFn: async () => {
            const { data } = await axios.get(`${APP_URL}/cra/datacollection`);
            return data;
        },
        staleTime: 1000 * 60 * 5,
    });



    useEffect(() => {
        if (isLoading) {
            console.log("Fetching data...");
        }

        if (isError) {
            toast.error("Failed to fetch data!");
        }

        if (data) {
            console.log("API Data:", data);
            toast.success("Data loaded successfully!");
        }
    }, [isLoading, isError, data]);

    return (
        <AdminLayout>
            <Toaster richColors />
            <Head title="CRA" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-6">
                {isLoading && <p>Loading...</p>}
                {isError && <p className="text-red-500">Error loading data.</p>}
                {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
            </div>
        </AdminLayout>
    );
}
