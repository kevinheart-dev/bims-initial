import React from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// 🎨 Vibrant, distinct colors (6 core + auto-fallback)
const COLORS = [
    "#06b6d4", // Teal
    "#f43f5e", // Coral Red
    "#a855f7", // Violet
    "#facc15", // Gold
    "#10b981", // Emerald Green
    "#fb923c", // Orange
];

// Function to dynamically create a new color if ethnicity exceeds predefined COLORS
const generateColor = (index) => {
    if (index < COLORS.length) return COLORS[index];
    // Generate a fallback color using HSL for uniqueness
    const hue = (index * 45) % 360;
    return `hsl(${hue}, 70%, 60%)`;
};

// Helper to calculate percentage
const calculatePercentage = (value, total) => {
    return total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
};

const EthnicityBarChart = ({ ethnicityDistribution = {} }) => {
    const dataArray = Object.entries(ethnicityDistribution).map(([ethnicity, total]) => ({
        ethnicity,
        total,
    }));

    const totalPopulation = dataArray.reduce((acc, curr) => acc + curr.total, 0);

    const stackedData = [
        { name: "Population", ...ethnicityDistribution },
    ];

    return (
        <div className="w-full p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <h3 className="text-xl text-gray-800 font-bold mb-4">
                Ethnicity Distribution
            </h3>

            <ResponsiveContainer width="100%" height={50}>
                <BarChart data={stackedData} layout="vertical" margin={{ left: 2, right: 2 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />

                    {dataArray.map((entry, index) => {
                        const isFirst = index === 0;
                        const isLast = index === dataArray.length - 1;
                        return (
                            <Bar
                                key={entry.ethnicity}
                                dataKey={entry.ethnicity}
                                stackId="a"
                                fill={generateColor(index)}
                                radius={isFirst ? [10, 0, 0, 10] : isLast ? [0, 10, 10, 0] : 0}
                            />
                        );
                    })}

                    <Tooltip
                        formatter={(value, name) => [`${value}`, `${name}`]}
                        cursor={{ fill: "transparent" }}
                    />
                </BarChart>
            </ResponsiveContainer>

            <hr className="my-4" />

            {/* Scrollable Legend / Breakdown List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[175px]">
                {dataArray.map((entry, index) => {
                    const percentage = calculatePercentage(entry.total, totalPopulation);
                    return (
                        <div
                            key={entry.ethnicity}
                            className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                        >
                            {/* Color Swatch + Name */}
                            <div className="flex items-center gap-3 w-1/2">
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: generateColor(index) }}
                                ></span>
                                <span className="text-sm text-gray-700 font-medium truncate">
                                    {entry.ethnicity}
                                </span>
                            </div>

                            {/* Value */}
                            <span className="text-sm text-gray-800 font-semibold w-1/4 text-right">
                                {entry.total.toLocaleString()}
                            </span>

                            {/* Percentage */}
                            <span className="text-sm text-gray-600 w-1/4 text-right">
                                ({percentage}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EthnicityBarChart;
