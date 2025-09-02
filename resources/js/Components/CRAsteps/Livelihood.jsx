import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import Accordion from "../Accordion";

// optimize na toh teh

// ------------------------------------------------------
// Constants
const defaultLivelihoods = [
    "Farming", "Fishing", "Poultry and Livestock", "Carpentry",
    "Professional", "Government Employee", "Private Employee",
    "Brgy. Official or Staff", "Businessman/woman",
    "Formal/Licensed Driver", "Non-Licensed Driver", "Porter",
    "Masseuse", "House Helper", "Electrician", "Laborer",
    "Miner", "Lender", "Call Center Agent", "Medical Transcriptionist",
    "Virtual Assistant",
];

const defaultInfra = [
    {
        category: "Electricity Source",
        rows: [
            { type: "Distribution Company (ISELCO-II)", households: "" },
            { type: "Generator", households: "" },
            { type: "Solar (renewable energy source)", households: "" },
            { type: "Battery", households: "" },
            { type: "None", households: "" },
        ],
    },
    {
        category: "Bath and Wash Area",
        rows: [
            { type: "With own Sink and Bath", households: "" },
            { type: "Shared or Communal", households: "" },
            { type: "Separate Bathroom", households: "" },
        ],
    },
    {
        category: "Water Source",
        rows: [
            { type: "Level II Water System", households: "" },
            { type: "Level III Water System", households: "" },
            { type: "Deep Well (Level I)", households: "" },
            { type: "Artesian Well (Level I)", households: "" },
            { type: "Shallow Well (Level I)", households: "" },
            { type: "Commercial Water Refill Source", households: "" },
        ],
    },
    {
        category: "Waste Management",
        rows: [
            { type: "Open Dump Site", households: "" },
            { type: "Sanitary Landfill", households: "" },
            { type: "Compost Pits", households: "" },
            { type: "Material Recovery Facility (MRF)", households: "" },
            { type: "Garbage is collected", households: "" },
        ],
    },
    {
        category: "Toilet",
        rows: [
            { type: "Water Sealed", households: "" },
            { type: "Compost Pit Toilet", households: "" },
            { type: "Shared or Communal Toilet/Public Toilet", households: "" },
            { type: "No Latrine", households: "" },
            { type: "Flash Toilet", households: "" },
        ],
    },
];

// ------------------------------------------------------
// Utility helpers
const sumRow = (row) =>
    ["male_no_dis", "male_dis", "female_no_dis", "female_dis", "lgbtq_no_dis", "lgbtq_dis"]
        .reduce((s, f) => s + (Number(row[f]) || 0), 0);

const sumColumn = (data, field) =>
    data?.reduce((s, r) => s + (Number(r[field]) || 0), 0) || "";

const sumGrand = (data) =>
    data?.reduce((s, r) => s + sumRow(r), 0) || "";

// ------------------------------------------------------
// Livelihood Table Component
function LivelihoodTable({ data, updateRow, updateType, removeRow, addRow }) {
    const fields = ["male_no_dis", "male_dis", "female_no_dis", "female_dis", "lgbtq_no_dis", "lgbtq_dis"];

    return (
        <section>
            <h2 className="text-lg font-semibold mb-3">Primary Livelihood of Residents</h2>
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th rowSpan="3" className="border px-2 py-1 w-[250px]">Type of Livelihood</th>
                        <th colSpan="6" className="border px-2 py-1 text-center">NUMBER</th>
                        <th rowSpan="3" className="border px-2 py-1">Total</th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="border px-2 py-1 text-center">Male</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">Female</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">LGBTQ+</th>
                    </tr>
                    <tr>
                        {["Without Disability", "With Disability", "Without Disability", "With Disability", "Without Disability", "With Disability"]
                            .map((label, i) => <th key={i} className="border px-2 py-1">{label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={row.type}
                                    placeholder="Enter livelihood type"
                                    onChange={(e) => updateType(idx, e.target.value)}
                                />
                            </td>
                            {fields.map((field) => (
                                <td key={field} className="border px-2 py-1">
                                    <input
                                        type="number"
                                        className="w-full border p-1 text-center"
                                        value={row[field] ?? ""}
                                        onChange={(e) => updateRow(idx, field, e.target.value)}
                                    />
                                </td>
                            ))}
                            <td className="border px-2 py-1 font-semibold text-center bg-gray-50">{sumRow(row) || ""}</td>
                            <td className="px-2 py-1 text-center !border-0">
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                    onClick={() => removeRow(idx)}
                                >
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                        <td className="border px-2 py-1 text-center">Total</td>
                        {fields.map((f) => (
                            <td key={f} className="border px-2 py-1 text-center">{sumColumn(data, f)}</td>
                        ))}
                        <td className="border px-2 py-1 text-center">{sumGrand(data)}</td>
                    </tr>
                </tfoot>
            </table>
            <button className="mt-3 text-blue-600 hover:underline" onClick={addRow}>+ Add new row</button>
        </section>
    );
}

// ------------------------------------------------------
// Infrastructure Table Component
function InfraTable({ category, catIdx, updateRow, removeRow, addRow }) {
    return (
        <div className="flex flex-col border rounded">
            <h3 className="font-semibold text-md mb-2 p-2">{category.category}</h3>
            <div className="flex-1 overflow-auto">
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[300px]">Type</th>
                            <th className="border px-2 py-1 text-center">Households</th>
                            <th className="px-2 py-1 text-center !border-0"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.rows.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                <td className="border px-2 py-1">
                                    <input
                                        type="text"
                                        className="w-full border p-1"
                                        value={row.type}
                                        placeholder="Enter type"
                                        onChange={(e) => updateRow(catIdx, rowIdx, "type", e.target.value)}
                                    />
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="number"
                                        className="w-full border p-1 text-center"
                                        value={row.households ?? ""}
                                        onChange={(e) => updateRow(catIdx, rowIdx, "households", e.target.value)}
                                    />
                                </td>
                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                        onClick={() => removeRow(catIdx, rowIdx)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-2 mt-auto">
                <button className="text-blue-600 hover:underline" onClick={() => addRow(catIdx)}>+ Add new row</button>
            </div>
        </div>
    );
}

// ------------------------------------------------------
// Main Component
export default function Livelihood() {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize data if empty
    useEffect(() => {
        if (!craData.livelihood?.length) {
            setCraData((prev) => ({
                ...prev,
                livelihood: defaultLivelihoods.map((type) => ({
                    type,
                    male_no_dis: "", male_dis: "", female_no_dis: "", female_dis: "", lgbtq_no_dis: "", lgbtq_dis: "",
                })),
            }));
        }
        if (!craData.infrastructure?.length) {
            setCraData((prev) => ({ ...prev, infrastructure: defaultInfra }));
        }
    }, [craData, setCraData]);

    // Livelihood row updates
    const updateRow = (i, field, val) => {
        const updated = [...craData.livelihood];
        updated[i][field] = val === "" ? "" : Number(val);
        setCraData((prev) => ({ ...prev, livelihood: updated }));
    };
    const updateType = (i, val) => {
        const updated = [...craData.livelihood];
        updated[i].type = val;
        setCraData((prev) => ({ ...prev, livelihood: updated }));
    };
    const addRow = () => {
        setCraData((prev) => ({
            ...prev,
            livelihood: [...prev.livelihood, { type: "", male_no_dis: "", male_dis: "", female_no_dis: "", female_dis: "", lgbtq_no_dis: "", lgbtq_dis: "" }],
        }));
        toast.success("Row added!");
    };
    const removeRow = (i) => {
        const removed = craData.livelihood[i]?.type || "Row";
        setCraData((prev) => ({ ...prev, livelihood: prev.livelihood.filter((_, idx) => idx !== i) }));
        toast.error(`${removed} removed!`);
    };

    // Infra row updates
    const updateInfraRow = (catIdx, rowIdx, field, value) => {
        const updated = [...craData.infrastructure];
        updated[catIdx].rows[rowIdx][field] = field === "households" ? (value === "" ? "" : Number(value)) : value;
        setCraData((prev) => ({ ...prev, infrastructure: updated }));
    };
    const addInfraRow = (catIdx) => {
        const updated = [...craData.infrastructure];
        updated[catIdx].rows.push({ type: "", households: "" });
        setCraData((prev) => ({ ...prev, infrastructure: updated }));
        toast.success(`New row added to "${updated[catIdx].category}"`);
    };
    const removeInfraRow = (catIdx, rowIdx) => {
        const updated = [...craData.infrastructure];
        const removed = updated[catIdx].rows[rowIdx]?.type || "row";
        updated[catIdx].rows = updated[catIdx].rows.filter((_, i) => i !== rowIdx);
        setCraData((prev) => ({ ...prev, infrastructure: updated }));
        toast.error(`Removed "${removed}" from "${updated[catIdx].category}"`);
    };

    return (
        <div className="space-y-4">
            <Accordion title="B. Information on Livelihood">
                <LivelihoodTable
                    data={craData.livelihood || []}
                    updateRow={updateRow}
                    updateType={updateType}
                    removeRow={removeRow}
                    addRow={addRow}
                />
            </Accordion>

            <Accordion title="C. Infrastructures and Institutions that provide services to the Barangay">
                <div className="grid gap-4">
                    {/* First row → 3 cols */}
                    <div className="grid grid-cols-3 gap-4">
                        {craData.infrastructure?.slice(0, 3).map((cat, idx) => (
                            <InfraTable
                                key={idx}
                                category={cat}
                                catIdx={idx}
                                updateRow={updateInfraRow}
                                removeRow={removeInfraRow}
                                addRow={addInfraRow}
                            />
                        ))}
                    </div>
                    {/* Second row → 2 cols */}
                    <div className="grid grid-cols-2 gap-4">
                        {craData.infrastructure?.slice(3).map((cat, idx) => (
                            <InfraTable
                                key={idx + 3}
                                category={cat}
                                catIdx={idx + 3}
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
