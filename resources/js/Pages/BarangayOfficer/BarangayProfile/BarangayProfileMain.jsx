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
            return data.data;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    // fallback static data
    const fallbackBarangayData = {
        barangay_name: "San Isidro",
        city: "City of Ilagan",
        province: "Isabela",
        zip_code: 3300,
        contact_number: "(+63) 912 345 6789",
        email: "sanisidro@example.com",
        founded_year: "1998",
        logo_path: "/images/csa-logo.png",
    };

    // pick API data if available, else fallback
    const barangayData = data ?? fallbackBarangayData;

    return (
        <AdminLayout>
            <Head title="Barangay Profile" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="bg-white min-h-screen p-2 m-2 rounded-sm">
                {/* <pre>{JSON.stringify(projects, undefined, 3)}</pre> */}
                <div className="bg-[#fffff2] p-5 rounded-lg shadow-lg">
                    <div className="text-gray-800 text-base leading-relaxed">
                        <h2 className="text-4xl font-black font-montserrat bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text uppercase p-0 m-0">
                            {barangayData.barangay_name}
                        </h2>

                        <p className="text-lg p-0 m-0">
                            {barangayData.city}
                            {", "} {barangayData.province}
                            {", "}
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
                            <button
                                onClick={() => setActiveTab("infrastructure")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "infrastructure"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Infrastructure
                            </button>
                            <button
                                onClick={() => setActiveTab("institutions")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "institutions"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Institutions
                            </button>
                            <button
                                onClick={() => setActiveTab("facilities")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "facilities"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Facilities
                            </button>
                            <button
                                onClick={() => setActiveTab("projects")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "projects"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Projects
                            </button>
                            <button
                                onClick={() => setActiveTab("roads")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "roads"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Roads
                            </button>
                            <button
                                onClick={() => setActiveTab("officials")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "officials"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Officials
                            </button>
                            <button
                                onClick={() => setActiveTab("disaster")}
                                className={`py-2 px-1 border-b-2 ${
                                    activeTab === "disaster"
                                        ? "border-blue-600 text-blue-700"
                                        : "border-transparent text-gray-500"
                                }`}
                            >
                                Disaster Risk Areas
                            </button>
                        </div>
                    </div>

                    {/* Tab content placeholder */}
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
