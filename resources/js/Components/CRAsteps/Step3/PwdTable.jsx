import React, { useState, useEffect, useContext, useRef } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { StepperContext } from "@/context/StepperContext";

const defaultDisabilities = [
    "Deaf/Hard of Hearing",
    "Speech/Language Impairment",
    "Visual Disability",
    "Mental Disability",
    "Intellectual Disability",
    "Learning Disability",
    "Physical Disability",
    "Psychosocial Disability",
    "Orthopedic Disability",
];

const ageGroups = [
    { label: "0-6Y", cols: 2 },
    { label: "7M-2Y", cols: 2 },
    { label: "3-5Y", cols: 2 },
    { label: "6-12Y", cols: 3 },
    { label: "13-17Y", cols: 3 },
    { label: "18-59Y", cols: 3 },
    { label: "60Y+", cols: 3 },
];

const subLabels = [
    "M", "F",
    "M", "F",
    "M", "F",
    "M", "F", "LGBTQ",
    "M", "F", "LGBTQ",
    "M", "F", "LGBTQ",
    "M", "F", "LGBTQ",
];

const categories = [
    "age0_6M", "age0_6F",
    "age7m_2yM", "age7m_2yF",
    "age3_5M", "age3_5F",
    "age6_12M", "age6_12F", "age6_12LGBTQ",
    "age13_17M", "age13_17F", "age13_17LGBTQ",
    "age18_59M", "age18_59F", "age18_59LGBTQ",
    "age60upM", "age60upF", "age60upLGBTQ",
];

// Create a new row with optional type
const createRow = (type = "") =>
    categories.reduce((acc, c) => ({ ...acc, [c]: "" }), { type });

const TableHeader = () => (
    <thead className="bg-gray-100 text-sm">
        <tr>
            <th rowSpan="2" className="border p-1">Type</th>
            {ageGroups.map((g, idx) => (
                <th key={idx} colSpan={g.cols} className="border p-1 text-center">{g.label}</th>
            ))}
            <th rowSpan="2" className="border p-1 text-center">TOTAL</th>
            <th rowSpan="2" className="border p-1"></th>
        </tr>
        <tr>
            {subLabels.map((lbl, idx) => (
                <th key={idx} className="border p-1 text-center">{lbl}</th>
            ))}
        </tr>
    </thead>
);

const DisabilityRow = ({ row, rowIdx, updateField, removeRow, inputRefs }) => {
    // Determine if the type field should be editable
    // It's editable if it's an empty string (new row) OR if it's not one of the default disabilities
    const isTypeEditable = row.type === "" || !defaultDisabilities.includes(row.type);

    return (
        <tr>
            <td className="border p-1 text-sm">
                {isTypeEditable ? (
                    <input
                        ref={el => inputRefs.current[rowIdx] = el}
                        type="text"
                        value={row.type}
                        className="w-full border p-1 text-sm"
                        onChange={(e) => updateField(rowIdx, "type", e.target.value)}
                        placeholder="Enter Disability"
                    />
                ) : (
                    // Otherwise, display the type as plain text
                    row.type
                )}
            </td>

            {categories.map((field) => (
                <td key={field} className="border p-1">
                    <input
                        type="text"
                        value={row[field]}
                        className="w-full text-center border p-1"
                        onChange={(e) => updateField(rowIdx, field, e.target.value)}
                    />
                </td>
            ))}

            <td className="border p-1 text-center font-bold">
                {categories.reduce((sum, f) => sum + (Number(row[f]) || 0), 0)}
            </td>

            <td className="border p-1 text-center">
                {/* Only allow removal if it's a user-added row (identified by an empty type initially, or a type not in default) */}
                {isTypeEditable ? (
                    <button
                        onClick={() => removeRow(rowIdx)}
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        <X className="w-3 h-3" />
                    </button>
                ) : (
                    <div className="w-5 h-5"></div>
                )}
            </td>
        </tr>
    );
};

const TotalsRow = ({ rows }) => (
    <tr className="bg-gray-50 font-bold text-sm">
        <td className="border p-1">TOTAL</td>
        {categories.map((field) => (
            <td key={field} className="border p-1 text-center">
                {rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0)}
            </td>
        ))}
        <td className="border p-1 text-center">
            {rows.reduce((sum, row) => sum + categories.reduce((s, f) => s + (Number(row[f]) || 0), 0), 0)}
        </td>
        <td className="border p-1"></td>
    </tr>
);

export default function PwdTable() {
    const { craData, setCraData } = useContext(StepperContext);
    const inputRefs = useRef([]);

    const [rows, setRows] = useState(
        craData.pwd?.length ? craData.pwd : defaultDisabilities.map((type) => createRow(type))
    );

    // Sync with StepperContext
    useEffect(() => {
        setCraData(prev => ({ ...prev, pwd: rows }));
    }, [rows, setCraData]);

    const updateField = (rowIdx, field, value) => {
        const newRows = rows.map((row, idx) => {
            if (idx === rowIdx) {
                return {
                    ...row,
                    [field]: categories.includes(field) ? value.replace(/\D/g, "") : value,
                    // Only numeric for category fields
                    // Letters allowed for "type"
                };
            }
            return row;
        });
        setRows(newRows);
    };

    const addDisabilityRow = () => {
        setRows(prev => {
            const newRows = [...prev, createRow()];
            setTimeout(() => inputRefs.current[newRows.length - 1]?.focus(), 0); // autofocus new input
            return newRows;
        });
        toast.success("New disability row added!");
    };

    const removeDisabilityRow = (rowIdx) => {
        setRows(rows.filter((_, idx) => idx !== rowIdx));
        toast.error("Disability row removed!");
    };

    return (
        <div className="border rounded-lg shadow-sm p-2 overflow-auto">
            <h3 className="text-base font-semibold mb-2 text-gray-800">
                Persons with Disability (PWD) by Age Group
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full border table-auto text-sm">
                    <TableHeader />
                    <tbody>
                        {rows.map((row, idx) => (
                            <DisabilityRow
                                key={idx}
                                row={row}
                                rowIdx={idx}
                                updateField={updateField}
                                removeRow={removeDisabilityRow}
                                inputRefs={inputRefs}
                            />
                        ))}
                        <TotalsRow rows={rows} />
                    </tbody>
                </table>
            </div>

            <button
                className="mt-2 flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600 transition"
                onClick={addDisabilityRow}
            >
                <Plus className="w-4 h-4" />
                <span className="text-xs">
                    Add Disability
                </span>
            </button>
        </div>
    );
}
