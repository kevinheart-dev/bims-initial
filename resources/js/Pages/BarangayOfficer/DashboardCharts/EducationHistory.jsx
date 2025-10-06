import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";

// Custom tooltip for stacked bars
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[160px]">
                <p className="font-semibold text-gray-700">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="font-semibold text-gray-700">
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Colors for education status
const STATUS_COLORS = {
    Graduated: "#3B82F6",
    "Currently Enrolled": "#60A5FA",
    Incomplete: "#93C5FD",
    "Dropped Out": "#BFDBFE",
};

function EducationStackedBarChart({ educationData }) {
    const dataMap = {};

    educationData.forEach((item) => {
        const eduLabel = item.educational_attainment_label;
        const statusLabel = item.education_status_label;

        if (!dataMap[eduLabel]) dataMap[eduLabel] = { education: eduLabel };
        dataMap[eduLabel][statusLabel] = item.total_count;
    });

    const chartData = Object.values(dataMap);

    return (
        <div className="w-full h-[320px] p-4 flex flex-col">
            <h3 className="text-gray-700 font-semibold text-lg mb-4">
                Education Level vs Status
            </h3>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 0, left: -10, bottom: 50 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="education"
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                        />
                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />

                        {Object.keys(STATUS_COLORS).map((status) => (
                            <Bar
                                key={status}
                                dataKey={status}
                                stackId="a" // important: stack bars together
                                fill={STATUS_COLORS[status]}
                            >
                                <LabelList
                                    dataKey={status}
                                    position="center"
                                    formatter={(val) => (val > 0 ? val : "")}
                                    style={{ fontSize: "10px", fill: "#1e3a8a", fontWeight: "bold" }}
                                />
                            </Bar>
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default EducationStackedBarChart;
