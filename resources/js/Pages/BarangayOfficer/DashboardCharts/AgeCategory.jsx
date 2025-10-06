import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";

const AGE_LABELS = {
    'Child': [0, 14],
    'Youth': [15, 30],
    'Adult': [31, 59],
    'Senior': [60, 200],
};

const AgeCategory = ({ ageCategory }) => {
    const data = Object.entries(ageCategory).map(([key, value]) => ({
        name: `${key}\n(${AGE_LABELS[key][0]}-${AGE_LABELS[key][1]})`, // Two lines
        value,
    }));

    return (
        <div className="w-full h-[210px] p-0 flex flex-col">
            <ResponsiveContainer width="100%" height="110%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 0, left: 5, bottom: -10 }}
                >
                    {/* Horizontal Gradient: White -> Blue */}
                    <defs>
                        <linearGradient id="horizontalGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#1e3a8a" }} />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{
                            fontSize: 10,
                            fill: "#1e3a8a",
                            whiteSpace: "pre-line", // enable multiline
                            fontWeight: "bold",
                        }}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="value"
                        fill="url(#horizontalGradient)"
                        radius={[0, 10, 10, 0]}
                    >
                        <LabelList
                            dataKey="value"
                            position="right"
                            style={{ fontSize: "12px", fill: "#1e3a8a", fontWeight: "bold" }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AgeCategory;
