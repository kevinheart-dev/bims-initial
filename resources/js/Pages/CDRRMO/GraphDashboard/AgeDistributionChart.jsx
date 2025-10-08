import { useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from "recharts";

export default function AgeDistributionChart({ ageDistribution, height = 280 }) {
    const [showGender, setShowGender] = useState(false);
    const [showDisability, setShowDisability] = useState(false);

    const formatLabel = (label) => {
        if (typeof label !== "string") label = String(label);
        return label.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const chartData = ageDistribution.map(item => {
        const ageGroup = item.age_group;
        const maleWithout = Number(item.male_without_disability);
        const maleWith = Number(item.male_with_disability);
        const femaleWithout = Number(item.female_without_disability);
        const femaleWith = Number(item.female_with_disability);
        const lgbtqWithout = Number(item.lgbtq_without_disability);
        const lgbtqWith = Number(item.lgbtq_with_disability);

        const data = { age_group: ageGroup };

        if (!showGender && !showDisability) {
            data.total = maleWithout + maleWith + femaleWithout + femaleWith + lgbtqWithout + lgbtqWith;
        } else if (showGender && !showDisability) {
            data.male = maleWithout + maleWith;
            data.female = femaleWithout + femaleWith;
            data.lgbtq = lgbtqWithout + lgbtqWith;
        } else if (!showGender && showDisability) {
            data.withDisability = maleWith + femaleWith + lgbtqWith;
            data.withoutDisability = maleWithout + femaleWithout + lgbtqWithout;
        } else if (showGender && showDisability) {
            data.maleWithDisability = maleWith;
            data.maleWithoutDisability = maleWithout;
            data.femaleWithDisability = femaleWith;
            data.femaleWithoutDisability = femaleWithout;
            data.lgbtqWithDisability = lgbtqWith;
            data.lgbtqWithoutDisability = lgbtqWithout;
        }

        return data;
    });

    const colors = {
        male: "#4f46e5",
        female: "#f97316",
        lgbtq: "#14b8a6",
        total: "#8884d8",
        withDisability: "#dc2626",
        withoutDisability: "#16a34a",
        maleWithDisability: "#4f46e5",
        maleWithoutDisability: "#60a5fa",
        femaleWithDisability: "#f97316",
        femaleWithoutDisability: "#fb923c",
        lgbtqWithDisability: "#14b8a6",
        lgbtqWithoutDisability: "#22d3ee"
    };

    const activeBars = Object.keys(chartData[0] || {}).filter(
        key => key !== "age_group"
    );

    return (
        <div className="border rounded-xl p-4 mb-6 bg-white hover:shadow-lg transition-shadow duration-300 z-50 relative">
            {/* Header and Filters */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Population According to Age</h3>

                <div className="flex items-center gap-3 z-50 relative">
                    {/* Toggle Gender */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showGender}
                                onChange={() => setShowGender(!showGender)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${showGender ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${showGender ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-gray-700 font-medium transition-colors duration-300 hover:text-blue-500`}>Gender</span>
                    </label>

                    {/* Toggle Disability */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={showDisability}
                                onChange={() => setShowDisability(!showDisability)}
                                className="sr-only"
                            />
                            <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${showDisability ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${showDisability ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <span className={`text-gray-700 font-medium transition-colors duration-300 hover:text-green-500`}>Disability</span>
                    </label>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age_group" tick={{ fontSize: 12 }} tickFormatter={formatLabel} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        formatter={(value) => new Intl.NumberFormat().format(value)}
                        labelFormatter={(label) => {
                            let formatted = formatLabel(label);
                            return formatted.length > 20 ? formatted.slice(0, 20) + "..." : formatted;
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} formatter={formatLabel} />

                    {activeBars.map((key) => (
                        <Bar
                            key={key}
                            dataKey={key}
                            fill={colors[key]}
                            radius={[5, 5, 0, 0]}
                            barSize={22}
                            isAnimationActive={true}
                        >
                            <LabelList dataKey={key} position="top" fontSize={11} formatter={formatLabel} />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
