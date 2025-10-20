import React, { useState, useMemo } from "react";
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

const LivelihoodStatisticsChart = ({ livelihoodStatistics, height = 280 }) => {
    const [showGender, setShowGender] = useState(false);
    const [showDisability, setShowDisability] = useState(false);

    // ✅ Dynamic chart title
    const chartTitle = useMemo(() => {
        if (showGender && showDisability)
            return "Livelihood by Gender & Disability";
        if (showGender) return "Livelihood by Gender";
        if (showDisability) return "Livelihood by Disability";
        return "Livelihood Distribution";
    }, [showGender, showDisability]);

    // ✅ Sort by total
    const sortedData = useMemo(
        () =>
            [...livelihoodStatistics]
                .sort((a, b) => b.total_livelihood - a.total_livelihood)
                .slice(0, 10),
        [livelihoodStatistics]
    );

    // ✅ Prepare chart data
    const chartData = useMemo(() => {
        return sortedData.map((item) => {
            const {
                livelihood_type,
                male_without_disability,
                male_with_disability,
                female_without_disability,
                female_with_disability,
                lgbtq_without_disability,
                lgbtq_with_disability,
                total_livelihood,
            } = item;

            const maleWith = Number(male_with_disability);
            const maleWithout = Number(male_without_disability);
            const femaleWith = Number(female_with_disability);
            const femaleWithout = Number(female_without_disability);
            const lgbtqWith = Number(lgbtq_with_disability);
            const lgbtqWithout = Number(lgbtq_without_disability);

            const data = { livelihood_type };

            if (!showGender && !showDisability) {
                data.total =
                    maleWith +
                    maleWithout +
                    femaleWith +
                    femaleWithout +
                    lgbtqWith +
                    lgbtqWithout;
            } else if (showGender && !showDisability) {
                data.male = maleWith + maleWithout;
                data.female = femaleWith + femaleWithout;
                data.lgbtq = lgbtqWith + lgbtqWithout;
            } else if (!showGender && showDisability) {
                data.withDisability = maleWith + femaleWith + lgbtqWith;
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
        });
    }, [sortedData, showGender, showDisability]);

    const colors = {
        total: "#3b82f6",
        male: "#2563eb",
        female: "#f97316",
        lgbtq: "#14b8a6",
        withDisability: "#c62828",
        withoutDisability: "#81c784",
        maleWithDisability: "#1e3a8a",
        maleWithoutDisability: "#60a5fa",
        femaleWithDisability: "#d97706",
        femaleWithoutDisability: "#fbbf24",
        lgbtqWithDisability: "#047857",
        lgbtqWithoutDisability: "#34d399",
    };

    const formatKey = (key) => {
        const keyMap = {
            total: "Total",
            male: "Male",
            female: "Female",
            lgbtq: "LGBTQ",
            withDisability: "With Disability",
            withoutDisability: "Without Disability",
            maleWithDisability: "Male (Dis.)",
            maleWithoutDisability: "Male (No Dis.)",
            femaleWithDisability: "Female (Dis.)",
            femaleWithoutDisability: "Female (No Dis.)",
            lgbtqWithDisability: "LGBTQ (Dis.)",
            lgbtqWithoutDisability: "LGBTQ (No Dis.)",
        };
        return keyMap[key] || key;
    };

    const activeBars = Object.keys(chartData[0] || {}).filter(
        (key) => key !== "livelihood_type"
    );

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-300 text-sm min-w-[180px] z-50 relative">
                    <p className="font-semibold text-gray-900 mb-2 text-base">
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <div
                            key={`tooltip-${index}`}
                            className="flex justify-between text-gray-700 py-1"
                        >
                            <span>{formatKey(entry.name)}</span>
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{chartTitle}</h3>

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
                                className={`w-10 h-5 rounded-full transition-colors duration-300 ${showDisability ? "bg-green-500" : "bg-gray-300"
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
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    {/* ✅ Smart wrapped X-Axis labels */}
                    <XAxis
                        dataKey="livelihood_type"
                        tick={(props) => {
                            const { x, y, payload } = props;
                            let text = payload.value;

                            // ✅ Split by space or slash for better wrapping
                            const parts = text.split(/[\s/]+/);

                            return (
                                <g transform={`translate(${x},${y + 10})`}>
                                    {parts.map((line, index) => (
                                        <text
                                            key={index}
                                            x={0}
                                            y={index * 12}
                                            textAnchor="middle"
                                            fill="#555"
                                            fontSize={12}
                                        >
                                            {line}
                                        </text>
                                    ))}
                                </g>
                            );
                        }}
                        interval={0}
                    />

                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />

                    {/* ✅ Move Legend below chart */}
                    <Legend
                        formatter={formatKey}
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: 20 }}
                    />

                    {activeBars.map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[key]}
                            radius={[5, 5, 0, 0]}
                            barSize={22}
                        >
                            <LabelList
                                dataKey={key}
                                position="top"
                                fontSize={10}
                                formatter={(v) => new Intl.NumberFormat().format(v)}
                            />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>


        </div>
    );
};

export default LivelihoodStatisticsChart;
