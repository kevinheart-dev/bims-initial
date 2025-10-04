import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#e5e7eb"];

function PwdHalfPie({ pwdDistribution }) {
    const total = (pwdDistribution.PWD || 0) + (pwdDistribution.nonPWD || 0);
    const percentage = total > 0 ? ((pwdDistribution.PWD || 0) / total) * 100 : 0;

    const data = [
        { name: "PWD", value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    return (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4 w-full max-w-sm">
            <div className="flex flex-col justify-center">
                <h3 className="text-gray-600 font-semibold text-sm">PWD Distribution</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{pwdDistribution.PWD || 0}</p>
                <p className="text-xs text-gray-400">out of {total} residents</p>
            </div>

            {/* Right Side Half Pie */}
            <div className="w-28 h-20 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={40}
                            outerRadius={60}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    cornerRadius={50}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Percentage inside chart */}
                <div className="absolute inset-0 flex items-center justify-center -mt-4">
                    <p className="text-sm font-semibold text-gray-800">
                        {percentage.toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
}

export default PwdHalfPie;
