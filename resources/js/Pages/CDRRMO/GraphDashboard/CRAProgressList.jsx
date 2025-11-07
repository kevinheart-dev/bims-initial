import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import useAppUrl from "@/hooks/useAppUrl";

export default function CRAProgressList({ selectedBarangayId }) {
    const [data, setData] = useState([]);
    const [year, setYear] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    const itemRefs = useRef({});
    const APP_URL = useAppUrl();

    // Example: Pass year explicitly or let backend fallback to session
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${APP_URL}/craProgress`, {
                    params: { year: year || undefined }, // send year if known
                });

                if (res.data.success) {
                    const { data: craData } = res.data;
                    setYear(craData.year || null);
                    setData(craData.barangays || []);
                } else {
                    setData([]);
                }
            } catch (err) {
                console.error("Failed to fetch CRA progress:", err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [APP_URL, year]);

    // 🔹 Auto-scroll to selected barangay
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

    // 🔹 Loading state
    if (loading) {
        return (
            <div className="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-[200px]">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Loading CRA progress...</p>
            </div>
        );
    }

    // 🔹 Empty state
    if (!data || data.length === 0) {
        return (
            <div className="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center text-gray-500 text-sm">
                No CRA progress data found for the selected year.
            </div>
        );
    }
    if (loading) {
        return (
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-[200px]">
                <p className="text-gray-500 text-sm">Loading CRA progress...</p>
            </div>
        );
    }

    // 🔹 Main render
    return (
        <div className="w-full p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold text-gray-700">
                    CRA Progress by Barangay
                </h2>
                {year && (
                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                        Year: {year}
                    </span>
                )}
            </div>

            <div ref={scrollRef} className="max-h-[370px] overflow-y-auto pr-1">

                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                    {data.map((item, index) => {
                        const progress = item.cra_progress ?? 0;
                        return (
                            <li
                                key={item.id}
                                ref={(el) => (itemRefs.current[item.id] = el)}
                                className={`py-2 px-2 rounded-md transition-colors duration-200 ${selectedBarangayId === item.id
                                    ? "bg-blue-50 font-semibold"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                {/* Barangay name and progress */}
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

                                {/* Progress bar */}
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

                                {/* Status label */}
                                <p className="text-xs text-gray-500 mt-1 text-right italic">
                                    {progress >= 100
                                        ? "Completed"
                                        : progress > 0
                                            ? "In Progress"
                                            : "Not Started"}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <p className="text-sm font-semibold pt-2">
                <span className="text-green-600">
                    {data.filter(b => b.cra_progress > 0).length}
                </span>
                /
                <span className="text-gray-600">{data.length}</span> barangays have submitted their CRA
            </p>
        </div>
    );
}
