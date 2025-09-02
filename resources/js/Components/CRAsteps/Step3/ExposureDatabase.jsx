import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import Accordion from "@/Components/Accordion";
import toast from "react-hot-toast";

function ExposureTable({ exposure, updateField, addRow, removeRow }) {
    // Re-ordered and refined categories to match the image structure
    const categories = [
        "families",

        "individualsM",
        "individualsF",
        "lgbtq",

        "age0_6M", "age0_6F",
        "age7m_2yM", "age7m_2yF",
        "age3_5M", "age3_5F",
        "age6_12M", "age6_12F",
        "age13_17M", "age13_17F",

        "age18_59M", "age18_59F",
        "age60upM", "age60upF",

        "pwdM", "pwdF",

        "diseasesM", "diseasesF",

        "pregnantWomen",
    ];

    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm mb-4">
            <table className="w-full border text-xs">
                <thead className="bg-gray-100">
                    <tr>
                        {/* These span two rows */}
                        <th className="border px-2 py-1 rotate-90 !h-auto whitespace-nowrap" rowSpan="3">Purok</th>
                        <th className="border px-2 py-1 rotate-90 !h-auto whitespace-nowrap" rowSpan="3">No. of Families</th>

                        {/* These span two rows over their M/F/LGBTQ sub-headers */}
                        <th colSpan="3" className="border px-2 py-1 text-center">No. of Individuals</th>
                        <th colSpan="10" className="border px-2 py-1 text-center">Children</th>
                        <th colSpan="4" className="border px-2 py-1 text-center">Adult</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">Persons w/ Disabilities</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">Persons w/ Diseases</th>

                        {/* This spans two rows */}
                        <th className="border px-2 py-1 rotate-90 !h-auto whitespace-nowrap" rowSpan="3">Pregnant Women</th>
                    </tr>
                    <tr>
                        {/* No. of Individuals sub-headers */}
                        <th rowSpan="2" className="border px-2 py-1 text-center">M</th>
                        <th rowSpan="2" className="border px-2 py-1 text-center">F</th>
                        <th rowSpan="2" className="border px-2 py-1 text-center">LGBTQ</th>

                        {/* Children sub-headers (M/F for each age group) */}
                        <th className="border px-2 py-1 text-center">0-6M</th>
                        <th className="border px-2 py-1 text-center">0-6M</th>
                        <th className="border px-2 py-1 text-center">7M-2Y</th>
                        <th className="border px-2 py-1 text-center">7M-2Y</th>
                        <th className="border px-2 py-1 text-center">3-5Y</th>
                        <th className="border px-2 py-1 text-center">3-5Y</th>
                        <th className="border px-2 py-1 text-center">6-12Y</th>
                        <th className="border px-2 py-1 text-center">6-12Y</th>
                        <th className="border px-2 py-1 text-center">13-17Y</th>
                        <th className="border px-2 py-1 text-center">13-17Y</th>

                        {/* Adult sub-headers (M/F for each age group) */}
                        <th className="border px-2 py-1 text-center">18-59Y</th>
                        <th className="border px-2 py-1 text-center">18-59Y</th>
                        <th className="border px-2 py-1 text-center">60Y & UP</th>
                        <th className="border px-2 py-1 text-center">60Y & UP</th>

                        {/* PWD sub-headers */}
                        <th rowSpan="2" className="border px-2 py-1 text-center">M</th>
                        <th rowSpan="2" className="border px-2 py-1 text-center">F</th>

                        {/* Diseases sub-headers */}
                        <th rowSpan="2" className="border px-2 py-1 text-center">M</th>
                        <th rowSpan="2" className="border px-2 py-1 text-center">F</th>
                    </tr>
                    <tr>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                        <th className="border px-2 py-1 text-center">M</th>
                        <th className="border px-2 py-1 text-center">F</th>
                    </tr>
                </thead>
                <tbody>
                    {exposure.map((row, idx) => (
                        <tr key={idx}>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1 "
                                    value={row.purok}
                                    onChange={(e) => updateField(idx, "purok", e.target.value)}
                                    placeholder="1"
                                />
                            </td>
                            {categories.map((field) => (
                                <td key={field} className="border px-2 py-1">
                                    <input
                                        type="number"
                                        className="w-full border p-1"
                                        value={row[field] ?? ""}
                                        onChange={(e) => updateField(idx, field, e.target.value)}
                                        min="0"
                                    />
                                </td>
                            ))}
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

                    <tr>
                        <td className="border px-2 py-1 font-bold">TOTAL</td>
                        {categories.map((field) => (
                            <td
                                key={`total-${field}`}
                                className="border px-2 py-1 font-bold text-center"
                            >
                                {exposure.reduce((sum, row) => sum + (Number(row[field]) || 0), 0)}
                            </td>
                        ))}
                        <td className="px-2 py-1 !border-0" />
                    </tr>
                </tbody>

            </table>

            <button
                className="mt-3 text-blue-600 hover:underline"
                onClick={addRow}
            >
                + Add Purok
            </button>
        </div>
    );
}

const ExposureDatabase = () => {
    const { craData, setCraData } = useContext(StepperContext);

    const createEmptyRow = (purokNum = "") => {
        const baseRow = { purok: purokNum };
        const allCategories = [
            "families",
            "individualsM", "individualsF", "lgbtq",
            "age0_6M", "age0_6F", "age7m_2yM", "age7m_2yF", "age3_5M", "age3_5F",
            "age6_12M", "age6_12F", "age13_17M", "age13_17F",
            "age18_59M", "age18_59F", "age60upM", "age60upF",
            "pwdM", "pwdF",
            "diseasesM", "diseasesF",
            "pregnantWomen",
        ];
        allCategories.forEach(cat => {
            baseRow[cat] = "";
        });
        return baseRow;
    };

    // Initialize default row
    useEffect(() => {
        if (!craData.exposure || craData.exposure.length === 0) {
            setCraData((prev) => ({
                ...prev,
                exposure: [createEmptyRow("1")],
            }));
        }
    }, [craData, setCraData]);

    // Update field handler
    const updateField = (idx, field, val) => {
        const updated = [...craData.exposure];
        updated[idx][field] = val === "" ? "" : Number(val);
        setCraData((prev) => ({ ...prev, exposure: updated }));
    };

    // Add new row
    const addRow = () => {
        const updated = [...(craData.exposure || [])];
        const newPurokNum = updated.length > 0 ? (Number(updated[updated.length - 1].purok) + 1).toString() : "1";
        updated.push(createEmptyRow(newPurokNum));
        setCraData((prev) => ({ ...prev, exposure: updated }));
        toast.success("New Purok row added!");
    };

    // Remove row
    const removeRow = (idx) => {
        const updated = [...craData.exposure];
        const removed = updated[idx]?.purok ? `Purok ${updated[idx].purok}` : "Row";
        updated.splice(idx, 1);
        setCraData((prev) => ({ ...prev, exposure: updated }));
        toast.error(`${removed} removed!`);
    };

    return (
        <div className="space-y-4">
            <ExposureTable
                exposure={craData.exposure || []}
                updateField={updateField}
                addRow={addRow}
                removeRow={removeRow}
            />
        </div>
    );
};

export default ExposureDatabase;
