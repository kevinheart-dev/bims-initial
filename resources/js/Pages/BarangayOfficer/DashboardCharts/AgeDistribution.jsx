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

// Custom tooltip for age distribution
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/40 backdrop-blur-md px-4 py-2 shadow-lg rounded-2xl border border-white/40 text-sm text-gray-800 min-w-[140px]">
                <p className="font-semibold text-gray-700">{`${label}`}</p>
                <p className="font-semibold text-gray-700">
                    Count: <span className="font-bold">{payload[0].value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const AgeDistribution = ({ ageDistribution }) => {
    // --- FIX IS HERE: Define labelMap before using it ---
    const labelMap = {
        "0-6 months": "0-6m",
        "7 mos. to 2 years old": "7m-2y",
        "3-5 years old": "3-5y",
        "6-12 years old": "6-12y",
        "13-17 years old": "13-17y",
        "18-59 years old": "18-59y",
        "60 years old and above": "60+y",
    };

    const data = Object.entries(ageDistribution).map(([ageGroup, count]) => ({
        ageGroup: labelMap[ageGroup] || ageGroup,
        count,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 0, right: 20, left: -20, bottom: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: '#4A90E2', fontWeight: 'bold' }}
                />
                <YAxis
                    dataKey="ageGroup"
                    type="category"
                    tick={{ fontSize: 10, fill: '#4A90E2', fontWeight: 'bold' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#4A90E2" barSize={20}>
                    <LabelList
                        dataKey="count"
                        position="right"
                        formatter={(val) => val.toLocaleString()}
                        style={{ fontSize: '12px', fill: '#4A90E2', fontWeight: 'bold' }}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default AgeDistribution;
