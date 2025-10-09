import React from "react";
import {
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { barangay_name, population } = payload[0].payload;

        return (
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[140px]">
                <p className="font-semibold text-gray-700">
                    Barangay: {barangay_name}
                </p>
                <p className="font-semibold text-gray-700">
                    Population:{" "}
                    <span className="font-bold">
                        {Number(population).toLocaleString()}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

// Custom vertical label inside each bar
const CustomBarLabel = ({ x, y, width, height, value }) => {
    const textX = x + width / 2;
    const textY = y + height / 2;

    return (
        <text
            x={textX}
            y={textY}
            fill="#1e3a8a"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, ${textX}, ${textY})`}
            style={{
                fontSize: "10px",
                fontWeight: "bold",
                pointerEvents: "none",
            }}
        >
            {value}
        </text>
    );
};

const PopulationChart = ({ populationPerBarangay }) => {
    if (
        !Array.isArray(populationPerBarangay) ||
        populationPerBarangay.length === 0
    ) {
        return (
            <p className="text-center text-gray-600 font-semibold mt-6">
                No population data available.
            </p>
        );
    }

    // ✅ Filter out barangays with 0 or null population
    const chartData = populationPerBarangay
        .filter((item) => item.population && item.population > 0)
        .map((item) => ({
            name: item.barangay_name,
            population: item.population,
            barangay_name: item.barangay_name,
        }));

    // Check if any valid barangay remains
    if (chartData.length === 0) {
        return (
            <p className="text-center text-gray-600 font-semibold mt-6">
                No population data available.
            </p>
        );
    }

    const chartWidth = Math.max(chartData.length * 60, 1200);
    const chartHeight = 300;

    return (
        <div className="w-full h-[350px] p-4 flex flex-col">

            {/* ✅ Scrollable Chart Container */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <BarChart
                    width={chartWidth}
                    height={chartHeight}
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                >
                    <defs>
                        <linearGradient id="whiteToBlue" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="2 2" />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                        dataKey="population"
                        fill="url(#whiteToBlue)"
                        barSize={45}
                        radius={[10, 10, 0, 0]}
                    >


                        {/* Inside bar vertical label */}
                        <LabelList
                            dataKey="name"
                            content={<CustomBarLabel />}
                        />
                    </Bar>
                </BarChart>
            </div>
        </div>
    );
};

export default PopulationChart;
