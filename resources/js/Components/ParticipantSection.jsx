import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import DropdownInputField from "./DropdownInputField";
import { PlusCircle } from "lucide-react";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { Textarea } from "./ui/textarea";
import { RESIDENT_GENDER_TEXT2 } from "@/constants";

export const ParticipantSection = ({
    title,
    dataArray,
    setDataArray,
    errors,
    residentsList,
    fieldKey = "resident_id",
    notesKey = "notes",
    disableAdd = false,
}) => {
    const handleResidentArrayChange = (value, index) => {
        const resident = residentsList.find(
            (r) => Number(r.value) === Number(value)
        );
        const updated = [...dataArray];

        if (!resident) {
            updated[index] = {
                ...updated[index],
                [fieldKey]: "",
                resident_name: value,
            };
        } else {
            updated[index] = {
                ...updated[index],
                [fieldKey]: resident.value,
                resident_name: resident.label,
                purok_number: resident.purok_number,
                birthdate: resident.birthdate,
                resident_image: resident.resident_picture_path,
                sex: resident.sex,
                contact_number: resident.contact_number,
                email: resident.email,
            };
        }

        setDataArray(updated);
    };

    // Update notes
    const handleNotesChange = (value, index) => {
        const updated = [...dataArray];
        updated[index] = { ...updated[index], [notesKey]: value };
        setDataArray(updated);
    };

    // Add a new participant
    const addItem = () => {
        setDataArray([...dataArray, { [fieldKey]: null, [notesKey]: "" }]);
    };

    // Remove a participant
    const removeItem = (index) => {
        setDataArray(dataArray.filter((_, i) => i !== index));
    };

    return (
        <div className="mb-6">
            {/* <pre>{JSON.stringify(dataArray, undefined, 2)}</pre> */}
            <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">
                Select participants involved. You may choose from existing
                residents or enter names manually.
            </p>

            {dataArray.map((item, index) => (
                <div
                    key={index}
                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                >
                    <label className="block text-sm font-medium text-gray-700">
                        {title.slice(0, -1)}
                    </label>

                    <DropdownInputField
                        name={`resident_name_${index}`}
                        value={item.resident_name || ""}
                        onChange={(e) =>
                            handleResidentArrayChange(e.target.value, index)
                        }
                        placeholder="Select or type a name"
                        items={residentsList} // expects [{ value, label }]
                        required={false} // set true if needed
                    />

                    <InputError
                        message={
                            errors?.[
                                `${title.toLowerCase()}.${index}.${fieldKey}`
                            ]
                        }
                        className="mt-2"
                    />

                    {item.resident_name && (
                        <div className="mt-3 rounded-lg border border-gray-200 bg-white shadow-sm p-4">
                            <h4 className="text-base font-semibold text-gray-800 mb-4 border-b pb-2">
                                {title.slice(0, -1)} Details
                            </h4>
                            <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
                                {/* Profile */}
                                <div className="flex flex-col items-center">
                                    <img
                                        src={
                                            item.resident_image
                                                ? `/storage/${item.resident_image}`
                                                : "/images/default-avatar.jpg"
                                        }
                                        alt="Resident"
                                        className="w-24 h-24 object-cover rounded-full border border-gray-300 shadow-sm"
                                    />
                                    <p className="mt-2 font-medium text-gray-800">
                                        {item.resident_name}
                                    </p>
                                </div>

                                {/* Info */}
                                <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <span className="font-medium">
                                            Purok:
                                        </span>{" "}
                                        {item.purok_number || "—"}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Birthdate:
                                        </span>{" "}
                                        {item.birthdate
                                            ? new Date(
                                                  item.birthdate
                                              ).toLocaleDateString("en-US", {
                                                  month: "long",
                                                  day: "numeric",
                                                  year: "numeric",
                                              })
                                            : "—"}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Sex:
                                        </span>{" "}
                                        {RESIDENT_GENDER_TEXT2[item.sex] || "—"}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Contact:
                                        </span>{" "}
                                        {item.contact_number || "—"}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium">
                                            Email:
                                        </span>{" "}
                                        {item.email || "—"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <InputLabel value="Notes" />
                        <Textarea
                            name={`${title.toLowerCase()}.${index}.${notesKey}`}
                            value={item[notesKey] || ""}
                            onChange={(e) =>
                                handleNotesChange(e.target.value, index)
                            }
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                            rows="3"
                            placeholder={`Notes for the ${title.slice(
                                0,
                                -1
                            )}...`}
                        />
                        <InputError
                            message={
                                errors?.[
                                    `${title.toLowerCase()}.${index}.${notesKey}`
                                ]
                            }
                            className="mt-1"
                        />
                    </div>

                    {(title !== "Complainants" || dataArray.length > 1) && (
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute top-1 right-2 text-sm text-red-500 hover:text-red-800"
                        >
                            <IoIosCloseCircleOutline className="text-2xl" />
                        </button>
                    )}
                </div>
            ))}
            {!disableAdd && (
                <button
                    type="button"
                    onClick={addItem}
                    className="text-blue-500 hover:text-blue-700 flex items-center gap-1 transition duration-150 font-medium p-1 rounded"
                >
                    <PlusCircle className="w-5 h-5" />

                    <span>Add {title.slice(0, -1)}</span>
                </button>
            )}
        </div>
    );
};
