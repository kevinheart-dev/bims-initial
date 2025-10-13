// src/components/Overview/AgeDistributionTable.jsx

import React from "react";

const AgeDistributionTable = ({ ageDistributionData }) => {
    if (!ageDistributionData || Object.keys(ageDistributionData).length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No age distribution data available.
            </div>
        );
    }

    // Compute total population for percentages
    const totalPopulation = Object.values(ageDistributionData).reduce(
        (sum, value) => sum + value,
        0
    );

    return (
        <div
            className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm"
            style={{
                background: "white",
            }}
        >
            <div className="max-h-80 overflow-y-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    {/* Table Header */}
                    <thead className="sticky top-0 bg-[#f8faff] shadow-sm z-10">
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 font-semibold text-[#093a7b] whitespace-nowrap">
                                Age Group
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#093a7b] text-right whitespace-nowrap">
                                Population
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#093a7b] text-right whitespace-nowrap">
                                Percentage
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {Object.entries(ageDistributionData).map(
                            ([ageGroup, count], index) => {
                                const percentage =
                                    totalPopulation > 0
                                        ? (count / totalPopulation) * 100
                                        : 0;
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-2 font-medium text-gray-800 break-words max-w-[160px]">
                                            {ageGroup}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-700">
                                            {count.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-700">
                                            {percentage.toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            }
                        )}

                        {/* Summary row */}
                        <tr className="font-semibold bg-gray-50 border-t border-gray-200">
                            <td className="px-4 py-2 text-[#093a7b]">Total</td>
                            <td className="px-4 py-2 text-right text-[#093a7b]">
                                {totalPopulation.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right text-[#093a7b]">100%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgeDistributionTable;
