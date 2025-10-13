// src/components/Overview/BarangayPopulationTable.jsx

import React from "react";

const BarangayPopulationTable = ({ populationPerBarangay }) => {
    if (!populationPerBarangay || populationPerBarangay.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No population data available.
            </div>
        );
    }

    // Compute total population
    const totalPopulation = populationPerBarangay.reduce(
        (sum, data) => sum + (data.population || 0),
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
                                Barangay
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
                        {populationPerBarangay
                            .filter((data) => data)
                            .map((data, index) => {
                                const percentage =
                                    totalPopulation > 0
                                        ? (data.population / totalPopulation) * 100
                                        : 0;

                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-2 font-medium text-gray-800 break-words max-w-[180px]">
                                            {data.barangay_name}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-700">
                                            {(data.population || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-700">
                                            {percentage.toFixed(2)}%
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BarangayPopulationTable;
