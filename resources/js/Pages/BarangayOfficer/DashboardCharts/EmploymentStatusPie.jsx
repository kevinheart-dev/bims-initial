import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const EmploymentStatusPieChart = ({ employmentStatusData }) => {
    if (!employmentStatusData || Object.keys(employmentStatusData).length === 0) {
        return (
            <div className="p-4 text-gray-500 text-center">
                No employment data available.
            </div>
        );
    }

    // Convert object to array
    const chartData = Object.entries(employmentStatusData).map(([status, total]) => ({
        name: status.replace(/_/g, " "),
        value: total,
    }));

    // Shades of blue
    const COLORS = ["#093a7b", "#1d4ed8", "#2563eb", "#3b82f6", "#60a5fa"];

    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        labelLine={false}
                        isAnimationActive={true}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="#ffffff"
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>

                    {/* Tooltip now includes percentage */}
                    <Tooltip
                        formatter={(value, name, props) => {
                            const total = chartData.reduce((sum, item) => sum + item.value, 0);
                            const percentage = ((value / total) * 100).toFixed(2);
                            return [
                                `${value.toLocaleString()} (${percentage}%)`,
                                name.charAt(0).toUpperCase() + name.slice(1),
                            ];
                        }}
                        contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            color: "#093a7b",
                        }}
                    />

                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmploymentStatusPieChart;
