import React, { useContext, useEffect, useState } from "react";
import { StepperContext } from "@/context/StepperContext";
import Accordion from "@/Components/Accordion";
import toast from "react-hot-toast";
import { Plus, Minus } from "lucide-react";
import PwdTable from "./PwdTable";
import DisasterPerPurok from "./DisasterPerPurok";
import IllinessesTable from "./IllinessesTable";

// Helper function
const createEmptyPurokRow = (purokNum = "") => {
    const baseRow = { purok: purokNum };
    const allCategories = [
        "families",
        "individualsM",
        "individualsF",
        "lgbtq",
        "age0_6M",
        "age0_6F",
        "age7m_2yM",
        "age7m_2yF",
        "age3_5M",
        "age3_5F",
        "age6_12M",
        "age6_12F",
        "age13_17M",
        "age13_17F",
        "age18_59M",
        "age18_59F",
        "age60upM",
        "age60upF",
        "pwdM",
        "pwdF",
        "diseasesM",
        "diseasesF",
        "pregnantWomen",
    ];
    allCategories.forEach((cat) => {
        baseRow[cat] = "";
    });
    return baseRow;
};

function ExposureTable({
    tableId,
    riskType,
    purokData,
    updateRiskType,
    updatePurokField,
    addPurokRow,
    removePurokRow,
    removeTable,
    tableIndex,
}) {
    const categories = [
        "families",
        "individualsM",
        "individualsF",
        "lgbtq",
        "age0_6M",
        "age0_6F",
        "age7m_2yM",
        "age7m_2yF",
        "age3_5M",
        "age3_5F",
        "age6_12M",
        "age6_12F",
        "age13_17M",
        "age13_17F",
        "age18_59M",
        "age18_59F",
        "age60upM",
        "age60upF",
        "pwdM",
        "pwdF",
        "diseasesM",
        "diseasesF",
        "pregnantWomen",
    ];

    return (
        <div className="border rounded-lg shadow-sm mb-4 p-2 relative">
            <div className="absolute top-2 right-2 mb-4">
                <button
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition"
                    onClick={() => removeTable(tableId)}
                >
                    <Minus className="w-4 h-4" />
                </button>
            </div>

            <div className="mb-4 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kind of Risk:
                </label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    value={riskType}
                    onChange={(e) => updateRiskType(tableId, e.target.value)}
                    placeholder="e.g., TYPHOON, FLOOD, EARTHQUAKE"
                />
            </div>

            <h3 className="text-sm font-semibold mb-2 text-gray-800">
                3.1.{tableIndex + 1} Number of Families and Individuals
                according to Age and Health Condition who are at Risk from{" "}
                <span className="underline">
                    {riskType || "[Kind of Risk]"}
                </span>
            </h3>

            <table className="w-full border text-[0.6rem] table-fixed">
                <colgroup>
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "45px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "40px" }} />
                    <col style={{ width: "60px" }} />
                    <col style={{ width: "24px" }} />
                </colgroup>

                <thead className="bg-gray-100">
                    <tr>
                        <th
                            className="border p-0.5 rotate-90 whitespace-nowrap"
                            rowSpan="3"
                        >
                            Purok
                        </th>
                        <th
                            className="border p-0.5 rotate-90 whitespace-nowrap"
                            rowSpan="3"
                        >
                            Families
                        </th>

                        <th
                            colSpan="3"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            Individuals
                        </th>
                        <th
                            colSpan="10"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            Children
                        </th>
                        <th
                            colSpan="4"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            Adult
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            PWD
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            Diseases
                        </th>

                        <th
                            className="border p-0.5 rotate-90 whitespace-nowrap"
                            rowSpan="3"
                        >
                            Pregnant
                        </th>
                        <th
                            className="border p-0.5 whitespace-nowrap"
                            rowSpan="3"
                        ></th>
                    </tr>
                    <tr>
                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            M
                        </th>
                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            F
                        </th>
                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            LGBTQ
                        </th>

                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            0-6Y
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            7M-2Y
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            3-5Y
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            6-12Y
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            13-17Y
                        </th>

                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            18-59Y
                        </th>
                        <th
                            colSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            60Y+
                        </th>

                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            M
                        </th>
                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            F
                        </th>

                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            M
                        </th>
                        <th
                            rowSpan="2"
                            className="border p-0.5 text-center whitespace-nowrap"
                        >
                            F
                        </th>
                    </tr>
                    <tr>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            M
                        </th>
                        <th className="border p-0.5 text-center whitespace-nowrap">
                            F
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(purokData || []).map((row, idx) => (
                        <tr key={idx}>
                            <td className="border p-0.5">
                                <input
                                    type="text"
                                    className="border p-0.5 w-full text-[0.6rem] text-center"
                                    value={row.purok}
                                    onChange={(e) =>
                                        updatePurokField(
                                            tableId,
                                            idx,
                                            "purok",
                                            e.target.value
                                        )
                                    }
                                    placeholder="1"
                                />
                            </td>
                            {categories.map((field) => (
                                <td key={field} className="border p-0.5">
                                    <input
                                        type="number"
                                        className="border p-0.5 w-full text-[0.6rem] text-center"
                                        value={row[field] ?? ""}
                                        onChange={(e) =>
                                            updatePurokField(
                                                tableId,
                                                idx,
                                                field,
                                                e.target.value
                                            )
                                        }
                                        min="0"
                                    />
                                </td>
                            ))}
                            <td className="p-0.5 text-center !border-0">
                                <button
                                    className="w-4 h-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200 mx-auto"
                                    onClick={() => removePurokRow(tableId, idx)}
                                >
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}

                    <tr>
                        <td className="border p-0.5 font-bold">TOTAL</td>
                        {categories.map((field) => (
                            <td
                                key={`total-${field}`}
                                className="border p-0.5 font-bold text-center"
                            >
                                {(purokData || []).reduce(
                                    (sum, row) =>
                                        sum + (Number(row[field]) || 0),
                                    0
                                )}
                            </td>
                        ))}
                        <td className="p-0.5 !border-0" />
                    </tr>
                </tbody>
            </table>

            <button
                className="m-2 flex items-center gap-2 px-3 py-1 bg-blue-300 text-white rounded-full shadow hover:bg-blue-700 transition"
                onClick={() => addPurokRow(tableId)}
            >
                <Plus className="w-2 h-2" />
                <span className="text-xs">Add Purok</span>
            </button>
        </div>
    );
}

const ExposureDatabase = () => {
    const { craData, setCraData } = useContext(StepperContext);

    // use craData.exposure instead of exposureTables
    const [tables, setTables] = useState(
        craData.exposure || [
            { riskType: "", purokData: [createEmptyPurokRow("1")] },
        ]
    );

    // Sync local state with StepperContext
    useEffect(() => {
        setCraData((prev) => ({
            ...prev,
            exposure: tables, // ✅ renamed to exposure
        }));
    }, [tables, setCraData]);

    const updateRiskType = (tableIdx, newRiskType) => {
        setTables((prev) =>
            prev.map((t, idx) =>
                idx === tableIdx ? { ...t, riskType: newRiskType } : t
            )
        );
    };

    const updatePurokField = (tableIdx, purokIdx, field, val) => {
        setTables((prev) =>
            prev.map((t, idx) =>
                idx === tableIdx
                    ? {
                          ...t,
                          purokData: t.purokData.map((row, rIdx) =>
                              rIdx === purokIdx
                                  ? {
                                        ...row,
                                        [field]: val === "" ? "" : Number(val),
                                    }
                                  : row
                          ),
                      }
                    : t
            )
        );
    };

    const addPurokRow = (tableIdx) => {
        setTables((prev) =>
            prev.map((t, idx) =>
                idx === tableIdx
                    ? {
                          ...t,
                          purokData: [
                              ...t.purokData,
                              createEmptyPurokRow(
                                  (t.purokData.length + 1).toString()
                              ),
                          ],
                      }
                    : t
            )
        );
        toast.success("New Purok row added!");
    };

    const removePurokRow = (tableIdx, purokIdx) => {
        setTables((prev) =>
            prev.map((t, idx) =>
                idx === tableIdx
                    ? {
                          ...t,
                          purokData: t.purokData.filter(
                              (_, rIdx) => rIdx !== purokIdx
                          ),
                      }
                    : t
            )
        );
        toast.error("Purok row removed!");
    };

    const addTable = () => {
        setTables((prev) => [
            ...prev,
            { riskType: "", purokData: [createEmptyPurokRow("1")] },
        ]);
        toast.success("New risk table added!");
    };

    const removeTable = (tableIdx) => {
        setTables((prev) => prev.filter((_, idx) => idx !== tableIdx));
        toast.error("Table removed!");
    };

    return (
        <div className="space-y-5">
            <p className="text-md font-bold">3.1 Population</p>

            {/* Debugger to see stored structure
            <pre className="text-xs bg-black text-green-400 p-2 rounded">
                {JSON.stringify(craData, null, 2)}
            </pre> */}

            {tables.map((table, idx) => (
                <React.Fragment key={idx}>
                    <ExposureTable
                        tableId={idx}
                        riskType={table.riskType}
                        purokData={table.purokData}
                        updateRiskType={updateRiskType}
                        updatePurokField={updatePurokField}
                        addPurokRow={addPurokRow}
                        removePurokRow={removePurokRow}
                        removeTable={removeTable}
                        tableIndex={idx}
                    />
                    <button
                        className="m-2 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
                        onClick={addTable}
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-xs">Add New Risk Table</span>
                    </button>
                </React.Fragment>
            ))}

            <p className="text-md font-bold">
                3.2 Deatailed Number of Persons with Disabilities
            </p>
            <PwdTable />
            <p className="text-md font-bold">
                3.3 Number of Families at Risk of Hazards and Disaster per Purok
            </p>
            <DisasterPerPurok />
            <p className="text-md font-bold">
                3.4 Number of Persons with Illnesses or Communicable Diseases
            </p>
            <IllinessesTable />
        </div>
    );
};

export default ExposureDatabase;
