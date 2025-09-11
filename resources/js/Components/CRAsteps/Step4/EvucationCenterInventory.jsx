import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const ROW_TEMPLATE = {
    totalFamilies: "",
    totalIndividuals: "",
    populationAtRiskFamilies: "",
    populationAtRiskIndividuals: "",
    evacuationCenterPlanA: "",
    personsCanBeAccommodatedPlanAFamilies: "",
    personsCanBeAccommodatedPlanAIndividuals: "",
    personsCannotBeAccommodatedPlanAFamilies: "",
    personsCannotBeAccommodatedPlanAIndividuals: "",
    evacuationCenterPlanB: "",
    personsCannotBeAccommodatedPlanABFamilies: "",
    personsCannotBeAccommodatedPlanABIndividuals: "",
    remarks: "",
};

const EvacuationCenterInventory = () => {
    const { craData, setCraData } = useContext(StepperContext);
    const textareaRefs = useRef([]);

    useEffect(() => {
        if (!craData.evacuation_center_inventory) {
            setCraData({
                ...craData,
                evacuation_center_inventory: [{ ...ROW_TEMPLATE }],
            });
        }
    }, []);

    const rows = craData.evacuation_center_inventory || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, evacuation_center_inventory: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            evacuation_center_inventory: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            evacuation_center_inventory: rows.filter((_, i) => i !== index),
        });
        toast.error("Row removed!");
    };

    const autoResize = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

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

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th rowSpan={2} className="border px-2 py-1">Purok</th>
                            <th colSpan={2} className="border px-2 py-1">Total Population</th>
                            <th colSpan={2} className="border px-2 py-1">Number of Population at Risk</th>
                            <th rowSpan={2} className="border px-2 py-1">Name of Evacuation Center (Plan A) Government-owned</th>
                            <th colSpan={2} className="border px-2 py-1">Number of Persons who can be accommodated</th>
                            <th colSpan={2} className="border px-2 py-1">Number of Persons who cannot be accommodated</th>
                            <th rowSpan={2} className="border px-2 py-1">Name of Evacuation Center (Plan B) Privately-owned</th>
                            <th colSpan={2} className="border px-2 py-1">Number of Persons who cannot be accommodated at Plan A & B</th>
                            <th rowSpan={2} className="border px-2 py-1 w-[110px]">Remarks</th>
                            <th rowSpan={2} className="border px-2 py-1 w-[40px]"></th>
                        </tr>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{idx + 1}</td>

                                {[
                                    "totalFamilies",
                                    "totalIndividuals",
                                    "populationAtRiskFamilies",
                                    "populationAtRiskIndividuals",
                                    "evacuationCenterPlanA",
                                    "personsCanBeAccommodatedPlanAFamilies",
                                    "personsCanBeAccommodatedPlanAIndividuals",
                                    "personsCannotBeAccommodatedPlanAFamilies",
                                    "personsCannotBeAccommodatedPlanAIndividuals",
                                    "evacuationCenterPlanB",
                                    "personsCannotBeAccommodatedPlanABFamilies",
                                    "personsCannotBeAccommodatedPlanABIndividuals",
                                    "remarks",
                                ].map((field, fIdx) => (
                                    <td key={field} className="border px-2 py-1">
                                        <textarea
                                            ref={(el) => (textareaRefs.current[idx * 13 + fIdx] = el)}
                                            rows={1}
                                            value={row[field]}
                                            onChange={(e) => {
                                                updateCell(idx, field, e.target.value);
                                                autoResize(e);
                                            }}
                                            className="border w-full px-2 py-1 text-center resize-none overflow-hidden text-xs"
                                        />
                                    </td>
                                ))}

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

export default EvacuationCenterInventory;
