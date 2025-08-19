import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#9B59B6", "#E94E77", "#4A90E2"]; // LGBTQ, female, male

// A simple custom hook to detect window width.
// This helps us switch between mobile and desktop layouts.
const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowWidth;
};

function GenderDonutChart({ genderDistribution }) {
    // Recharts doesn't automatically re-order data, so we do it manually
    // to match the visual representation in your original image.
    const data = [
        { name: 'LGBTQ', value: genderDistribution['LGBTQ'] || 0 },
        { name: 'female', value: genderDistribution['female'] || 0 },
        { name: 'male', value: genderDistribution['male'] || 0 },
    ];

    const width = useWindowWidth();
    // We use 768px as the breakpoint, which corresponds to Tailwind's `md` prefix.
    const isMobile = width < 768;

    // This custom legend component is now styled with Tailwind CSS classes.
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className={`flex ${isMobile ? 'flex-row justify-center flex-wrap gap-x-6' : 'flex-col gap-y-4'}`}>
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center">
                        <span
                            className="inline-block w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: entry.color }}
                        ></span>
                        <span className="w-24 inline-block text-lg text-gray-600">{entry.value}</span>
                        <span className="font-bold text-lg text-gray-800 ml-1">
                            {entry.payload.value}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };


    return (
        // On mobile, increase the container height to fit the legend below the chart.
        <ResponsiveContainer width="100%" height={isMobile ? 220 : 150}>
            <PieChart>
                <Pie
                    data={data}
                    cx={isMobile ? "50%" : "33%"}
                    cy={isMobile ? "45%" : "50%"}
                    innerRadius={40}
                    outerRadius={isMobile ? 60 : 70}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(209, 213, 219, 0.5)",
                        borderRadius: "0.75rem",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    }}
                />
                <Legend
                    // Change layout and position based on screen size.
                    layout={isMobile ? "horizontal" : "vertical"}
                    align={isMobile ? "center" : "right"}
                    verticalAlign={isMobile ? "bottom" : "middle"}
                    content={renderLegend}
                    // Adjust the wrapper style to position the legend correctly.
                    wrapperStyle={isMobile ? { bottom: 0 } : { right: 20 }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default GenderDonutChart;
