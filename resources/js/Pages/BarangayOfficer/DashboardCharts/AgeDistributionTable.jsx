// src/components/Overview/AgeDistributionTable.jsx

import React from 'react';

const AgeDistributionTable = ({ ageDistributionData }) => {
    if (!ageDistributionData || Object.keys(ageDistributionData).length === 0) {
        return <div className="p-4 text-center text-gray-500">No age distribution data available.</div>;
    }

    // Compute total population for percentages
    const totalPopulation = Object.values(ageDistributionData).reduce((sum, value) => sum + value, 0);

    return (
        <div className="max-h-70 overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#f8faff] shadow-sm">
                    <tr className="border-b">
                        <th className="px-4 py-2 font-semibold text-[#093a7b]">Age Group</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Population</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(ageDistributionData).map(([ageGroup, count], index) => {
                        const percentage = totalPopulation > 0 ? (count / totalPopulation) * 100 : 0;
                        return (
                            <tr key={index} className="border-b hover:bg-gray-50/50">
                                <td className="px-4 py-2 font-medium">{ageGroup}</td>
                                <td className="px-4 py-2 text-right">{count.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{percentage.toFixed(2)}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AgeDistributionTable;
