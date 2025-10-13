import React, { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
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

    // 🎨 Complementary & balanced color palette
    const COLORS = ["#3B82F6", "#F97316", "#10B981", "#A855F7", "#EF4444"];

    // Total population for percentage display
    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    // 📱 Responsive font scaling
    const [fontSize, setFontSize] = useState(14);
    const [radius, setRadius] = useState(120);

    useEffect(() => {
        const updateChartSize = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setFontSize(10);
                setRadius(70);
            } else if (width < 768) {
                setFontSize(12);
                setRadius(90);
            } else if (width < 1024) {
                setFontSize(14);
                setRadius(110);
            } else {
                setFontSize(16);
                setRadius(130);
            }
        };

        updateChartSize();
        window.addEventListener("resize", updateChartSize);
        return () => window.removeEventListener("resize", updateChartSize);
    }, []);

    return (
        <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="45%"
                        cy="50%"
                        outerRadius={radius}
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

                    {/* 🧠 Custom Tooltip */}
                    <Tooltip
                        formatter={(value, name) => {
                            const percentage = ((value / total) * 100).toFixed(2);
                            return [
                                `${value.toLocaleString()} (${percentage}%)`,
                                name.charAt(0).toUpperCase() + name.slice(1),
                            ];
                        }}
                        contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.75rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            color: "#111827",
                            fontSize: `${fontSize}px`,
                            fontWeight: 500,
                        }}
                        itemStyle={{ color: "#1f2937" }}
                    />

                    {/* 📊 Responsive Legend */}
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        iconType="circle"
                        wrapperStyle={{
                            paddingLeft: 10,
                            lineHeight: "1.6rem",
                            fontSize: `${fontSize}px`,
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EmploymentStatusPieChart;
