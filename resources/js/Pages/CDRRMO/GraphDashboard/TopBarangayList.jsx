import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, Users, House, UsersRound } from "lucide-react";

export default function TopBarangaysList({ data, selectedBarangayId }) {
    const [field, setField] = useState("population");
    const [reverse, setReverse] = useState(false);
    const scrollRef = useRef(null);
    const itemRefs = useRef({});
    const scrolledOnceRef = useRef(false);

    const iconMap = {
        population: <Users className="w-4 h-4" />,
        households: <House className="w-4 h-4" />,
        families: <UsersRound className="w-4 h-4" />,
    };

    const sortedData = [...data].sort((a, b) => {
        return reverse ? a[field] - b[field] : b[field] - a[field];
    });

    const handleFieldChange = (metric) => {
        if (metric === field) setReverse(!reverse);
        else {
            setField(metric);
            setReverse(false);
        }
    };

    // Scroll to selected barangay and trigger highlight effect
    useEffect(() => {
        if (selectedBarangayId && scrollRef.current && itemRefs.current[selectedBarangayId]) {
            const el = itemRefs.current[selectedBarangayId];
            const container = scrollRef.current;
            const offsetTop = el.offsetTop - container.offsetTop - container.clientHeight / 2 + el.clientHeight / 2;

            container.scrollTo({ top: offsetTop, behavior: "smooth" });

            // briefly add highlight effect
            el.classList.add("bg-blue-200", "font-semibold");
            setTimeout(() => {
                el.classList.remove("bg-blue-200", "font-semibold");
            }, 1500); // effect lasts 1.5 seconds
        }
    }, [selectedBarangayId]);

    return (
        <div className="w-full p-2 bg-white rounded-xl border border-gray-200">
            {/* Metric buttons */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                    {["population", "households", "families"].map((metric) => (
                        <button
                            key={metric}
                            onClick={() => handleFieldChange(metric)}
                            className={`p-1 rounded border ${field === metric ? "border-blue-500 bg-blue-50" : "border-gray-200"} hover:bg-gray-100 transition-colors`}
                            title={metric.charAt(0).toUpperCase() + metric.slice(1)}
                        >
                            {iconMap[metric]}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setReverse(!reverse)}
                    className="p-1 rounded hover:bg-gray-100"
                    title={reverse ? "Show Descending" : "Show Ascending"}
                >
                    {reverse ? <ArrowDown className="w-4 h-4 text-gray-600" /> : <ArrowUp className="w-4 h-4 text-gray-600" />}
                </button>
            </div>

            {/* Scrollable list */}
            <div ref={scrollRef} className="max-h-60 overflow-y-auto">
                <ul className="text-sm text-gray-600">
                    {sortedData.map((item, index) => (
                        <li
                            key={item.id}
                            ref={(el) => (itemRefs.current[item.id] = el)}
                            className={`flex justify-between py-1 border-b last:border-b-0 transition-colors duration-300
                                ${selectedBarangayId === item.id ? "bg-blue-50 font-semibold" : ""}`}
                        >
                            <span>{index + 1}. {item.barangay_name}</span>
                            <span>{item[field]}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
