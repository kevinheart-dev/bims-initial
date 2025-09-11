import { useContext, useEffect, useCallback } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import React from "react";
import { Plus, Minus } from "lucide-react";
import Accordion from "@/Components/Accordion";

// Fixed categories
const populationCategories = [
    "With Disability",
    "Pregnant Women",
    "Number of Families",
    "Number of Individuals",
    "0-6 months",
    "7 mos - 2 yrs",
    "3-5 yrs",
    "6-12 yrs",
    "13-17 yrs",
    "18-59 yrs",
    "60+ yrs",
    "Physical Health",
    "Mental Health",
];

const disasterEffectImpact = [
    "Number of Casualties",
    "Deaths",
    "Injured",
    "Missing",
];



// 🔹 Define property categories
const propertyCategories = [
    {
        category: "Agriculture",
        defaultDescriptions: [
            "Farming (extent of damage in land area or worth of damage)"
        ]
    },
    {
        category: "Fishing",
        defaultDescriptions: [
            "Fishing Equipment (quantity or worth of damage)",
            "Fishing Boats (damaged or lost)"
        ]
    },
];

const defaultLifelines = [
    {
        defaultDescriptions: [
            "Transportation Facilities (extent of damage or worth of damage)",
        ],
    },
    {
        category: "Roads",
        defaultDescriptions: [
            "National (Number of impassable road or worth of damage)",
            "Provincial (Number of impassable road or worth of damage)",
            "City (Number of impassable road or worth of damage)",
            "Barangay (Number of impassable road or worth of damage)",
        ],
    },
    {
        category: "Electric and Water Supply",
        defaultDescriptions: [
            "Electric Supply (Number of households affected)",
            "Water Supply (Number of households affected)",
        ],
    },
    {
        category: "Bridges",
        defaultDescriptions: [
            "Bailey (Number of impassable bridges or worth of damages)",
            "Concrete (Number of impassable bridges or worth of damages)",
            "Wooden (Number of impassable bridges or worth of damages)",
            "Railway (Number of impassable bridges or worth of damages)",
        ],
    },
    {
        category: "Communication Facilities",
        defaultDescriptions: [
            "PLDT (Number of damaged lines or worth of damages)",
            "BAYANTEL (Number of damaged lines or worth of damages)",
            "Cell Sites (Number of damaged lines or worth of damages)",
            "Radio (Number of damaged lines or worth of damages)",
            "Repeaters (Number of damaged lines or worth of damages)",
        ],
    },
];


const defaultAgriculture = [
    "Livestock (quantity or value)",
    "Farm animals (quantity)",
    "Poultry and Fowl (quantity)",
    "Agriculture/Farm Inputs",
];


const defaultDamageDescriptions = [
    "Totally Damaged (quantity or worth of damage)",
    "Partially Damaged (quantity or worth of damage)",
];

const defaultStructure = [
    "Houses",
    "Schools",
    "Hospitals",
    "Health Center",
    "Government Offices",
    "Public Markets",
    "Flood Control",
    "Commercial Facilities",
].map((category) => ({
    category,
    defaultDescriptions: [...defaultDamageDescriptions],
}));


// Default calamity (fresh object)
const defaultCalamity = () => ({
    disaster_name: "",
    year: "",
    population: populationCategories.map((cat) => ({
        category: cat,
        value: "",
        source: "",
    })),
    impacts: disasterEffectImpact.map((effect) => ({
        effect_type: effect,
        value: "",
        source: "",
    })),
    property: propertyCategories.map((prop) => ({
        category: prop.category,
        descriptions: prop.defaultDescriptions.map((desc) => ({
            description: desc,
            value: "",
            source: "",
        })),
    })),
    structure: defaultStructure.map((str) => ({
        category: str.category,
        descriptions: str.defaultDescriptions.map((desc) => ({
            description: desc,
            value: "",
            source: "",
        })),
    })),
    agriculture: defaultAgriculture.map((agri) => ({
        description: agri,
        value: "",
        source: "",
    })),
    lifelines: defaultLifelines.map((life) => ({
        category: life.category || life.defaultDescriptions,
        descriptions: Array.isArray(life.defaultDescriptions)
            ? life.defaultDescriptions.map((desc) => ({
                description: desc,
                value: "",
                source: "",
            }))
            : [{
                description: life.defaultDescriptions,
                value: "",
                source: "",
            }],
    })),
});


const CalamityTable = ({ calamities, updateCell }) => {
    return (
        <table className="w-full border text-sm mt-4">
            <thead>
                {/* Top header row */}
                <tr>
                    <th className="border px-2 py-1 w-[200px]">Calamity/Disaster</th>
                    {calamities.map((cal, idx) => (
                        <React.Fragment key={idx}>
                            <th className="border text-center">
                                <input
                                    type="text"
                                    placeholder="Disaster Name"
                                    value={cal.disaster_name}
                                    className="border w-full text-center font-bold"
                                    onChange={(e) =>
                                        updateCell(idx, "disaster_name", e.target.value)
                                    }
                                />
                            </th>
                            <th className="border text-center">Source of Information</th>
                        </React.Fragment>
                    ))}
                </tr>

                {/* Second header row (Year + Barangay) */}
                <tr>
                    <th className="border px-2 py-1 w-[200px]">Year</th>
                    {calamities.map((cal, idx) => (
                        <React.Fragment key={idx}>
                            <th className="border text-center">
                                <input
                                    type="text"
                                    placeholder="e.g. 2020 or 2020-2026"
                                    value={cal.year}
                                    className="border text-center w-full"
                                    onChange={(e) =>
                                        updateCell(idx, "year", e.target.value)
                                    }
                                />
                            </th>
                            <th className="border text-center">Barangay</th>
                        </React.Fragment>
                    ))}
                </tr>

                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        POPULATION
                    </th>
                </tr>
                <tr>
                    <th className="border text-center w-[200px]">Affected Population</th>
                </tr>
            </thead>

            <tbody>
                {populationCategories.map((cat, rowIdx) => (
                    <tr key={rowIdx}>
                        <td className="border px-2 py-1">{cat}</td>
                        {calamities.map((cal, calIdx) => {
                            const popRow = cal.population?.[rowIdx] || { value: "", source: "" };
                            return (
                                <React.Fragment key={calIdx}>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={popRow.value}
                                            onChange={(e) =>
                                                updateCell(calIdx, "population", e.target.value, rowIdx, null, "value")
                                            }

                                        />
                                    </td>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={popRow.source}
                                            onChange={(e) =>
                                                updateCell(calIdx, "population", e.target.value, rowIdx, null, "source")
                                            }
                                        />
                                    </td>
                                </React.Fragment>
                            );
                        })}
                    </tr>
                ))}
                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        EFFECTS/IMPACTS OF DISASTER
                    </th>
                </tr>

                {disasterEffectImpact.map((effect, rowIdx) => (
                    <tr key={`impact-${rowIdx}`}>
                        <td className="border px-2 py-1">{effect}</td>
                        {calamities.map((cal, calIdx) => {
                            const impactRow = cal.impacts?.[rowIdx] || { value: "", source: "" };
                            return (
                                <React.Fragment key={calIdx}>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={impactRow.value}
                                            onChange={(e) =>
                                                updateCell(calIdx, "impacts", e.target.value, rowIdx, null, "value")
                                            }
                                        />
                                    </td>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={impactRow.source}
                                            onChange={(e) =>
                                                updateCell(calIdx, "impacts", e.target.value, rowIdx, null, "source")
                                            }
                                        />
                                    </td>
                                </React.Fragment>
                            );
                        })}
                    </tr>
                ))}

                {/* Damage to Property Section */}
                {/* DAMAGE TO PROPERTY */}
                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        DAMAGE TO PROPERTY
                    </th>
                </tr>

                {propertyCategories.map((prop, rowIdx) => (
                    <React.Fragment key={`category-${rowIdx}`}>
                        {/* Category Row */}
                        <tr>
                            <th
                                className="border text-left font-bold bg-gray-50 px-2"
                                colSpan={1 + calamities.length * 2}
                            >
                                {prop.category}
                            </th>
                        </tr>

                        {prop.defaultDescriptions.map((desc, descIdx) => (
                            <tr key={`desc-${rowIdx}-${descIdx}`}>
                                <td className="border px-2 py-1">{desc}</td>
                                {calamities.map((cal, calIdx) => {
                                    const propRow =
                                        cal.property?.[rowIdx]?.descriptions?.[descIdx] || {
                                            value: "",
                                            source: "",
                                        };

                                    return (
                                        <React.Fragment key={`prop-${calIdx}-${rowIdx}-${descIdx}`}>
                                            {/* Value */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={propRow.value}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "property",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "value"
                                                        )
                                                    }
                                                />
                                            </td>

                                            {/* Source */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={propRow.source}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "property",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "source"
                                                        )
                                                    }
                                                />
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}


                {/* AGRICULTURE */}
                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        AGRICULTURE
                    </th>
                </tr>

                {defaultAgriculture.map((agri, rowIdx) => (
                    <tr key={`agri-${rowIdx}`}>
                        <td className="border px-2 py-1">{agri}</td>
                        {calamities.map((cal, calIdx) => {
                            const agriRow = cal.agriculture?.[rowIdx] || { value: "", source: "" };
                            return (
                                <React.Fragment key={calIdx}>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={agriRow.value}
                                            onChange={(e) =>
                                                updateCell(calIdx, "agriculture", e.target.value, rowIdx, null, "value")
                                            }
                                        />
                                    </td>
                                    <td className="border text-center px-2 py-1">
                                        <input
                                            type="text"
                                            className="w-full border text-center"
                                            value={agriRow.source}
                                            onChange={(e) =>
                                                updateCell(calIdx, "agriculture", e.target.value, rowIdx, null, "source")
                                            }
                                        />
                                    </td>
                                </React.Fragment>
                            );
                        })}
                    </tr>
                ))}

                {/* STRUCTURES */}
                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        DAMAGE PROPERTIES (STRUCTURES)
                    </th>
                </tr>

                {defaultStructure.map((str, rowIdx) => (
                    <React.Fragment key={`structure-${rowIdx}`}>
                        {/* Category Row */}
                        <tr>
                            <th
                                className="border text-left font-bold bg-gray-50 px-2"
                                colSpan={1 + calamities.length * 2}
                            >
                                {str.category}
                            </th>
                        </tr>

                        {str.defaultDescriptions.map((desc, descIdx) => (
                            <tr key={`structure-${rowIdx}-${descIdx}`}>
                                <td className="border px-2 py-1">{desc}</td>
                                {calamities.map((cal, calIdx) => {
                                    const structRow =
                                        cal.structure?.[rowIdx]?.descriptions?.[descIdx] || {
                                            value: "",
                                            source: "",
                                        };

                                    return (
                                        <React.Fragment key={`struct-${calIdx}-${rowIdx}-${descIdx}`}>
                                            {/* Value */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={structRow.value}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "structure",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "value"
                                                        )
                                                    }
                                                />
                                            </td>

                                            {/* Source */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={structRow.source}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "structure",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "source"
                                                        )
                                                    }
                                                />
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}

                <tr>
                    <th
                        className="border text-center font-bold bg-gray-100"
                        colSpan={1 + calamities.length * 2}
                    >
                        LIFELINES
                    </th>
                </tr>

                {defaultLifelines.map((life, rowIdx) => (
                    <React.Fragment key={`life-${rowIdx}`}>
                        {/* Category Row */}
                        <tr>
                            <th
                                className="border text-left font-bold bg-gray-50 px-2"
                                colSpan={1 + calamities.length * 2}
                            >
                                {life.category || "General Lifeline"}
                            </th>
                        </tr>

                        {life.defaultDescriptions.map((desc, descIdx) => (
                            <tr key={`life-${rowIdx}-${descIdx}`}>
                                <td className="border px-2 py-1">{desc}</td>
                                {calamities.map((cal, calIdx) => {
                                    const lifeRow =
                                        cal.lifelines?.[rowIdx]?.descriptions?.[descIdx] || {
                                            value: "",
                                            source: "",
                                        };

                                    return (
                                        <React.Fragment key={`life-${calIdx}-${rowIdx}-${descIdx}`}>
                                            {/* Value */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={lifeRow.value}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "lifelines",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "value"
                                                        )
                                                    }
                                                />
                                            </td>

                                            {/* Source */}
                                            <td className="border text-center px-2 py-1">
                                                <input
                                                    type="text"
                                                    className="w-full border text-center"
                                                    value={lifeRow.source}
                                                    onChange={(e) =>
                                                        updateCell(
                                                            calIdx,
                                                            "lifelines",
                                                            e.target.value,
                                                            rowIdx,
                                                            descIdx,
                                                            "source"
                                                        )
                                                    }
                                                />
                                            </td>
                                        </React.Fragment>
                                    );
                                })}
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default function Calamities() {
    const { craData, setCraData } = useContext(StepperContext);
    useEffect(() => {
        setCraData((prev) => ({
            ...prev,
            calamities: prev.calamities?.length
                ? prev.calamities.map((cal) => ({
                    ...cal,
                    population: cal.population?.length
                        ? cal.population
                        : populationCategories.map((cat) => ({
                            category: cat,
                            value: "",
                            source: "",
                        })),
                    impacts: cal.impacts?.length
                        ? cal.impacts
                        : disasterEffectImpact.map((effect) => ({
                            effect_type: effect,
                            value: "",
                            source: "",
                        })),
                    property: cal.property?.length
                        ? cal.property
                        : propertyCategories.map((prop) => ({
                            category: prop.category,
                            descriptions: prop.defaultDescriptions.map((desc) => ({
                                description: desc,
                                value: "",
                                source: "",
                            })),
                        })),
                    structure: cal.structure?.length
                        ? cal.structure
                        : defaultStructure.map((str) => ({
                            category: str.category,
                            descriptions: str.defaultDescriptions.map((desc) => ({
                                description: desc,
                                value: "",
                                source: "",
                            })),
                        })),
                    agriculture: cal.agriculture?.length
                        ? cal.agriculture
                        : defaultAgriculture.map((agri) => ({
                            description: agri,
                            value: "",
                            source: "",
                        })),
                    lifelines: cal.lifelines?.length
                        ? cal.lifelines
                        : defaultLifelines.map((life) => ({
                            category: life.category || "General",
                            descriptions: (Array.isArray(life.defaultDescriptions)
                                ? life.defaultDescriptions
                                : [life.defaultDescriptions]
                            ).map((desc) => ({
                                description: desc,
                                value: "",
                                source: "",
                            })),
                        })),

                }))
                : [defaultCalamity()],
        }));
    }, [setCraData]);


    const addCalamity = useCallback(() => {
        setCraData((prev) => ({
            ...prev,
            calamities: [...prev.calamities, defaultCalamity()],
        }));
        toast.success("New calamity added!");
    }, [setCraData]);

    const removeCalamity = useCallback(() => {
        setCraData((prev) => {
            if (prev.calamities.length <= 1) return prev;
            return { ...prev, calamities: prev.calamities.slice(0, -1) };
        });
        toast.error("Last calamity removed!");
    }, [setCraData]);

    const updateCell = useCallback(
        (calIdx, field, value, rowIdx = null, descIdx = null, subField = null) => {
            setCraData((prev) => {
                const updated = [...prev.calamities]; // shallow copy of calamities

                if (["population", "impacts", "agriculture"].includes(field)) {
                    if (rowIdx !== null && subField) {
                        updated[calIdx] = {
                            ...updated[calIdx],
                            [field]: updated[calIdx][field].map((item, i) =>
                                i === rowIdx ? { ...item, [subField]: value } : item
                            ),
                        };
                    }
                } else if (["property", "structure", "lifelines"].includes(field)) {
                    if (rowIdx !== null && descIdx !== null && subField) {
                        updated[calIdx] = {
                            ...updated[calIdx],
                            [field]: updated[calIdx][field].map((cat, i) =>
                                i === rowIdx
                                    ? {
                                        ...cat,
                                        descriptions: cat.descriptions.map((desc, j) =>
                                            j === descIdx ? { ...desc, [subField]: value } : desc
                                        ),
                                    }
                                    : cat
                            ),
                        };
                    }
                } else {
                    updated[calIdx] = {
                        ...updated[calIdx],
                        [field]: value,
                    };
                }

                return { ...prev, calamities: updated };
            });
        },
        [setCraData]
    );




    return (
        <div>
            <Accordion title="1. Identify Calamities or Disasters in the Past Years and their Impact to the Community">
                <div className="flex justify-end mt-0 gap-2">
                    {/* Add Calamity */}
                    <button
                        onClick={addCalamity}
                        className="group relative flex items-center justify-center w-8 h-8 bg-blue-300 text-white rounded-full shadow hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="absolute top-12 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            Add Calamity
                        </span>
                    </button>

                    {/* Remove Calamity */}
                    <button
                        onClick={removeCalamity}
                        className="group relative flex items-center justify-center w-8 h-8 bg-red-300 text-white rounded-full shadow hover:bg-red-700 transition"
                    >
                        <Minus className="w-4 h-4" />
                        <span className="absolute top-12 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            Remove Calamity
                        </span>
                    </button>
                </div>

                <CalamityTable
                    calamities={craData.calamities || []}
                    updateCell={updateCell}
                />
            </Accordion>
        </div>
    );
}
