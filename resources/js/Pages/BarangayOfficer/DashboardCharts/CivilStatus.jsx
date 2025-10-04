import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]; // blue shades

const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
};

function CivilStatus({ civilStatusDistribution }) {
    // Convert { Single: 20, Married: 30 } → [{name: 'Single', value: 20}, ...]
    const chartData = Object.entries(civilStatusDistribution).map(([key, value]) => ({
        name: key,
        value: value,
    }));

    const width = useWindowWidth();
    const isMobile = width < 768;

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="w-full flex flex-col items-center relative rounded-2xl p-6">

            {/* Donut Chart */}
            <ResponsiveContainer width="100%" height={isMobile ? 260 : 240}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

            {/* Center total only */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p className="text-xl font-bold text-gray-800">{total}</p>
            </div>

            {/* Legend below chart */}
            <div className="mt-4 w-full">
                {chartData.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700 mb-2"
                    >
                        <div className="flex items-center">
                            <span
                                className="inline-block w-4 h-4 rounded-full mr-2"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
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

export default CivilStatus;
