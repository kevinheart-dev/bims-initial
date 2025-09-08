import React, { useContext, useState, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";
import InputField from "../InputField";
import {
    IoIosArrowDown,
    IoIosArrowUp,
    IoIosAddCircleOutline,
    IoIosCloseCircleOutline,
} from "react-icons/io";

function MedicalInfo() {
    const { userData, setUserData, errors } = useContext(StepperContext);
    const families = userData.household?.families || [];

    // open states
    const [openFamilyIndex, setOpenFamilyIndex] = useState(null);
    const [openMemberIndex, setOpenMemberIndex] = useState({});

    /** 🔹 Utility function to update nested household structure */
    const updateHousehold = (updatedFamilies) => {
        setUserData((prev) => ({
            ...prev,
            household: { ...prev.household, families: updatedFamilies },
        }));
    };

    /** 🔹 BMI calculator */
    const calculateBMIAndStatus = (weightKg, heightCm, age, gender) => {
        if (!weightKg || !heightCm || age == null)
            return { bmi: null, status: "" };

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        let status = "";

        if (age >= 20) {
            // WHO adult BMI cutoffs
            if (bmi < 18.5) status = BMI_STATUS.underweight;
            else if (bmi <= 24.9) status = BMI_STATUS.normal;
            else if (bmi <= 29.9) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        } else if (age >= 5) {
            // School-aged children & adolescents
            if (bmi < 15) status = BMI_STATUS.severely_underweight;
            else if (bmi < 19) status = BMI_STATUS.normal;
            else if (bmi < 23) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        } else {
            // Under 5 years old (Barangay Health Worker focus)
            if (bmi < 13) status = BMI_STATUS.severely_underweight;
            else if (bmi < 14) status = BMI_STATUS.underweight;
            else if (bmi <= 18) status = BMI_STATUS.normal;
            else if (bmi <= 20) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        }

        return { bmi: parseFloat(bmi.toFixed(2)), status };
    };

    /** 🔹 Handle medical field changes (including text fields like PWD ID) */
    const handleMedicalChange = (familyIndex, memberIndex, e) => {
        const { name, value, type } = e.target;
        const updatedFamilies = [...families];
        const member = updatedFamilies[familyIndex].members[memberIndex];

        // ✅ Allow both number and text fields
        if (type === "number") {
            member[name] = value === "" ? "" : parseFloat(value);
        } else {
            member[name] = value;
        }

        // ✅ Recalculate BMI only if weight, height, age, gender are provided
        const { weight_kg, height_cm, age, gender } = member;
        if (weight_kg && height_cm && age && gender) {
            const { bmi, status } = calculateBMIAndStatus(
                weight_kg,
                height_cm,
                age,
                gender
            );
            member.bmi = bmi;
            member.nutrition_status = status;
        }

        updateHousehold(updatedFamilies);
    };

    /** 🔹 Disability handling */
    const addDisability = (familyIndex, memberIndex) => {
        const updatedFamilies = [...families];
        const member = updatedFamilies[familyIndex].members[memberIndex];
        const disabilities = [...(member.disabilities || [])];
        disabilities.push({ disability_type: "" });
        member.disabilities = disabilities;
        updateHousehold(updatedFamilies);
    };

    const removeDisability = (familyIndex, memberIndex, disabilityIndex) => {
        const updatedFamilies = [...families];
        const member = updatedFamilies[familyIndex].members[memberIndex];
        const disabilities = [...(member.disabilities || [])];
        disabilities.splice(disabilityIndex, 1);
        member.disabilities = disabilities;
        updateHousehold(updatedFamilies);
    };

    const handleDisabilityChange = (
        familyIndex,
        memberIndex,
        disabilityIndex,
        e
    ) => {
        const { name, value } = e.target;
        const updatedFamilies = [...families];
        const member = updatedFamilies[familyIndex].members[memberIndex];
        const disabilities = [...(member.disabilities || [])];

        disabilities[disabilityIndex] = {
            ...disabilities[disabilityIndex],
            [name]: value,
        };

        member.disabilities = disabilities;
        updateHousehold(updatedFamilies);
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Medical Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Kindly share your medical history and health-related details.
            </p>

            {families.map((family, fIndex) => (
                <div
                    key={fIndex}
                    className="mb-4 border rounded shadow-sm bg-white"
                >
                    {/* 🔹 Family Accordion */}
                    <button
                        type="button"
                        className={`w-full text-left p-4 font-semibold flex justify-between items-center
                            ${
                                openFamilyIndex === fIndex
                                    ? "border-t-2 border-blue-600 text-gray-900"
                                    : "text-gray-700 hover:bg-sky-100"
                            }
                            transition duration-300 ease-in-out`}
                        onClick={() =>
                            setOpenFamilyIndex(
                                openFamilyIndex === fIndex ? null : fIndex
                            )
                        }
                    >
                        <span>
                            {family.family_name
                                ? `${family.family_name} Family`
                                : `Family ${fIndex + 1}`}
                        </span>

                        {openFamilyIndex === fIndex ? (
                            <IoIosArrowUp className="text-xl text-blue-600" />
                        ) : (
                            <IoIosArrowDown className="text-xl text-blue-600" />
                        )}
                    </button>

                    {openFamilyIndex === fIndex && (
                        <div className="my-4 space-y-4 mx-4">
                            {(family.members || []).map((member, mIndex) => {
                                const isOpen =
                                    openMemberIndex[fIndex] === mIndex;
                                const displayName = `${
                                    member.firstname || ""
                                } ${member.lastname || ""}`.trim();

                                return (
                                    <div
                                        key={mIndex}
                                        className="mt-3 border rounded bg-white"
                                    >
                                        <button
                                            type="button"
                                            className={`w-full text-left p-4 font-semibold flex justify-between items-center
                                                ${
                                                    isOpen
                                                        ? "border-t-2 border-blue-600 text-gray-900"
                                                        : "text-gray-700 hover:bg-sky-100"
                                                }
                                                transition duration-300 ease-in-out`}
                                            onClick={() =>
                                                setOpenMemberIndex((prev) => ({
                                                    ...prev,
                                                    [fIndex]:
                                                        prev[fIndex] === mIndex
                                                            ? null
                                                            : mIndex,
                                                }))
                                            }
                                        >
                                            <span>
                                                {displayName ||
                                                    `Member ${mIndex + 1}`}
                                            </span>
                                            {isOpen ? (
                                                <IoIosArrowUp className="text-xl text-blue-600" />
                                            ) : (
                                                <IoIosArrowDown className="text-xl text-blue-600" />
                                            )}
                                        </button>

                                        {isOpen && (
                                            <div className="p-4 space-y-4">
                                                <div className="grid md:grid-cols-4 gap-4">
                                                    {/* Weight */}
                                                    <div>
                                                        <InputField
                                                            label="Weight in Kilogram (kg)"
                                                            name="weight_kg"
                                                            value={
                                                                member.weight_kg ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Enter weight in kg"
                                                            type="number"
                                                            step="0.01"
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.weight_kg`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.weight_kg`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Height */}
                                                    <div>
                                                        <InputField
                                                            label="Height in Centimeter (cm)"
                                                            name="height_cm"
                                                            value={
                                                                member.height_cm ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Enter height in cm"
                                                            type="number"
                                                            step="0.01"
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.height_cm`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.height_cm`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* BMI */}
                                                    <div>
                                                        <InputField
                                                            label="BMI"
                                                            name="bmi"
                                                            value={
                                                                member.bmi || ""
                                                            }
                                                            placeholder="Auto-calculated BMI"
                                                            disabled
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.bmi`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.bmi`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Nutrition Status */}
                                                    <div>
                                                        <InputField
                                                            label="Nutrition Status"
                                                            name="nutrition_status"
                                                            value={
                                                                member.nutrition_status ||
                                                                ""
                                                            }
                                                            placeholder="Automatically determined"
                                                            disabled
                                                            required
                                                        />
                                                    </div>

                                                    {/* Emergency Contact Number */}
                                                    <div>
                                                        <InputField
                                                            label="Emergency contact number"
                                                            name="emergency_contact_number"
                                                            value={
                                                                member.emergency_contact_number ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="09XXXXXXXXX"
                                                            type="text"
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.emergency_contact_number`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.emergency_contact_number`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Emergency Contact Name */}
                                                    <div>
                                                        <InputField
                                                            label="Emergency contact name"
                                                            name="emergency_contact_name"
                                                            value={
                                                                member.emergency_contact_name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Enter contact name"
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.emergency_contact_name`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.emergency_contact_name`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Emergency Contact Relationship */}
                                                    <div>
                                                        <DropdownInputField
                                                            label="Emergency Contact Relationship"
                                                            name="emergency_contact_relationship"
                                                            value={
                                                                member.emergency_contact_relationship ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
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
                                                            ]}
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.emergency_contact_relationship`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.emergency_contact_relationship`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Blood Type */}
                                                    <div>
                                                        <DropdownInputField
                                                            label="Blood Type"
                                                            name="blood_type"
                                                            value={
                                                                member.blood_type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Select blood type"
                                                            items={[
                                                                "A+",
                                                                "A-",
                                                                "B+",
                                                                "B-",
                                                                "AB+",
                                                                "AB-",
                                                                "O+",
                                                                "O-",
                                                            ]}
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.blood_type`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.blood_type`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* PhilHealth */}
                                                    <div>
                                                        <RadioGroup
                                                            label="Are you a PhilHealth member?"
                                                            name="has_philhealth"
                                                            options={[
                                                                {
                                                                    label: "Yes",
                                                                    value: 1,
                                                                },
                                                                {
                                                                    label: "No",
                                                                    value: 0,
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                member.has_philhealth ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.has_philhealth`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.has_philhealth`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {member.has_philhealth ==
                                                        1 && (
                                                        <div>
                                                            <InputField
                                                                label="PhilHealth ID number"
                                                                name="philhealth_id_number"
                                                                value={
                                                                    member.philhealth_id_number ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleMedicalChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="Enter PhilHealth id number"
                                                            />
                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.philhealth_id_number`
                                                            ] && (
                                                                <p className="text-red-500 text-xs">
                                                                    {
                                                                        errors[
                                                                            `families.${fIndex}.members.${mIndex}.philhealth_id_number`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Alcohol */}
                                                    <div>
                                                        <RadioGroup
                                                            label="Do you consume alcohol?"
                                                            name="is_alcohol_user"
                                                            options={[
                                                                {
                                                                    label: "Yes",
                                                                    value: 1,
                                                                },
                                                                {
                                                                    label: "No",
                                                                    value: 0,
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                member.is_alcohol_user ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.is_alcohol_user`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.is_alcohol_user`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Smoker */}
                                                    <div>
                                                        <RadioGroup
                                                            label="Do you smoke?"
                                                            name="is_smoker"
                                                            options={[
                                                                {
                                                                    label: "Yes",
                                                                    value: 1,
                                                                },
                                                                {
                                                                    label: "No",
                                                                    value: 0,
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                member.is_smoker ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.is_smoker`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.is_smoker`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* PWD */}
                                                    <div>
                                                        <RadioGroup
                                                            label="Do you have a disability?"
                                                            name="is_pwd"
                                                            options={[
                                                                {
                                                                    label: "Yes",
                                                                    value: 1,
                                                                },
                                                                {
                                                                    label: "No",
                                                                    value: 0,
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                member.is_pwd ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleMedicalChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    e
                                                                )
                                                            }
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.is_pwd`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `families.${fIndex}.members.${mIndex}.is_pwd`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-x-6 items-start">
                                                    {member.is_pwd == 1 && (
                                                        <div className="flex flex-col gap-4 mt-2">
                                                            <InputField
                                                                label="PWD ID number"
                                                                name="pwd_id_number"
                                                                value={
                                                                    member.pwd_id_number ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleMedicalChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="PWD-XXX-XXXXXXX"
                                                            />

                                                            {/* Disability Types */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                                    Disability
                                                                    type(s)
                                                                </label>

                                                                <div className="flex flex-wrap items-center gap-4">
                                                                    {(
                                                                        member.disabilities ||
                                                                        []
                                                                    ).map(
                                                                        (
                                                                            disability,
                                                                            disIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    disIndex
                                                                                }
                                                                                className="flex items-center gap-2 bg-gray-50 p-2 rounded-md shadow-sm"
                                                                            >
                                                                                <div>
                                                                                    <InputField
                                                                                        type="text"
                                                                                        name="disability_type"
                                                                                        value={
                                                                                            disability.disability_type ||
                                                                                            ""
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleDisabilityChange(
                                                                                                fIndex,
                                                                                                mIndex,
                                                                                                disIndex,
                                                                                                e
                                                                                            )
                                                                                        }
                                                                                        placeholder="Enter disability type"
                                                                                    />
                                                                                    {errors?.[
                                                                                        `families.${fIndex}.members.${mIndex}.disabilities.${disIndex}.disability_type`
                                                                                    ] && (
                                                                                        <p className="text-red-500 text-xs">
                                                                                            {
                                                                                                errors[
                                                                                                    `families.${fIndex}.members.${mIndex}.disabilities.${disIndex}.disability_type`
                                                                                                ]
                                                                                            }
                                                                                        </p>
                                                                                    )}
                                                                                </div>

                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        removeDisability(
                                                                                            fIndex,
                                                                                            mIndex,
                                                                                            disIndex
                                                                                        )
                                                                                    }
                                                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                                                    title="Remove"
                                                                                >
                                                                                    <IoIosCloseCircleOutline />
                                                                                </button>
                                                                            </div>
                                                                        )
                                                                    )}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            addDisability(
                                                                                fIndex,
                                                                                mIndex
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-800 text-2xl"
                                                                        title="Add disability"
                                                                    >
                                                                        <IoIosAddCircleOutline />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MedicalInfo;
