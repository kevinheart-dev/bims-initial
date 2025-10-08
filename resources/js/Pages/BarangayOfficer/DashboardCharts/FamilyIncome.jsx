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

// Helper to format bracket
const formatBracket = (bracket) => {
    return bracket
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const entry = payload[0].payload;
        return (
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[140px]">
                <p className="font-semibold text-gray-700">{`Income Category: ${label} (${formatBracket(
                    entry.income_bracket
                )})`}</p>
                <p className="font-semibold text-gray-700">
                    Families: <span className="font-bold">{entry.total}</span>
                </p>
            </div>
        );
    }
    return null;
};

function FamilyIncomeBarChart({ familyIncome }) {
    const allCategories = [
        "Survival",
        "Poor",
        "Low Income",
        "Lower Middle Income",
        "Middle Income",
        "Upper Middle Income",
        "High Income",
    ];

    const completeData = allCategories.map((cat) => {
        const found = familyIncome.find((f) => f.income_category === cat);
        return found || {
            income_category: cat,
            income_bracket: "",
            total: 0,
        };

    });

    return (
        <div className="w-full h-[325px] p-4 flex flex-col">
            <h3 className="text-gray-700 font-semibold text-lg mb-4">
                Family Income Distribution
            </h3>

            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={completeData}
                        margin={{ top: 20, right: 0, left: -40, bottom: 30 }}
                    >
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis
                            dataKey="income_category"
                            interval={0} // show all labels
                            tick={({ x, y, payload }) => {
                                const words = payload.value.split(" "); // split into words
                                return (
                                    <text x={x} y={y + 15} textAnchor="middle" fontSize={10}>
                                        {words.map((word, index) => (
                                            <tspan key={index} x={x} dy={index === 0 ? 0 : 12}>
                                                {word}
                                            </tspan>
                                        ))}
                                    </text>
                                );
                            }}
                        />

                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />

                        <Bar
                            dataKey="total"
                            fill="url(#blueGradient)"
                            barSize={50}
                            radius={[10, 10, 0, 0]}
                        >
                            <LabelList
                                dataKey="total"
                                position="top"
                                formatter={(val) => val.toLocaleString()}
                                style={{ fontSize: "12px", fill: "#1e3a8a", fontWeight: "bold" }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default FamilyIncomeBarChart;
