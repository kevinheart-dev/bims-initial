import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const DEFAULT_DESIGNATIONS = [
    "BDRRMC Chairman",
    "BDRRM Focal Person",
    "Operation/Admin/ Infra/Shelter",
    "Prevention & Mitigation Sub-Committee",
    "Preparedness Sub-Committee",
    "Response Sub-Committee",
    "Recovery & Rehabilitation Sub-Committee",
    "SRR",
    "Security And Safety",
    "Education",
    "Damage Control/POANA Team/RDANA",
    "Health Or First Aid & Psycho-Social Support",
    "Livelihood",
    "Evacuation/Camp Mngt.",
    "Relief Distribution",
    "Protection",
    "Research And Planning",
    "Communication & Warning",
    "Transportation",
    "Fire Management",
    "Infrastructure and Shelter",
];

const ROW_TEMPLATE = { designation: "", name: "", contact: "" };

const BdrrmcDirectory = () => {
    const { craData, setCraData } = useContext(StepperContext);
    const textareaRefs = useRef([]);

    // Initialize the table with default designations
    useEffect(() => {
        if (!craData.bdrrmc_directory) {
            setCraData({
                ...craData,
                bdrrmc_directory: DEFAULT_DESIGNATIONS.map((designation) => ({
                    ...ROW_TEMPLATE,
                    designation,
                })),
            });
        }
    }, []);

    const rows = craData.bdrrmc_directory || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, bdrrmc_directory: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            bdrrmc_directory: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            bdrrmc_directory: rows.filter((_, i) => i !== index),
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
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">Designation/Team</th>
                            <th className="border px-2 py-1">Name</th>
                            <th className="border px-2 py-1">Contact No.</th>
                            <th className="border px-2 py-1 w-[40px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">{idx + 1}</td>

                                {/* Designation */}
                                <td className="border px-2 py-1 text-left">
                                    <textarea
                                        ref={(el) => (textareaRefs.current[idx * 3] = el)}
                                        rows={1}
                                        value={row.designation}
                                        onChange={(e) => {
                                            updateCell(idx, "designation", e.target.value);
                                            autoResize(e);
                                        }}
                                        className="border w-full px-2 py-1 text-left resize-none overflow-hidden"
                                    />
                                </td>

                                {/* Name */}
                                <td className="border px-2 py-1">
                                    <textarea
                                        ref={(el) => (textareaRefs.current[idx * 3 + 1] = el)}
                                        rows={1}
                                        value={row.name}
                                        onChange={(e) => {
                                            updateCell(idx, "name", e.target.value);
                                            autoResize(e);
                                        }}
                                        className="border w-full px-2 py-1 text-center resize-none overflow-hidden"
                                    />
                                </td>

                                {/* Contact */}
                                <td className="border px-2 py-1">
                                    <textarea
                                        ref={(el) => (textareaRefs.current[idx * 3 + 2] = el)}
                                        rows={1}
                                        value={row.contact}
                                        onChange={(e) => {
                                            updateCell(idx, "contact", e.target.value);
                                            autoResize(e);
                                        }}
                                        className="border w-full px-2 py-1 text-center resize-none overflow-hidden"
                                    />
                                </td>

                                {/* Remove row */}
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

export default BdrrmcDirectory;
