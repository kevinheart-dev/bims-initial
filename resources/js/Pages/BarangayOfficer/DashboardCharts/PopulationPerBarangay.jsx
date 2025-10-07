import React from 'react';
import {
    BarChart,
    Bar,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList,
    // ResponsiveContainer is removed as we are setting a fixed width for scroll
} from 'recharts';

// NOTE: We need to modify CustomTooltip to accept isPurokView as a prop
// to change the label from "Barangay" to "Purok".
const CustomTooltip = ({ active, payload, isPurokView }) => {
    if (active && payload && payload.length) {
        const name = payload[0].payload.name; // This is the barangay name or purok number
        const population = payload[0].value;

        // Dynamic Label
        const label = isPurokView ? 'Purok' : 'Barangay';

        return (
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[140px]">
                <p className="font-semibold text-gray-700">{`${label}: ${name}`}</p>
                <p className="font-semibold text-gray-700">
                    Population: <span className="font-bold">{population.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};


const CustomBarLabel = (props) => {
    // ... (CustomBarLabel remains exactly the same, it only displays the value) ...
    const { x, y, width, height, value } = props;
    const textX = x + width / 2;
    const textY = y + height / 2;

    return (
        <text
            x={textX}
            y={textY}
            fill="#1e3a8a"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(-90, ${textX}, ${textY})`} // Rotate around its center
            style={{
                fontSize: '10px',
                fontWeight: 'bold',
                pointerEvents: 'none', // prevent tooltip hover issues
            }}
        >
            {value}
        </text>
    );
};


// Main Component - UPDATED
function PopulationPerBarangay({ populationPerBarangay, isPurokView = false }) { // <-- Accept isPurokView

    // Determine the chart title dynamically
    const chartTitle = isPurokView
        ? "Population Distribution per Purok"
        : "Population Distribution per Barangay";

    const data = Object.entries(populationPerBarangay).map(([key, value]) => ({
        // Ensure Purok numbers are treated as strings if necessary, but the key (name) works fine.
        name: key,
        value: value,
    }));

    const chartData = data.filter(item => item.value > 0);

    // 1. Calculate the required chart width for scrolling
    const BAR_WIDTH_AND_SPACING = 50;
    const MIN_CHART_WIDTH = 600;

    const calculatedWidth = chartData.length * BAR_WIDTH_AND_SPACING;
    const chartWidth = Math.max(calculatedWidth, MIN_CHART_WIDTH);
    const chartHeight = 260;

    return (
        <div className="w-full h-[280px] p-4 flex flex-col">
            <h3 className="text-gray-700 font-semibold text-lg mb-4">
                {chartTitle} {/* <-- Use the dynamic title */}
            </h3>

            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <BarChart
                    width={chartWidth}
                    height={chartHeight}
                    data={chartData}
                    margin={{ top: 15, right: 10, left: -25, bottom: 80 }}
                >
                    <defs>
                        <linearGradient id="whiteToBlue" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="2 2" />
                    <YAxis tick={{ fontSize: 10 }} />
                    {/* Pass isPurokView to the CustomTooltip */}
                    <Tooltip content={<CustomTooltip isPurokView={isPurokView} />} />
                    <Bar
                        dataKey="value"
                        fill="url(#whiteToBlue)"
                        barSize={35}
                        radius={[10, 10, 0, 0]}
                    >
                        {/* Label for the population value (at the top of the bar) */}
                        <LabelList
                            dataKey="value"
                            position="top"
                            formatter={(val) => val.toLocaleString()}
                            style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                        />

                        {/* Label for the barangay/purok name (inside the bar, rotated vertically) */}
                        <LabelList
                            dataKey="name"
                            content={<CustomBarLabel />}
                        />
                    </Bar>
                </BarChart>
            </div>
        </div>
    );
}


export default PopulationPerBarangay;
