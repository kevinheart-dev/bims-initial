import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import BarangayInfrastucture from "./BarangayInfrastructure/BarangayInfrastucture";
import FacilityIndex from "./BarangayFacility/FacilityIndex";
import InstitutionIndex from "./BarangayInstitution/InstitutionIndex";
import ProjectIndex from "./BarangayProjects/ProjectIndex";
import RoadIndex from "./BarangayRoad/RoadIndex";
import { useQuery } from "@tanstack/react-query";
import useAppUrl from "@/hooks/useAppUrl";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";

const BarangayProfileMain = () => {
    const [activeTab, setActiveTab] = useState("infrastructure");
    const breadcrumbs = [{ label: "Barangay Profile", showOnMobile: false }];
    const APP_URL = useAppUrl();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["details"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_profile/barangaydetails`
            );
            return data.data; // only API data
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
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

    const barangayData = data; // directly use API data

    return (
        <AdminLayout>
            <Head title="Barangay Profile" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="bg-white min-h-screen p-2 m-2 rounded-sm">
                <div className="bg-[#fffff2] p-5 rounded-lg shadow-lg">
                    <div className="text-gray-800 text-base leading-relaxed">
                        <h2 className="text-4xl font-black font-montserrat bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text uppercase p-0 m-0">
                            {barangayData.barangay_name}
                        </h2>

                        <p className="text-lg p-0 m-0">
                            {barangayData.city}, {barangayData.province},{" "}
                            {barangayData.zip_code}
                        </p>
                        <div className="flex gap-6">
                            <p className="text-gray-700 p-0 m-0">
                                {barangayData.contact_number}
                            </p>
                            <p className="text-gray-700 p-0 m-0">
                                {barangayData.email}
                            </p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-gray-400 mt-4">
                        <div className="flex gap-6 text-sm font-medium flex-wrap">
                            {[
                                "infrastructure",
                                "institutions",
                                "facilities",
                                "projects",
                                "roads",
                                "officials",
                                "disaster",
                            ].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-1 border-b-2 ${
                                        activeTab === tab
                                            ? "border-blue-600 text-blue-700"
                                            : "border-transparent text-gray-500"
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() +
                                        tab.slice(1).replace(/([A-Z])/g, " $1")}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab content */}
                    <div className="mt-4">
                        {activeTab === "infrastructure" && (
                            <BarangayInfrastucture />
                        )}
                        {activeTab === "institutions" && <InstitutionIndex />}
                        {activeTab === "facilities" && <FacilityIndex />}
                        {activeTab === "projects" && <ProjectIndex />}
                        {activeTab === "roads" && <RoadIndex />}
                        {activeTab === "officials" && (
                            <p>Officials content goes here.</p>
                        )}
                        {activeTab === "disaster" && (
                            <p>Disaster content goes here.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BarangayProfileMain;
