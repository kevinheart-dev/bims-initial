import { useContext, useEffect, useCallback } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import Accordion from "../Accordion";
import React from "react";
import { toTitleCase } from "@/utils/stringFormat";
import { defaultLivelihoods, defaultInfra } from "./defaults";

// ------------------------------------------------------
// Constants
// const defaultLivelihoods = [
//     "Farming", "Fishing", "Poultry and Livestock", "Carpentry",
//     "Professional", "Government Employee", "Private Employee",
//     "Brgy. Official or Staff", "Businessman/woman",
//     "Formal/Licensed Driver", "Non-Licensed Driver", "Porter",
//     "Masseuse", "House Helper", "Electrician", "Laborer",
//     "Miner", "Lender", "Call Center Agent", "Medical Transcriptionist",
//     "Virtual Assistant",
// ];

// const defaultInfra = [
//     {
//         category: "Electricity Source",
//         rows: [
//             { type: "Distribution Company (ISELCO-II)", households: "" },
//             { type: "Generator", households: "" },
//             { type: "Solar (renewable energy source)", households: "" },
//             { type: "Battery", households: "" },
//             { type: "None", households: "" },
//         ],
//     },
//     {
//         category: "Bath and Wash Area",
//         rows: [
//             { type: "With own Sink and Bath", households: "" },
//             { type: "Shared or Communal", households: "" },
//             { type: "Separate Bathroom", households: "" },
//         ],
//     },
//     {
//         category: "Water Source",
//         rows: [
//             { type: "Level II Water System", households: "" },
//             { type: "Level III Water System", households: "" },
//             { type: "Deep Well (Level I)", households: "" },
//             { type: "Artesian Well (Level I)", households: "" },
//             { type: "Shallow Well (Level I)", households: "" },
//             { type: "Commercial Water Refill Source", households: "" },
//         ],
//     },
//     {
//         category: "Waste Management",
//         rows: [
//             { type: "Open Dump Site", households: "" },
//             { type: "Sanitary Landfill", households: "" },
//             { type: "Compost Pits", households: "" },
//             { type: "Material Recovery Facility (MRF)", households: "" },
//             { type: "Garbage is collected", households: "" },
//         ],
//     },
//     {
//         category: "Toilet",
//         rows: [
//             { type: "Water Sealed", households: "" },
//             { type: "Compost Pit Toilet", households: "" },
//             { type: "Shared or Communal Toilet/Public Toilet", households: "" },
//             { type: "No Latrine", households: "" },
//             { type: "Flash Toilet", households: "" },
//         ],
//     },
// ];

// ------------------------------------------------------
// Utility helpers
const fields = [
    "male_no_dis", "male_dis", "female_no_dis", "female_dis", "lgbtq_no_dis", "lgbtq_dis"
];

const sumRow = (row) => fields.reduce((s, f) => s + (Number(row[f]) || 0), 0);
const sumColumn = (data, field) => data?.reduce((s, r) => s + (Number(r[field]) || 0), 0) || "";
const sumGrand = (data) => data?.reduce((s, r) => s + sumRow(r), 0) || "";

// ------------------------------------------------------
// Livelihood Table
const LivelihoodTable = React.memo(function LivelihoodTable({ data, defaultLivelihoodTypes, updateRow, updateType, removeRow, addRow }) {
    return (
        <section>
            <h2 className="text-lg font-semibold mb-3">Primary Livelihood of Residents</h2>
            <p className="text-sm text-gray-600 italic mb-2">
                <strong>Note:</strong> Leave a cell blank if the value is zero. Default livelihoods cannot be removed or edited.
            </p>
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th rowSpan="3" className="border px-2 py-1 w-[250px]">Type of Livelihood</th>
                        <th colSpan="6" className="border px-2 py-1 text-center">NUMBER</th>
                        <th rowSpan="3" className="border px-2 py-1">Total</th>
                        <th rowSpan="3" className="border px-2 py-1 !border-0 w-10"></th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="border px-2 py-1 text-center">Male</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">Female</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">LGBTQ+</th>
                    </tr>
                    <tr>{ /* Adjusted this line for no whitespace */
                        [
                            "Without Disability", "With Disability",
                            "Without Disability", "With Disability",
                            "Without Disability", "With Disability"
                        ].map((label, i) => (
                            <th key={i} className="border px-2 py-1">{label}</th>
                        ))
                    }</tr>
                </thead>
                <tbody>{ /* Adjusted this line for no whitespace */
                    data.map((row, idx) => {
                        const isDefault = defaultLivelihoodTypes.includes(row.type);
                        return (
                            <tr key={idx}><td className="border px-2 py-1">
                                {isDefault ? (
                                    <span className="block w-full p-1 bg-gray-50 text-gray-700">
                                        {row.type}
                                    </span>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full border p-1"
                                        value={row.type}
                                        placeholder="Enter livelihood type"
                                        onChange={(e) => updateType(idx, toTitleCase(e.target.value))}
                                    />
                                )}
                            </td>{fields.map((field) => (
                                <td key={field} className="border px-2 py-1">
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full border p-1 text-center"
                                        value={row[field] ?? ""}
                                        onChange={(e) => updateRow(idx, field, e.target.value)}
                                    />
                                </td>
                            ))}<td className="border px-2 py-1 font-semibold text-center bg-gray-50">
                                    {sumRow(row) || ""}
                                </td><td className="px-2 py-1 text-center !border-0">
                                    {!isDefault && (
                                        <button
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                            onClick={() => removeRow(idx)}
                                            title="Remove this row"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </td></tr>
                        );
                    })
                }</tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-semibold"><td className="border px-2 py-1 text-center">Total</td>{fields.map((f) => (
                        <td key={f} className="border px-2 py-1 text-center">{sumColumn(data, f)}</td>
                    ))}<td className="border px-2 py-1 text-center">{sumGrand(data)}</td><td className="!border-0"></td></tr>
                </tfoot>
            </table>

            <div className="flex items-start justify-between mt-3">
                <button
                    onClick={addRow}
                    className="text-xs px-2 py-1 border border-blue-500 text-blue-600 rounded-md font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                >
                    + Add new row
                </button>
                <p className="text-sm text-gray-600 italic">
                    <strong>Note:</strong> Add a new row if the livelihood type is not specified.
                </p>
            </div>
        </section>
    );
});

// ------------------------------------------------------
// Infrastructure Table - MODIFIED
const InfraTable = React.memo(function InfraTable({ category, catIdx, defaultCategoryRows, updateRow, removeRow, addRow }) {
    const defaultTypesForCategory = defaultCategoryRows.map(row => row.type);

    return (
        <div className="flex flex-col border rounded">
            <h3 className="font-semibold text-md mb-2 p-2">{category.category}</h3>
            <div className="flex-1 overflow-auto">
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[300px]">Type</th>
                            <th className="border px-2 py-1 text-center">Households</th>
                            <th className="px-2 py-1 text-center !border-0 w-10"></th>
                        </tr>
                    </thead>

                    <tbody>{ /* Adjusted this line for no whitespace */
                        category.rows.map((row, rowIdx) => {
                            const isDefault = defaultTypesForCategory.includes(row.type);
                            return (
                                <tr key={rowIdx}><td className="border px-2 py-1">
                                    {isDefault ? (
                                        <span className="block w-full p-1 bg-gray-50 text-gray-700">
                                            {row.type}
                                        </span>
                                    ) : (
                                        <input
                                            type="text"
                                            className="w-full border p-1"
                                            value={row.type}
                                            placeholder="Enter type"
                                            onChange={(e) => {
                                                if (!isDefault) {
                                                    updateRow(catIdx, rowIdx, "type", toTitleCase(e.target.value));
                                                } else {
                                                    toast.error("Default infrastructure types cannot be edited.");
                                                }
                                            }}
                                        />
                                    )}
                                </td><td className="border px-2 py-1 text-center">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full border p-1 text-center"
                                            value={row.households ?? ""}
                                            onChange={(e) => updateRow(catIdx, rowIdx, "households", e.target.value)}
                                        />
                                    </td><td className="px-2 py-1 text-center !border-0">
                                        {!isDefault && (
                                            <button
                                                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                                onClick={() => removeRow(catIdx, rowIdx)}
                                                title="Remove this row"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </td></tr>
                            );
                        })
                    }</tbody>
                </table>
            </div>

            <div className="flex items-start justify-between p-2 mt-2">
                <button
                    onClick={() => addRow(catIdx)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                >
                    <span className="text-sm font-bold">+</span> Add new row
                </button>
                <p className="text-xs text-gray-600 italic">
                    <strong>Note:</strong> Add a new row if needed.
                </p>
            </div>
        </div>
    );
});

// ------------------------------------------------------
// Main Component
export default function Livelihood() {
    const { craData, setCraData } = useContext(StepperContext);

    useEffect(() => {
        // Run once on mount to initialize defaults if needed
        setCraData(prev => {
            if (
                prev.livelihood?.length &&
                prev.infrastructure?.length
            ) {
                return prev;
            }
            return {
                ...prev,
                livelihood: prev.livelihood?.length
                    ? prev.livelihood
                    : defaultLivelihoods.map((type) => ({
                        type,
                        male_no_dis: "",
                        male_dis: "",
                        female_no_dis: "",
                        female_dis: "",
                        lgbtq_no_dis: "",
                        lgbtq_dis: "",
                    })),
                infrastructure: prev.infrastructure?.length
                    ? prev.infrastructure
                    : defaultInfra,
            };
        });
    }, [setCraData]);


    const updateRow = useCallback((i, field, val) => {
        setCraData((prev) => {
            const updated = [...prev.livelihood];
            updated[i] = { ...updated[i], [field]: val === "" ? "" : Number(val) };
            return { ...prev, livelihood: updated };
        });
    }, [setCraData]);

    const updateType = useCallback((i, val) => {
        setCraData((prev) => {
            const updated = [...prev.livelihood];
            const isDefault = defaultLivelihoods.includes(updated[i].type);
            if (!isDefault) { // Only allow editing if it's not a default type
                updated[i] = { ...updated[i], type: val };
            } else {
                toast.error("Default livelihood types cannot be edited.");
            }
            return { ...prev, livelihood: updated };
        });
    }, [setCraData]);


    const addRow = useCallback(() => {
        setCraData((prev) => ({
            ...prev,
            livelihood: [...prev.livelihood, {
                type: "", male_no_dis: "", male_dis: "", female_no_dis: "", female_dis: "", lgbtq_no_dis: "", lgbtq_dis: ""
            }],
        }));
        toast.success("Row added!");
    }, [setCraData]);

    const removeRow = useCallback((i) => {
        setCraData((prev) => {
            const livelihoodToRemove = prev.livelihood[i];
            const isDefault = defaultLivelihoods.includes(livelihoodToRemove.type);

            if (isDefault) {
                toast.error("Default livelihood rows cannot be removed.");
                return prev;
            }

            toast.error("Row removed!");
            return {
                ...prev,
                livelihood: prev.livelihood.filter((_, idx) => idx !== i),
            };
        });
    }, [setCraData]);

    const updateInfraRow = useCallback((catIdx, rowIdx, field, value) => {
        setCraData((prev) => {
            const updated = prev.infrastructure.map((cat, i) =>
                i === catIdx
                    ? {
                        ...cat,
                        rows: cat.rows.map((row, j) => {
                            if (j !== rowIdx) return row;

                            return {
                                ...row,
                                [field]: field === "households" ? (value === "" ? "" : Number(value)) : value
                            };
                        }),
                    }
                    : cat
            );
            return { ...prev, infrastructure: updated };
        });
    }, [setCraData]);


    const addInfraRow = useCallback((catIdx) => {
        setCraData((prev) => {
            const updated = prev.infrastructure.map((cat, i) =>
                i === catIdx ? { ...cat, rows: [...cat.rows, { type: "", households: "" }] } : cat
            );
            return { ...prev, infrastructure: updated };
        });
        toast.success("New row added!");
    }, [setCraData]);

    const removeInfraRow = useCallback((catIdx, rowIdx) => {
        setCraData((prev) => {
            const categoryToUpdate = prev.infrastructure[catIdx];
            const rowToRemove = categoryToUpdate.rows[rowIdx];

            const defaultRowsForCategory = defaultInfra[catIdx].rows;
            const isDefault = defaultRowsForCategory.some(defaultRow => defaultRow.type === rowToRemove.type);

            if (isDefault) {
                toast.error("Default infrastructure rows cannot be removed.");
                return prev;
            }

            toast.error("Row removed!");
            const updated = prev.infrastructure.map((cat, i) =>
                i === catIdx ? { ...cat, rows: cat.rows.filter((_, j) => j !== rowIdx) } : cat
            );
            return { ...prev, infrastructure: updated };
        });
    }, [setCraData]);

    return (
        <div className="space-y-4">
            <Accordion title="B. Information on Livelihood">
                <LivelihoodTable
                    data={craData.livelihood || []}
                    defaultLivelihoodTypes={defaultLivelihoods}
                    updateRow={updateRow}
                    updateType={updateType}
                    removeRow={removeRow}
                    addRow={addRow}
                />
            </Accordion>

            <Accordion title="C. Infrastructures and Institutions that provide services to the Barangay">
                <div className="grid gap-4">
                    <p className="text-sm text-gray-600 italic mb-2">
                        <strong>Note:</strong> Leave a cell blank if the value is zero.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        {craData.infrastructure?.slice(0, 3).map((cat, idx) => (
                            <InfraTable
                                key={idx}
                                category={cat}
                                catIdx={idx}
                                defaultCategoryRows={defaultInfra[idx].rows}
                                updateRow={updateInfraRow}
                                removeRow={removeInfraRow}
                                addRow={addInfraRow}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {craData.infrastructure?.slice(3).map((cat, idx) => (
                            <InfraTable
                                key={idx + 3}
                                category={cat}
                                catIdx={idx + 3}
                                defaultCategoryRows={defaultInfra[idx + 3].rows}
                                updateRow={updateInfraRow}
                                removeRow={removeInfraRow}
                                addRow={addInfraRow}
                            />
                        ))}
                    </div>
                </div>
            </Accordion>
        </div>
    );
}
