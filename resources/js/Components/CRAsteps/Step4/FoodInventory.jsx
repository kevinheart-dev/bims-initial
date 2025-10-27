import React, { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import { toTitleCase } from '@/utils/stringFormat';

const ROW_TEMPLATE = {
    item: "",
    quantity: "",
    remarks: "",
};

const FoodInventory = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize supplies table in stepper
    useEffect(() => {
        if (!craData.food_inventory) {
            setCraData({
                ...craData,
                food_inventory: [ROW_TEMPLATE],
            });
        }
    }, []);

    const rows = craData.food_inventory || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, food_inventory: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            food_inventory: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            food_inventory: rows.filter((_, i) => i !== index),
        });
        toast.error("Row removed!");
    };

    return (
        <div className="mb-8">
            <h2 className="text-md font-bold mb-3">Food Inventory</h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1 whitespace-nowrap">Item</th>
                            <th className="border px-2 py-1 whitespace-nowrap">Quantity</th>
                            <th className="border px-2 py-1 whitespace-nowrap">Remarks</th>
                            <th className="border px-2 py-1 w-[40px] text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border px-2 py-1">
                                    <textarea
                                        value={row.item}
                                        onChange={(e) => updateCell(idx, "item", toTitleCase(e.target.value))}
                                        className="border w-full px-2 py-1 text-md text-center resize-none overflow-hidden"
                                        rows={1}
                                        onInput={(e) => {
                                            e.target.style.height = "auto"; // reset height
                                            e.target.style.height = e.target.scrollHeight + "px"; // grow to fit
                                        }}
                                        placeholder="Enter Item"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <textarea
                                        value={row.quantity}
                                        onChange={(e) => updateCell(idx, "quantity", e.target.value)}
                                        className="border w-full px-2 py-1 text-md text-center resize-none overflow-hidden"
                                        rows={1}
                                        onInput={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        placeholder="Enter Quantity"
                                    />
                                </td>
                                <td className="border px-2 py-1">
                                    <textarea
                                        value={row.remarks}
                                        onChange={(e) => updateCell(idx, "remarks", toTitleCase(e.target.value))}
                                        className="border w-full px-2 py-1 text-md text-center resize-none overflow-hidden"
                                        rows={1}
                                        onInput={(e) => {
                                            e.target.style.height = "auto";
                                            e.target.style.height = e.target.scrollHeight + "px";
                                        }}
                                        placeholder="Enter Remarks"
                                    />
                                </td>

                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        onClick={() => removeRow(idx)}
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
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

export default FoodInventory;
