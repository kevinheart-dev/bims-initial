import React, { useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { StepperContext } from "@/context/StepperContext";

// 1. Default count is empty string "" (visual blank)
const DEFAULT_ROWS = [
    { value: "Number of Informal Settler Families", count: "" },
    { value: "Number of Employed Individuals", count: "" },
    {
        value: "Number of Families Aware of the Effects of Risks and Hazards",
        count: "",
    },
    {
        value: "Number of Families with Access to Information (radio/TV/newspaper/social media, etc.)",
        count: "",
    },
    {
        value: "Number of Families who received Financial Assistance",
        count: "",
    },
    {
        value: "Number of Families with Access to Early Warning System",
        count: "",
    },
];

const DisasterPerPurok = () => {
    const { craData, setCraData } = useContext(StepperContext);

    const displayList = craData.disaster_per_purok || [];

    const updatePurok = (purokIdx, key, value, rowIdx = null) => {
        setCraData((prev) => {
            const currentList = prev.disaster_per_purok || [];

            const updated = currentList.map((p, i) => {
                if (i !== purokIdx) return p;

                const currentRows = p.rowsValue || DEFAULT_ROWS.map(r => ({ ...r }));

                if (rowIdx !== null) {
                    // Only allow numbers, but allow empty string
                    let cleanValue = value.replace(/\D/g, "");

                    // Optional: If user types "05", turn it into "5".
                    // If they just type "0", keep it "0".
                    if (cleanValue.length > 1 && cleanValue.startsWith("0")) {
                        cleanValue = cleanValue.substring(1);
                    }

                    const rowsValue = currentRows.map((row, rIdx) =>
                        rIdx === rowIdx
                            ? { ...row, count: cleanValue }
                            : row
                    );
                    return { ...p, rowsValue };
                }

                return { ...p, [key]: value };
            });

            return { ...prev, disaster_per_purok: updated };
        });
    };

    const addPurok = () => {
        setCraData((prev) => {
            const currentList = prev.disaster_per_purok || [];
            const nextNum = currentList.length + 1;

            // 2. Purok name defaults to just the number (e.g. "1")
            const newPurok = {
                purok: `${nextNum}`,
                rowsValue: DEFAULT_ROWS.map((row) => ({ ...row })),
            };

            return {
                ...prev,
                disaster_per_purok: [...currentList, newPurok],
            };
        });
        toast.success("Purok added successfully!");
    };

    const removePurok = (index) => {
        setCraData((prev) => {
            const currentList = prev.disaster_per_purok || [];
            const updated = currentList.filter((_, i) => i !== index);
            return { ...prev, disaster_per_purok: updated };
        });
        toast.error("Purok removed!");
    };

    // 3. Calculate totals (Treat empty string as 0)
    const totals = DEFAULT_ROWS.map((_, idx) =>
        displayList.reduce(
            (sum, p) => sum + Number(p.rowsValue?.[idx]?.count || 0),
            0
        )
    );

    return (
        <div className="p-4">
            <Toaster position="top-right" />
            <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-1 text-center">Purok</th>
                            {DEFAULT_ROWS.map((row, idx) => (
                                <th key={idx} className="border p-1 text-center">
                                    {row.value}
                                </th>
                            ))}
                            <th className="border p-1 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayList.map((purok, pIdx) => {
                            // Fallback if rows are missing
                            const displayRows = (purok.rowsValue && purok.rowsValue.length > 0)
                                ? purok.rowsValue
                                : DEFAULT_ROWS.map(r => ({ ...r }));

                            return (
                                <tr key={pIdx} className="hover:bg-gray-50">
                                    <td className="border p-1">
                                        <input
                                            type="text"
                                            value={purok.purok || ""}
                                            placeholder={`${pIdx + 1}`}
                                            onChange={(e) =>
                                                updatePurok(pIdx, "purok", e.target.value)
                                            }
                                            className="w-full text-center text-xs p-1 border rounded"
                                        />
                                    </td>
                                    {displayRows.map((row, rIdx) => (
                                        <td key={rIdx} className="border p-1">
                                            <input
                                                type="text"
                                                // Renders empty string if no value
                                                value={row.count || ""}
                                                onChange={(e) =>
                                                    updatePurok(pIdx, "count", e.target.value, rIdx)
                                                }
                                                className="w-full text-center text-xs p-1 border rounded"
                                            />
                                        </td>
                                    ))}
                                    <td className="p-0.5 text-center !border-0">
                                        <button
                                            className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 mx-auto"
                                            onClick={() => removePurok(pIdx)}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        <tr className="bg-gray-200 font-bold">
                            <td className="border p-1 text-center">Total</td>
                            {totals.map((total, idx) => (
                                <td key={idx} className="border p-1 text-center">
                                    {total}
                                </td>
                            ))}
                            <td className="border p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button
                onClick={addPurok}
                className="inline-flex items-center gap-1 m-2 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Purok
            </button>
        </div>
    );
};

export default DisasterPerPurok;
