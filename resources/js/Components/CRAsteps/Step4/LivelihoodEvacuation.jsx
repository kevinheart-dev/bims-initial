import React, { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const ROW_TEMPLATE = {
    type: "",
    evacuation: "",
    origin: "",
    items: "",
};

const LivelihoodEvacuation = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Ensure craData has livelihood_evacuation initialized
    useEffect(() => {
        if (!craData.livelihood_evacuation) {
            setCraData({
                ...craData,
                livelihood_evacuation: [ROW_TEMPLATE],
            });
        }
    }, []);

    const rows = craData.livelihood_evacuation || [];

    const updateCell = (rIdx, field, value) => {
        const updated = [...rows];
        updated[rIdx] = { ...updated[rIdx], [field]: value };
        setCraData({ ...craData, livelihood_evacuation: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            livelihood_evacuation: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (rIdx) => {
        setCraData({
            ...craData,
            livelihood_evacuation: rows.filter((_, i) => i !== rIdx),
        });
        toast.error("Row removed!");
    };

    return (
        <div className="mb-8">
            <h2 className="text-md font-bold mb-3">Livelihood and Evacuation</h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Type</th>
                            <th className="border px-2 py-1">Evacuation</th>
                            <th className="border px-2 py-1">Origin</th>
                            <th className="border px-2 py-1">Items</th>
                            <th className="border px-2 py-1 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                                <td className="border px-2 py-1">
                                    <input
                                        type="text"
                                        value={row.type}
                                        onChange={(e) =>
                                            updateCell(rIdx, "type", e.target.value)
                                        }
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        type="text"
                                        value={row.evacuation}
                                        onChange={(e) =>
                                            updateCell(rIdx, "evacuation", e.target.value)
                                        }
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        type="text"
                                        value={row.origin}
                                        onChange={(e) =>
                                            updateCell(rIdx, "origin", e.target.value)
                                        }
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <input
                                        type="text"
                                        value={row.items}
                                        onChange={(e) =>
                                            updateCell(rIdx, "items", e.target.value)
                                        }
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>
                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                        onClick={() => removeRow(rIdx)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={addRow}
                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-xs"
            >
                + Add Row
            </button>
        </div>
    );
};

export default LivelihoodEvacuation;
