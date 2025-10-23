import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const ROW_TEMPLATE = { task: "", responsible: "", remarks: "" };

const BarangayEvacuationPlan = () => {
    const { craData, setCraData } = useContext(StepperContext);
    const textareaRefs = useRef([]);

    // Initialize table with one empty row if not already set
    useEffect(() => {
        if (!craData.evacuation_plan) {
            setCraData({
                ...craData,
                evacuation_plan: [{ ...ROW_TEMPLATE }],
            });
        }
    }, []);

    const rows = craData.evacuation_plan || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, evacuation_plan: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            evacuation_plan: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            evacuation_plan: rows.filter((_, i) => i !== index),
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
            <h2 className="text-md font-bold mb-3">Barangay Evacuation Plan</h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">THINGS TO DO</th>
                            <th className="border px-2 py-1">RESPONSIBLE PERSON</th>
                            <th className="border px-2 py-1">REMARKS</th>
                            <th className="border px-2 py-1 w-[40px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{idx + 1}</td>

                                {["task", "responsible", "remarks"].map((field, fIdx) => (
                                    <td key={field} className="border px-2 py-1">
                                        <textarea
                                            ref={(el) => (textareaRefs.current[idx * 3 + fIdx] = el)}
                                            rows={1}
                                            value={row[field]}
                                            onChange={(e) => {
                                                updateCell(idx, field, e.target.value);
                                                autoResize(e);
                                            }}
                                            className="border w-full px-2 py-1 text-left resize-none overflow-hidden"
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
                className="inline-flex items-center gap-1 mt-3 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Row
            </button>

        </div>
    );
};

export default BarangayEvacuationPlan;
