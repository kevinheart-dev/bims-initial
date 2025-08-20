// ResidentCharts.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#10B981", "#EC4899", "#4F46E5"]; // male, female, lgbtq

const ResidentCharts = ({ residents }) => {
    // Ensure array
    const residentArray = Array.isArray(residents) ? residents : residents?.data || [];

    // Normalize gender into 3 categories
    const genderCounts = residentArray.reduce((acc, r) => {
        let g = (r.gender || "").toLowerCase().trim();

        if (g === "male" || g === "m") {
            g = "Male";
        } else if (g === "female" || g === "f") {
            g = "Female";
        } else {
            g = "LGBTQ";
        }

        acc[g] = (acc[g] || 0) + 1;
        return acc;
    }, { Male: 0, Female: 0, LGBTQ: 0 });

    const genderData = Object.entries(genderCounts).map(([key, value]) => ({
        name: key,
        value,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="bg-white shadow rounded-2xl p-4">
                <h2 className="text-lg font-semibold mb-4">Gender Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {genderData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ResidentCharts;
