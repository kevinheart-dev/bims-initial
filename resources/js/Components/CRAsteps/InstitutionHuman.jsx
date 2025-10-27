import { useContext, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import toast from "react-hot-toast";
import Accordion from "../Accordion";
import { toTitleCase } from '@/utils/stringFormat';

const createRow = (type) => ({
    type,
    male_no_dis: "",
    male_dis: "",
    female_no_dis: "",
    female_dis: "",
    lgbtq_no_dis: "",
    lgbtq_dis: "",
});

const defaultInstitutions = [
    {
        name: "",
        male: "",
        female: "",
        lgbtq: "",
        head: "",
        contact: "",
        registered: "YES",
        programs: "",
    },
];


const defaultHumanResources = [
    {
        category: "Medical Personnel/Professionals",
        rows: [
            "Barangay Health Worker",
            "Barangay Nutrition Scholar",
            "Doctor",
            "Nurse",
            "Midwife",
            "Dentist",
            "Medical Technologist",
        ].map(createRow),
    },
    {
        category: "Other Professionals",
        rows: ["Fireman/Firewoman", "Teacher", "Social Worker"].map(createRow),
    },
    {
        category: "Laborers",
        rows: [
            "Carpenter",
            "Mason",
            "Electrician",
            "Engineer",
            "Technician",
            "Painter",
            "Plumber",
            "Crane Operator",
            "Truck Driver",
        ].map(createRow),
    },
];

const fields = ["male_no_dis", "male_dis", "female_no_dis", "female_dis", "lgbtq_no_dis", "lgbtq_dis"];
const sumRow = (row) => fields.reduce((acc, f) => acc + (Number(row[f]) || 0), 0);
const sumColumn = (rows, field) => rows.reduce((acc, r) => acc + (Number(r[field]) || 0), 0);
const sumGrand = (rows) => rows.reduce((acc, r) => acc + sumRow(r), 0);

function HumanResourcesTable({ category, catIdx, updateCategoryName, updateRow, removeRow, addRow, removeCategory }) {
    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm mb-4 bg-white">
            <div className="px-2 py-1 font-semibold flex items-center justify-between">
                <input
                    type="text"
                    className="w-[300px] p-1 text-lg font-semibold border rounded m-2"
                    value={category.category}
                    onChange={(e) => updateCategoryName(catIdx, toTitleCase(e.target.value))}
                    placeholder="Enter category name"
                />
                <button
                    className="ml-2 text-red-600 hover:text-red-800 font-bold"
                    onClick={() => removeCategory(catIdx)}
                >
                    ✕
                </button>
            </div>
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th rowSpan="3" className="border px-2 py-1 w-[250px]">HUMAN RESOURCES</th>
                        <th colSpan="6" className="border px-2 py-1 text-center">NUMBER</th>
                        <th rowSpan="3" className="border px-2 py-1">Total</th>
                        <th rowSpan="3" className="border px-2 py-1 w-[40px]"></th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="border px-2 py-1 text-center">Male</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">Female</th>
                        <th colSpan="2" className="border px-2 py-1 text-center">LGBTQ+</th>
                    </tr>
                    <tr>
                        {["Without Disability", "With Disability", "Without Disability", "With Disability", "Without Disability", "With Disability"]
                            .map((label, i) => <th key={i} className="border px-2 py-1">{label}</th>)}
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
                                    onChange={(e) => updateRow(catIdx, rowIdx, "type", e.target.value)}
                                />
                            </td>
                            {fields.map((field) => (
                                <td key={field} className="border px-2 py-1">
                                    <input
                                        type="number"
                                        className="w-full border p-1 text-center"
                                        value={row[field] ?? ""}
                                        onChange={(e) => updateRow(catIdx, rowIdx, field, e.target.value)}
                                    />
                                </td>
                            ))}
                            <td className="border px-2 py-1 text-center font-semibold bg-gray-50">{sumRow(row)}</td>
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
                <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                        <td className="border px-2 py-1 text-center">Total</td>
                        {fields.map((f) => (
                            <td key={f} className="border px-2 py-1 text-center">{sumColumn(category.rows, f)}</td>
                        ))}
                        <td className="border px-2 py-1 text-center">{sumGrand(category.rows)}</td>
                        <td className="border"></td>
                    </tr>
                </tfoot>
            </table>
            <div className="p-2 m-auto">
                <button
                    onClick={() => addRow(catIdx)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm mt-3"
                >
                    <span className="text-sm font-bold">+</span> Add new row
                </button>
            </div>
        </div>
    );
}

function InstitutionsTable({ institutions, instIdx, updateField, removeInstitution, addInstitution }) {
    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm mb-4">
            <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1 w-[250px]" rowSpan="2">NAME OF INSTITUTION/ SECTOR/ GROUP</th>
                        <th colSpan="3" className="border px-2 py-1 text-center">NUMBER OF MEMBERS</th>
                        <th className="border px-2 py-1" rowSpan="2">NAME OF HEAD</th>
                        <th className="border px-2 py-1" rowSpan="2">CONTACT NO.</th>
                        <th className="border px-2 py-1" rowSpan="2">STATUS (REGISTERED OR NOT)</th>
                        <th className="border px-2 py-1" rowSpan="2">PROGRAMS/ SERVICES</th>
                    </tr>
                    <tr>
                        <th className="border px-2 py-1 text-center">MALE</th>
                        <th className="border px-2 py-1 text-center">FEMALE</th>
                        <th className="border px-2 py-1 text-center">LGBTQ</th>
                    </tr>
                </thead>

                <tbody>
                    {institutions.map((inst, idx) => (
                        <tr key={idx}>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={inst.name}
                                    onChange={(e) => updateField(instIdx, idx, "name", e.target.value)}
                                />
                            </td>
                            {["male", "female", "lgbtq"].map((field) => (
                                <td key={field} className="border px-2 py-1">
                                    <input
                                        type="number"
                                        className="w-full border p-1 text-center"
                                        value={inst[field]}
                                        onChange={(e) => updateField(instIdx, idx, field, e.target.value)}
                                    />
                                </td>
                            ))}
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={inst.head}
                                    onChange={(e) => updateField(instIdx, idx, "head", e.target.value)}
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={inst.contact}
                                    onChange={(e) => updateField(instIdx, idx, "contact", e.target.value)}
                                />
                            </td>
                            <td className="border px-2 py-1">
                                <select
                                    className="w-full border p-1"
                                    value={inst.registered}
                                    onChange={(e) => updateField(instIdx, idx, "registered", e.target.value)}
                                >
                                    <option value="YES">YES</option>
                                    <option value="NO">NO</option>
                                </select>
                            </td>
                            <td className="border px-2 py-1">
                                <input
                                    type="text"
                                    className="w-full border p-1"
                                    value={inst.programs}
                                    onChange={(e) => updateField(instIdx, idx, "programs", e.target.value)}
                                />
                            </td>
                            <td className="px-2 py-1 text-center !border-0">
                                <button
                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 hover:bg-gray-200"
                                    onClick={() => removeInstitution(instIdx, idx)}
                                >
                                    ✕
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="p-2 mt-auto">
                <button
                    onClick={() => addInstitution(instIdx)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-blue-500 text-blue-600 rounded-md hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm mt-3"
                >
                    <span className="text-sm font-bold">+</span> Add new row
                </button>
            </div>
        </div>
    );
}


const InstitutionHuman = () => {
    const { craData, setCraData } = useContext(StepperContext);

    useEffect(() => {
        if (!craData.human_resources) {
            setCraData((prev) => ({ ...prev, human_resources: defaultHumanResources }));
        }
    }, [craData, setCraData]);

    const updateCategoryName = (catIdx, val) => {
        const updated = [...craData.human_resources];
        updated[catIdx].category = val;
        setCraData((prev) => ({ ...prev, human_resources: updated }));
    };

    const updateRow = (catIdx, rowIdx, field, val) => {
        const updated = [...craData.human_resources];
        updated[catIdx].rows[rowIdx][field] = field === "type" ? val : (val === "" ? "" : Number(val));
        setCraData((prev) => ({ ...prev, human_resources: updated }));
    };

    const addRow = (catIdx) => {
        const updated = [...craData.human_resources];
        updated[catIdx].rows.push({ type: "", ...Object.fromEntries(fields.map(f => [f, ""])) });
        setCraData((prev) => ({ ...prev, human_resources: updated }));
        toast.success("Row added!");
    };

    const removeRow = (catIdx, rowIdx) => {
        const updated = [...craData.human_resources];
        const removed = updated[catIdx].rows[rowIdx]?.type || "Row";
        updated[catIdx].rows.splice(rowIdx, 1);
        setCraData((prev) => ({ ...prev, human_resources: updated }));
        toast.error(`${removed} removed!`);
    };

    const addCategory = () => {
        const updated = [...craData.human_resources];
        updated.push({
            category: "", // editable empty name
            rows: [{ type: "", ...Object.fromEntries(fields.map(f => [f, ""])) }],
        });
        setCraData((prev) => ({ ...prev, human_resources: updated }));
        toast.success("New category added!");
    };
    const removeCategory = (catIdx) => {
        const updated = [...craData.human_resources];
        const removedCategory = updated[catIdx].category || "Category";
        updated.splice(catIdx, 1);
        setCraData((prev) => ({ ...prev, human_resources: updated }));
        toast.error(`${removedCategory} removed!`);
    };

    useEffect(() => {
        if (!craData.institutions) {
            setCraData((prev) => ({ ...prev, institutions: defaultInstitutions }));
        }
    }, [craData, setCraData]);

    const updateField = (instIdx, rowIdx, field, val) => {
        const updated = [...craData.institutions];
        updated[rowIdx][field] = field === "male" || field === "female" || field === "lgbtq" ? (val === "" ? "" : Number(val)) : val;
        setCraData((prev) => ({ ...prev, institutions: updated }));
    };

    const addInstitution = (instIdx) => {
        const updated = [...craData.institutions];
        updated.push({ ...defaultInstitutions[0] });
        setCraData((prev) => ({ ...prev, institutions: updated }));
        toast.success("Row added!");
    };

    const removeInstitution = (instIdx, rowIdx) => {
        const updated = [...craData.institutions];
        const removedName = updated[rowIdx]?.name || "Institution";
        updated.splice(rowIdx, 1);
        setCraData((prev) => ({ ...prev, institutions: updated }));
        toast.error(`${removedName} removed!`);
    };

    return (
        <div className="space-y-4">
            <Accordion title="F. Inventory of Institutions, Sectors, and other Volunteer Groups in the Barangay">
                <InstitutionsTable
                    institutions={craData.institutions || []}
                    instIdx={0}
                    updateField={updateField}
                    removeInstitution={removeInstitution}
                    addInstitution={addInstitution}
                />
            </Accordion>


            <Accordion title="G. Inventory of Human Resources">
                <div className="mb-10 border-2 border-purple-300 rounded-xl p-5 bg-purple-50 shadow-sm">
                    {(craData.human_resources || []).map((cat, i) => (
                        <HumanResourcesTable
                            key={i}
                            category={cat}
                            catIdx={i}
                            updateCategoryName={updateCategoryName}
                            updateRow={updateRow}
                            removeRow={removeRow}
                            addRow={addRow}
                            removeCategory={removeCategory}
                        />
                    ))}
                </div>

                <div className="p-2 m-auto">
                    <button
                        onClick={addCategory}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200 shadow-sm mt-3"
                    >
                        <span className="text-sm font-bold">+</span> Add new category
                    </button>
                </div>
            </Accordion>
        </div>
    );
};

export default InstitutionHuman;
