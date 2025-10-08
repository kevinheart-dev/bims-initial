import React, { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis, // Re-added XAxis
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList
} from "recharts";

// Tooltip
const CustomTooltip = ({ active, payload, label }) => {
    // Check for "total" entry to display the count clearly
    const totalEntry = payload.find(entry => entry.dataKey === 'total');
    const totalValue = totalEntry ? totalEntry.value : 'N/A';
    const statusLabel = payload[0]?.payload.education; // The category name

    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[160px]">
                {/* Use the 'label' prop passed by Recharts (which will now be the education level) */}
                <p className="font-semibold text-gray-700">Education Level: {label}</p>
                <p className="font-semibold text-gray-700">
                    Total Count: <span className="font-bold">{totalValue.toLocaleString()}</span>
                </p>
                {/* You can optionally add the current filter status here */}
                <p className="text-xs text-gray-500 mt-1">Status: {payload[0]?.payload.selectedStatus || 'All'}</p>
            </div>
        );
    }
    return null;
};

// Custom label inside the bar (no changes needed here)
const CustomBarLabel = ({ x, y, width, height, value }) => {
    const textX = x + width / 2;
    const textY = y + height / 2;

    // Skip if bar is too small
    if (height < 20) return null;

    return (
        <text
            x={textX}
            y={textY}
            fill="#1e3a8a"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, ${textX}, ${textY})`}
            style={{
                fontSize: "10px",
                fontWeight: "bold",
                pointerEvents: "none",
            }}
        >
            {value}
        </text>
    );
};

// Status list
const STATUS_LABELS = ["Graduated", "Currently Enrolled", "Incomplete", "Dropped Out"];

function EducationBarChart({ educationData }) {
    const [selectedStatus, setSelectedStatus] = useState("All");

    const dataMap = {};
    educationData.forEach((item) => {
        const eduLabel = item.educational_attainment_label;
        const statusLabel = item.education_status_label;

        if (!dataMap[eduLabel]) {
            dataMap[eduLabel] = { education: eduLabel, total: 0, selectedStatus: selectedStatus };
        }

        if (selectedStatus === "All") {
            dataMap[eduLabel].total += item.total_count;
        } else if (statusLabel === selectedStatus) {
            dataMap[eduLabel].total = item.total_count;
        }
    });

    // Make sure we update the selectedStatus on the data objects for the tooltip
    Object.values(dataMap).forEach(d => d.selectedStatus = selectedStatus);

    const chartData = Object.values(dataMap);

    return (
        <div className="w-full h-[320px] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold text-lg">
                    Education Level vs Status
                </h3>

                {/* Buttons in one line */}
                <div className="flex flex-nowrap gap-1">
                    {["All", ...STATUS_LABELS].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-3 py-1 text-[11px] rounded-full border transition whitespace-nowrap
                                ${selectedStatus === status
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

            </div>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -35, bottom: 35 }}
                    >
                        <defs>
                            <linearGradient id="whiteToBlue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" />

                        {/* THE FIX: Explicitly define XAxis dataKey to pass 'education' level as the label */}
                        <XAxis dataKey="education" hide={true} />

                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />

                        {/* CustomTooltip now receives the 'education' value as 'label' */}
                        <Tooltip content={<CustomTooltip />} />

                        <Bar
                            dataKey="total"
                            fill="url(#whiteToBlue)" // Always gradient
                            barSize={35}
                            radius={[8, 8, 0, 0]}
                        >
                            {/* Total at the top of the bar */}
                            <LabelList
                                dataKey="total"
                                position="top"
                                formatter={(val) => (val > 0 ? val.toLocaleString() : "")}
                                style={{
                                    fontSize: "11px",
                                    fill: "#1e3a8a",
                                    fontWeight: "bold",
                                }}
                            />

                            {/* Education level name inside bar (rotated) */}
                            <LabelList
                                dataKey="education"
                                content={<CustomBarLabel />}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default EducationBarChart;
