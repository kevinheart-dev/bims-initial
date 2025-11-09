import React, { useContext, useEffect, useCallback } from "react";
import { StepperContext } from "@/context/StepperContext"; // Adjust path as needed
import toast from "react-hot-toast"; // Ensure you have react-hot-toast installed
import { toTitleCase } from "@/utils/stringFormat"; // Adjust path as needed
import SelectField from "@/Components/SelectField";

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

    const disasterData = craData.disaster_per_purok || [];

    useEffect(() => {
        const hasValidHazard =
            disasterData.length > 0 &&
            disasterData.some(
                (hazard) => Array.isArray(hazard.rows) && hazard.rows.length > 0
            );

        if (!hasValidHazard) {
            // console.log("Initializing disaster_per_purok with 1 table and 7 rows");
            setCraData((prev) => ({
                ...prev,
                disaster_per_purok: [
                    { type: "Typhoon", rows: getDefaultPuroks() },
                ],
            }));
        }
    }, [disasterData, setCraData]);

    const updateHazard = useCallback(
        (hIdx, updater) => {
            setCraData((prev) => {
                const updatedDisasters = [...(prev.disaster_per_purok || [])];
                const currentHazard = updatedDisasters[hIdx] || {
                    type: "",
                    rows: [],
                };
                updatedDisasters[hIdx] = {
                    ...currentHazard,
                    ...updater(currentHazard),
                };

                // console.log(
                //     `updateHazard: updated hazard at index ${hIdx}`,
                //     updatedDisasters[hIdx]
                // );
                return { ...prev, disaster_per_purok: updatedDisasters };
            });
        },
        [setCraData]
    );

    const updateHazardType = (hIdx, value) =>
        updateHazard(hIdx, (hazard) => ({ type: value })); // Updater returns only the 'type' property

    const updateCell = (hIdx, rIdx, field, value) =>
        updateHazard(hIdx, (hazard) => {
            const rows = [...(hazard.rows || [])];
            rows[rIdx] = { ...rows[rIdx], [field]: value };
            return { rows };
        });

    const addHazard = () => {
        setCraData((prev) => ({
            ...prev,
            disaster_per_purok: [
                ...(prev.disaster_per_purok || []),
                { type: "", rows: getDefaultPuroks() }, // Adds a new hazard with 7 default puroks
            ],
        }));
        toast.success("New hazard category added!");
        // console.log("addHazard: New hazard added.");
    };

    const removeHazard = (hIdx) => {
        setCraData((prev) => ({
            ...prev,
            disaster_per_purok: (prev.disaster_per_purok || []).filter(
                (_, i) => i !== hIdx
            ),
        }));
        toast.success("Hazard category removed!");
        // console.log(`removeHazard: Hazard at index ${hIdx} removed.`);
    };

    // Purok actions
    const addPurok = (hIdx) =>
        updateHazard(hIdx, (hazard) => ({
            rows: [...(hazard.rows || []), { ...PUROK_TEMPLATE, purok: "" }], // Add a new empty purok
        }));

    const removePurok = (hIdx, rIdx) =>
        updateHazard(hIdx, (hazard) => ({
            rows: (hazard.rows || []).filter((_, i) => i !== rIdx), // Remove the specified purok
        }));

    // Log the entire craData.disaster_per_purok on every render for comprehensive debugging
    // console.log(
    //     "Render: craData.disaster_per_purok:",
    //     craData.disaster_per_purok
    // );

    return (
        <div>
            <p className="text-md font-bold mb-4">
                4.1 Number of Families and Individuals at Risk of Hazards per
                Purok based on the following categories:
            </p>
            <div className="mb-10 border-2 border-purple-300 rounded-xl p-5 bg-purple-50 shadow-sm">
                {disasterData.map((hazard, hIdx) => (
                    <div
                        key={hIdx}
                        className="mb-8 border rounded p-4 bg-white shadow-sm"
                    >
                        {/* Hazard type input and remove button */}
                        <div className="flex justify-between items-center mb-3">
                            <SelectField
                                label=""
                                value={hazard.type || ""}
                                onChange={(e) =>
                                    updateHazardType(
                                        hIdx,
                                        toTitleCase(e.target.value)
                                    )
                                }
                                items={[
                                    { value: "Typhoon", label: "Typhoon" },
                                    { value: "Flood", label: "Flood" },
                                    {
                                        value: "Rain-induced Landslide",
                                        label: "Rain-induced Landslide",
                                    },
                                    { value: "Fire", label: "Fire" },
                                    { value: "Drought", label: "Drought" },
                                    {
                                        value: "Earthquake",
                                        label: "Earthquake",
                                    },
                                    {
                                        value: "Vehicular Incident",
                                        label: "Vehicular Incident",
                                    },
                                    {
                                        value: "Pandemic / Emerging and Re-emerging Diseases",
                                        label: "Pandemic / Emerging and Re-emerging Diseases",
                                    },
                                    // Optional: show previously typed value if not in list
                                    ...(hazard.type &&
                                        ![
                                            "Typhoon",
                                            "Flood",
                                            "Rain-induced Landslide",
                                            "Fire",
                                            "Drought",
                                            "Earthquake",
                                            "Vehicular Incident",
                                            "Pandemic / Emerging and Re-emerging Diseases",
                                        ].includes(hazard.type)
                                        ? [
                                            {
                                                value: hazard.type,
                                                label: hazard.type,
                                            },
                                        ]
                                        : []),
                                ]}
                                placeholder="Select hazard"
                                required={false}
                            />

                            <button
                                onClick={() => removeHazard(hIdx)}
                                className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                                title="Remove Category"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Table for purok data */}
                        <div className="overflow-x-auto">
                            <table className="border border-collapse w-full text-xs">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th
                                            rowSpan="2"
                                            className="border px-2 py-1"
                                        >
                                            Areas affected (Purok)
                                        </th>
                                        {[
                                            "Low Risk",
                                            "Medium Risk",
                                            "High Risk",
                                        ].map((group) => (
                                            <th
                                                key={group}
                                                colSpan="2"
                                                className="border px-2 py-1 text-center"
                                            >
                                                {group}
                                            </th>
                                        ))}
                                        <th
                                            rowSpan="2"
                                            className="border px-2 py-1 text-center"
                                        />
                                    </tr>
                                    <tr className="bg-gray-100">
                                        {RISK_FIELDS.map(({ label }, idx) => (
                                            <th
                                                key={idx}
                                                className="border px-2 py-1"
                                            >
                                                {label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {(hazard.rows || []).map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            <td className="border px-2 py-1 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={row?.purok ?? ""}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            hIdx,
                                                            rIdx,
                                                            "purok",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border w-full px-2 py-1 text-center text-xs"
                                                />
                                            </td>
                                            {RISK_FIELDS.map(({ key }, i) => (
                                                <td
                                                    key={i}
                                                    className="border px-2 py-1 text-center"
                                                >
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={row?.[key] ?? ""}
                                                        onChange={(e) =>
                                                            updateCell(
                                                                hIdx,
                                                                rIdx,
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="border w-full px-2 py-1 text-center text-xs"
                                                    />
                                                </td>
                                            ))}
                                            <td className="border px-2 py-1 text-center">
                                                <button
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-200"
                                                    onClick={() =>
                                                        removePurok(hIdx, rIdx)
                                                    }
                                                    title="Remove Purok Row"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Button to add a new purok row to the current hazard table */}
                        <button
                            onClick={() => addPurok(hIdx)}
                            className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                        >
                            <span className="text-sm font-bold">+</span> Add
                            Purok
                        </button>
                    </div>
                ))}
            </div>

            {/* Button to add a new hazard category table */}
            <button
                onClick={addHazard}
                className="inline-flex items-center gap-1 mt-0 mb-4 px-3 py-1.5 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Hazard Category
            </button>
        </div>
    );
};

export default EffectDisaster;
