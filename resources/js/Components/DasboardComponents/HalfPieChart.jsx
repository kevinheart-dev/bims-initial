import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Counter from "@/Components/Counter";

function HalfPieChart({
    title,
    distribution,
    fillColor = "#3b82f6",
    labelName,
    gradientId,
    gradientColor,
}) {
    const filled = distribution[1] ?? 0;
    const remaining = distribution[0] ?? 0;
    const total = filled + remaining;
    const percentage = total > 0 ? (filled / total) * 100 : 0;

    const data = [
        { name: labelName, value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    const gradientFill = gradientId ? `url(#${gradientId})` : fillColor;

    return (
        <div className="flex items-center justify-between p-4 w-full h-[250px] md:h-[160px]">

            <div className="flex flex-col justify-center">
                <h3 className="text-gray-600 font-medium text-sm">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    <Counter end={filled} />
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {filled} out of {total}
                </p>
            </div>

            <div className="flex-1 h-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {gradientId && gradientColor && (
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
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
                                    fill={index === 0 ? gradientFill : "#e5e7eb"}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

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
