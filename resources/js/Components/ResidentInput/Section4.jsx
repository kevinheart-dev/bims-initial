import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const Section4 = ({ data, setData, errors }) => {
    const addDisability = () => {
        setData("disabilities", [...(data.disabilities || []), {}]);
    };

    const removeDisability = (disAbIndex) => {
        const updated = [...(data.disabilities || [])];
        updated.splice(disAbIndex, 1);
        setData("disabilities", updated);
    };
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mt-10 mb-1">
                Medical Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Please record the resident's medical and health information.
                This includes weight, height, BMI, nutrition status, emergency
                contacts, blood type, and lifestyle habits.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
                <div>
                    <InputField
                        label="Weight (KG)"
                        name="weight_kg"
                        value={data.weight_kg || ""}
                        onChange={(e) => setData("weight_kg", e.target.value)}
                        placeholder="Enter weight in kg"
                        type="number"
                        step="0.01"
                    />
                    <InputError message={errors.weight_kg} className="mt-1" />
                </div>

                <div>
                    <InputField
                        label="Height (CM)"
                        name="height_cm"
                        value={data.height_cm || ""}
                        onChange={(e) => setData("height_cm", e.target.value)}
                        placeholder="Enter height in cm"
                        type="number"
                        step="0.01"
                    />
                    <InputError message={errors.height_cm} className="mt-1" />
                </div>

                <div>
                    <InputField
                        label="BMI"
                        name="bmi"
                        placeholder="Calculated automatically"
                        value={data.bmi || ""}
                        disabled
                    />
                    <InputError
                        message={errors.nutrition_status}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputField
                        label="Nutrition Status"
                        name="nutrition_status"
                        value={data.nutrition_status || ""}
                        placeholder="Select status"
                        disabled
                    />
                    <InputError
                        message={errors.nutrition_status}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputField
                        label="Emergency Contact Number"
                        name="emergency_contact_number"
                        value={data.emergency_contact_number || ""}
                        onChange={(e) =>
                            setData("emergency_contact_number", e.target.value)
                        }
                        placeholder="09XXXXXXXXX"
                    />
                    <InputError
                        message={errors.emergency_contact_number}
                        className="mt-1"
                    />
                </div>

                <div>
                    <InputField
                        label="Emergency Contact Name"
                        name="emergency_contact_name"
                        value={data.emergency_contact_name || ""}
                        onChange={(e) =>
                            setData("emergency_contact_name", e.target.value)
                        }
                        placeholder="Enter contact name"
                    />
                    <InputError
                        message={errors.emergency_contact_name}
                        className="mt-1"
                    />
                </div>

                <div>
                    <DropdownInputField
                        label="Relationship"
                        name="emergency_contact_relationship"
                        value={data.emergency_contact_relationship || ""}
                        onChange={(e) =>
                            setData(
                                "emergency_contact_relationship",
                                e.target.value
                            )
                        }
                        placeholder="Select relationship"
                        items={[
                            "Mother",
                            "Father",
                            "Sibling",
                            "Grandparent",
                            "Relative",
                            "Neighbor",
                            "Friend",
                            "Guardian",
                            "Other",
                        ]}
                    />
                    <InputError
                        message={errors.emergency_contact_relationship}
                        className="mt-1"
                    />
                </div>

                <div>
                    <DropdownInputField
                        label="Blood Type"
                        name="blood_type"
                        value={data.blood_type || ""}
                        onChange={(e) => setData("blood_type", e.target.value)}
                        placeholder="Select blood type"
                        items={[
                            { label: "A+", value: "A+" },
                            { label: "A-", value: "A-" },
                            { label: "B+", value: "B+" },
                            { label: "B-", value: "B-" },
                            { label: "AB+", value: "AB+" },
                            { label: "O+", value: "O+" },
                            { label: "O-", value: "O-" },
                        ]}
                    />
                    <InputError message={errors.blood_type} className="mt-1" />
                </div>

                <div>
                    <RadioGroup
                        label="PhilHealth"
                        name="has_philhealth"
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        selectedValue={data.has_philhealth || ""}
                        onChange={(e) =>
                            setData("has_philhealth", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.has_philhealth}
                        className="mt-1"
                    />
                </div>

                <div>
                    <RadioGroup
                        label="Consume Alcohol"
                        name="is_alcohol_user"
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        selectedValue={data.is_alcohol_user || ""}
                        onChange={(e) =>
                            setData("is_alcohol_user", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.is_alcohol_user}
                        className="mt-1"
                    />
                </div>

                <div>
                    <RadioGroup
                        label="Smoker"
                        name="is_smoker"
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        selectedValue={data.is_smoker || ""}
                        onChange={(e) => setData("is_smoker", e.target.value)}
                    />
                    <InputError message={errors.is_smoker} className="mt-1" />
                </div>

                <div>
                    <RadioGroup
                        label="Person with Disability (PWD)"
                        name="is_pwd"
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        selectedValue={data.is_pwd || ""}
                        onChange={(e) => setData("is_pwd", e.target.value)}
                    />
                    <InputError message={errors.is_pwd} className="mt-1" />
                </div>

                {data.has_philhealth == 1 && (
                    <div className="md:col-span-2">
                        <InputField
                            label="PhilHealth ID Number"
                            name="philhealth_id_number"
                            value={data.philhealth_id_number || ""}
                            onChange={(e) =>
                                setData("philhealth_id_number", e.target.value)
                            }
                            placeholder="Enter PhilHealth ID number"
                        />
                        <InputError
                            message={errors.philhealth_id_number}
                            className="mt-1"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 mt-5">
                {data.is_pwd == 1 && (
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* PWD ID input */}
                        <div className="flex-1 min-w-[200px]">
                            <InputField
                                label="PWD ID Number"
                                name="pwd_id_number"
                                value={data.pwd_id_number || ""}
                                onChange={(e) =>
                                    setData("pwd_id_number", e.target.value)
                                }
                                placeholder="PWD-XXX-XXXXXXX"
                            />
                            <InputError
                                message={errors.pwd_id_number}
                                className="mt-1"
                            />
                        </div>

                        {/* Disability Types */}
                        <div className="flex-1 min-w-[250px]">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Disability Type(s)
                            </label>

                            <div className="flex flex-wrap gap-3">
                                {(data.disabilities || []).map(
                                    (disability, disIndex) => (
                                        <div
                                            key={disIndex}
                                            className="flex items-center gap-2"
                                        >
                                            <InputField
                                                type="text"
                                                name={`disability_type`}
                                                value={
                                                    disability.disability_type ||
                                                    ""
                                                }
                                                onChange={(e) => {
                                                    const updated = [
                                                        ...(data.disabilities ||
                                                            []),
                                                    ];
                                                    updated[disIndex] = {
                                                        ...updated[disIndex],
                                                        disability_type:
                                                            e.target.value,
                                                    };
                                                    setData(
                                                        "disabilities",
                                                        updated
                                                    );
                                                }}
                                                placeholder="Enter disability type"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDisability(disIndex)
                                                }
                                                className="text-red-400 hover:text-red-600 text-xl"
                                            >
                                                <IoIosCloseCircleOutline />
                                            </button>
                                        </div>
                                    )
                                )}

                                {/* Add disability button */}
                                <button
                                    type="button"
                                    onClick={() => addDisability()}
                                    className="text-blue-500 hover:text-blue-700 text-2xl"
                                >
                                    <IoIosAddCircleOutline />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Section4;
