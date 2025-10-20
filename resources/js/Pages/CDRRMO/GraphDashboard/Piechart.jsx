import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Label,
    // Legend, // <--- REMOVE Legend from imports if not used inside RechartsPieChart
} from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DD0",
    "#FF6666",
    "#66CCFF",
];

export default function CustomPieChart({ data }) {
    // Transform data
    const chartData = data.map((item) => ({
        name: item.service_name,
        value: item.households_quantity,
    }));

    const totalQuantity = chartData.reduce((sum, item) => sum + item.value, 0);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const entry = payload[0].payload;
            const percentage = ((entry.value / totalQuantity) * 100).toFixed(2);
            return (
                <div className="p-2 bg-white border border-gray-300 rounded shadow-md">
                    <p className="text-sm font-semibold">
                        {`${entry.name}: ${new Intl.NumberFormat().format(
                            entry.value
                        )} (${percentage}%)`}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom Scrollable Legend - now takes `payload` directly
    const CustomLegendContent = ({ payload }) => {
        if (!payload || payload.length === 0) return null; // Added check for empty payload

        return (
            <div className="mt-4 max-h-24 overflow-y-auto custom-scrollbar pr-1 w-full">
                {payload.map((entry, index) => (
                    <div
                        key={`item-${index}`}
                        className="flex items-center justify-between text-sm py-0.5"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            ></span>
                            <span className="truncate max-w-[100px]">
                                {entry.value} {/* This should be entry.name */}
                            </span>
                        </div>
                        <span className="font-medium text-gray-700">
                            {new Intl.NumberFormat().format(entry.payload.value)}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full h-[280px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
                <RechartsPieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        label={false}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                        <Label
                            value={new Intl.NumberFormat().format(totalQuantity)}
                            position="center"
                            className="text-base font-bold"
                        />
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {/* REMOVED: <Legend content={renderScrollableLegend} /> */}
                </RechartsPieChart>
            </ResponsiveContainer>
            <CustomLegendContent payload={chartData.map((item, index) => ({
                value: item.name, // The name to display in the legend
                color: COLORS[index % COLORS.length],
                payload: { value: item.value }
            }))} />
        </div>
    );
}
