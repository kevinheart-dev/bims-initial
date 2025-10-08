import Counter from "@/Components/Counter";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
};

function GenderDonutChart({ genderDistribution, sexDistribution, view }) {
    const genderData = [
        { name: "LGBTQ", value: genderDistribution["lgbtq"] || 0 },
        { name: "Female", value: genderDistribution["female"] || 0 },
        { name: "Male", value: genderDistribution["male"] || 0 },
    ];

    const sexData = [
        { name: "Male", value: sexDistribution["male"] || 0 },
        { name: "Female", value: sexDistribution["female"] || 0 },
    ];

    const activeData = view === "sex" ? sexData : genderData;

    const width = useWindowWidth();
    const isMobile = width < 768;

    const total = activeData.reduce((sum, item) => sum + item.value, 0);

    const BLUE_SHADES = [
        { start: "#1e3a8a", end: "#3b82f6" },
        { start: "#1d4ed8", end: "#4f46e5" },
        { start: "#0ea5e9", end: "#3b82f6" },
    ];


    return (
        <div className="w-full h-[210px] flex flex-col items-center relative">
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 220}>
                <PieChart>
                    <defs>
                        {activeData.map((entry, index) => (
                            <linearGradient
                                key={`grad-${index}`}
                                id={`grad-${index}`}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                <stop offset="0%" stopColor={BLUE_SHADES[index].start} />
                                <stop offset="100%" stopColor={BLUE_SHADES[index].end} />
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="35%"
                        innerRadius="40%"
                        outerRadius="70%"
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#grad-${index})`} />
                        ))}
                    </Pie>

                    <Tooltip
                        formatter={(value) =>
                            `${value} (${((value / total) * 100).toFixed(1)}%)`
                        }
                        contentStyle={{
                            background: "rgba(255, 255, 255, 0.9)",
                            border: "1px solid rgba(209, 213, 219, 0.5)",
                            borderRadius: "0.75rem",
                            boxShadow:
                                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-2xl font-bold text-gray-800 -translate-y-7">
                    <Counter end={total} />
                </p>
            </div>

            {/* Legend */}
            <div className="mt-4 w-full">
                {activeData.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700 mb-2"
                    >
                        <div className="flex items-center">
                            <span
                                className="inline-block w-4 h-4 rounded-full mr-2"
                                style={{
                                    background: `linear-gradient(to right, ${BLUE_SHADES[index].start}, ${BLUE_SHADES[index].end})`,
                                }}
                            ></span>
                            <span>{entry.name}</span>
                        </div>
                        <span className="font-semibold">
                            {entry.value} ({((entry.value / total) * 100).toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GenderDonutChart;
