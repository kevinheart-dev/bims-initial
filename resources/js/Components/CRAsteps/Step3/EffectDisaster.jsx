import React, { useContext, useEffect, useCallback } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

// Default purok row template
const PUROK_TEMPLATE = {
    purok: "",
    lowFamilies: "",
    lowIndividuals: "",
    mediumFamilies: "",
    mediumIndividuals: "",
    highFamilies: "",
    highIndividuals: "",
};

// Generate 7 default puroks
const getDefaultPuroks = () =>
    Array.from({ length: 7 }, (_, i) => ({
        ...PUROK_TEMPLATE,
        purok: `${i + 1}`,
    }));

// Risk categories for table headers
const RISK_FIELDS = [
    { key: "lowFamilies", label: "Families", group: "Low Risk" },
    { key: "lowIndividuals", label: "Individuals", group: "Low Risk" },
    { key: "mediumFamilies", label: "Families", group: "Medium Risk" },
    { key: "mediumIndividuals", label: "Individuals", group: "Medium Risk" },
    { key: "highFamilies", label: "Families", group: "High Risk" },
    { key: "highIndividuals", label: "Individuals", group: "High Risk" },
];

const EffectDisaster = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Ensure craData.disaster_per_purok is always initialized as an array
    // Add a fallback for hazard.rows as well
    const disasterData = craData.disaster_per_purok || [];

    // Initialize with 1 hazard category if none exists
    useEffect(() => {
        if (!disasterData.length) {
            setCraData((prev) => ({
                ...prev,
                disaster_per_purok: [{ type: "Typhoon", rows: getDefaultPuroks() }],
            }));
        }
    }, [disasterData, setCraData]);

    // Update hazard type or cell
    const updateHazard = useCallback(
        (hIdx, updater) => {
            setCraData((prev) => {
                const updated = [...(prev.disaster_per_purok || [])];
                // Ensure the hazard object itself and its rows are initialized if they somehow become undefined
                updated[hIdx] = { type: "", rows: [], ...updated[hIdx], ...updater(updated[hIdx]) };
                return { ...prev, disaster_per_purok: updated };
            });
        },
        [setCraData]
    );

    const updateHazardType = (hIdx, value) =>
        updateHazard(hIdx, () => ({ type: value }));

    const updateCell = (hIdx, rIdx, field, value) =>
        updateHazard(hIdx, (hazard) => {
            const rows = [...(hazard.rows || [])]; // Ensure rows is an array here
            rows[rIdx] = { ...rows[rIdx], [field]: value };
            return { rows };
        });

    // Category actions
    const addHazard = () => {
        setCraData((prev) => ({
            ...prev,
            disaster_per_purok: [
                ...(prev.disaster_per_purok || []),
                { type: "", rows: getDefaultPuroks() },
            ],
        }));
        toast.success("New hazard category added!");
    };

    const removeHazard = (hIdx) => {
        setCraData((prev) => ({
            ...prev,
            disaster_per_purok: (prev.disaster_per_purok || []).filter(
                (_, i) => i !== hIdx
            ),
        }));
        toast.success("Hazard category removed!");
    };

    // Purok actions
    const addPurok = (hIdx) =>
        updateHazard(hIdx, (hazard) => ({
            rows: [...(hazard.rows || []), { ...PUROK_TEMPLATE }], // Ensure rows is an array here
        }));

    const removePurok = (hIdx, rIdx) =>
        updateHazard(hIdx, (hazard) => ({
            rows: (hazard.rows || []).filter((_, i) => i !== rIdx), // Ensure rows is an array here
        }));

    return (
        <div>
            <p className="text-md font-bold mb-4">
                4.1 Number of Families and Individuals at Risk of Hazards per Purok
                based on the following categories:
            </p>

            {disasterData.map((hazard, hIdx) => (
                <div key={hIdx} className="mb-8 border rounded p-4 bg-white shadow-sm">
                    {/* Hazard type and remove button */}
                    <div className="flex justify-between items-center mb-3">
                        <input
                            type="text"
                            placeholder="Enter Hazard Type (e.g., Typhoon)"
                            value={hazard.type || ""} // Add fallback for hazard.type
                            onChange={(e) => updateHazardType(hIdx, e.target.value)}
                            className="border px-3 py-2 rounded w-1/2 text-sm"
                        />
                        <button
                            onClick={() => removeHazard(hIdx)}
                            className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                            title="Remove Category"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="border border-collapse w-full text-xs">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th rowSpan="2" className="border px-2 py-1">
                                        Areas affected (Purok)
                                    </th>
                                    {["Low Risk", "Medium Risk", "High Risk"].map((group) => (
                                        <th
                                            key={group}
                                            colSpan="2"
                                            className="border px-2 py-1 text-center"
                                        >
                                            {group}
                                        </th>
                                    ))}
                                    <th rowSpan="2" className="border px-2 py-1 text-center" />
                                </tr>
                                <tr className="bg-gray-100">
                                    {RISK_FIELDS.map(({ label }, idx) => (
                                        <th key={idx} className="border px-2 py-1">
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(hazard.rows || []).map((row, rIdx) => ( // <--- This is the key fix
                                    <tr key={rIdx}>
                                        <td className="border px-2 py-1 text-center">
                                            <input
                                                type="text"
                                                value={row.purok || ""} // Add fallback for row.purok
                                                onChange={(e) =>
                                                    updateCell(hIdx, rIdx, "purok", e.target.value)
                                                }
                                                className="border w-full px-2 py-1 text-center text-xs"
                                            />
                                        </td>
                                        {RISK_FIELDS.map(({ key }, i) => (
                                            <td key={i} className="border px-2 py-1 text-center">
                                                <input
                                                    type="number"
                                                    value={row[key] || ""} // Add fallback for row[key]
                                                    onChange={(e) =>
                                                        updateCell(hIdx, rIdx, key, e.target.value)
                                                    }
                                                    className="border w-full px-2 py-1 text-center text-xs"
                                                />
                                            </td>
                                        ))}
                                        <td className="border px-2 py-1 text-center">
                                            <button
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-200"
                                                onClick={() => removePurok(hIdx, rIdx)}
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add purok row button */}
                    <button
                        onClick={() => addPurok(hIdx)}
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                        + Add Purok
                    </button>
                </div>
            ))}

            {/* Add hazard table button */}
            <button
                onClick={addHazard}
                className="mt-0 px-4 py-2 bg-green-500 text-white rounded text-sm"
            >
                + Add Hazard Category
            </button>
        </div>
    );
};

export default EffectDisaster;
