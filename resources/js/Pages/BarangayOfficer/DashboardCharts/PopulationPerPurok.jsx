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
            <div className="bg-white/40 backdrop-blur-md px-4 py-2 shadow-lg rounded-2xl border border-white/40 text-sm text-gray-800 min-w-[140px]">
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
        <ResponsiveContainer width="100%" height={220}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: -10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    label={{ position: "insideBottom", offset: -5 }}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#4A90E2" barSize={35} radius={[10, 10, 0, 0]}>
                    <LabelList
                        dataKey="value"
                        position="top"
                        formatter={(val) => val.toLocaleString()}
                        style={{ fontSize: '12px', fill: '#4A90E2', fontWeight: 'bold' }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

export default PopulationPerPurok;
