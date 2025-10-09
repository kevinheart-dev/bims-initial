// src/components/Overview/TopBarangaysPieChart.jsx

import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const prepareTop10Data = (data) => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => b.population - a.population);

    const top10 = sortedData.slice(0, 10);

    const top10TotalPopulation = top10.reduce((sum, item) => sum + (item.population || 0), 0);

    return top10.map(item => ({
        name: item.barangay_name,
        value: item.population || 0,
        percentage: ((item.population / top10TotalPopulation) * 100).toFixed(2)
    }));
};

const COLORS = [
    '#1976D2', // Primary Blue
    '#00BCD4', // Cyan/Teal
    '#3F51B5', // Indigo
    '#03A9F4', // Light Sky Blue
    '#009688', // Dark Teal
    '#2196F3', // Brighter Blue
    '#673AB7', // Deep Violet-Blue
    '#4DD0E1', // Lighter Cyan
    '#9FA8DA', // Light Indigo
    '#81D4FA'  // Pale Blue
];


const TopBarangaysPieChart = ({ populationPerBarangay }) => {
    const chartData = prepareTop10Data(populationPerBarangay);

    return (

        <div className="h-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            // Increased outerRadius for a bigger pie chart
                            outerRadius={120}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value.toLocaleString()} residents (${props.payload.percentage}%)`,
                                // Using props.payload.name here, as that is the dataKey we are mapping
                                props.payload.name
                            ]}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            // Set iconType to 'circle' for bullet point style
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                    No sufficient data to display Top 10 chart.
                </div>
            )}
        </div>
    );
};

export default TopBarangaysPieChart;
