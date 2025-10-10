// src/components/Overview/AgeCategoryGraph.jsx
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-3 py-2 shadow-lg rounded-xl border border-gray-200 text-xs text-gray-800">
                <p className="font-semibold text-gray-700">{label}</p>
                <p className="font-semibold text-gray-700">
                    Count: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
                </p>
            </div>
        );
    }
    return null;
};

const AgeCategoryGraph = ({ ageCategoryData }) => {
    const data = Object.entries(ageCategoryData).map(([category, count]) => ({
        category,
        count,
    }));

    return (
        <div className="w-full h-full p-0 flex flex-col">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 0, right: 20, left: 20, bottom: 5 }}
                >
                    {/* Gradient for bars */}
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#4A90E2" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tick={{ fontSize: 12, fill: '#4A90E2', fontWeight: 'bold' }}
                    />
                    <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fontSize: 12, fill: '#4A90E2', fontWeight: 'bold' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        barSize={30}
                        radius={[0, 8, 8, 0]}
                    >
                        <LabelList
                            dataKey="count"
                            position="right"
                            formatter={(val) => val.toLocaleString()}
                            style={{ fontSize: '12px', fill: '#4A90E2', fontWeight: 'bold' }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AgeCategoryGraph;
