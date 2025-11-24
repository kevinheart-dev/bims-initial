// src/components/Overview/FamilyIncomeTable.jsx

import React from "react";

const FamilyIncomeTable = ({ familyIncomeData }) => {
    if (!familyIncomeData || familyIncomeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No family income data available.
            </div>
        );
    }
    console.log(familyIncomeData);
    // Compute total population for percentages
    const totalPopulation = familyIncomeData.reduce(
        (sum, item) => sum + item.total,
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
                                Income Category
                            </th>
                            <th className="px-4 py-3 font-semibold text-[#093a7b] whitespace-nowrap">
                                Income Bracket
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
                        {familyIncomeData.map((item, index) => {
                            const percentage =
                                totalPopulation > 0
                                    ? (
                                          (item.total / totalPopulation) *
                                          100
                                      ).toFixed(2)
                                    : 0;
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-gray-900"
                                >
                                    <td className="px-4 py-2 font-medium text-gray-800 break-words max-w-[160px]">
                                        {item.income_category}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 break-words max-w-[160px]">
                                        {(item.income_bracket ?? "").replace(
                                            /_/g,
                                            " – "
                                        )}
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
                            <td></td>
                            <td className="px-4 py-2 text-right text-[#093a7b]">
                                {totalPopulation.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-right text-[#093a7b]">
                                100%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FamilyIncomeTable;
