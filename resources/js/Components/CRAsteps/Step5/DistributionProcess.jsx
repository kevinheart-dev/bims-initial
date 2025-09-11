import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const ROW_TEMPLATE = {
    process: "",
    origin: "",
    remarks: "",
};

const DistributionProcess = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize table if not present in craData
    useEffect(() => {
        if (!craData.distribution_process) {
            setCraData({
                ...craData,
                distribution_process: [ROW_TEMPLATE],
            });
        }
    }, []);

    const rows = craData.distribution_process || [];

    // Auto-expand textarea
    const autoExpand = (el) => {
        if (el) {
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
        }
    };

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, distribution_process: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            distribution_process: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added!");
    };

    const removeRow = (index) => {
        if (rows.length === 1) {
            toast.error("At least one row is required!");
            return;
        }
        setCraData({
            ...craData,
            distribution_process: rows.filter((_, i) => i !== index),
        });
        toast.success("Row removed!");
    };

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Distribution Process</h2>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-400 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-400 px-2 py-1 w-1/3">
                                Distribution Process
                            </th>
                            <th className="border border-gray-400 px-2 py-1 w-1/3">
                                Origin of Relief Goods
                            </th>
                            <th className="border border-gray-400 px-2 py-1 w-1/3">
                                Challenge / Status / Remarks
                            </th>
                            <th className="border border-gray-400 px-2 py-1 w-[100px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border border-gray-400 px-2 py-1">
                                    <textarea
                                        value={row.process}
                                        onChange={(e) => updateCell(idx, "process", e.target.value)}
                                        ref={autoExpand} // auto-expand on render
                                        onInput={(e) => autoExpand(e.target)}
                                        className="w-full resize-none overflow-hidden border rounded p-1"
                                        rows={1}
                                        placeholder="Enter distribution process"
                                    />
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                    <textarea
                                        value={row.origin}
                                        onChange={(e) => updateCell(idx, "origin", e.target.value)}
                                        ref={autoExpand}
                                        onInput={(e) => autoExpand(e.target)}
                                        className="w-full resize-none overflow-hidden border rounded p-1"
                                        rows={1}
                                        placeholder="Enter origin of relief goods"
                                    />
                                </td>
                                <td className="border border-gray-400 px-2 py-1">
                                    <textarea
                                        value={row.remarks}
                                        onChange={(e) => updateCell(idx, "remarks", e.target.value)}
                                        ref={autoExpand}
                                        onInput={(e) => autoExpand(e.target)}
                                        className="w-full resize-none overflow-hidden border rounded p-1"
                                        rows={1}
                                        placeholder="Enter remarks"
                                    />
                                </td>
                                <td className="border border-gray-400 px-2 py-1 text-center">
                                    <button
                                        type="button"
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
                type="button"
                onClick={addRow}
                className="mt-3 bg-blue-500 text-white px-4 py-1 rounded text-xs"
            >
                + Add Row
            </button>
        </div>
    );
};

export default DistributionProcess;
