// src/components/Overview/EmploymentStatusTable.jsx

import React from "react";

const EmploymentStatusTable = ({ employmentStatusData }) => {
    if (!employmentStatusData || Object.keys(employmentStatusData).length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No employment status data available.
            </div>
        );
    }

    // Convert object to array format for easier mapping
    const employmentArray = Object.entries(employmentStatusData).map(([status, total]) => ({
        status,
        total,
    }));
    // Compute total population for percentage calculation
    const totalPopulation = employmentArray.reduce((sum, item) => sum + item.total, 0);

    return (
        <div
            className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm"
            style={{
                background: "white",
            }}
        >
            <div className="max-h-80 overflow-y-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="sticky top-0 bg-[#f8faff] shadow-sm z-10">
                        <tr className="border-b border-gray-200">
                            <th className="px-4 py-3 font-semibold text-[#093a7b] whitespace-nowrap">
                                Employment Category
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#093a7b] text-right whitespace-nowrap">
                                Population
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#093a7b] text-right whitespace-nowrap">
                                Percentage
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {employmentArray.map((item, index) => {
                            const formattedStatus = item.status.replace(/_/g, " ");
                            const percentage =
                                totalPopulation > 0
                                    ? ((item.total / totalPopulation) * 100).toFixed(2)
                                    : 0;

                            return (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-900"
                                >
                                    <td className="px-4 py-2 font-medium capitalize break-words max-w-[200px]">
                                        {formattedStatus}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                        {item.total.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                        {percentage}%
                                    </td>
                                </tr>
                            );
                        })}

                        {/* Total Row */}
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

export default EmploymentStatusTable;
