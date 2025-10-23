import React, { useContext, useEffect, useRef } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

const ROW_TEMPLATE = {
    evacuationCenter: "",
    typeOfGoods: "",
    quantity: "",
    unit: "",
    beneficiaries: "",
    address: "",
};

const ReliefGoods = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize table in stepper
    useEffect(() => {
        if (!craData.relief_goods) {
            setCraData({
                ...craData,
                relief_goods: [ROW_TEMPLATE],
            });
        }
    }, []);

    const rows = craData.relief_goods || [];

    const updateCell = (index, field, value) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: value };
        setCraData({ ...craData, relief_goods: updated });
    };

    const addRow = () => {
        setCraData({
            ...craData,
            relief_goods: [...rows, { ...ROW_TEMPLATE }],
        });
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        if (rows.length === 1) {
            toast.error("At least one row is required!");
            return;
        }
        setCraData({
            ...craData,
            relief_goods: rows.filter((_, i) => i !== index),
        });
        toast.error("Row removed!");
    };

    // Function to resize textarea
    const autoResize = (el) => {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    };

    return (
        <div className="mb-8">
            <h2 className="text-md font-bold mb-3">
                Relief Goods (Food and Non-Food Items)
            </h2>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1">Name of Evacuation Center</th>
                            <th className="border px-2 py-1">Type of Relief Goods</th>
                            <th className="border px-2 py-1">Quantity</th>
                            <th className="border px-2 py-1">Unit</th>
                            <th className="border px-2 py-1">Name of Beneficiaries</th>
                            <th className="border px-2 py-1">Beneficiaries’ Address</th>
                            <th className="border px-2 py-1 w-[40px] text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                {[
                                    "evacuationCenter",
                                    "typeOfGoods",
                                    "quantity",
                                    "unit",
                                    "beneficiaries",
                                    "address",
                                ].map((field) => (
                                    <td key={field} className="border px-2 py-1">
                                        <textarea
                                            rows={1}
                                            value={row[field]}
                                            onChange={(e) => {
                                                updateCell(idx, field, e.target.value);
                                                autoResize(e.target);
                                            }}
                                            ref={(el) => autoResize(el)} // 👈 ensures it resizes on mount
                                            className="border w-full px-2 py-1 text-md text-center resize-none overflow-hidden"
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

export default ReliefGoods;
