// src/components/Overview/TopBarangaysPieChart.jsx

import React, { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    ResponsiveContainer,
    Legend,
} from "recharts";

const prepareTop10Data = (data) => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => b.population - a.population);
    const top10 = sortedData.slice(0, 10);
    const total = top10.reduce((sum, item) => sum + (item.population || 0), 0);

    return top10.map((item) => ({
        name: item.barangay_name,
        value: item.population || 0,
        percentage: ((item.population / total) * 100).toFixed(2),
    }));
};

// 🌈 Refined complementary color palette (vibrant + balanced)
const COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EF4444", // Red
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#EC4899", // Pink
    "#6366F1", // Indigo
    "#F97316", // Orange
];

const TopBarangaysPieChart = ({ populationPerBarangay }) => {
    const chartData = prepareTop10Data(populationPerBarangay);

    // 📱 Responsive chart size and text scaling
    const [outerRadius, setOuterRadius] = useState(120);
    const [fontSize, setFontSize] = useState(14);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 480) {
                setOuterRadius(70);
                setFontSize(10);
            } else if (width < 768) {
                setOuterRadius(90);
                setFontSize(12);
            } else if (width < 1024) {
                setOuterRadius(110);
                setFontSize(13);
            } else {
                setOuterRadius(130);
                setFontSize(15);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full h-[400px] sm:h-[100px] md:h-[1700px] lg:h-[270px] xl:h-[370px]">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="45%"
                            cy="50%"
                            outerRadius={outerRadius}
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

                        {/* 🧠 Enhanced tooltip with population + percentage */}
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value.toLocaleString()} residents (${props.payload.percentage}%)`,
                                props.payload.name,
                            ]}
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "1px solid #e5e7eb",
                                borderRadius: "0.75rem",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                fontSize: `${fontSize}px`,
                                fontWeight: 500,
                                color: "#111827",
                            }}
                        />

                        {/* 🗂 Clean, adaptive legend */}
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
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm sm:text-base">
                    No sufficient data to display Top 10 chart.
                </div>
            )}
        </div>
    );
};

export default TopBarangaysPieChart;
