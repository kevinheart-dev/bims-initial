import Counter from "@/Components/Counter";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function VotersDistribution({ voterDistribution }) {
    const total = (voterDistribution.Registered || 0) + (voterDistribution.Unregistered || 0);
    const percentage = total > 0 ? ((voterDistribution.Registered || 0) / total) * 100 : 0;
    const data = [
        { name: "Registered", value: percentage },
        { name: "Unregistered", value: 100 - percentage },
    ];

    return (
        <div className="flex items-center justify-between p-4 w-full h-[250px] md:h-[160px]">
            {/* Left Side: Text */}
            <div className="flex flex-col justify-center">
                <h3 className="text-gray-600 font-medium text-sm">Voters Distribution</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                    <Counter end={voterDistribution.Registered || 0} />
                </p>
                <p className="text-xs text-gray-500 mt-0.5">registered out of {total}</p>
            </div>

            {/* Right Side: Half Pie */}
            <div className="flex-1 h-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Define gradient from white to blue */}
                        <defs>
                            <linearGradient id="whiteToBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>

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
                                    fill={index === 0 ? "url(#whiteToBlue)" : "#e5e7eb"}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Percentage inside chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-gray-800 translate-y-7">{percentage.toFixed(1)}%</p>
                </div>
            </div>
        </div>
    );
}

export default VotersDistribution;
