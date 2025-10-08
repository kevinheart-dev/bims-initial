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
        <div className="w-full h-[210px] p-0 flex flex-col">

            <div className="flex-1 w-full">
                <ResponsiveContainer width="105%" height="110%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 0, right: 20, left: -20, bottom: 5 }}
                    >
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#4A90E2" />
                            </linearGradient>
                        </defs>

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
                        <Bar dataKey="count" fill="url(#barGradient)" barSize={30} radius={[0, 8, 8, 0]}>
                            <LabelList
                                dataKey="count"
                                position="right"
                                formatter={(val) => val.toLocaleString()}
                                style={{ fontSize: '11px', fill: '#4A90E2', fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeDistribution;
