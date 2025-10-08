import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import Accordion from "@/Components/Accordion";
import toast from "react-hot-toast";
import Risk from "./Risk";
import ExposureDatabase from "./ExposureDatabase";
import EffectDisaster from "./EffectDisaster";
import Inventory from "./Inventory";
import Evacuation from "./Evacuation";
const computeAverage = (h) => {
    if (h.probability === "" || h.effect === "" || h.management === "")
        return "";
    const avg =
        (Number(h.probability) + Number(h.effect) + Number(h.management)) / 3;
    return parseFloat(avg.toFixed(3));
};

function HazardTable({ hazards, updateField, addHazard, removeHazard }) {
    // sort hazards by average (desc) to assign ranking
    const hazardsWithRank = hazards
        .map((h, idx) => ({ ...h, index: idx, average: computeAverage(h) }))
        .sort((a, b) => (b.average || 0) - (a.average || 0))
        .map((h, rank) => ({ ...h, rank: h.average ? rank + 1 : "" }));

    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm mb-4">
            {/* Legend */}
            <div className="p-3 bg-gray-50 border-b text-sm">
                <h3 className="font-semibold mb-2">Legend</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="font-medium">Probability</p>
                        <p>1 – Most Unlikely</p>
                        <p>2 – Low Probability</p>
                        <p>3 – Perhaps</p>
                        <p>4 – High Probability</p>
                        <p>5 – Almost Certain</p>
                    </div>
                    <div>
                        <p className="font-medium">Effect</p>
                        <p>1 – Negligible</p>
                        <p>2 – Low Impact</p>
                        <p>3 – Maintain Impact</p>
                        <p>4 – High Impact</p>
                        <p>5 – Devastating</p>
                    </div>
                    <div>
                        <p className="font-medium">Management</p>
                        <p>1 – Most Manageable</p>
                        <p>2 – Manageable</p>
                        <p>3 – Most Extensive</p>
                        <p>4 – Most Frequent</p>
                        <p>5 – Most Severe</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">Hazard / Risk</th>
                        <th className="border px-2 py-1">Probability</th>
                        <th className="border px-2 py-1">Effect</th>
                        <th className="border px-2 py-1">Management</th>
                        <th className="border px-2 py-1">Basis</th>
                        <th className="border px-2 py-1">Average</th>
                        <th className="border px-2 py-1">Ranking</th>
                        <th className="border px-2 py-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {hazardsWithRank.map((h) => (
                        <tr key={h.index}>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={h.hazard}
                                    onChange={(e) =>
                                        updateField(
                                            h.index,
                                            "hazard",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            {["probability", "effect", "management"].map(
                                (f) => (
                                    <td key={f} className="border px-2 py-1">
                                        <select
                                            className="w-full border p-1"
                                            value={h[f]}
                                            onChange={(e) =>
                                                updateField(
                                                    h.index,
                                                    f,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Select</option>
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                )
                            )}
                            <td className="border px-2 py-1">
                                <textarea
                                    className="w-full border p-1"
                                    value={h.basis}
                                    onChange={(e) =>
                                        updateField(
                                            h.index,
                                            "basis",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td className="border px-2 py-1 text-center bg-gray-50 font-semibold">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={h.average}
                                    onChange={(e) =>
                                        updateField(
                                            h.index,
                                            "average",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td className="border px-2 py-1 text-center">
                                {h.rank}
                            </td>
                            <td className="px-2 py-1 text-center !border-0">
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                    onClick={() => removeHazard(h.index)}
                                >
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="mt-3 text-blue-600 hover:underline"
                onClick={addHazard}
            >
                + Add new row
            </button>
        </div>
    );
}

const Hazard = () => {
    const { craData, setCraData } = useContext(StepperContext);

    useEffect(() => {
        if (!craData.hazards || craData.hazards.length === 0) {
            setCraData((prev) => ({
                ...prev,
                hazards: [
                    {
                        hazard: "",
                        probability: "",
                        effect: "",
                        management: "",
                        basis: "",
                    },
                ],
            }));
        }
    }, [craData, setCraData]);

    const updateField = (idx, field, val) => {
        const updated = [...craData.hazards];
        updated[idx][field] =
            field === "probability" ||
            field === "effect" ||
            field === "management"
                ? val === ""
                    ? ""
                    : Number(val)
                : val;
        setCraData((prev) => ({ ...prev, hazards: updated }));
    };

    const addHazard = () => {
        const updated = [...(craData.hazards || [])];
        updated.push({
            hazard: "",
            probability: "",
            effect: "",
            management: "",
            basis: "",
        });
        setCraData((prev) => ({ ...prev, hazards: updated }));
        toast.success("Hazard added!");
    };

    const removeHazard = (idx) => {
        const updated = [...craData.hazards];
        const removedName = updated[idx]?.hazard || "Hazard";
        updated.splice(idx, 1);
        setCraData((prev) => ({ ...prev, hazards: updated }));
        toast.error(`${removedName} removed!`);
    };

    return (
        <div className="space-y-4">
            <Accordion title="2. Identifying Possible Risks or Dangers that could affect the Barangay">
                <HazardTable
                    hazards={craData.hazards || []}
                    updateField={updateField}
                    addHazard={addHazard}
                    removeHazard={removeHazard}
                />
                <Risk />
            </Accordion>

            <Accordion title="3. Development an exposure database of those that can be directly affected by risks and hazards">
                <ExposureDatabase />
            </Accordion>
            <Accordion title="4. Effects of Hazards or Disasters">
                <EffectDisaster />
                <Inventory />
            </Accordion>
            <Accordion
                title="5. List of Designated Center and Temporary Isolation Facilities in the
            Barangay and City (whether owned by the goverment or private)"
            >
                <Evacuation />
            </Accordion>
        </div>
    );
};

export default Hazard;
