import React, { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
} from "recharts";

const COLORS_GENDER = [
    "#3B82F6", // Blue - Male
    "#F472B6", // Pink - Female
    "#10B981",
];

const COLORS_WELFARE = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
];

const COLORS_PUROK = ["#1E40AF"];
const COLORS_VOTERS = ["#2563EB", "#60A5FA"];
const COLORS_EMPLOYMENT = ["#06b6d4", "#f43f5e", "#a855f7", "#facc15", "#10b981", "#9ca3af"]
const COLORS_AGE = [
    "#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"
];
const COLORS_CIVIL = ["#06b6d4", "#f43f5e", "#a855f7", "#facc15", "#10b981", "#fb923c"]

const AGE_GROUPS = [
    { label: "0-6m", min: 0, max: 0.5 },
    { label: "7m-2y", min: 0.5, max: 2 },
    { label: "3-5y", min: 2, max: 6 },
    { label: "6-12y", min: 6, max: 13 },
    { label: "13-17y", min: 13, max: 18 },
    { label: "18-59y", min: 18, max: 60 },
    { label: "60+y", min: 60, max: Infinity },
];

const ChartSkeleton = React.memo(({ height }) => (
    <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="w-full" style={{ height }}>
            <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
        </div>
    </div>
));

const getAge = (birthdate) => {
    if (!birthdate) return null;
    const birthDateObj = new Date(birthdate);
    if (isNaN(birthDateObj.getTime())) return null;
    const now = new Date();
    return (now - birthDateObj) / 31557600000; // Milliseconds in a year
};

const getAgeGroup = (age) => {
    if (age === null) return null;
    return AGE_GROUPS.find(g => age >= g.min && age < g.max)?.label || null;
};


// Add welfareFilters prop here
const ResidentCharts = ({ residents, isLoading, welfareFilters = [] }) => {

    // 1. Memoize residentArray first
    const residentArray = useMemo(() => Array.isArray(residents) ? residents : residents?.data || [], [residents]);

    // 2. Memoize all derived data calculations. These MUST be called regardless of isLoading or residentArray.length.
    const { genderData, totalGender } = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            let g = (r.gender || "Unknown").toLowerCase().trim();
            g = (g === "male" || g === "m") ? "Male" : (g === "female" || g === "f") ? "Female" : "LGBTQ";
            acc[g] = (acc[g] || 0) + 1;
            return acc;
        }, { Male: 0, Female: 0, LGBTQ: 0 });
        const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
        const total = data.reduce((sum, item) => sum + item.value, 0);
        return { genderData: data, totalGender: total };
    }, [residentArray]);

    const { welfareData, totalWelfare } = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            // Count independently
            if (r.is_pwd) acc.PWD++;
            if (r.is4ps) acc.FourPs++;
            if (r.isSoloParent) acc.SoloParent++;
            return acc;
        }, { PWD: 0, FourPs: 0, SoloParent: 0 });

        let data = [];
        const allWelfareCategories = ["PWD", "FourPs", "SoloParent"];

        // Determine which categories to display
        const categoriesToDisplay = welfareFilters.length > 0 ? welfareFilters : allWelfareCategories;

        if (categoriesToDisplay.includes("PWD")) {
            data.push({ name: "PWD", value: counts.PWD });
        }
        if (categoriesToDisplay.includes("FourPs")) {
            data.push({ name: "FourPs", value: counts.FourPs });
        }
        if (categoriesToDisplay.includes("SoloParent")) {
            data.push({ name: "SoloParent", value: counts.SoloParent });
        }

        // Filter out categories with 0 values only if they are not explicitly selected
        // Or if all are shown by default and a category has 0 value
        // Also, ensure categories with 0 value are displayed if they are part of `categoriesToDisplay`
        data = data.filter(item => item.value > 0 || categoriesToDisplay.includes(item.name));

        const total = data.reduce((sum, item) => sum + item.value, 0);
        return { welfareData: data, totalWelfare: total };
    }, [residentArray, welfareFilters]);

    const purokData = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            const p = r.purok_number || "Unknown";
            acc[p] = (acc[p] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [residentArray]);

    const voterData = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            const p = r.purok_number || "Unknown";
            if (!acc[p]) acc[p] = { registered: 0, unregistered: 0 };
            acc[p][r.registered_voter === 1 ? 'registered' : 'unregistered'] += 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, counts]) => ({ name, ...counts }));
    }, [residentArray]);

    const civilData = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            const status = (r.civil_status || "Unknown").toLowerCase().trim();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([key, value]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value,
        }));
    }, [residentArray]);

    const employmentData = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            const status = (r.employment_status || "unemployed").toLowerCase().trim();
            const mapping = {
                student: "Student",
                employed: "Employed",
                self_employed: "Self-Employed",
                under_employed: "Under-Employed",
                unemployed: "Unemployed",
                not_applicable: "Not Applicable"
            };
            const key = mapping[status] || "Unemployed";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [residentArray]);

    const ageCountsData = useMemo(() => {
        const counts = residentArray.reduce((acc, r) => {
            const group = getAgeGroup(getAge(r.birthdate));
            if (group) acc[group] = (acc[group] || 0) + 1;
            return acc;
        }, {});
        return counts;
    }, [residentArray]);

    const ageData = useMemo(() => {
        return AGE_GROUPS.map(g => ({ name: g.label, value: ageCountsData[g.label] || 0 }));
    }, [ageCountsData]);


    // --- CONDITIONAL RENDERING AFTER ALL HOOKS HAVE BEEN CALLED ---
    if (isLoading) {
        return (
            <div className="pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {/* LEFT COLUMN SKELETON */}
                    <div className="lg:col-span-3 flex flex-col gap-2">
                        <ChartSkeleton height={140} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            <ChartSkeleton height={140} />
                            <ChartSkeleton height={140} />
                        </div>
                    </div>
                    {/* RIGHT COLUMN SKELETON */}
                    <div className="lg:col-span-2 flex flex-col gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <ChartSkeleton height={80} />
                            <ChartSkeleton height={80} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <ChartSkeleton height={200} />
                            <ChartSkeleton height={200} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (residentArray.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                <img
                    src="/images/chart_error.png"
                    alt="No records illustration"
                    className="h-40 w-auto mb-3"
                />
                <p className="text-lg font-semibold">No records found</p>
                <p className="text-sm text-gray-400">
                    Try adjusting your filters or check back later.
                </p>
            </div>
        );
    }

    // Now render the actual charts, as all data is ready and hooks are called
    return (
        <div className="pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                    {/* PUROK DISTRIBUTION */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Population Demographics by Purok</h2>
                        <ResponsiveContainer width="100%" height={140}>
                            <BarChart data={purokData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fontSize: 13 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} wrapperClassName="rounded-lg shadow-lg" />
                                <Bar dataKey="value" barSize={35} radius={[10, 10, 0, 0]} fill="#1E40AF">
                                    <LabelList dataKey="value" position="top" fill="#6B7280" fontSize={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    {/* VOTER + AGE */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {/* Voter Registration */}
                        <div className="bg-white shadow-lg rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Registered Voter by Purok</h2>
                            <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={voterData} layout="vertical" margin={{ top: -10, right: 20, left: -40, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={60} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                                    <Legend verticalAlign="top" align="left" wrapperStyle={{ top: -20, left: 0, fontSize: 12 }} />
                                    <Bar dataKey="registered" name="Registered" fill="#2563EB" stackId="a" barSize={30} radius={[15, 0, 0, 15]}>
                                        <LabelList dataKey="registered" position="inside" fill="#fff" fontSize={12} />
                                    </Bar>
                                    <Bar dataKey="unregistered" name="Unregistered" fill="#60A5FA" stackId="a" barSize={30} radius={[0, 15, 15, 0]}>
                                        <LabelList dataKey="unregistered" position="inside" fill="#fff" fontSize={12} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Age Distribution */}
                        <div className="bg-white shadow-lg rounded-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Age Distribution</h2>
                            <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={ageData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                    <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                                    <Bar dataKey="value" barSize={30} radius={[10, 10, 0, 0]}>
                                        {ageData.map((entry, index) => (
                                            <Cell key={`age-cell-${entry.name}`} fill={COLORS_AGE[index % COLORS_AGE.length]} />
                                        ))}
                                        <LabelList dataKey="value" position="top" fill="#6B7280" fontSize={12} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                {/* --- RIGHT COLUMN --- */}
                <div className="lg:col-span-2 flex flex-col gap-2">
                    {/* GENDER & WELFARE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {/* GENDER */}
                        <div className="bg-white shadow-lg rounded-2xl p-4 h-44">
                            <h2 className="text-lg font-semibold text-gray-700">Gender</h2>
                            <div className="flex items-center h-full">
                                <div className="w-2/5 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={genderData} cx="50%" cy="50%" outerRadius={40} innerRadius={30} dataKey="value" cornerRadius={5}>
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`gender-cell-${entry.name}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} stroke="#FFFFFF" strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name) => [`${value}`, name]} contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">{totalGender}</text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-3/5 flex flex-col justify-center gap-2 pl-4">
                                    {genderData.map((entry, index) => (
                                        <div key={`gender-legend-${entry.name}`} className="flex items-center text-sm w-full">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS_GENDER[index % COLORS_GENDER.length] }}></span>
                                            <span className="font-medium text-gray-700">{entry.name}</span>
                                            <span className="ml-auto text-gray-500">{`${totalGender > 0 ? ((entry.value / totalGender) * 100).toFixed(0) : 0}%`}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* WELFARE */}
                        <div className="bg-white shadow-lg rounded-2xl p-4 h-44">
                            <h2 className="text-lg font-semibold text-gray-700">Social Welfare</h2>
                            <div className="flex items-center h-full">
                                <div className="w-2/5 h-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={welfareData} cx="50%" cy="50%" outerRadius={40} innerRadius={30} dataKey="value" cornerRadius={5}>
                                                {welfareData.map((entry, index) => (
                                                    <Cell key={`welfare-cell-${entry.name}`} fill={COLORS_WELFARE[index % COLORS_WELFARE.length]} stroke="#FFFFFF" strokeWidth={2} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value, name) => [`${value}`, name]} contentStyle={{ fontSize: "12px", borderRadius: "8px" }} />
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">{totalWelfare}</text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-3/5 flex flex-col justify-center gap-2 pl-4">
                                    {welfareData.map((entry, index) => (
                                        <div key={`welfare-legend-${entry.name}`} className="flex items-center text-sm w-full">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS_WELFARE[index % COLORS_WELFARE.length] }}></span>
                                            <span className="font-medium text-gray-700">{entry.name === "FourPs" ? "4Ps" : entry.name}</span>
                                            <span className="ml-auto text-gray-500">{`${totalWelfare > 0 ? ((entry.value / totalWelfare) * 100).toFixed(0) : 0}%`}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* CIVIL STATUS & EMPLOYMENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {/* Civil Status */}
                        <div className="bg-white shadow-lg rounded-2xl p-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Civil Status</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={civilData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value">
                                        {civilData.map((entry, index) => (
                                            <Cell key={`civil-cell-${entry.name}`} fill={COLORS_CIVIL[index % COLORS_CIVIL.length]} stroke="#FFFFFF" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <text x="50%" y="40%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-semibold fill-gray-700">{civilData.reduce((sum, entry) => sum + entry.value, 0)}</text>
                                    <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                                    <Legend iconType="circle" iconSize={8} verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Employment */}
                        <div className="bg-white shadow-lg rounded-2xl p-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Employment</h2>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={employmentData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value">
                                        {employmentData.map((entry, index) => (
                                            <Cell key={`employment-cell-${entry.name}`} fill={COLORS_EMPLOYMENT[index % COLORS_EMPLOYMENT.length]} stroke="#FFFFFF" strokeWidth={2} />
                                        ))}
                                    </Pie>
                                    <text x="50%" y="35%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-semibold fill-gray-700">{employmentData.reduce((sum, entry) => sum + entry.value, 0)}</text>
                                    <Tooltip wrapperClassName="rounded-lg shadow-lg" />
                                    <Legend iconType="circle" iconSize={8} verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "11px", paddingTop: "20px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentCharts;
