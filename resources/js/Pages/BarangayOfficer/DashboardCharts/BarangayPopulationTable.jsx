// src/components/Overview/BarangayPopulationTable.jsx

import React from 'react';

const BarangayPopulationTable = ({ populationPerBarangay }) => {
    if (!populationPerBarangay || populationPerBarangay.length === 0) {
        return <div className="p-4 text-center text-gray-500">No population data available.</div>;
    }

    // Compute total population
    const totalPopulation = populationPerBarangay.reduce(
        (sum, data) => sum + (data.population || 0),
        0
    );

    return (
        <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-sm">
                {/* Table Header - Sticky during scroll */}
                <thead className="sticky top-0 bg-[#f8faff] shadow-sm">
                    <tr className="border-b">
                        <th className="px-4 py-2 font-semibold text-[#093a7b]">Barangay</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Population</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {populationPerBarangay
                        .filter(data => data)
                        .map((data, index) => {
                            const percentage =
                                totalPopulation > 0
                                    ? (data.population / totalPopulation) * 100
                                    : 0;

                            return (
                                <tr key={index} className="border-b hover:bg-gray-50/50">
                                    <td className="px-4 py-2 font-medium">{data.barangay_name}</td>
                                    <td className="px-4 py-2 text-right">
                                        {(data.population || 0).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        {percentage.toFixed(2)}%
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default BarangayPopulationTable;
