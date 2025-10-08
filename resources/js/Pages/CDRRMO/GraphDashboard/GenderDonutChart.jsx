import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { Mars, Venus, Transgender } from 'lucide-react'; // Male, Female, Transgender icons

const COLORS = ['#0088FE', '#FF8042', '#00C49F']; // Male, Female, Transgender

const ICONS = {
    Male: <Mars className="w-6 h-6 text-blue-500" />,
    Female: <Venus className="w-6 h-6 text-pink-500" />,
    'LGBTQ+': <Transgender className="w-6 h-6 text-green-500" />
};

// Force order: Male, Female, LGBTQ+
const GENDER_ORDER = ['Male', 'Female', 'LGBTQ+'];

const GenderDonutChart = ({ genderData }) => {
    if (!genderData || genderData.length === 0) {
        return <div className="p-4 text-center text-gray-500">No gender data available.</div>;
    }

    // Map data into an object for easy access by name
    const dataMap = genderData.reduce((acc, item) => {
        acc[item.gender] = Number(item.total_quantity);
        return acc;
    }, {});

    // Prepare chartData in fixed order
    const chartData = GENDER_ORDER.map(gender => ({
        name: gender,
        value: dataMap[gender] || 0
    }));

    const totalQuantity = chartData.reduce((sum, entry) => sum + entry.value, 0);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const entry = payload[0].payload;
            const percentage = ((entry.value / totalQuantity) * 100).toFixed(2);
            return (
                <div className="p-2 bg-white border border-gray-300 rounded shadow-md">
                    <p className="text-sm font-semibold">
                        {`${entry.name}: ${new Intl.NumberFormat().format(entry.value)} (${percentage}%)`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full max-w-sm border rounded-xl p-2 mx-auto hover:shadow-lg">
            {/* Heading */}
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                Population Based on Gender
            </h3>

            <div className="flex flex-col items-center">
                {/* Donut Chart */}
                <ResponsiveContainer width={150} height={150}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label
                                value={new Intl.NumberFormat().format(totalQuantity)}
                                position="center"
                                className="text-lg font-bold text-gray-800"
                            />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Horizontal separator */}
                <hr className="w-full border-gray-300 my-3" />

                {/* Icons row with totals in fixed order */}
                <div className="flex justify-around w-full">
                    {GENDER_ORDER.map((gender, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {ICONS[gender]}
                            <span className="text-base font-bold text-gray-900 mt-1">
                                {new Intl.NumberFormat().format(dataMap[gender] || 0)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GenderDonutChart;
