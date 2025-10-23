import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import Accordion from "../Accordion";
import { quantile } from "d3";

// ------------------------------------------------------
// Default Building Data
const defaultBuildings = [
    {
        category: "Health and Medical Facilities",
        rows: [
            { type: "Evacuation Center", households: "" },
            { type: "Flood Control", households: "" },
            { type: "Rain Water Harvester (Communal)", households: "" },
            { type: "Barangay Disaster Operation Center", households: "" },
            { type: "Public Comfort Room/Toilet", households: "" },
            { type: "Community Garden", households: "" },
            { type: "Barangay Health Center", households: "" },
            { type: "Hospital", households: "" },
            { type: "Maternity Clinic", households: "" },
            { type: "Barangay Drug Store", households: "" },
            { type: "City/Municipal Public Drug Store", households: "" },
            { type: "Private Drug Store", households: "" },
            { type: "Quarantine/Isolation Facility", households: "" },
        ],
    },
    {
        category: "Education Facilities",
        rows: [
            { type: "Child Development Center", households: "" },
            { type: "Preschool", households: "" },
            { type: "Elementary", households: "" },
            { type: "Secondary", households: "" },
            { type: "Vocational", households: "" },
            { type: "College/University", households: "" },
            { type: "Islamic School", households: "" },
        ],
    },
    {
        category: "Agricultural Facilities",
        rows: [
            { type: "Rice Mill", households: "" },
            { type: "Corn Mill", households: "" },
            { type: "Feed Mill", households: "" },
            { type: "Agriculture Produce Market", households: "" },
        ],
    },
];

const defaultFacilities = [
    {
        category: "Facilities and Services",
        rows: [
            { type: "Multi-Purposes Hall", quantity: "" },
            { type: "Barangay Women and Chidren Protection Desk", quantity: "" },
            { type: "Barangay Tanonds and Barangay Peacekeeping Action Teams Post", quantity: "" },
            { type: "Bureau of Jail Management and Penology", quantity: "" },
            { type: "Philippine National Police Outpost", quantity: "" },
            { type: "Bank", quantity: "" },
            { type: "Post Office", quantity: "" },
            { type: "Market", quantity: "" },
        ],
    },
    {
        category: "Public Transportation",
        rows: [
            { type: "Bus", quantity: "" },
            { type: "Taxi", quantity: "" },
            { type: "Van/FX", quantity: "" },
            { type: "Jeepney", quantity: "" },
            { type: "Tricyle", quantity: "" },
            { type: "Pedicab", quantity: "" },
            { type: "Boat", quantity: "" },
        ],
    },
    {
        category: "Road Types",
        rows: [
            { type: "Concrete", length: "", maintained_by: "" },
            { type: "Asphalt", length: "", maintained_by: "" },
            { type: "Gravel", length: "", maintained_by: "" },
            { type: "Natural Earth Surface", length: "", maintained_by: "" },

        ],
    },

];

// ------------------------------------------------------
// Building Table Component
function BuildingTable({ category, catIdx, updateRow, removeRow, addRow }) {
    return (
        <div className="flex flex-col border rounded">
            <h3 className="font-semibold text-md mb-2 p-2">{category.category}</h3>
            <div className="flex-1 overflow-auto">
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[400px]">Type</th>
                            <th className="border px-2 py-1 text-center">Households</th>
                            <th className="px-2 py-1 text-center !border-0 w-[40px]"></th>
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
                <button
                    onClick={() => addRow(catIdx)}
                    className="text-xs px-2 py-1 border border-blue-500 text-blue-600 rounded-md font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                >
                    + Add new row
                </button>
            </div>


        </div>
    );
}

// ------------------------------------------------------
// Facilities & Services Table Component
function FacilitiesServicesTable({ category, catIdx, updateRow, removeRow, addRow }) {
    const extraFields = Object.keys(category.rows[0] || {}).filter(k => k !== "type");
    console.log(extraFields);
    const fieldLabels = {
        quantity: "Quantity",
        length: "Length of Road (km)",
        maintained_by: "Who Maintains the Road Network",
    };


    return (
        <div className="flex flex-col border rounded">
            <div className="flex-1 overflow-auto">
                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-2 py-1 w-[400px]">{category.category}</th>
                            {extraFields.map(field => (
                                <th key={field} className="border px-2 py-1 text-center">
                                    {fieldLabels[field] || field.replace("_", " ")}
                                </th>
                            ))}
                            <th className="px-2 py-1 text-center !border-0 w-[40px]"></th>
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
                                {extraFields.map(field => (
                                    <td key={field} className="border px-2 py-1 text-center">
                                        <input
                                            type={field === "quantity" ? "number" : "text"}
                                            className="w-full border p-1 text-center"
                                            value={row[field] ?? ""}
                                            onChange={(e) => updateRow(catIdx, rowIdx, field, e.target.value)}
                                        />
                                    </td>
                                ))}
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
                <button
                    onClick={() => addRow(catIdx)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                >
                    <span className="text-sm font-bold">+</span> Add new row
                </button>
            </div>

        </div>
    );
}



// ------------------------------------------------------
// Main Component
export default function Buildings() {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize with defaultBuildings
    useEffect(() => {
        if (!craData.buildings?.length) {
            setCraData((prev) => ({ ...prev, buildings: defaultBuildings }));
        }
    }, [craData, setCraData]);

    // Initialize with defaultFacilities
    useEffect(() => {
        if (!craData.facilities?.length) {
            setCraData((prev) => ({ ...prev, facilities: defaultFacilities }));
        }
    }, [craData, setCraData]);

    // ---------------- Building row helpers ----------------
    const updateBuildingRow = (catIdx, rowIdx, field, value) => {
        const updated = [...craData.buildings];
        updated[catIdx].rows[rowIdx][field] =
            field === "households" ? (value === "" ? "" : Number(value)) : value;
        setCraData((prev) => ({ ...prev, buildings: updated }));
    };

    const addBuildingRow = (catIdx) => {
        const updated = [...craData.buildings];
        updated[catIdx].rows.push({ type: "", households: "" });
        setCraData((prev) => ({ ...prev, buildings: updated }));
        toast.success(`New row added to "${updated[catIdx].category}"`);
    };

    const removeBuildingRow = (catIdx, rowIdx) => {
        const updated = [...craData.buildings];
        const removed = updated[catIdx].rows[rowIdx]?.type || "row";
        updated[catIdx].rows = updated[catIdx].rows.filter((_, i) => i !== rowIdx);
        setCraData((prev) => ({ ...prev, buildings: updated }));
        toast.error(`Removed "${removed}" from "${updated[catIdx].category}"`);
    };

    // ---------------- Facilities row helpers ----------------
    const updateFacilityRow = (catIdx, rowIdx, field, value) => {
        const updated = [...craData.facilities];
        updated[catIdx].rows[rowIdx][field] =
            field === "quantity" ? (value === "" ? "" : Number(value)) : value;
        setCraData((prev) => ({ ...prev, facilities: updated }));
    };

    const addFacilityRow = (catIdx) => {
        setCraData((prev) => {
            const updated = [...prev.facilities];
            const category = updated[catIdx]?.category;
            const firstRow = updated[catIdx]?.rows?.[0];

            let rowTemplate = {};


            if (firstRow && Object.keys(firstRow).length > 0) {
                rowTemplate = Object.keys(firstRow).reduce((acc, key) => {
                    acc[key] = "";
                    return acc;
                }, {});
            }

            else {
                if (category === "Facilities and Services" || category === "Public Transportation") {
                    rowTemplate = { type: "", quantity: "" };
                } else if (category === "Road Types") {
                    rowTemplate = { type: "", length: "", maintained_by: "" };
                } else {
                    // Generic fallback for any other category
                    rowTemplate = { type: "", quantity: "" };
                }
            }
            if (!Array.isArray(updated[catIdx].rows)) {
                updated[catIdx].rows = [];
            }

            updated[catIdx].rows.push(rowTemplate);

            return { ...prev, facilities: updated };
        });
    };



    const removeFacilityRow = (catIdx, rowIdx) => {
        const updated = [...craData.facilities];
        const removed = updated[catIdx].rows[rowIdx]?.type || "row";
        updated[catIdx].rows = updated[catIdx].rows.filter((_, i) => i !== rowIdx);
        setCraData((prev) => ({ ...prev, facilities: updated }));
        toast.error(`Removed "${removed}" from "${updated[catIdx].category}"`);
    };

    return (
        <div className="space-y-4">
            <Accordion title="D. Buildings and other Facilities in the Barangay">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {craData.buildings?.map((cat, idx) => (
                        <BuildingTable
                            key={idx}
                            category={cat}
                            catIdx={idx}
                            updateRow={updateBuildingRow}
                            removeRow={removeBuildingRow}
                            addRow={addBuildingRow}
                        />
                    ))}
                </div>
            </Accordion>

            <Accordion title="E. Primary Facilities and Services in the Barangay">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {craData.facilities?.slice(0, 2).map((cat, idx) => (
                        <FacilitiesServicesTable
                            key={idx}
                            category={cat}
                            catIdx={idx}
                            updateRow={updateFacilityRow}
                            removeRow={removeFacilityRow}
                            addRow={addFacilityRow}
                        />
                    ))}


                    <div className="md:col-span-2">
                        <FacilitiesServicesTable
                            category={craData.facilities?.[2]}
                            catIdx={2}
                            updateRow={updateFacilityRow}
                            removeRow={removeFacilityRow}
                            addRow={addFacilityRow}
                        />
                    </div>
                </div>
            </Accordion>
        </div>
    );
}

