import React, { useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function CRAProgressList({ data = [], selectedBarangayId }) {
    const scrollRef = useRef(null);
    const itemRefs = useRef({});

    useEffect(() => {
        if (!selectedBarangayId || !scrollRef.current) return;
        const el = itemRefs.current[selectedBarangayId];
        if (!el) return;

        const container = scrollRef.current;
        const offsetTop =
            el.offsetTop -
            container.offsetTop -
            container.clientHeight / 2 +
            el.clientHeight / 2;

        container.scrollTo({ top: offsetTop, behavior: "smooth" });

        el.classList.add("bg-blue-100", "font-semibold");
        const timeout = setTimeout(() => {
            el.classList.remove("bg-blue-100", "font-semibold");
        }, 1500);

        return () => clearTimeout(timeout);
    }, [selectedBarangayId]);

    return (
        <div className="w-full p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-3">
                CRA Progress by Barangay
            </h2>

            <div ref={scrollRef} className="max-h-[375px] overflow-y-auto pr-1">
                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                    {data.map((item, index) => {
                        const progress = item.cra_progress || 0; // percentage value 0–100

                        return (
                            <li
                                key={item.id}
                                ref={(el) => (itemRefs.current[item.id] = el)}
                                className={`py-2 px-1 transition-colors duration-200 ${selectedBarangayId === item.id
                                    ? "bg-blue-50 font-semibold"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                {/* Barangay Name and Percentage */}
                                <div className="flex justify-between items-center mb-1">
                                    <span className="truncate text-gray-800 font-medium">
                                        {index + 1}. {item.barangay_name}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        {progress >= 100 ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                                        )}
                                        <span>{progress}%</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-500 ${progress >= 100
                                            ? "bg-green-500"
                                            : progress >= 70
                                                ? "bg-blue-500"
                                                : progress >= 40
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
