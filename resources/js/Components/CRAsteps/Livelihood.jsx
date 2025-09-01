import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";

export default function Livelihood() {
    const { craData, setCraData } = useContext(StepperContext);

    useEffect(() => {
        console.log("CRA Data:", craData);
    }, [craData]);

    const defaultLivelihoods = [
        "Farming", "Fishing", "Poultry and Livestock", "Carpentry",
        "Professional", "Government Employee", "Private Employee",
        "Brgy. Official or Staff", "Businessman/woman",
        "Formal/Licensed Driver", "Non-Licensed Driver", "Porter",
        "Masseuse", "House Helper", "Electrician", "Laborer",
        "Miner", "Lender", "Call Center Agent", "Medical Transcriptionist",
        "Virtual Assistant",
    ];

    useEffect(() => {
        if (!craData.livelihood || !Array.isArray(craData.livelihood) || craData.livelihood.length === 0) {
            setCraData((prev) => ({
                ...prev,
                livelihood: defaultLivelihoods.map((type) => ({
                    type,
                    male_no_dis: "",
                    male_dis: "",
                    female_no_dis: "",
                    female_dis: "",
                    lgbtq_no_dis: "",
                    lgbtq_dis: "",
                })),
            }));
        }
    }, [craData, setCraData]);

    const updateRow = (index, field, value) => {
        const updated = [...craData.livelihood];
        updated[index][field] = value === "" ? "" : Number(value);
        setCraData((prev) => ({ ...prev, livelihood: updated }));
    };

    const updateType = (index, value) => {
        const updated = [...craData.livelihood];
        updated[index].type = value;
        setCraData((prev) => ({ ...prev, livelihood: updated }));
    };

    const addRow = () => {
        setCraData((prev) => ({
            ...prev,
            livelihood: [
                ...prev.livelihood,
                { type: "", male_no_dis: "", male_dis: "", female_no_dis: "", female_dis: "", lgbtq_no_dis: "", lgbtq_dis: "" },
            ],
        }));
        toast.success("Row added successfully!");
    };

    const removeRow = (index) => {
        const removedType = craData.livelihood[index]?.type || "Row";
        const updated = craData.livelihood.filter((_, i) => i !== index);
        setCraData((prev) => ({ ...prev, livelihood: updated }));
        toast.error(`${removedType} removed!`);
    };

    const getColumnTotal = (field) => {
        const sum = craData.livelihood?.reduce((s, row) => s + (Number(row[field]) || 0), 0);
        return sum === 0 ? "" : sum;
    };

    const getRowTotal = (row) => {
        const sum =
            (Number(row.male_no_dis) || 0) +
            (Number(row.male_dis) || 0) +
            (Number(row.female_no_dis) || 0) +
            (Number(row.female_dis) || 0) +
            (Number(row.lgbtq_no_dis) || 0) +
            (Number(row.lgbtq_dis) || 0);
        return sum === 0 ? "" : sum;
    };

    const getGrandTotal = () => {
        const sum = craData.livelihood?.reduce((s, row) => s + (
            (Number(row.male_no_dis) || 0) +
            (Number(row.male_dis) || 0) +
            (Number(row.female_no_dis) || 0) +
            (Number(row.female_dis) || 0) +
            (Number(row.lgbtq_no_dis) || 0) +
            (Number(row.lgbtq_dis) || 0)
        ), 0);
        return sum === 0 ? "" : sum;
    };

    // ------------------------------------------------------
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

    // ✅ Initialize infra if missing
    useEffect(() => {
        if (!craData.infrastructure || craData.infrastructure.length === 0) {
            setCraData((prev) => ({
                ...prev,
                infrastructure: defaultInfra,
            }));
        }
    }, [craData, setCraData]);

    const updateInfraRow = (catIdx, rowIdx, field, value) => {
        const updated = [...craData.infrastructure];
        updated[catIdx].rows[rowIdx][field] =
            field === "households" ? (value === "" ? "" : Number(value)) : value;
        setCraData((prev) => ({ ...prev, infrastructure: updated }));
    };

    const addInfraRow = (catIdx) => {
        const updated = [...craData.infrastructure];
        updated[catIdx].rows.push({ type: "", households: "" });
        setCraData((prev) => ({ ...prev, infrastructure: updated }));

        // ✅ Toaster
        toast.success(`New row added to "${updated[catIdx].category}"`, {
            duration: 2000,
        });
    };

    const removeInfraRow = (catIdx, rowIdx) => {
        const updated = [...craData.infrastructure];
        const removed = updated[catIdx].rows[rowIdx]?.type || "row"; // show name if available
        updated[catIdx].rows = updated[catIdx].rows.filter((_, i) => i !== rowIdx);
        setCraData((prev) => ({ ...prev, infrastructure: updated }));

        // ✅ Toaster
        toast.error(`Removed "${removed}" from "${updated[catIdx].category}"`, {
            duration: 2000,
        });
    };


    return (
        <div className="space-y-8">
            <h1 className="text-lg font-semibold mb-3">B. Information on Livelihood</h1>
            <section>
                <h2 className="text-lg font-semibold mb-3">Primary Livelihood of Residents in the Barangay</h2>

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
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                            <th className="border px-2 py-1">Without Disability</th>
                            <th className="border px-2 py-1">With Disability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {craData.livelihood?.map((row, idx) => (
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

                                {["male_no_dis", "male_dis", "female_no_dis", "female_dis", "lgbtq_no_dis", "lgbtq_dis"].map((field) => (
                                    <td key={field} className="border px-2 py-1">
                                        <input
                                            type="number"
                                            className="w-full border p-1 text-center"
                                            value={row[field] ?? ""}
                                            onChange={(e) => updateRow(idx, field, e.target.value)}
                                        />
                                    </td>
                                ))}

                                <td className="border px-2 py-1 font-semibold text-center bg-gray-50">
                                    {getRowTotal(row)}
                                </td>

                                <td className="px-2 py-1 text-center !border-0">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 border-none outline-none"
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
                            <td className="border px-2 py-1 text-center">{getColumnTotal("male_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("male_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("female_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("female_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("lgbtq_no_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getColumnTotal("lgbtq_dis")}</td>
                            <td className="border px-2 py-1 text-center">{getGrandTotal()}</td>
                        </tr>
                    </tfoot>
                </table>

                <button
                    className="mt-3 text-blue-600 hover:underline"
                    onClick={addRow}
                >
                    + Add new row
                </button>
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-3">
                    C. Infrastructures and Institutions that provide services to the Barangay
                </h2>

                <div className="grid gap-4">
                    {/* First row → 3 columns */}
                    <div className="grid grid-cols-3 gap-4">
                        {craData.infrastructure?.slice(0, 3).map((category, catIdx) => (
                            <div key={catIdx} className="flex flex-col border rounded">
                                <h3 className="font-semibold text-md mb-2 p-2">{category.category}</h3>

                                <div className="flex-1 overflow-auto">
                                    <table className="w-full border text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-2 py-1 w-[300px]">Type</th>
                                                <th className="border px-2 py-1 text-center">Number of Households</th>
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
                                                            onChange={(e) =>
                                                                updateInfraRow(catIdx, rowIdx, "type", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-full border p-1 text-center"
                                                            value={row.households ?? ""}
                                                            onChange={(e) =>
                                                                updateInfraRow(catIdx, rowIdx, "households", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center !border-0">
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 border-none outline-none"
                                                            onClick={() => removeInfraRow(catIdx, rowIdx)}
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
                                        className="text-blue-600 hover:underline"
                                        onClick={() => addInfraRow(catIdx)}
                                    >
                                        + Add new row
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second row → 2 columns */}
                    <div className="grid grid-cols-2 gap-4">
                        {craData.infrastructure?.slice(3, 5).map((category, catIdx) => (
                            <div key={catIdx + 3} className="flex flex-col border rounded">
                                <h3 className="font-semibold text-md mb-2 p-2">{category.category}</h3>

                                <div className="flex-1 overflow-auto">
                                    <table className="w-full border text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-2 py-1 w-[300px]">Type</th>
                                                <th className="border px-2 py-1 text-center">Number of Households</th>
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
                                                            onChange={(e) =>
                                                                updateInfraRow(catIdx + 3, rowIdx, "type", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="border px-2 py-1 text-center">
                                                        <input
                                                            type="number"
                                                            className="w-full border p-1 text-center"
                                                            value={row.households ?? ""}
                                                            onChange={(e) =>
                                                                updateInfraRow(catIdx + 3, rowIdx, "households", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="px-2 py-1 text-center !border-0">
                                                        <button
                                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 border-none outline-none"
                                                            onClick={() => removeInfraRow(catIdx + 3, rowIdx)}
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
                                        className="text-blue-600 hover:underline"
                                        onClick={() => addInfraRow(catIdx + 3)}
                                    >
                                        + Add new row
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>





        </div>

    );
}
