import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import DropdownInputField from "./DropdownInputField";
import InputError from "./InputError";
import InputLabel from "./InputLabel";
import { Textarea } from "./ui/textarea";

export const ParticipantSection = ({
    title,
    dataArray,
    setDataArray,
    errors,
    residentsList,
    fieldKey = "resident_id",
    notesKey = "notes",
}) => {
    // Update selected resident
    const handleResidentArrayChange = (residentId, index) => {
        const resident = residentsList.find(
            (r) => Number(r.value) === Number(residentId)
        );

        const updated = [...dataArray];
        if (!resident) {
            updated[index] = {
                ...updated[index],
                [fieldKey]: "",
                resident_name: "",
            };
        } else {
            updated[index] = {
                ...updated[index],
                [fieldKey]: resident.value,
                resident_name: resident.label,
                purok_number: resident.purok_number,
                birthdate: resident.birthdate,
                resident_image: resident.resident_picture_path,
                gender: resident.sex,
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
                    <DropdownInputField
                        label={title.slice(0, -1)}
                        name={`${title.toLowerCase()}.${index}.${fieldKey}`}
                        value={item.resident_name || ""}
                        placeholder="Select a resident"
                        onChange={(e) =>
                            handleResidentArrayChange(e.target.value, index)
                        }
                        items={residentsList}
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
                        <div className="mt-3 rounded-lg border bg-white shadow-sm p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                {title.slice(0, -1)} Details
                            </h4>
                            <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">
                                <div className="flex flex-col items-center">
                                    <InputLabel
                                        htmlFor={`${title}_${index}_image`}
                                        value="Profile Photo"
                                    />
                                    <img
                                        src={
                                            item.resident_image
                                                ? `/storage/${item.resident_image}`
                                                : "/images/default-avatar.jpg"
                                        }
                                        alt="Resident"
                                        className="w-24 h-24 object-cover rounded-full border border-gray-200 mt-2"
                                    />
                                </div>
                                <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                                    <div>
                                        <span className="font-medium">
                                            Name:
                                        </span>{" "}
                                        {item.resident_name}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Purok:
                                        </span>{" "}
                                        {item.purok_number}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Birthdate:
                                        </span>{" "}
                                        {item.birthdate}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Gender:
                                        </span>{" "}
                                        {item.gender}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Contact:
                                        </span>{" "}
                                        {item.contact_number}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium">
                                            Email:
                                        </span>{" "}
                                        {item.email}
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

                    {dataArray.length > 1 && (
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

            <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
                <IoIosAddCircleOutline className="text-2xl" />
                <span>Add {title.slice(0, -1)}</span>
            </button>
        </div>
    );
};
