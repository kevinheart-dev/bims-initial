import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

const TRAINING_TITLES = [
    "Training on RA 10121 (Philippine Disaster Risk Reduction and Management Act)",
    "Training on RA 10821 (Children’s Emergency Relief and Protection Act)",
    "Training on Child Protection in Emergencies",
    "Training on Pre- Disaster Risk Assessment",
    "Training on the Protocol for Management of the Dead and Missing",
    "Training on Camp Management",
    "Training on Incident Command System",
    "Training on Psychological First Aid",
    "First Aid at Basic Life Support Training",
    "Basic Search and Rescue Training",
    "Training on Psychological First Aid",
    "Training on Mental Health and Psychosocial Support",
    "Community-Based Reduction and Management (CBDRRM) Training",
    "Mental Health and Psychosocial Support (MHPSS) Training",
    "Training on the Conduct of Simulation/Drills for Priority Hazards",
    "Training on Rapid Damage Assessment and Needs Analysis (RDANA)",
    "Training on Minimum Health Protocols",
    "Training on Contact Tracing and Reporting",
    "Training on Public Service Continuity",
    "Training on Basic Disease Surveillance and Reporting",
    "QAS for BDRRM and Committee training workshop",
];

const ROW_TEMPLATE = {
    title: "",
    applies: "",
    duration: "",
    agency: "",
    dates: "",
    participants: "",
    names: "",
};

const TrainingsInventory = () => {
    const { craData, setCraData } = useContext(StepperContext);
    const textareaRefs = useRef([]);

    // Initialize table in stepper with default titles
    useEffect(() => {
        if (!craData.trainings_inventory) {
            setCraData({
                ...craData,
                trainings_inventory: TRAINING_TITLES.map((t) => ({
                    ...ROW_TEMPLATE,
                    title: t,
                })),
            });
        }
    }, []);

    const rows = craData.trainings_inventory || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, trainings_inventory: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            trainings_inventory: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            trainings_inventory: rows.filter((_, i) => i !== index),
        });
        toast.error("Row removed!");
    };

    // Auto-resize textarea (typing)
    const autoResize = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    // Expand textareas on load (for saved content)
    useEffect(() => {
        textareaRefs.current.forEach((textarea) => {
            if (textarea) {
                textarea.style.height = "auto";
                textarea.style.height = textarea.scrollHeight + "px";
            }
        });
    }, [rows]);

    return (
        <div className="mb-8">
            <h2 className="text-md font-bold mb-3">Trainings Inventory</h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Title of the training</th>
                            <th className="border px-2 py-1 w-[150px]">
                                Put a check if the item applies (✓) and cross (x) if it does not
                            </th>
                            <th className="border px-2 py-1">Duration of training</th>
                            <th className="border px-2 py-1 w-[180px]">
                                Agency or organization that provided the training
                            </th>
                            <th className="border px-2 py-1">
                                Inclusive dates of the training
                            </th>
                            <th className="border px-2 py-1">Number of participants</th>
                            <th className="border px-2 py-1">
                                Name of persons attended/ participated
                            </th>
                            <th className="border px-2 py-1 w-[40px] text-center"></th>
                        </tr>

                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {/* Title */}
                                <td className="border px-2 py-1">
                                    <textarea
                                        ref={(el) => (textareaRefs.current[idx * 6 + 0] = el)}
                                        rows={1}
                                        value={row.title}
                                        onChange={(e) => {
                                            updateCell(idx, "title", e.target.value);
                                            autoResize(e);
                                        }}
                                        className="border w-full px-2 py-1 text-md text-left resize-none overflow-hidden"
                                    />
                                </td>

                                {/* Applies Column */}
                                <td className="border px-2 py-1 w-[80px]">
                                    <div className="flex justify-center gap-1">
                                        <button
                                            onClick={() => updateCell(idx, "applies", "yes")}
                                            className={`p-1 rounded-full ${row.applies === "yes"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateCell(idx, "applies", "no")}
                                            className={`p-1 rounded-full ${row.applies === "no"
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </td>

                                {/* Other Columns */}
                                {["duration", "agency", "dates", "participants", "names"].map(
                                    (field, fIdx) => (
                                        <td key={field} className="border px-2 py-1">
                                            <textarea
                                                ref={(el) =>
                                                    (textareaRefs.current[idx * 6 + (fIdx + 1)] = el)
                                                }
                                                rows={1}
                                                value={row[field]}
                                                onChange={(e) => {
                                                    updateCell(idx, field, e.target.value);
                                                    autoResize(e);
                                                }}
                                                className="border w-full px-2 py-1 text-md text-center resize-none overflow-hidden"
                                            />
                                        </td>
                                    )
                                )}

                                {/* Remove Button */}
                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        onClick={() => removeRow(idx)}
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
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

export default TrainingsInventory;
