import React, { useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import { toTitleCase } from '@/utils/stringFormat';

const ROW_TEMPLATE = {
    riskLevel: "",
    purok: "",
    totalFamilies: "",
    totalIndividuals: "",
    atRiskFamilies: "",
    atRiskIndividuals: "",
    safeEvacuationArea: "",
};

// Generate 7 default puroks
const getDefaultRows = () =>
    Array.from({ length: 7 }, (_, i) => ({
        ...ROW_TEMPLATE,
        purok: (i + 1).toString(),
    }));

const DisasterTable = ({ disaster, updateDisaster, removeDisaster }) => {
    const updateCell = (rIdx, field, value) => {
        const updatedRows = [...disaster.rows];
        updatedRows[rIdx] = { ...updatedRows[rIdx], [field]: value };
        updateDisaster({ ...disaster, rows: updatedRows });
    };

    const addRow = () => {
        const nextPurok = (disaster.rows.length + 1).toString();
        updateDisaster({
            ...disaster,
            rows: [...disaster.rows, { ...ROW_TEMPLATE, purok: nextPurok }],
        });
    };

    const removeRow = (rIdx) => {
        updateDisaster({
            ...disaster,
            rows: disaster.rows.filter((_, i) => i !== rIdx),
        });
    };

    // Totals
    const totals = disaster.rows.reduce(
        (acc, row) => {
            acc.families += Number(row.totalFamilies) || 0;
            acc.individuals += Number(row.totalIndividuals) || 0;
            acc.atRiskFamilies += Number(row.atRiskFamilies) || 0;
            acc.atRiskIndividuals += Number(row.atRiskIndividuals) || 0;
            return acc;
        },
        { families: 0, individuals: 0, atRiskFamilies: 0, atRiskIndividuals: 0 }
    );

    // ✅ Define placeholders
    const placeholders = {
        totalFamilies: "Enter # of families",
        totalIndividuals: "Enter # of individuals",
        atRiskFamilies: "Enter # of at-risk families",
        atRiskIndividuals: "Enter # of at-risk individuals",
        safeEvacuationArea: "Enter safe evacuation area",
    };

    return (
        <div className="mb-8">
            {/* Disaster Name */}
            <div className="flex items-center justify-between mb-4">
                <input
                    type="text"
                    value={disaster.name}
                    onChange={(e) => updateDisaster({ ...disaster, name: e.target.value })}
                    className="text-md font-bold bg-transparent border-none focus:outline-none w-full"
                    placeholder="Enter new Disaster"
                />
                <button
                    onClick={removeDisaster}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                >
                    ✕
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="border border-collapse w-full text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1 w-32">Risk Level</th>
                            <th className="border px-2 py-1">Purok</th>
                            <th colSpan="2" className="border px-2 py-1 text-center">Total Population</th>
                            <th colSpan="2" className="border px-2 py-1 text-center">At-Risk Population</th>
                            <th className="border px-2 py-1">Safe Evacuation Area</th>
                            <th className="border px-2 py-1 text-center"></th>
                        </tr>
                        <tr className="bg-gray-100">
                            <th className="border px-2 py-1"></th>
                            <th className="border px-2 py-1"></th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1">Families</th>
                            <th className="border px-2 py-1">Individuals</th>
                            <th className="border px-2 py-1"></th>
                            <th className="border px-2 py-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {disaster.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                                {/* Risk Level Dropdown */}
                                <td className="border px-2 py-1 text-center">
                                    <select
                                        value={row.riskLevel}
                                        onChange={(e) => updateCell(rIdx, "riskLevel", e.target.value)}
                                        className="border w-full px-2 py-1 text-xs text-center rounded"
                                    >
                                        <option value="">--Select--</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </td>

                                {/* Purok */}
                                <td className="border px-2 py-1 text-center">{row.purok}</td>

                                {/* Total Families */}
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="number"
                                        value={row.totalFamilies}
                                        onChange={(e) => updateCell(rIdx, "totalFamilies", e.target.value)}
                                        placeholder={placeholders.totalFamilies} // ✅
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>

                                {/* Total Individuals */}
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="number"
                                        value={row.totalIndividuals}
                                        onChange={(e) => updateCell(rIdx, "totalIndividuals", e.target.value)}
                                        placeholder={placeholders.totalIndividuals} // ✅
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>

                                {/* At-Risk Families */}
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="number"
                                        value={row.atRiskFamilies}
                                        onChange={(e) => updateCell(rIdx, "atRiskFamilies", e.target.value)}
                                        placeholder={placeholders.atRiskFamilies} // ✅
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>

                                {/* At-Risk Individuals */}
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="number"
                                        value={row.atRiskIndividuals}
                                        onChange={(e) => updateCell(rIdx, "atRiskIndividuals", e.target.value)}
                                        placeholder={placeholders.atRiskIndividuals} // ✅
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>

                                {/* Safe Evacuation Area */}
                                <td className="border px-2 py-1 text-center">
                                    <input
                                        type="text"
                                        value={row.safeEvacuationArea}
                                        onChange={(e) =>
                                            updateCell(rIdx, "safeEvacuationArea", toTitleCase(e.target.value))
                                        }
                                        placeholder={placeholders.safeEvacuationArea} // ✅
                                        className="border w-full px-2 py-1 text-xs text-center"
                                    />
                                </td>

                                {/* Remove Button */}
                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                        onClick={() => removeRow(rIdx)}
                                    >
                                        ✕
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* Totals Row */}
                        <tr className="bg-gray-50 font-semibold">
                            <td className="border px-2 py-1 text-center">Total</td>
                            <td className="border px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center">{totals.families}</td>
                            <td className="border px-2 py-1 text-center">{totals.individuals}</td>
                            <td className="border px-2 py-1 text-center">{totals.atRiskFamilies}</td>
                            <td className="border px-2 py-1 text-center">{totals.atRiskIndividuals}</td>
                            <td className="border px-2 py-1 text-center"></td>
                            <td className="border px-2 py-1 text-center"></td>
                        </tr>
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


const AffectedAreas = () => {
    const { craData, setCraData } = useContext(StepperContext);

    const addDisaster = () => {
        const newDisaster = {
            id: Date.now(),
            name: "",
            rows: getDefaultRows(),
        };
        setCraData({
            ...craData,
            affected_areas: [...(craData.affected_areas || []), newDisaster],
        });
    };

    const updateDisaster = (id, updated) => {
        setCraData({
            ...craData,
            affected_areas: craData.affected_areas.map((d) =>
                d.id === id ? updated : d
            ),
        });
    };

    const removeDisaster = (id) => {
        setCraData({
            ...craData,
            affected_areas: craData.affected_areas.filter((d) => d.id !== id),
        });
    };

    // Ensure default disaster "Typhoon"
    React.useEffect(() => {
        if (!craData.affected_areas || craData.affected_areas.length === 0) {
            setCraData({
                ...craData,
                affected_areas: [
                    { id: Date.now(), name: "Typhoon", rows: getDefaultRows() },
                ],
            });
        }
    }, []);

    return (
        <div>
            <div className="mb-10 border-2 border-purple-300 rounded-xl p-5 bg-purple-50 shadow-sm">
                {(craData.affected_areas || []).map((disaster) => (
                    <DisasterTable
                        key={disaster.id}
                        disaster={disaster}
                        updateDisaster={(updated) => updateDisaster(disaster.id, updated)}
                        removeDisaster={() => removeDisaster(disaster.id)}
                    />
                ))}

            </div>

            <button
                onClick={addDisaster}
                className="inline-flex items-center gap-1 mt-0 mb-3 px-2 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-sm"
            >
                <span className="text-sm font-bold">+</span> Add Disaster
            </button>

        </div>
    );
};

export default AffectedAreas;
