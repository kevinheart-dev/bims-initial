import { Skeleton } from "@/Components/ui/skeleton";
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

// --- Color constants and data processing logic ---

// Shades of blue for Gender
const COLORS_GENDER = ["#2563EB", "#60A5FA", "#1E40AF"]; // Male, Female, LGBTQ
// Shades of green for Social Welfare
const COLORS_WELFARE = ["#2563EB", "#60A5FA", "#1E40AF"]; // PWD, 4Ps, Solo Parent
// Colors for Puroks
const COLORS_PUROK = ["#1E40AF"];
// Colors for Voters
const COLORS_VOTERS = ["#2563EB", "#60A5FA"]; // Registered, Unregistered
// Colors for Employment Status
const COLORS_EMPLOYMENT = [
    "#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA"
];
// Colors for Age
const COLORS_AGE = [
    "#1E3A8A", "#1D4ED8", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"
];
// Colors for Civil Status
const COLORS_CIVIL = [
    "#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"
];

const AGE_GROUPS = [
    { label: "0-6m", min: 0, max: 0.5 },
    { label: "7m-2y", min: 0.5, max: 2 },
    { label: "3-5y", min: 2, max: 6 },
    { label: "6-12y", min: 6, max: 13 },
    { label: "13-17y", min: 13, max: 18 },
    { label: "18-59y", min: 18, max: 60 },
    { label: "60+y", min: 60, max: Infinity },
];

const ResidentCharts = ({ residents, isLoading }) => {
    const residentArray = Array.isArray(residents) ? residents : residents?.data || [];

    const ChartSkeleton = ({ height }) => (
        <div className="bg-white shadow-lg rounded-2xl p-6">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="w-full" style={{ height }}>
                <div className="w-full h-full bg-gray-100 rounded animate-pulse"></div>
            </div>
        </div>
    );

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

    if (!residentArray || residentArray.length === 0) {
        return <div>No data available for charts</div>;
    }


    const genderCounts = residentArray.reduce((acc, r) => {
        let g = (r.gender || "Unknown").toLowerCase().trim();
        g = (g === "male" || g === "m") ? "Male" : (g === "female" || g === "f") ? "Female" : "LGBTQ";
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, { Male: 0, Female: 0, LGBTQ: 0 });
    const genderData = Object.entries(genderCounts).map(([name, value]) => ({ name, value }));
    const totalGender = genderData.reduce((sum, item) => sum + item.value, 0);

    const welfareCounts = residentArray.reduce((acc, r) => {
        acc.PWD = (acc.PWD || 0) + (r.is_pwd ? 1 : 0);
        acc.FourPs = (acc.FourPs || 0) + (r.is4ps ? 1 : 0);
        acc.SoloParent = (acc.SoloParent || 0) + (r.isSoloParent ? 1 : 0);
        return acc;
    }, { PWD: 0, FourPs: 0, SoloParent: 0 });
    const welfareData = Object.entries(welfareCounts).map(([name, value]) => ({ name, value }));
    const totalWelfare = welfareData.reduce((sum, item) => sum + item.value, 0);

    const purokCounts = residentArray.reduce((acc, r) => {
        const p = r.purok_number || "Unknown";
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});
    const purokData = Object.entries(purokCounts).map(([name, value]) => ({ name, value }));

    const voterCounts = residentArray.reduce((acc, r) => {
        const p = r.purok_number || "Unknown";
        if (!acc[p]) acc[p] = { registered: 0, unregistered: 0 };
        acc[p][r.registered_voter === 1 ? 'registered' : 'unregistered'] += 1;
        return acc;
    }, {});
    const voterData = Object.entries(voterCounts).map(([name, counts]) => ({ name, ...counts }));

    const civilCounts = residentArray.reduce((acc, r) => {
        const status = (r.civil_status || "Unknown").toLowerCase().trim();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const civilData = Object.entries(civilCounts).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
    }));

    const employmentCounts = residentArray.reduce((acc, r) => {
        const status = (r.employment_status || "unemployed").toLowerCase().trim();
        const mapping = {
            student: "Student",
            employed: "Employed",
            self_employed: "Self-Employed",
            under_employed: "Under-Employed",
            unemployed: "Unemployed",
        };
        const key = mapping[status] || "Unemployed";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
    const employmentData = Object.entries(employmentCounts).map(([name, value]) => ({ name, value }));

    const getAge = (birthdate) => {
        if (!birthdate) return null;
        const birthDateObj = new Date(birthdate);
        return isNaN(birthDateObj) ? null : (new Date() - birthDateObj) / 31557600000; // Milliseconds in a year
    };
    const getAgeGroup = (age) => {
        if (age === null) return null;
        return AGE_GROUPS.find(g => age >= g.min && age < g.max)?.label || null;
    };
    const ageCounts = residentArray.reduce((acc, r) => {
        const group = getAgeGroup(getAge(r.birthdate));
        if (group) acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {});
    const ageData = AGE_GROUPS.map(g => ({ name: g.label, value: ageCounts[g.label] || 0 }));

    console.log(residentArray);
    return (
        <div className="pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                    {/* PUROK DISTRIBUTION */}
                    <div className="bg-white shadow-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Purok Distribution</h2>
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
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Voter Registration by Purok</h2>
                            <ResponsiveContainer width="100%" height={140}>
                                <BarChart data={voterData} layout="vertical" margin={{ top: -10, right: -10, left: -40, bottom: 10 }}>
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
