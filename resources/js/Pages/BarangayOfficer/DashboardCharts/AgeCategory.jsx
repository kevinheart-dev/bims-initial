import React from "react";
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

// Blue shades only
const COLORS = ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa"];

const AgeCategory = ({ ageCategory }) => {
    // Convert object into array
    const data = Object.entries(ageCategory).map(([key, value]) => ({
        name: key,
        value: value,
        fill: COLORS[Math.floor(Math.random() * COLORS.length)], // assign random blue shade
    }));

    // Calculate total only
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="w-full h-[350px] rounded-2xl p-6 flex flex-col">
            <p className="text-sm text-gray-500 mb-4">Total: <span className="font-semibold text-blue-600">{total}</span></p>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value">
                            <LabelList dataKey="value" position="top" />
                            {data.map((entry, index) => (
                                <cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeCategory;
