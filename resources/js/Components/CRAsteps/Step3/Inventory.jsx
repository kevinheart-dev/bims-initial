import React, { useContext, useEffect, useCallback } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import { toTitleCase } from '@/utils/stringFormat';

const ITEM_TEMPLATE = {
    item: "",
    total: "",
    percent: "",
    location: "",
};

const DEFAULT_HAZARDS = [
    {
        hazard: "Typhoon",
        categories: [
            {
                type: "Infrastructures",
                rows: [
                    { ...ITEM_TEMPLATE, item: "Bridge/s" },
                    { ...ITEM_TEMPLATE, item: "Barangay Hall" },
                    { ...ITEM_TEMPLATE, item: "Multi-purpose Building" },
                    { ...ITEM_TEMPLATE, item: "Houses" },
                    { ...ITEM_TEMPLATE, item: "School/s" },
                    { ...ITEM_TEMPLATE, item: "Child Development Center" },
                ],
            },
            {
                type: "Establishments",
                rows: [
                    { ...ITEM_TEMPLATE, item: "Store" },
                    { ...ITEM_TEMPLATE, item: "Eatery" },
                    { ...ITEM_TEMPLATE, item: "Bakery" },
                ],
            },
            {
                type: "Facilities",
                rows: [
                    { ...ITEM_TEMPLATE, item: "Water" },
                    { ...ITEM_TEMPLATE, item: "Electricity" },
                    { ...ITEM_TEMPLATE, item: "Telephone/Mobile service" },
                    { ...ITEM_TEMPLATE, item: "Hospitals" },
                    { ...ITEM_TEMPLATE, item: "Barangay Health Center" },
                ],
            },
            {
                type: "Livelihood",
                rows: [
                    { ...ITEM_TEMPLATE, item: "Rice/Corn Field" },
                    { ...ITEM_TEMPLATE, item: "Vegetables" },
                    { ...ITEM_TEMPLATE, item: "Boats" },
                    { ...ITEM_TEMPLATE, item: "Fish Nets" },
                    { ...ITEM_TEMPLATE, item: "Fish Ponds" },
                ],
            },
            {
                type: "Nature",
                rows: [
                    { ...ITEM_TEMPLATE, item: "Mountain/s" },
                    { ...ITEM_TEMPLATE, item: "Mangroves" },
                ],
            },
        ],
    },
];

const Inventory = () => {
    const { craData, setCraData } = useContext(StepperContext);

    useEffect(() => {
        if (!craData.disaster_inventory?.length) {
            setCraData((prev) => ({
                ...prev,
                disaster_inventory: DEFAULT_HAZARDS,
            }));
        }
    }, [craData, setCraData]);

    // Helpers
    const updateHazard = useCallback(
        (hIdx, updater) => {
            setCraData((prev) => {
                const updated = [...prev.disaster_inventory];
                updated[hIdx] = { ...updated[hIdx], ...updater(updated[hIdx]) };
                return { ...prev, disaster_inventory: updated };
            });
        },
        [setCraData]
    );

    const updateCategory = (hIdx, cIdx, updater) =>
        updateHazard(hIdx, (hazard) => {
            const categories = [...hazard.categories];
            categories[cIdx] = { ...categories[cIdx], ...updater(categories[cIdx]) };
            return { categories };
        });

    const updateCell = (hIdx, cIdx, rIdx, field, value) =>
        updateCategory(hIdx, cIdx, (category) => {
            const rows = [...category.rows];
            rows[rIdx] = { ...rows[rIdx], [field]: value };
            return { rows };
        });

    // Actions
    const addHazard = () => {
        setCraData((prev) => ({
            ...prev,
            disaster_inventory: [
                ...prev.disaster_inventory,
                {
                    hazard: "",
                    categories: DEFAULT_HAZARDS[0].categories.map((cat) => ({
                        ...cat,
                        rows: cat.rows.map((row) => ({ ...row })), // clone rows
                    })),
                },
            ],
        }));
        toast.success("New hazard added!");
    };


    const removeHazard = (hIdx) => {
        setCraData((prev) => ({
            ...prev,
            disaster_inventory: prev.disaster_inventory.filter((_, i) => i !== hIdx),
        }));
        toast.error("Hazard removed!");
    };

    const addCategory = (hIdx) => {
        updateHazard(hIdx, (hazard) => ({
            categories: [
                ...hazard.categories,
                { type: "", rows: [{ ...ITEM_TEMPLATE }] },
            ],
        }));
        toast.success("New category added!");
    };

    const removeCategory = (hIdx, cIdx) => {
        updateHazard(hIdx, (hazard) => ({
            categories: hazard.categories.filter((_, i) => i !== cIdx),
        }));
        toast.error("Category removed!");
    };

    const addRow = (hIdx, cIdx) =>
        updateCategory(hIdx, cIdx, (category) => ({
            rows: [...category.rows, { ...ITEM_TEMPLATE }],
        }));

    const removeRow = (hIdx, cIdx, rIdx) =>
        updateCategory(hIdx, cIdx, (category) => ({
            rows: category.rows.filter((_, i) => i !== rIdx),
        }));

    return (
        <div>
            <p className="text-md font-bold mb-4 mt-4">
                4.2 Inventory of Assets at Risk during Hazards and Disasters
            </p>

            {craData.disaster_inventory?.map((hazard, hIdx) => (
                <div
                    key={hIdx}
                    className="mb-10 border-2 border-purple-300 rounded-xl p-5 bg-purple-50 shadow-sm"
                >
                    {/* Hazard Header */}
                    <div className="flex justify-between items-center mb-4">
                        <input
                            list={`hazardList-${hIdx}`}
                            type="text"
                            value={hazard.hazard || ""}
                            onChange={(e) =>
                                updateHazard(hIdx, () => ({ hazard: toTitleCase(e.target.value) }))
                            }
                            className="text-lg font-semibold text-purple-700 bg-transparent border-b border-purple-300 focus:outline-none px-1"
                            placeholder="Enter Hazard"
                        />
                        <datalist id={`hazardList-${hIdx}`}>
                            {[
                                "Typhoon",
                                "Flood",
                                "Rain-induced Landslide",
                                "Fire",
                                "Drought",
                                "Earthquake",
                                "Vehicular Incident",
                                "Pandemic / Emerging and Re-emerging Diseases"
                            ].map((hazard, i) => (
                                <option key={i} value={hazard} />
                            ))}
                        </datalist>

                        <div>
                            <button
                                onClick={() => removeHazard(hIdx)}
                                className="ml-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Categories under hazard */}
                    {hazard.categories?.map((category, cIdx) => (
                        <div
                            key={cIdx}
                            className="mb-6 border rounded-lg p-4 bg-white shadow-sm"
                        >
                            {/* Category Header */}
                            <div className="flex justify-between items-center mb-3">
                                <input
                                    type="text"
                                    value={category.type}
                                    onChange={(e) =>
                                        updateCategory(hIdx, cIdx, () => ({ type: toTitleCase(e.target.value) }))
                                    }
                                    className="font-medium text-gray-700 bg-transparent border-b border-gray-300 focus:outline-none px-1"
                                    placeholder="Enter Category"
                                />
                                <button
                                    onClick={() => removeCategory(hIdx, cIdx)}
                                    className="ml-2 px-2 py-1 bg-red-400 text-white text-xs rounded-full"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="border border-collapse w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border px-2 py-1">Item</th>
                                            <th className="border px-2 py-1">Total</th>
                                            <th className="border px-2 py-1">
                                                Percentage or no. at Risk <br /> (or will be affected)
                                            </th>

                                            <th className="border px-2 py-1">Location</th>
                                            <th className="border px-2 py-1" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {category.rows.map((row, rIdx) => (
                                            <tr key={rIdx}>
                                                <td className="border px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={row.item}
                                                        onChange={(e) =>
                                                            updateCell(hIdx, cIdx, rIdx, "item", toTitleCase(e.target.value))
                                                        }
                                                        className="border w-full px-2 py-1 text-xs text-center rounded"
                                                        placeholder="Enter Item"
                                                    />
                                                </td>
                                                {["total", "percent", "location"].map((field, i) => (
                                                    <td key={i} className="border px-2 py-1">
                                                        <input
                                                            type="text"
                                                            value={row[field]}
                                                            onChange={(e) => {
                                                                let val = e.target.value;
                                                                if (field === "percent") {
                                                                    // Prevent multiple % symbols
                                                                    val = val.replace(/%/g, "");
                                                                    if (val !== "") {
                                                                        val = val + "%";
                                                                    }
                                                                }

                                                                updateCell(hIdx, cIdx, rIdx, field, val);
                                                            }}
                                                            className="border w-full px-2 py-1 text-xs text-center rounded"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="border px-2 py-1 text-center">
                                                    <button
                                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-300 hover:text-white"
                                                        onClick={() => removeRow(hIdx, cIdx, rIdx)}
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Add row button */}
                            <button
                                onClick={() => addRow(hIdx, cIdx)}
                                className="inline-flex items-center gap-1 mt-3 px-4 py-1.4 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                            >
                                <span className="text-sm font-bold">+</span> Add Item
                            </button>

                        </div>
                    ))}

                    {/* Add category button */}
                    <button
                        onClick={() => addCategory(hIdx)}
                        className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-sm"
                    >
                        <span className="text-sm font-bold">+</span> Add Category
                    </button>

                </div>
            ))}

            {/* Add hazard button */}
            <button
                onClick={addHazard}
                className="inline-flex items-center gap-1 mt-0 mb-3 px-5 py-1.5 text-xs font-medium border border-purple-500 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Hazard
            </button>

        </div>
    );
};

export default Inventory;
