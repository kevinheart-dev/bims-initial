import React from "react";

const FamilyIncomeTable = ({ familyIncomeData }) => {
    if (!familyIncomeData || familyIncomeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No family income data available.
            </div>
        );
    }

    // Compute total population for percentages
    const totalPopulation = familyIncomeData.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="max-h-70 overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#f8faff] shadow-sm">
                    <tr className="border-b">
                        <th className="px-4 py-2 font-semibold text-[#093a7b]">Income Category</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b]">Income Bracket</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Population</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">Percentage</th>
                    </tr>
                </thead>

                <tbody>
                    {familyIncomeData.map((item, index) => {
                        const percentage =
                            totalPopulation > 0
                                ? ((item.total / totalPopulation) * 100).toFixed(2)
                                : 0;
                        return (
                            <tr key={index} className="border-b text-gray-900 hover:bg-gray-50/50">
                                <td className="px-4 py-2 font-medium">{item.income_category}</td>
                                <td className="px-4 py-2">{item.income_bracket.replace(/_/g, " – ")}</td>
                                <td className="px-4 py-2 text-right">{item.total.toLocaleString()}</td>
                                <td className="px-4 py-2 text-right">{percentage}%</td>
                            </tr>
                        );
                    })}

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold">
                        <td className="px-4 py-2 text-[#093a7b]">Total</td>
                        <td></td>
                        <td className="px-4 py-2 text-right text-[#093a7b]">
                            {totalPopulation.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right text-[#093a7b]">100%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default FamilyIncomeTable;
