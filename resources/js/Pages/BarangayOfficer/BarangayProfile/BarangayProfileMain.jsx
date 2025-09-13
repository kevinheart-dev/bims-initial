import React, { useEffect, useState, Suspense, lazy } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { useQuery } from "@tanstack/react-query";
import useAppUrl from "@/hooks/useAppUrl";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton";
import { Toaster, toast } from "sonner";
import TableSkeleton from "@/Components/TableSkeleton";
import { Phone, Mail, MapPin } from 'lucide-react';
// Lazy load tab components
const BarangayInfrastucture = lazy(() =>
    import("./BarangayInfrastructure/BarangayInfrastucture")
);
const FacilityIndex = lazy(() => import("./BarangayFacility/FacilityIndex"));
const InstitutionIndex = lazy(() => import("./BarangayInstitution/InstitutionIndex"));
const ProjectIndex = lazy(() => import("./BarangayProjects/ProjectIndex"));
const RoadIndex = lazy(() => import("./BarangayRoad/RoadIndex"));
const InventoryIndex = lazy(() => import("./BarangayInventory/InventoryIndex"));
const BarangayOfficials = lazy(() => import("./BarangayOfficials/BarangayOfficials"));

const BarangayProfileMain = () => {
    const props = usePage().props;
    const success = props?.success ?? null;
    const tab = props?.activeTab ?? null;

    const [activeTab, setActiveTab] = useState(tab ?? "infrastructure");
    const breadcrumbs = [{ label: "Barangay Profile", showOnMobile: false }];
    const APP_URL = useAppUrl();

    // Fetch only barangay profile info (not all tab data)
    const { data, isLoading, isError } = useQuery({
        queryKey: ["barangayDetails"],
        queryFn: async () => {
            const { data } = await axios.get(
                `${APP_URL}/barangay_officer/barangay_profile/barangaydetails`
            );
            return data.data; // only API data
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        setActiveTab(tab ?? "infrastructure");
        if (success) {
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
    }, [success]);

    if (isLoading) {
        return (
            <div className="gap-2 space-y-4">
                <Skeleton className="h-[20px] w-[100px] rounded-full" />
                <Skeleton className="h-[10px] w-[100px] rounded-full" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-red-600">Failed to load barangay details.</p>;
    }

    const barangayData = data;

    return (
        <AdminLayout>
            <Head title="Barangay Profile" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <Toaster richColors />

            <div className="bg-white min-h-screen p-2 m-2 rounded-sm">
                <div className="bg-[#fffff2] p-5 rounded-lg shadow-lg">
                    {/* Header Info */}
                    <div className="text-gray-800 text-base leading-relaxed">
                        <h2 className="text-4xl font-black font-montserrat bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text uppercase p-0 m-0">
                            {barangayData.barangay_name}
                        </h2>
                        <p className="flex items-center gap-2 text-gray-700 text-lg p-0 m-0">
                            <MapPin className="w-5 h-5" />
                            <span>
                                {barangayData.city}, {barangayData.province},{" "}
                                {barangayData.zip_code}
                            </span>
                        </p>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-5 h-5" />
                                <span>{barangayData.contact_number}</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="w-5 h-5" />
                                <span>{barangayData.email}</span>
                            </div>
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
                                "inventories",
                                "roads",
                                "officials",
                                "disaster",
                            ].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 px-1 border-b-2 ${activeTab === tab
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

                    {/* Tab Content */}
                    <div className="mt-4">
                        <Suspense
                            fallback={
                                <div className="space-y-2">
                                    <Skeleton className="h-[20px] w-[200px]" />
                                    <Skeleton className="h-[20px] w-full" />
                                    <Skeleton className="h-[20px] w-2/3" />
                                </div>
                            }
                        >
                            {activeTab === "infrastructure" && (
                                <BarangayInfrastucture />
                            )}
                            {activeTab === "institutions" && <InstitutionIndex />}
                            {activeTab === "facilities" && <FacilityIndex />}
                            {activeTab === "projects" && <ProjectIndex />}
                            {activeTab === "inventories" && <InventoryIndex />}
                            {activeTab === "roads" && <RoadIndex />}
                            {activeTab === "officials" && <BarangayOfficials />}
                            {activeTab === "disaster" && (
                                <p>Disaster content goes here.</p>
                            )}
                        </Suspense>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BarangayProfileMain;
