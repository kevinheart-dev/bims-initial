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
        <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#f8faff] shadow-sm">
                    <tr className="border-b">
                        <th className="px-4 py-2 font-semibold text-[#093a7b]">Employment Category</th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">
                            Population
                        </th>
                        <th className="px-4 py-2 font-semibold text-[#093a7b] text-right">
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
                                className="border-b text-gray-900 hover:bg-gray-50/50"
                            >
                                <td className="px-4 py-2 font-medium capitalize">
                                    {formattedStatus}
                                </td>
                                <td className="px-4 py-2 text-right">
                                    {item.total.toLocaleString()}
                                </td>
                                <td className="px-4 py-2 text-right">{percentage}%</td>
                            </tr>
                        );
                    })}

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold">
                        <td className="px-4 py-2 text-[#093a7b]">Total</td>
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

export default EmploymentStatusTable;
