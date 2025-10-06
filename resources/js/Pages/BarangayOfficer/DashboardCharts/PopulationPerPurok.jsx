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
            <div className="bg-white px-4 py-2 shadow-lg rounded-2xl border border-gray-200 text-sm text-gray-800 min-w-[140px]">
                <p className="font-semibold text-gray-700">{`Purok: ${label}`}</p>
                <p className="font-semibold text-gray-700">
                    Population: <span className="font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

function PopulationPerPurok({ populationPerPurok }) {
    const data = Object.entries(populationPerPurok).map(([key, value]) => ({
        name: key,
        value: value,
    }));

    return (
        <div className="w-full h-[280px] p-4 flex flex-col">
            {/* Title */}
            <h3 className="text-gray-700 font-semibold text-lg mb-4">
                Population Distribution per Purok
            </h3>

            {/* Chart */}
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: -10, left: -40, bottom: 10 }}
                    >
                        <defs>
                            <linearGradient id="whiteToBlue" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
                                <stop offset="100%" stopColor="#3B82F6" stopOpacity={1} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="value"
                            fill="url(#whiteToBlue)"
                            barSize={50}
                            radius={[10, 10, 0, 0]}
                        >
                            <LabelList
                                dataKey="value"
                                position="top"
                                formatter={(val) => val.toLocaleString()}
                                style={{ fontSize: '12px', fill: '#1e3a8a', fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default PopulationPerPurok;
