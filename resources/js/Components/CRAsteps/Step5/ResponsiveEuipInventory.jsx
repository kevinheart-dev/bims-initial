import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

const EQUIPMENT_ITEMS = [
    "Spine Board",
    "Axe",
    "Gasoline or Fuel",
    "First Aid or Emergency Kit",
    "Hand-held Radio",
    "Helmet or hard hat",
    "Batteries",
    "Portable Generator or alternative source of electricity (ex: solar panel)",
    "Boots",
    "Rope",
    "Search Light",
    "Flash Light",
    "Megaphone",
    "Face Shield",
    "Alcohol",
    "Thermal scanner",
    "Chainsaw",
    "Cleaning materials (Ex: broom, dustpan, rugs, etc.)",
    "Life Vest",
    "Reflectorized Life Vest",
    "Personal Protective Equipment (PPE)",
    "Shovel",
];

const ROW_TEMPLATE = {
    item: "",
    status: "",
    quantity: "",
    location: "",
    remarks: "",
};

const ResponsiveEuipInventory = () => {
    const { craData, setCraData } = useContext(StepperContext);
    const textareaRefs = useRef([]);

    // Initialize table in StepperContext with default items
    useEffect(() => {
        if (!craData.equipment_inventory) {
            setCraData({
                ...craData,
                equipment_inventory: EQUIPMENT_ITEMS.map((item) => ({
                    ...ROW_TEMPLATE,
                    item,
                })),
            });
        }
    }, []);

    const rows = craData.equipment_inventory || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, equipment_inventory: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            equipment_inventory: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        setCraData({
            ...craData,
            equipment_inventory: rows.filter((_, i) => i !== index),
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
            <h2 className="text-md font-bold mb-3">Equipment Inventory</h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Equipment</th>
                            <th className="border px-2 py-1 w-[150px]">
                                Put a check (✓) if the items are found in the barangay and cross (x) if they are not
                            </th>
                            <th className="border px-2 py-1 text-center">Quantity</th>
                            <th className="border px-2 py-1">Location of the equipment</th>
                            <th className="border px-2 py-1">Remarks</th>
                            <th className="border px-2 py-1 w-[40px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {/* Item */}
                                <td className="border px-2 py-1">
                                    <textarea
                                        ref={(el) => (textareaRefs.current[idx * 5] = el)}
                                        rows={1}
                                        value={row.item}
                                        onChange={(e) => {
                                            updateCell(idx, "item", e.target.value);
                                            autoResize(e);
                                        }}
                                        className="border w-full px-2 py-1 text-left resize-none overflow-hidden"
                                    />
                                </td>

                                {/* Status */}
                                <td className="border px-2 py-1 w-[80px]">
                                    <div className="flex justify-center gap-1">
                                        <button
                                            onClick={() => updateCell(idx, "status", "✓")}
                                            className={`p-1 rounded-full ${row.status === "✓"
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            <Check size={14} />
                                        </button>
                                        <button
                                            onClick={() => updateCell(idx, "status", "x")}
                                            className={`p-1 rounded-full ${row.status === "x"
                                                ? "bg-red-500 text-white"
                                                : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </td>

                                {/* Quantity, Location, Remarks */}
                                {["quantity", "location", "remarks"].map((field, fIdx) => (
                                    <td key={field} className="border px-2 py-1">
                                        <textarea
                                            ref={(el) =>
                                                (textareaRefs.current[idx * 5 + (fIdx + 1)] = el)
                                            }
                                            rows={1}
                                            value={row[field]}
                                            onChange={(e) => {
                                                updateCell(idx, field, e.target.value);
                                                autoResize(e);
                                            }}
                                            className="border w-full px-2 py-1 text-center resize-none overflow-hidden"
                                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        />
                                    </td>
                                ))}

                                {/* Remove Row */}
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

export default ResponsiveEuipInventory;
