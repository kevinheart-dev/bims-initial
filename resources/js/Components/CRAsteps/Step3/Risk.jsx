import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import Accordion from "@/Components/Accordion";
import toast from "react-hot-toast";
import { toTitleCase } from "@/utils/stringFormat";

function MatrixTable({
    data,
    updateField,
    handleBlur,
    addRow,
    removeRow,
    label,
}) {
    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm mb-4">
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th rowSpan="2" className="border px-2 py-1">
                            Priority Hazards
                        </th>
                        <th colSpan="5" className="border px-2 py-1">
                            {label}
                        </th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                    <tr>
                        <th className="border px-2 py-1">People</th>
                        <th className="border px-2 py-1">Properties</th>
                        <th className="border px-2 py-1">Services</th>
                        <th className="border px-2 py-1">Environment</th>
                        <th className="border px-2 py-1">Livelihood</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((r, idx) => (
                        <tr key={idx}>
                            <td className="border px-2 py-1">
                                <select
                                    className="border p-1 text-sm w-48"
                                    value={r.hazard === "None" ? "" : r.hazard}
                                    onChange={(e) =>
                                        updateField(
                                            idx,
                                            "hazard",
                                            toTitleCase(e.target.value)
                                        )
                                    }
                                    onBlur={(e) =>
                                        handleBlur(
                                            idx,
                                            "hazard",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">Select hazard</option>

                                    {[
                                        "Typhoon",
                                        "Flood",
                                        "Rain-induced Landslide",
                                        "Fire",
                                        "Drought",
                                        "Earthquake",
                                        "Vehicular Incident",
                                        "Pandemic / Emerging and Re-emerging Diseases",
                                    ].map((hazard, i) => (
                                        <option key={i} value={hazard}>
                                            {hazard}
                                        </option>
                                    ))}

                                    {/* Optional: If hazard was manually typed before */}
                                    {r.hazard &&
                                        ![
                                            "Typhoon",
                                            "Flood",
                                            "Rain-induced Landslide",
                                            "Fire",
                                            "Drought",
                                            "Earthquake",
                                            "Vehicular Incident",
                                            "Pandemic / Emerging and Re-emerging Diseases",
                                        ].includes(r.hazard) && (
                                            <option value={r.hazard}>
                                                {r.hazard}
                                            </option>
                                        )}
                                </select>
                            </td>

                            <td className="border px-2 py-1">
                                <input
                                    type="number"
                                    className="w-full border p-1"
                                    value={r.people}
                                    onChange={(e) =>
                                        updateField(
                                            idx,
                                            "people",
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g., 5142"
                                    min="0"
                                />
                            </td>

                            {[
                                "properties",
                                "services",
                                "environment",
                                "livelihood",
                            ].map((f) => (
                                <td key={f} className="border px-2 py-1">
                                    <textarea
                                        className="w-full border p-1"
                                        value={r[f] === "None" ? "" : r[f]}
                                        onChange={(e) =>
                                            updateField(idx, f, e.target.value)
                                        }
                                        onBlur={(e) =>
                                            handleBlur(idx, f, e.target.value)
                                        }
                                        placeholder={`Enter ${f}`}
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
                </tbody>
            </table>
            <div className="p-2 m-auto">
                <button
                    onClick={addRow}
                    className="inline-flex items-center gap-1 mt-3 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
                >
                    <span className="text-sm font-bold">+</span> Add new row
                </button>
            </div>
        </div>
    );
}

const Risk = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // Initialize both risk & vulnerability if empty
    useEffect(() => {
        if (!craData.risks || craData.risks.length === 0) {
            setCraData((prev) => ({
                ...prev,
                risks: [
                    {
                        hazard: "",
                        people: "",
                        properties: "",
                        services: "",
                        environment: "",
                        livelihood: "",
                    },
                ],
            }));
        }

        if (!craData.vulnerabilities || craData.vulnerabilities.length === 0) {
            setCraData((prev) => ({
                ...prev,
                vulnerabilities: [
                    {
                        hazard: "",
                        people: "",
                        properties: "",
                        services: "",
                        environment: "",
                        livelihood: "",
                    },
                ],
            }));
        }
    }, [craData, setCraData]);

    // Generic updater
    const makeHandlers = (key) => {
        const updateField = (idx, field, val) => {
            const updated = [...craData[key]];
            updated[idx][field] =
                field === "people" ? (val === "" ? "" : Number(val)) : val;
            setCraData((prev) => ({ ...prev, [key]: updated }));
        };

        const handleBlur = (idx, field, val) => {
            const updated = [...craData[key]];
            if (field !== "people" && val.trim() === "") {
                updated[idx][field] = "None";
            }
            setCraData((prev) => ({ ...prev, [key]: updated }));
        };

        const addRow = () => {
            const updated = [...(craData[key] || [])];
            updated.push({
                hazard: "",
                people: "",
                properties: "",
                services: "",
                environment: "",
                livelihood: "",
            });
            setCraData((prev) => ({ ...prev, [key]: updated }));
            toast.success(
                `${key === "risks" ? "Risk" : "Vulnerability"} row added!`
            );
        };

        const removeRow = (idx) => {
            const updated = [...craData[key]];
            const removedName = updated[idx]?.hazard || "Row";
            updated.splice(idx, 1);
            setCraData((prev) => ({ ...prev, [key]: updated }));
            toast.error(`${removedName} removed!`);
        };

        return { updateField, handleBlur, addRow, removeRow };
    };

    const riskHandlers = makeHandlers("risks");
    const vulnHandlers = makeHandlers("vulnerabilities");

    return (
        <div className="space-y-4">
            <p className="mt-8 pt-6 font-bold text-md">
                2.1 Public Health - Risk Assessment Matrix
            </p>
            <MatrixTable
                data={craData.risks || []}
                label="RISK TO THE COMMUNITY"
                {...riskHandlers}
            />

            <p className="mt-8 pt-6 font-bold text-md">
                2.2 Public Health - Vulnerability Assessment Matrix
            </p>
            <MatrixTable
                data={craData.vulnerabilities || []}
                label="VULNERABILITY TO THE COMMUNITY"
                {...vulnHandlers}
            />
        </div>
    );
};

export default Risk;
