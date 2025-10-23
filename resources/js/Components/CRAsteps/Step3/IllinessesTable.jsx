import React, { useEffect, useContext } from "react";
import { Plus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { StepperContext } from "@/context/StepperContext";

const DEFAULT_ILLNESSES = [
    { illness: "Hypertension", children: "", adults: "" },
    { illness: "Acute Respiratory Infection (AURI)", children: "", adults: "" },
    { illness: "Diabetes Mellitus", children: "", adults: "" },
    { illness: "Scabies", children: "", adults: "" },
    { illness: "Infected Wound", children: "", adults: "" },
    { illness: "Influenza", children: "", adults: "" },
    { illness: "Urinary Tract Infection (UTI)", children: "", adults: "" },
    { illness: "Skin Allergy", children: "", adults: "" },
    { illness: "Boil", children: "", adults: "" },
    { illness: "Chicken Pox", children: "", adults: "" },
    { illness: "Diarrhea", children: "", adults: "" },
    { illness: "Dengue", children: "", adults: "" },
    { illness: "Stroke", children: "", adults: "" },
];

const IllnessesTable = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize illnesses array
    useEffect(() => {
        if (!craData.illnesses || craData.illnesses.length === 0) {
            setCraData(prev => ({ ...prev, illnesses: DEFAULT_ILLNESSES }));
        }
    }, [craData, setCraData]);

    const updateIllness = (idx, key, value) => {
        const updated = craData.illnesses.map((item, i) =>
            i === idx
                ? { ...item, [key]: key === "illness" ? value : value.replace(/\D/g, "") }
                : item
        );
        setCraData(prev => ({ ...prev, illnesses: updated }));
    };

    const addIllness = () => {
        const newRow = { illness: "", children: "", adults: "" };
        setCraData(prev => ({ ...prev, illnesses: [...prev.illnesses, newRow] }));
        toast.success("Illness added successfully!");
    };

    const removeIllness = (idx) => {
        const updated = craData.illnesses.filter((_, i) => i !== idx);
        setCraData(prev => ({ ...prev, illnesses: updated }));
        toast.error("Illness removed!");
    };

    // Calculate totals
    const totals = craData.illnesses?.reduce(
        (acc, item) => {
            acc[0] += Number(item.children) || 0;
            acc[1] += Number(item.adults) || 0;
            return acc;
        },
        [0, 0]
    ) || [0, 0];

    return (
        <div className="p-4">
            <Toaster position="top-right" />
            <div className="overflow-x-auto">
                <table className="min-w-full border text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-1 text-center">Illness/Disease</th>
                            <th className="border p-1 text-center">Children (17 and below)</th>
                            <th className="border p-1 text-center">Adults (18 and above)</th>
                            <th className="border p-1 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {craData.illnesses?.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="border p-1">
                                    <input
                                        type="text"
                                        value={item.illness}
                                        onChange={(e) => updateIllness(idx, "illness", e.target.value)}
                                        className="w-full text-center text-xs p-1 border rounded"
                                    />
                                </td>
                                <td className="border p-1">
                                    <input
                                        type="text"
                                        value={item.children}
                                        onChange={(e) => updateIllness(idx, "children", e.target.value)}
                                        className="w-full text-center text-xs p-1 border rounded"
                                    />
                                </td>
                                <td className="border p-1">
                                    <input
                                        type="text"
                                        value={item.adults}
                                        onChange={(e) => updateIllness(idx, "adults", e.target.value)}
                                        className="w-full text-center text-xs p-1 border rounded"
                                    />
                                </td>
                                <td className="p-0.5 text-center !border-0">
                                    <button
                                        className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 mx-auto"
                                        onClick={() => removeIllness(idx)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold">
                            <td className="border p-1 text-center">Total</td>
                            <td className="border p-1 text-center">{totals[0]}</td>
                            <td className="border p-1 text-center">{totals[1]}</td>
                            <td className="border p-1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button
                onClick={addIllness}
                className="inline-flex items-center gap-1 m-2 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Illness
            </button>

        </div>
    );
};

export default IllnessesTable;
