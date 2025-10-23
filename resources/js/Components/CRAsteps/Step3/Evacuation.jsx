import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import { Plus, Check, Square } from "lucide-react";

const Evacuation = () => {
    const { craData, setCraData } = useContext(StepperContext);

    const EMPTY_ROW = {
        name: "",
        families: "",
        individuals: "",
        ownerGovt: false,
        ownerPrivate: false,
        inspectedYes: false,
        inspectedNo: false,
        mouYes: false,
        mouNo: false,
    };

    // fallback if evacuation_list doesn't exist yet
    const rows = craData.evacuation_list || [EMPTY_ROW];

    const updateRows = (updatedRows) => {
        setCraData({ ...craData, evacuation_list: updatedRows });
    };

    const toggleExclusive = (index, field, group) => {
        const updated = [...rows];
        // uncheck all in the group
        group.forEach((f) => (updated[index][f] = false));
        // check only the clicked one
        updated[index][field] = true;
        updateRows(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        updateRows(updated);
    };

    const addRow = () => {
        updateRows([...rows, { ...EMPTY_ROW }]);
    };

    const removeRow = (index) => {
        const updated = [...rows];
        updated.splice(index, 1);
        updateRows(updated);
    };

    const renderCheck = (value, onClick) => (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center hover:bg-gray-100 p-1 rounded text-center"
        >
            {value ? <Check className="w-4 h-4 text-green-600" /> : <Square className="w-4 h-4 text-gray-400" />}
        </button>
    );

    return (
        <div className="overflow-x-auto">
            <p className="text-md font-bold mb-4 mt-4">
                4.3 Inventory of Evacuation Centers / Isolation Facilities
            </p>
            <table className="w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">
                            Name of Evacuation Center / Isolation Facility
                        </th>
                        <th className="border px-2 py-1" colSpan={2}>Capacity</th>
                        <th className="border px-2 py-1" colSpan={2}>Owner</th>
                        <th className="border px-2 py-1" colSpan={2}>Inspected by an Engineer</th>
                        <th className="border px-2 py-1" colSpan={2}>Presence of Memorandum of Understanding</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                    <tr>
                        <th className="border px-2 py-1"></th>
                        <th className="border px-2 py-1">Families</th>
                        <th className="border px-2 py-1">Individuals</th>
                        <th className="border px-2 py-1">Gov’t</th>
                        <th className="border px-2 py-1">Private</th>
                        <th className="border px-2 py-1">Yes</th>
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1">Yes</th>
                        <th className="border px-2 py-1">No</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    value={row.name}
                                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                                    className="w-full border px-1 py-0.5 text-sm text-center"
                                    placeholder="Enter Facility"
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    value={row.families}
                                    onChange={(e) => handleChange(idx, "families", e.target.value)}
                                    className="w-full border px-1 py-0.5 text-sm text-center"
                                    placeholder="Families"
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    value={row.individuals}
                                    onChange={(e) => handleChange(idx, "individuals", e.target.value)}
                                    className="w-full border px-1 py-0.5 text-sm text-center"
                                    placeholder="Individuals"
                                />
                            </td>
                            {/* Owner group */}
                            <td className="border">
                                {renderCheck(row.ownerGovt, () =>
                                    toggleExclusive(idx, "ownerGovt", ["ownerGovt", "ownerPrivate"])
                                )}
                            </td>
                            <td className="border">
                                {renderCheck(row.ownerPrivate, () =>
                                    toggleExclusive(idx, "ownerPrivate", ["ownerGovt", "ownerPrivate"])
                                )}
                            </td>
                            {/* Inspected group */}
                            <td className="border">
                                {renderCheck(row.inspectedYes, () =>
                                    toggleExclusive(idx, "inspectedYes", ["inspectedYes", "inspectedNo"])
                                )}
                            </td>
                            <td className="border">
                                {renderCheck(row.inspectedNo, () =>
                                    toggleExclusive(idx, "inspectedNo", ["inspectedYes", "inspectedNo"])
                                )}
                            </td>
                            {/* MOU group */}
                            <td className="border">
                                {renderCheck(row.mouYes, () =>
                                    toggleExclusive(idx, "mouYes", ["mouYes", "mouNo"])
                                )}
                            </td>
                            <td className="border">
                                {renderCheck(row.mouNo, () =>
                                    toggleExclusive(idx, "mouNo", ["mouYes", "mouNo"])
                                )}
                            </td>
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

            <button
                onClick={addRow}
                className="inline-flex items-center gap-1 mt-2 px-4 py-1.4 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Row
            </button>

        </div>
    );
};

export default Evacuation;
