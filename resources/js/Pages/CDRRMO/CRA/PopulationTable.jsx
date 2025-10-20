import { useState } from "react";
import { Users, Cross, Activity, Home, Key, VenusAndMars } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import TableSection from "@/Components/TableSection";
import DynamicTable from "@/Components/DynamicTable";
import NoDataPlaceholder from "@/Components/NoDataPlaceholder";
import SelectField from "@/Components/SelectField";
import BarangayFilterCard from "@/Components/BarangayFilterCard";

export default function Dashboard({
    populationData,
    genderData,
    ageDistributionData,
    houseBuildData,
    houseOwnershipData,
    queryParams,
    barangays = [],
    selectedBarangay,
}) {
    const breadcrumbs = [{ label: "Dashboard", showOnMobile: true }];
    queryParams = queryParams || {};

    const allcol1 = [
        { key: "id", label: "No." },
        { key: "name", label: "Barangay Name" },
        { key: "total_population", label: "Total Population" },
        { key: "total_households", label: "Total Households" },
        { key: "total_families", label: "Total Families" },
    ];
    const [viscol1] = useState(allcol1.map((col) => col.key));
    const colrender1 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number}
            </span>
        ),
        name: (row) => (
            <span className="font-medium text-gray-800">
                {row.barangay_name || "—"}
            </span>
        ),
        total_population: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_population?.toLocaleString() ?? "0"}
            </span>
        ),
        total_households: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_households?.toLocaleString() ?? "0"}
            </span>
        ),
        total_families: (row) => (
            <span className="text-gray-700 font-semibold">
                {row.total_families?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const allcol2 = [
        { key: "id", label: "No." },
        { key: "name", label: "Barangay Name" },
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "lgbtq", label: "LGBTQ" },
        { key: "total", label: "Total Population" },
    ];
    const [viscol2] = useState(allcol2.map((col) => col.key));
    const colrender2 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number ?? "—"}
            </span>
        ),
        name: (row) => (
            <span
                className={`font-medium ${row.barangay_name === "Total"
                    ? "text-blue-700 font-bold"
                    : "text-gray-800"
                    }`}
            >
                {row.barangay_name || "—"}
            </span>
        ),
        male: (row) => {
            const male = row.genders?.find(
                (g) => g.gender.toLowerCase() === "male"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {male?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },
        female: (row) => {
            const female = row.genders?.find(
                (g) => g.gender.toLowerCase() === "female"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {female?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },
        lgbtq: (row) => {
            const lgbtq = row.genders?.find((g) =>
                g.gender.toLowerCase().includes("lgbtq")
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {lgbtq?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },
        total: (row) => (
            <span className="text-sm font-semibold text-blue-600">
                {row.total?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const allcol3 = [
        { key: "id", label: "No." },
        { key: "name", label: "Barangay Name" },
        { key: "0_6_mos", label: "0-6 Months" },
        { key: "7_mos_to_2_yrs", label: "7 Months - 2 Years" },
        { key: "3_to_5_yrs", label: "3-5 Years" },
        { key: "6_to_12_yrs", label: "6-12 Years" },
        { key: "13_to_17_yrs", label: "13-17 Years" },
        { key: "18_to_59_yrs", label: "18-59 Years" },
        { key: "60_plus_yrs", label: "60+ Years" },
        { key: "total", label: "Total Population" },
    ];
    const [viscol3] = useState(allcol3.map((col) => col.key));
    // ✅ Column renderers
    const colrender3 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number ?? "—"}
            </span>
        ),

        name: (row) => (
            <span
                className={`font-medium ${row.barangay_name === "Total"
                    ? "text-blue-700 font-bold"
                    : "text-gray-800"
                    }`}
            >
                {row.barangay_name || "—"}
            </span>
        ),

        // Helper to extract values by age group
        getAgeGroupTotal: (row, key) => {
            const group = row.age_groups?.find((g) => g.age_group === key);
            return group?.total ?? 0;
        },

        "0_6_mos": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3.getAgeGroupTotal(row, "0_6_mos").toLocaleString()}
            </span>
        ),
        "7_mos_to_2_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "7_mos_to_2_yrs")
                    .toLocaleString()}
            </span>
        ),
        "3_to_5_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "3_to_5_yrs")
                    .toLocaleString()}
            </span>
        ),
        "6_to_12_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "6_to_12_yrs")
                    .toLocaleString()}
            </span>
        ),
        "13_to_17_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "13_to_17_yrs")
                    .toLocaleString()}
            </span>
        ),
        "18_to_59_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "18_to_59_yrs")
                    .toLocaleString()}
            </span>
        ),
        "60_plus_yrs": (row) => (
            <span className="text-gray-700 font-semibold">
                {colrender3
                    .getAgeGroupTotal(row, "60_plus_yrs")
                    .toLocaleString()}
            </span>
        ),

        total: (row) => (
            <span className="text-sm font-semibold text-blue-600">
                {row.total?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const allcol4 = [
        { key: "id", label: "No." },
        { key: "barangay", label: "Barangay Name" },
        { key: "concrete", label: "Concrete" },
        { key: "semi_concrete", label: "Semi-Concrete" },
        { key: "wood_light", label: "Made of Wood & Light Materials" },
        { key: "makeshift", label: "Salvaged / Makeshift" },
        { key: "total", label: "Total Houses" },
    ];
    const [viscol4] = useState(allcol4.map((col) => col.key));
    const colrender4 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number ?? "—"}
            </span>
        ),

        barangay: (row) => (
            <span
                className={`font-medium ${row.barangay_name === "Total"
                    ? "text-blue-700 font-bold"
                    : "text-gray-800"
                    }`}
            >
                {row.barangay_name || "—"}
            </span>
        ),

        // === Concrete ===
        concrete: (row) => {
            const data = row.house_types?.find(
                (h) => h.house_type.toLowerCase() === "concrete"
            );
            return (
                <div className="text-gray-700 text-sm leading-tight">
                    <div>
                        1F:{" "}
                        <span className="font-semibold">
                            {data?.one_floor?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div>
                        2F+:{" "}
                        <span className="font-semibold">
                            {data?.two_or_more_floors?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div className="text-blue-600 font-bold mt-1">
                        Total: {data?.total?.toLocaleString() ?? "0"}
                    </div>
                </div>
            );
        },

        // === Semi-Concrete ===
        semi_concrete: (row) => {
            const data = row.house_types?.find(
                (h) => h.house_type.toLowerCase() === "semi-concrete"
            );
            return (
                <div className="text-gray-700 text-sm leading-tight">
                    <div>
                        1F:{" "}
                        <span className="font-semibold">
                            {data?.one_floor?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div>
                        2F+:{" "}
                        <span className="font-semibold">
                            {data?.two_or_more_floors?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div className="text-blue-600 font-bold mt-1">
                        Total: {data?.total?.toLocaleString() ?? "0"}
                    </div>
                </div>
            );
        },

        // === Wood and Light Materials ===
        wood_light: (row) => {
            const data = row.house_types?.find((h) =>
                h.house_type.toLowerCase().includes("wood")
            );
            return (
                <div className="text-gray-700 text-sm leading-tight">
                    <div>
                        1F:{" "}
                        <span className="font-semibold">
                            {data?.one_floor?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div>
                        2F+:{" "}
                        <span className="font-semibold">
                            {data?.two_or_more_floors?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div className="text-blue-600 font-bold mt-1">
                        Total: {data?.total?.toLocaleString() ?? "0"}
                    </div>
                </div>
            );
        },

        // === Makeshift ===
        makeshift: (row) => {
            const data = row.house_types?.find((h) =>
                h.house_type.toLowerCase().includes("makeshift")
            );
            return (
                <div className="text-gray-700 text-sm leading-tight">
                    <div>
                        1F:{" "}
                        <span className="font-semibold">
                            {data?.one_floor?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div>
                        2F+:{" "}
                        <span className="font-semibold">
                            {data?.two_or_more_floors?.toLocaleString() ?? "0"}
                        </span>
                    </div>
                    <div className="text-blue-600 font-bold mt-1">
                        Total: {data?.total?.toLocaleString() ?? "0"}
                    </div>
                </div>
            );
        },

        // === Overall Total ===
        total: (row) => (
            <span
                className={`text-sm font-semibold ${row.barangay_name === "Total"
                    ? "text-blue-600"
                    : "text-blue-500"
                    }`}
            >
                {row.total?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const allcol5 = [
        { key: "id", label: "No." },
        { key: "barangay", label: "Barangay Name" },
        { key: "owned_house", label: "Owned (House)" },
        { key: "owned_land_house", label: "Owned (Land & House)" },
        { key: "rented", label: "Rented" },
        { key: "shared_owner", label: "Shared with Owner" },
        { key: "shared_renter", label: "Shared with Renter" },
        { key: "informal_settler", label: "Informal Settler Families" },
        { key: "total", label: "Total Households" },
    ];
    const [viscol5] = useState(allcol5.map((col) => col.key));
    const colrender5 = {
        id: (row) => (
            <span className="text-xs font-semibold text-gray-500">
                {row.number ?? "—"}
            </span>
        ),

        barangay: (row) => (
            <span
                className={`font-medium ${row.barangay_name === "Total"
                    ? "text-blue-700 font-bold"
                    : "text-gray-800"
                    }`}
            >
                {row.barangay_name || "—"}
            </span>
        ),

        owned_house: (row) => {
            const owned = row.ownerships?.find(
                (o) => o.ownership_type.toLowerCase() === "owned (house)"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {owned?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        owned_land_house: (row) => {
            const ownedLand = row.ownerships?.find(
                (o) =>
                    o.ownership_type.toLowerCase() === "owned (land and house)"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {ownedLand?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        rented: (row) => {
            const rented = row.ownerships?.find(
                (o) => o.ownership_type.toLowerCase() === "rented"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {rented?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        shared_owner: (row) => {
            const sharedOwner = row.ownerships?.find(
                (o) => o.ownership_type.toLowerCase() === "shared with owner"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {sharedOwner?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        shared_renter: (row) => {
            const sharedRenter = row.ownerships?.find(
                (o) => o.ownership_type.toLowerCase() === "shared with renter"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {sharedRenter?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        informal_settler: (row) => {
            const informal = row.ownerships?.find(
                (o) =>
                    o.ownership_type.toLowerCase() ===
                    "informal settler families"
            );
            return (
                <span className="text-gray-700 font-semibold">
                    {informal?.quantity?.toLocaleString() ?? "0"}
                </span>
            );
        },

        total: (row) => (
            <span
                className={`text-sm font-semibold ${row.barangay_name === "Total"
                    ? "text-blue-600"
                    : "text-blue-500"
                    }`}
            >
                {row.total?.toLocaleString() ?? "0"}
            </span>
        ),
    };

    const isDataNull =
        !populationData?.length ||
        !genderData?.length ||
        !ageDistributionData?.length ||
        !houseBuildData?.length ||
        !houseOwnershipData?.length;

    const handleBarangayChange = (e) => {
        const barangayId = e.target.value;

        // If "All" is selected, don't send the parameter
        router.get(
            route("cdrrmo_admin.population"),
            barangayId ? { barangay_id: barangayId } : {}
        );
    };

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="pt-8 pb-2 min-h-screen bg-gray-50">
                <div className="mx-auto w-full">
                    {isDataNull ? (
                        <NoDataPlaceholder tip="Use the year selector above to navigate to a year with available data." />
                    ) : (
                        <>
                            <BarangayFilterCard
                                selectedBarangay={selectedBarangay}
                                handleBarangayChange={handleBarangayChange}
                                barangays={barangays}
                            />
                            {/* <pre>
                                {JSON.stringify(
                                    houseOwnershipData,
                                    undefined,
                                    2
                                )}
                            </pre> */}
                            <TableSection
                                icon={<Users />}
                                color="blue"
                                title="General Population Overview"
                                description="Displays summarized data of total population, households, and families across all barangays. The table below provides a clear overview for monitoring and analysis purposes."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: populationData,
                                    allColumns: allcol1,
                                    columnRenderers: colrender1,
                                    queryParams,
                                    visibleColumns: viscol1,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />

                            <TableSection
                                icon={<VenusAndMars />}
                                color="pink"
                                title="Population by Gender"
                                description="Displays the total number of residents categorized by gender for each barangay. This overview helps analyze demographic distribution within the community."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: genderData,
                                    allColumns: allcol2,
                                    columnRenderers: colrender2,
                                    queryParams,
                                    visibleColumns: viscol2,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />

                            <TableSection
                                icon={<Users />} // You can change this to a more fitting icon like <BarChart /> or <PieChart /> if available
                                color="green"
                                title="Population by Age Group"
                                description="Displays the total population segmented by age group for each barangay. This helps identify age demographics and support age-specific community programs."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: ageDistributionData,
                                    allColumns: allcol3,
                                    columnRenderers: colrender3,
                                    queryParams,
                                    visibleColumns: viscol3,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />

                            <TableSection
                                icon={<Home />}
                                color="red"
                                title="Housing Structure Distribution"
                                description="Displays the total number of houses categorized by building material and floor levels for each barangay. This data helps assess housing durability and structural safety in the community."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: houseBuildData,
                                    allColumns: allcol4,
                                    columnRenderers: colrender4,
                                    queryParams,
                                    visibleColumns: viscol4,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />

                            <TableSection
                                icon={<Key />} // 🗝️ Represents house ownership; you can replace with <Home /> or <Building /> if preferred
                                color="green"
                                title="House Ownership Distribution"
                                description="Displays the distribution of house ownership types across each barangay. This data helps analyze housing tenure patterns and identify informal settlements within the community."
                                tableProps={{
                                    component: DynamicTable,
                                    passedData: houseOwnershipData,
                                    allColumns: allcol5,
                                    columnRenderers: colrender5,
                                    queryParams,
                                    visibleColumns: viscol5,
                                    showTotal: true,
                                    tableHeight: "500px",
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
