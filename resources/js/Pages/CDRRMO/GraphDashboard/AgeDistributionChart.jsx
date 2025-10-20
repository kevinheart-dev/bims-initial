import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
} from "recharts";

export default function AgeDistributionChart({ ageDistribution, height = 280 }) {
    const [showGender, setShowGender] = useState(false);
    const [showDisability, setShowDisability] = useState(false);

    // ✅ Dynamic title computation
    const chartTitle = useMemo(() => {
        if (showGender && showDisability)
            return "Population by Age, Gender & Disability";
        if (showGender) return "Population by Age & Gender";
        if (showDisability) return "Population by Age & Disability";
        return "Population by Age";
    }, [showGender, showDisability]);

    const ageOrder = [
        "0_6_mos",
        "7_mos_to_2_yrs",
        "3_to_5_yrs",
        "6_to_12_yrs",
        "13_to_17_yrs",
        "18_to_59_yrs",
        "60_plus_yrs",
    ];

    const sortedAgeDistribution = useMemo(
        () =>
            [...ageDistribution].sort(
                (a, b) => ageOrder.indexOf(a.age_group) - ageOrder.indexOf(b.age_group)
            ),
        [ageDistribution]
    );

    const formatLabel = (label) => {
        const labelMap = {
            "0_6_mos": "0–6M",
            "7_mos_to_2_yrs": "7M–2Y",
            "3_to_5_yrs": "3–5Y",
            "6_to_12_yrs": "6–12Y",
            "13_to_17_yrs": "13–17Y",
            "18_to_59_yrs": "18–59Y",
            "60_plus_yrs": "60+",
        };
        return labelMap[label] || label;
    };

    const formatKey = (key) => {
        const keyMap = {
            total: "Total Population",
            male: "Male",
            female: "Female",
            lgbtq: "LGBTQ",
            withDisability: "With Dis.",
            withoutDisability: "No Dis.",
            maleWithDisability: "Male (Dis.)",
            maleWithoutDisability: "Male (No Dis.)",
            femaleWithDisability: "Fem (Dis.)",
            femaleWithoutDisability: "Fem (No Dis.)",
            lgbtqWithDisability: "LGBTQ (Dis.)",
            lgbtqWithoutDisability: "LGBTQ (No Dis.)",
        };
        return keyMap[key] || key;
    };

    const chartData = useMemo(
        () =>
            sortedAgeDistribution.map((item) => {
                const {
                    age_group,
                    male_without_disability,
                    male_with_disability,
                    female_without_disability,
                    female_with_disability,
                    lgbtq_without_disability,
                    lgbtq_with_disability,
                } = item;

                const maleWithout = Number(male_without_disability);
                const maleWith = Number(male_with_disability);
                const femaleWithout = Number(female_without_disability);
                const femaleWith = Number(female_with_disability);
                const lgbtqWithout = Number(lgbtq_without_disability);
                const lgbtqWith = Number(lgbtq_with_disability);

                const data = { age_group };

                if (!showGender && !showDisability) {
                    data.total =
                        maleWithout +
                        maleWith +
                        femaleWithout +
                        femaleWith +
                        lgbtqWithout +
                        lgbtqWith;
                } else if (showGender && !showDisability) {
                    data.male = maleWithout + maleWith;
                    data.female = femaleWithout + femaleWith;
                    data.lgbtq = lgbtqWithout + lgbtqWith;
                } else if (!showGender && showDisability) {
                    data.withDisability =
                        maleWith + femaleWith + lgbtqWith;
                    data.withoutDisability =
                        maleWithout + femaleWithout + lgbtqWithout;
                } else if (showGender && showDisability) {
                    data.maleWithDisability = maleWith;
                    data.maleWithoutDisability = maleWithout;
                    data.femaleWithDisability = femaleWith;
                    data.femaleWithoutDisability = femaleWithout;
                    data.lgbtqWithDisability = lgbtqWith;
                    data.lgbtqWithoutDisability = lgbtqWithout;
                }

                return data;
            }),
        [sortedAgeDistribution, showGender, showDisability]
    );

    const colors = {
        male: "#4f46e5",
        female: "#f97316",
        lgbtq: "#14b8a6",
        total: "#8884d8",
        withDisability: "#c62828",
        withoutDisability: "#81c784",
        maleWithDisability: "#1e3a8a",
        maleWithoutDisability: "#60a5fa",
        femaleWithDisability: "#d97706",
        femaleWithoutDisability: "#fbbf24",
        lgbtqWithDisability: "#047857",
        lgbtqWithoutDisability: "#34d399",
    };

    const activeBars = Object.keys(chartData[0] || {}).filter(
        (key) => key !== "age_group"
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-300 text-sm min-w-[180px] z-50 relative">
                    <p className="font-semibold text-gray-900 mb-2 text-base">
                        {formatLabel(label)}
                    </p>
                    {payload.map((entry, index) => (
                        <div
                            key={`tooltip-${index}`}
                            className="flex justify-between text-gray-700 py-1"
                        >
                            <span className="text-sm">{formatKey(entry.name)}</span>
                            <span className="font-semibold text-gray-800">
                                {new Intl.NumberFormat().format(entry.value)}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="border rounded-xl p-4 mb-0 bg-white hover:shadow-lg transition-shadow duration-300">
            {/* Header and Filters */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {chartTitle}
                </h3>

                <div className="flex items-center gap-3">
                    {/* Toggle Gender */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showGender}
                                onChange={() => setShowGender(!showGender)}
                                className="sr-only"
                            />
                            <div
                                className={`w-10 h-5 rounded-full transition-colors duration-300 ${showGender ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                            ></div>
                            <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${showGender ? "translate-x-5" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                        <span className="text-gray-700 font-medium hover:text-blue-500">
                            Gender
                        </span>
                    </label>

                    {/* Toggle Disability */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showDisability}
                                onChange={() => setShowDisability(!showDisability)}
                                className="sr-only"
                            />
                            <div
                                className={`w-10 h-5 rounded-full transition-colors duration-300 ${showDisability
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                    }`}
                            ></div>
                            <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${showDisability ? "translate-x-5" : "translate-x-0"
                                    }`}
                            ></div>
                        </div>
                        <span className="text-gray-700 font-medium hover:text-green-500">
                            Disability
                        </span>
                    </label>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={height} className="relative z-50">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="age_group"
                        tick={{ fontSize: 12 }}
                        tickFormatter={formatLabel}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} formatter={formatKey} />

                    {activeBars.map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[key]}
                            radius={[5, 5, 0, 0]}
                            barSize={22}
                            isAnimationActive
                        >
                            <LabelList
                                dataKey={key}
                                position="top"
                                fontSize={10}
                                formatter={(v) =>
                                    new Intl.NumberFormat().format(v)
                                }
                            />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
