import React, { useEffect, useContext } from "react";
import { Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { StepperContext } from "@/context/StepperContext";

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

    // Initialize disaster_per_purok with 7 default puroks, each containing DEFAULT_ROWS
    useEffect(() => {
        if (
            !craData.disaster_per_purok ||
            craData.disaster_per_purok.length === 0
        ) {
            const defaultPuroks = Array.from({ length: 7 }, (_, i) => ({
                purok: `${i + 1}`,
                rowsValue: DEFAULT_ROWS.map((row) => ({ ...row })),
            }));
            setCraData((prev) => ({
                ...prev,
                disaster_per_purok: defaultPuroks,
            }));
        }
    }, [craData, setCraData]);

    const updatePurok = (purokIdx, key, value, rowIdx = null) => {
        const updated = craData.disaster_per_purok.map((p, i) => {
            if (i !== purokIdx) return p;
            if (rowIdx !== null) {
                // Update count
                const rowsValue = p.rowsValue.map((row, rIdx) =>
                    rIdx === rowIdx
                        ? { ...row, count: value.replace(/\D/g, "") }
                        : row
                );
                return { ...p, rowsValue };
            }
            // Update purok name
            return { ...p, [key]: value };
        });
        setCraData((prev) => ({ ...prev, disaster_per_purok: updated }));
    };

    const addPurok = () => {
        const newPurok = {
            purok: `${craData.disaster_per_purok.length + 1}`, // New purok name
            rowsValue: DEFAULT_ROWS.map((row) => ({ ...row })),
        };
        setCraData((prev) => ({
            ...prev,
            disaster_per_purok: [...prev.disaster_per_purok, newPurok],
        }));
        toast.success("Purok added successfully!");
    };

    const removePurok = (index) => {
        const updated = craData.disaster_per_purok.filter(
            (_, i) => i !== index
        );
        setCraData((prev) => ({ ...prev, disaster_per_purok: updated }));
        toast.error("Purok removed!");
    };

    // Compute totals
    const totals = (
        craData.disaster_per_purok?.[0]?.rowsValue || DEFAULT_ROWS
    ).map(
        // Use DEFAULT_ROWS here as a fallback
        (_, idx) =>
            craData.disaster_per_purok.reduce(
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
                            {/* Use DEFAULT_ROWS directly for headers to ensure they always show up */}
                            {DEFAULT_ROWS.map((row, idx) => (
                                <th
                                    key={idx}
                                    className="border p-1 text-center"
                                >
                                    {row.value}
                                </th>
                            ))}
                            <th className="border p-1 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(craData.disaster_per_purok || []).map(
                            (
                                purok,
                                pIdx // Ensure it's an array for map
                            ) => (
                                <tr key={pIdx} className="hover:bg-gray-50">
                                    <td className="border p-1">
                                        <input
                                            type="number"
                                            min={0}
                                            value={purok.purok}
                                            onChange={(e) =>
                                                updatePurok(
                                                    pIdx,
                                                    "purok",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-center text-xs p-1 border rounded"
                                        />
                                    </td>
                                    {(purok.rowsValue || []).map(
                                        (row, rIdx) => (
                                            <td
                                                key={rIdx}
                                                className="border p-1"
                                            >
                                                <input
                                                    type="text"
                                                    value={row.count || ""}
                                                    onChange={(e) =>
                                                        updatePurok(
                                                            pIdx,
                                                            "count",
                                                            e.target.value,
                                                            rIdx
                                                        )
                                                    }
                                                    className="w-full text-center text-xs p-1 border rounded"
                                                />
                                            </td>
                                        )
                                    )}
                                    <td className="p-0.5 text-center !border-0">
                                        <button
                                            className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 mx-auto"
                                            onClick={() => removePurok(pIdx)}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            )
                        )}
                        <tr className="bg-gray-200 font-bold">
                            <td className="border p-1 text-center">Total</td>
                            {/* Use DEFAULT_ROWS to determine the number of total columns if craData.disaster_per_purok is empty */}
                            {totals.map((total, idx) => (
                                <td
                                    key={idx}
                                    className="border p-1 text-center"
                                >
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
