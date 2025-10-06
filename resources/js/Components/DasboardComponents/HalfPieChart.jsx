import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Counter from "@/Components/Counter";

function HalfPieChart({
    title,
    distribution,
    fillColor = "#3b82f6", // Kept for default/fallback, but gradient will be used
    labelName,
    gradientId, // New prop: ID for the gradient definition
    gradientColor, // New prop: The color at the end of the gradient
}) {
    const keys = Object.keys(distribution);
    const filledKey = keys[0] ?? null;
    const remainingKey = keys[1] ?? null;

    const filled = filledKey ? distribution[filledKey] : 0;
    const remaining = remainingKey ? distribution[remainingKey] : 0;

    const total = filled + remaining;
    const percentage = total > 0 ? (filled / total) * 100 : 0;

    const data = [
        { name: labelName, value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    // Determine the gradient fill URL for the filled slice
    const gradientFill = gradientId ? `url(#${gradientId})` : fillColor;

    return (
        <div className="flex items-center justify-between p-4 w-full h-[250px] md:h-[160px]">
            {/* Left Side */}
            <div className="flex flex-col justify-center">
                <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    <Counter end={filled} />
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {filled} out of {total}
                </p>
            </div>

            {/* Right Side */}
            <div className="flex-1 h-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* 1. Define the gradient inside the PieChart using <defs> */}
                        {gradientId && gradientColor && (
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                                    {/* Stop 1: White at 0% of the gradient (start of the pie arc) */}
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                                    {/* Stop 2: The end color at 100% of the gradient (end of the pie arc) */}
                                    <stop offset="100%" stopColor={gradientColor} stopOpacity={1} />
                                </linearGradient>
                            </defs>
                        )}
                        <Pie
                            data={data}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            innerRadius="90%"
                            outerRadius="130%"
                            stroke="none"
                            cx="50%"
                            cy="80%"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    // 2. Use the gradientFill for the first (filled) slice
                                    fill={index === 0 ? gradientFill : "#e5e7eb"}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Percentage inside chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-gray-800 translate-y-7">
                        {percentage.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
}

export default HalfPieChart;
