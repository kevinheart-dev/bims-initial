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

// Shades of blue for Gender
const COLORS_GENDER = ["#2563EB", "#60A5FA", "#1E40AF"]; // Male, Female, LGBTQ
// Shades of green for Social Welfare
const COLORS_WELFARE = ["#2563EB", "#60A5FA", "#1E40AF"]; // PWD, 4Ps, Solo Parent
// Colors for Puroks
const COLORS_PUROK = ["#1E40AF"];
// Colors for Voters
const COLORS_VOTERS = ["#2563EB", "#60A5FA"]; // Registered, Unregistered
// Colors for Employment Status
const COLORS_EMPLOYMENT = ["#2563EB", "#60A5FA", "#1E40AF", "#10B981", "#F97316"]; // student, employed, self_employed, under_employed, unemployed

// Colors
const COLORS_AGE = ["#2563EB", "#60A5FA", "#1E40AF", "#10B981", "#F97316", "#FBBF24", "#A78BFA"];

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

    if (isLoading) return <div>Loading charts...</div>;
    if (!residents || residents.length === 0) return <div>No data available for charts</div>;

    // --- Gender Data ---
    const genderCounts = residentArray.reduce((acc, r) => {
        let g = (r.gender || "").toLowerCase().trim();
        if (g === "male" || g === "m") g = "Male";
        else if (g === "female" || g === "f") g = "Female";
        else g = "LGBTQ";
        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, { Male: 0, Female: 0, LGBTQ: 0 });

    const genderData = Object.entries(genderCounts).map(([key, value]) => ({ name: key, value }));
    const totalGender = genderData.reduce((sum, item) => sum + item.value, 0);

    // --- Social Welfare Data ---
    const welfareCounts = residentArray.reduce((acc, r) => {
        const isPWD = r.is_pwd === 1 || r.is_pwd === true;
        acc.PWD = (acc.PWD || 0) + (isPWD ? 1 : 0);
        acc.FourPs = (acc.FourPs || 0) + (r.is4ps ? 1 : 0);
        acc.SoloParent = (acc.SoloParent || 0) + (r.isSoloParent ? 1 : 0);
        return acc;
    }, { PWD: 0, FourPs: 0, SoloParent: 0 });

    const welfareData = Object.entries(welfareCounts).map(([key, value]) => ({ name: key, value }));
    const totalWelfare = welfareData.reduce((sum, item) => sum + item.value, 0);

    // --- Purok Data ---
    const purokCounts = residentArray.reduce((acc, r) => {
        const p = r.purok_number || "Unknown";
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});
    const purokData = Object.entries(purokCounts).map(([name, value]) => ({ name, value }));

    // --- Voter Registration Data ---
    const voterCounts = residentArray.reduce((acc, r) => {
        const p = r.purok_number || "Unknown";
        if (!acc[p]) acc[p] = { registered: 0, unregistered: 0 };
        if (r.registered_voter === 1) acc[p].registered += 1;
        else acc[p].unregistered += 1;
        return acc;
    }, {});
    const voterData = Object.entries(voterCounts).map(([name, counts]) => ({
        name,
        registered: counts.registered,
        unregistered: counts.unregistered,
    }));

    // --- Civil Status Data ---
    const civilCounts = residentArray.reduce((acc, r) => {
        const status = (r.civil_status || "Unknown").toLowerCase().trim();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    const civilData = Object.entries(civilCounts).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
    }));
    const totalCivil = civilData.reduce((sum, item) => sum + item.value, 0);
    const COLORS_CIVIL = [
        "#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"
    ];

    // --- Employment Status Data ---
    const employmentCounts = residentArray.reduce((acc, r) => {
        const status = (r.employment_status || "").toLowerCase().trim();
        switch (status) {
            case "student":
                acc.Student += 1;
                break;
            case "employed":
                acc.Employed += 1;
                break;
            case "self_employed":
                acc.SelfEmployed += 1;
                break;
            case "under_employed":
                acc.UnderEmployed += 1;
                break;
            case "unemployed":
                acc.Unemployed += 1;
                break;
            // remove default case since we no longer track "Others"
        }
        return acc;
    }, { Student: 0, Employed: 0, SelfEmployed: 0, UnderEmployed: 0, Unemployed: 0 });


    const employmentData = Object.entries(employmentCounts).map(([name, value]) => ({ name, value }));
    const totalEmployment = employmentData.reduce((sum, item) => sum + item.value, 0);

    // --- AGE DISTRIBUTION ---
    const getAge = (birthdate) => {
        if (!birthdate) return null;
        const birthDateObj = new Date(birthdate);
        if (isNaN(birthDateObj)) return null;
        const today = new Date();
        return (today - birthDateObj) / (1000 * 60 * 60 * 24 * 365.25); // approximate years
    };

    const getAgeGroup = (age) => {
        if (age === null) return null;
        const group = AGE_GROUPS.find((g) => age >= g.min && age < g.max);
        return group ? group.label : null;
    };

    // Initialize all age groups with 0
    const ageCounts = AGE_GROUPS.reduce((acc, g) => ({ ...acc, [g.label]: 0 }), {});

    residentArray.forEach((r) => {
        const age = getAge(r.birthdate); // <-- updated here
        const group = getAgeGroup(age);
        if (group) ageCounts[group] += 1;
    });

    const ageData = Object.entries(ageCounts).map(([name, value]) => ({ name, value }));
    const totalAge = ageData.reduce((sum, item) => sum + item.value, 0);


    // --- Legend Renderer ---
    const renderLegend = (props, total) => {
        const { payload } = props;
        return (
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
                {payload.map((entry, index) => {
                    const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(0) : 0;
                    let labelName = entry.payload.name;
                    if (labelName === "FourPs") labelName = "4Ps";
                    return (
                        <div key={`legend-${index}`} className="flex flex-col items-center gap-1">
                            <span
                                className="px-2 py-1 rounded-full text-white font-medium"
                                style={{ backgroundColor: entry.color }}
                            >
                                {labelName}
                            </span>
                            <span className="text-sm text-gray-500">{percent}%</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* Top 3 Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                {/* Purok Distribution */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-4">Purok Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={purokData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" barSize={20} radius={[10, 10, 0, 0]}>
                                {purokData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_PUROK[index % COLORS_PUROK.length]} />
                                ))}
                                <LabelList dataKey="value" position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={genderData} cx="50%" cy="50%" outerRadius={60} innerRadius={40} dataKey="value">
                                {genderData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_GENDER[index % COLORS_GENDER.length]} />
                                ))}
                            </Pie>
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-700">
                                {totalGender}
                            </text>
                            <Tooltip />
                            <Legend content={(props) => renderLegend(props, totalGender)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Social Welfare Distribution */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-4">Social Welfare Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={welfareData}
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                innerRadius={40}
                                startAngle={180}
                                endAngle={0}
                                dataKey="value"
                            >
                                {welfareData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_WELFARE[index % COLORS_WELFARE.length]} />
                                ))}
                            </Pie>
                            <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-700">
                                {totalWelfare}
                            </text>
                            <Tooltip />
                            <Legend content={(props) => renderLegend(props, totalWelfare)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                {/* Voter Registration Chart */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-4">Voter Registration</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={voterData}
                            layout="vertical"
                            margin={{ top: -10, right: 30, left: -40, bottom: 10 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />

                            <Legend
                                verticalAlign="top"
                                align="center"
                                iconType="circle"
                                iconSize={15} // size of the circle
                                wrapperStyle={{ marginBottom: 90, paddingTop: 0 }} // adjust legend spacing
                                formatter={(value, entry) => (
                                    <span className="text-md font-medium ml-2 capitalize">{value}</span>
                                )}
                            />

                            <Bar
                                dataKey="registered"
                                fill={COLORS_VOTERS[0]}
                                stackId="a"
                                barSize={30}
                                radius={[0, 0, 0, 0]}
                            >
                                <LabelList dataKey="registered" position="insideRight" fill="#fff" />
                            </Bar>
                            <Bar
                                dataKey="unregistered"
                                fill={COLORS_VOTERS[1]}
                                stackId="a"
                                barSize={30}
                                radius={[0, 15, 15, 0]}
                            >
                                <LabelList dataKey="unregistered" position="insideRight" fill="#fff" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                {/* Civil Status Pie Chart */}
                <div className="bg-white shadow rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-4">Civil Status Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={civilData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                {civilData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS_CIVIL[index % COLORS_CIVIL.length]} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-2xl font-bold fill-gray-700"
                            >
                                {totalCivil}
                            </text>
                            <Tooltip />
                            <Legend formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Employment Status Colored Bars */}
                <div className="bg-white shadow rounded-2xl p-4">
                    {/* Heading */}
                    <h2 className="text-lg font-semibold mb-4">Employment Status Distribution</h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Chart */}
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={employmentData.length * 50}>
                                <BarChart
                                    data={employmentData}
                                    layout="vertical"
                                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={false} width={0} />
                                    <Tooltip
                                        formatter={(value) =>
                                            `${value} (${((value / totalEmployment) * 100).toFixed(0)}%)`
                                        }
                                    />
                                    <Bar dataKey="value" radius={50}>
                                        {employmentData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS_EMPLOYMENT[index % COLORS_EMPLOYMENT.length]}
                                            />
                                        ))}
                                        <LabelList
                                            dataKey="value"
                                            position="insideRight"
                                            formatter={(value) => `${value}`}
                                            style={{ fill: "#fff", fontWeight: 500 }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend on the right */}
                        <div className="flex flex-col justify-center gap-2 md:w-32">
                            {employmentData.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full inline-block"
                                        style={{
                                            backgroundColor: COLORS_EMPLOYMENT[index % COLORS_EMPLOYMENT.length],
                                        }}
                                    ></span>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Age Distribution Colored Bars */}
            {/* Age Distribution Chart */}
            <div className="bg-white shadow rounded-2xl p-4 mt-6">
                <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height={ageData.length * 50}>
                            <BarChart
                                data={ageData}
                                layout="vertical"
                                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" tick={false} width={0} />
                                <Tooltip
                                    formatter={(value) =>
                                        `${value} (${((value / totalAge) * 100).toFixed(0)}%)`
                                    }
                                />
                                <Bar dataKey="value" radius={50}>
                                    {ageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_AGE[index % COLORS_AGE.length]} />
                                    ))}
                                    <LabelList
                                        dataKey="value"
                                        position="insideRight"
                                        formatter={(value) => `${value}`}
                                        style={{ fill: "#fff", fontWeight: 500 }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-col justify-center gap-2 md:w-32">
                        {ageData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span
                                    className="w-4 h-4 rounded-full inline-block"
                                    style={{ backgroundColor: COLORS_AGE[index % COLORS_AGE.length] }}
                                ></span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



        </>
    );
};

export default ResidentCharts;
