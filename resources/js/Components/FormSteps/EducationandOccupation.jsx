import React, { useContext, useState, useEffect } from "react";
import { StepperContext } from "@/context/StepperContext";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";
import InputField from "../InputField";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";
import SelectField from "../SelectField";
function EducationandOccupation({ occupationTypes }) {
    const { userData, setUserData, errors } = useContext(StepperContext);
    const members = userData.members || [];
    const [openIndex, setOpenIndex] = useState(null);

    const handleEducationChange = (memberIndex, educationIndex, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];

        const updatedEducations = [
            ...(updatedMembers[memberIndex].educations || []),
        ];

        const updatedEducation = {
            ...updatedEducations[educationIndex],
            [name]: value,
        };

        // // If year_ended or educational_status changes, handle year_graduated logic
        // if (name === "year_ended" || name === "educational_status") {
        //     if (updatedEducation.educational_status === "graduate") {
        //         updatedEducation.year_graduated = updatedEducation.year_ended || '';
        //     } else {
        //         updatedEducation.year_graduated = '';
        //     }
        // }

        updatedEducations[educationIndex] = updatedEducation;

        updatedMembers[memberIndex].educations = updatedEducations;

        setUserData((prev) => ({ ...prev, members: updatedMembers }));
    };

    const handleOccupationChange = (memberIndex, occupationIndex, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];
        const updatedOccupations = [
            ...(updatedMembers[memberIndex].occupations || []),
        ];
        const occupation = {
            ...updatedOccupations[occupationIndex],
            [name]: value,
        };

        const conversionFactors = {
            daily: 30,
            weekly: 4.33, // 52 weeks / 12 months ≈ 4.33 weeks per month
            "bi-weekly": 2.17, // 26 bi-weekly periods / 12 months ≈ 2.17
            monthly: 1, // Already monthly, no conversion needed
            annually: 1 / 12,
        };
        const income =
            name === "income"
                ? parseFloat(value)
                : parseFloat(occupation.income);
        const frequency = name === "frequency" ? value : occupation.frequency;

        if (!isNaN(income) && conversionFactors[frequency]) {
            occupation.monthly_income = (
                income * conversionFactors[frequency]
            ).toFixed(2);
        } else {
            occupation.monthly_income = "";
        }

        updatedOccupations[occupationIndex] = occupation;
        updatedMembers[memberIndex].occupations = updatedOccupations;

        setUserData((prev) => ({ ...prev, members: updatedMembers }));
    };

    const addEducation = (index) => {
        const updatedMembers = [...members];
        const educations = updatedMembers[index].educations || [];
        educations.push({});
        updatedMembers[index].educations = educations;
        setUserData((prev) => ({ ...prev, members: updatedMembers }));
    };

    const removeEducation = (memberIndex, educationIndex) => {
        const updatedMembers = [...members];
        const updatedEducations = [
            ...(updatedMembers[memberIndex].educations || []),
        ];

        updatedEducations.splice(educationIndex, 1);
        updatedMembers[memberIndex].educations = updatedEducations;

        setUserData((prev) => ({ ...prev, members: updatedMembers }));
        toast.success("Education removed.", {
            duration: 2000,
        });
    };

    const addOccupation = (index) => {
        const updatedMembers = [...members];
        const occupations = updatedMembers[index].occupations || [];

        occupations.push({});
        updatedMembers[index].occupations = occupations;

        setUserData((prev) => ({ ...prev, members: updatedMembers }));
    };

    const removeOccupation = (memberIndex, occupationIndex) => {
        const updatedMembers = [...members];
        const updatedOccupations = [
            ...(updatedMembers[memberIndex].occupations || []),
        ];

        updatedOccupations.splice(occupationIndex, 1);
        updatedMembers[memberIndex].occupations = updatedOccupations;

        setUserData((prev) => ({ ...prev, members: updatedMembers }));
        toast.success("Occupation removed.", { duration: 2000 });
    };

    useEffect(() => {
        const totalIncome = (userData.members || []).reduce((sum, member) => {
            const memberIncome = (member.occupations || []).reduce(
                (mSum, occ) => {
                    return mSum + (parseFloat(occ.monthly_income) || 0);
                },
                0
            );
            return sum + memberIncome;
        }, 0);

        const brackets = [
            { min: 0, max: 5000, key: "below_5000", category: "survival" },
            { min: 5001, max: 10000, key: "5001_10000", category: "poor" },
            {
                min: 10001,
                max: 20000,
                key: "10001_20000",
                category: "low_income",
            },
            {
                min: 20001,
                max: 40000,
                key: "20001_40000",
                category: "lower_middle_income",
            },
            {
                min: 40001,
                max: 70000,
                key: "40001_70000",
                category: "middle_income",
            },
            {
                min: 70001,
                max: 120000,
                key: "70001_120000",
                category: "upper_middle_income",
            },
            {
                min: 120001,
                max: Infinity,
                key: "above_120001",
                category: "high_income",
            },
        ];

        const bracketData =
            brackets.find(
                (b) => totalIncome >= b.min && totalIncome <= b.max
            ) || {};

        setUserData((prev) => ({
            ...prev,
            family_monthly_income: totalIncome,
            income_bracket: bracketData.key || "",
            income_category: bracketData.category || "",
        }));
    }, [userData.members]);

    const occupations_types = occupationTypes.map((item) => item.toLowerCase());

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Education and Occupation
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide education background and current occupation for
                each household member.
            </p>

            {members.map((member, index) => {
                const isOpen = openIndex === index;
                const displayName = `${member.firstname || ""} ${
                    member.lastname || ""
                }`;

                return (
                    <div
                        key={index}
                        className="mb-4 border rounded shadow-sm bg-white"
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
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                        >
                            {displayName.trim() ||
                                `Household Member ${index + 1}`}
                            {isOpen ? (
                                <IoIosArrowUp className="text-xl text-blue-600" />
                            ) : (
                                <IoIosArrowDown className="text-xl text-blue-600" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="p-4 space-y-4">
                                <p className="font-bold">Educational History</p>
                                {/* <div className="grid md:grid-cols-4 gap-4">
                                    <RadioGroup
                                        label="Currently studying"
                                        name="is_student"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.is_student || ''}
                                        onChange={(e) => handleEducationChange(index, e)}
                                    />
                                </div>

                                {member.is_student == 1 && (
                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <InputField
                                            label="School Name"
                                            name="school_name"
                                            type="text"
                                            value={member.school_name || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            placeholder="Enter school name"

                                        />

                                        <DropdownInputField
                                            label="Current Level"
                                            name="current_level"
                                            value={member.current_level || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            items={[
                                                { label: "Elementary", value: "elementary" },
                                                { label: "High School", value: "high_school" },
                                                { label: "College", value: "college" },
                                                { label: "Vocational", value: "vocational" },
                                                { label: "Post Grad", value: "post_grad" },
                                            ]}

                                            placeholder="Select school level"
                                        />

                                        <RadioGroup
                                            label="School Type"
                                            name="school_type"
                                            options={[
                                                { label: 'Public', value: 'public' },
                                                { label: 'Private', value: 'private' },
                                            ]}
                                            selectedValue={member.school_type || ''}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                )}
                                {member.is_student == 0 && (
                                    <>
                                        <div className="grid md:grid-cols-2 gap-10 mt-4">
                                            <div className="grid md:grid-cols-2 gap-2">
                                                <DropdownInputField
                                                    label="Highest Educational Attainment"
                                                    name="education"
                                                    value={member.education || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    items={[
                                                        { label: "No Formal Education", value: "no_formal_education" },
                                                        { label: "Elementary", value: "elementary" },
                                                        { label: "High School", value: "high_school" },
                                                        { label: "College", value: "college" },
                                                        { label: "Post Grad", value: "post_grad" },
                                                        { label: "Vocational", value: "vocational" },
                                                    ]}

                                                    placeholder="Select your Educational Attainment"
                                                />

                                                <RadioGroup
                                                    label="Educational Status"
                                                    name="education_status"
                                                    options={[
                                                        { label: 'Graduate', value: 'graduate' },
                                                        { label: 'Undergraduate', value: 'undergraduate' },
                                                    ]}
                                                    selectedValue={member.education_status || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    disabled={member.education === 'No Formal Education'}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {member.age >= 6 && member.age <= 14 && (
                                                    <RadioGroup
                                                        label="Out of School Children (6-14 years old)"
                                                        name="osc"
                                                        options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                        selectedValue={member.osc || ''}
                                                        onChange={(e) => handleEducationChange(index, e)}
                                                    />

                                                )}
                                                {member.age >= 15 && member.age <= 24 && (
                                                    <RadioGroup
                                                        label="Out of School Youth (15-24 years old)"
                                                        name="osy"
                                                        options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                        selectedValue={member.osy || ''}
                                                        onChange={(e) => handleEducationChange(index, e)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                                            <InputField
                                                label="School Name"
                                                name="school_name"
                                                type="text"
                                                value={member.school_name || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                placeholder="Enter school name"
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                            <RadioGroup
                                                label="School Type"
                                                name="school_type"
                                                options={[
                                                    { label: 'Public', value: 'public' },
                                                    { label: 'Private', value: 'private' },
                                                ]}
                                                selectedValue={member.school_type || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                            <YearDropdown
                                                label="Year Started"
                                                name="year_started"
                                                value={member.year_started || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}

                                            />

                                            <YearDropdown
                                                label="Year Ended"
                                                name="year_ended"
                                                value={member.year_ended || ''}
                                                onChange={(e) => handleEducationChange(index, e)}
                                                disabled={member.education === 'No Formal Education'}
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                                            {(member.education === 'college' && member.education_status === 'graduate') && (
                                                <InputField
                                                    label="Finised Course"
                                                    name="program"
                                                    type="text"
                                                    value={member.program || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    placeholder="Enter your course"
                                                    disabled={member.education === 'No Formal Education'}
                                                />
                                            )}

                                            {member.education_status === "graduate" && (
                                                <YearDropdown
                                                    label="Year Graduated"
                                                    name="year_graduated"
                                                    value={member.year_graduated || ''}
                                                    onChange={(e) => handleEducationChange(index, e)}
                                                    disabled
                                                />
                                            )}
                                        </div>
                                    </>
                                )} */}

                                {(member.educations || []).map(
                                    (education, eduIndex) => {
                                        const showProgram =
                                            education.education === "college" &&
                                            education.educational_status ===
                                                "graduated";
                                        const secondRowCols = showProgram
                                            ? "md:grid-cols-4"
                                            : "md:grid-cols-3";

                                        return (
                                            <div
                                                key={eduIndex}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                {/* Row 1 – Always 3 Inputs */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <DropdownInputField
                                                            label="Educational Attainment"
                                                            name="education"
                                                            value={
                                                                education.education ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Select attainment"
                                                            items={[
                                                                {
                                                                    label: "No Education Yet",
                                                                    value: "no_education_yet",
                                                                },
                                                                {
                                                                    label: "No Formal Education",
                                                                    value: "no_formal_education",
                                                                },
                                                                {
                                                                    label: "Prep School",
                                                                    value: "prep_school",
                                                                },
                                                                {
                                                                    label: "Kindergarten",
                                                                    value: "kindergarten",
                                                                },
                                                                {
                                                                    label: "Elementary",
                                                                    value: "elementary",
                                                                },
                                                                {
                                                                    label: "High School",
                                                                    value: "high_school",
                                                                },
                                                                {
                                                                    label: "Senior High School",
                                                                    value: "senior_high_school",
                                                                },
                                                                {
                                                                    label: "College",
                                                                    value: "college",
                                                                },
                                                                {
                                                                    label: "ALS (Alternative Learning System)",
                                                                    value: "als",
                                                                },
                                                                {
                                                                    label: "TESDA",
                                                                    value: "tesda",
                                                                },
                                                                {
                                                                    label: "Vocational",
                                                                    value: "vocational",
                                                                },
                                                                {
                                                                    label: "Post Graduate",
                                                                    value: "post_graduate",
                                                                },
                                                            ]}
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.education`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.education`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <DropdownInputField
                                                            label="Educational Status"
                                                            name="educational_status"
                                                            value={
                                                                education.educational_status ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Select status"
                                                            items={[
                                                                {
                                                                    label: "Currently Enrolled",
                                                                    value: "enrolled",
                                                                },
                                                                {
                                                                    label: "Graduated",
                                                                    value: "graduated",
                                                                },
                                                                {
                                                                    label: "Incomplete",
                                                                    value: "incomplete",
                                                                },
                                                                {
                                                                    label: "Dropped Out",
                                                                    value: "dropped_out",
                                                                },
                                                            ]}
                                                            disabled={
                                                                education.education ===
                                                                    "no_formal_education" ||
                                                                education.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.educational_status`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.educational_status`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <InputField
                                                            label="School Name"
                                                            name="school_name"
                                                            type="text"
                                                            value={
                                                                education.school_name ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            placeholder="Enter school name"
                                                            disabled={
                                                                education.education ===
                                                                    "no_formal_education" ||
                                                                education.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.school_name`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.school_name`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Row 2 – 3 or 4 Inputs depending on showProgram */}
                                                <div
                                                    className={`grid grid-cols-1 ${secondRowCols} gap-4 mt-4`}
                                                >
                                                    <div>
                                                        <RadioGroup
                                                            label="School Type"
                                                            name="school_type"
                                                            options={[
                                                                {
                                                                    label: "Public",
                                                                    value: "public",
                                                                },
                                                                {
                                                                    label: "Private",
                                                                    value: "private",
                                                                },
                                                            ]}
                                                            selectedValue={
                                                                education.school_type ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            disabled={
                                                                education.education ===
                                                                    "no_formal_education" ||
                                                                education.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.school_type`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.school_type`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <YearDropdown
                                                            label="Year Started"
                                                            name="year_started"
                                                            value={
                                                                education.year_started ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            disabled={
                                                                education.education ===
                                                                    "no_formal_education" ||
                                                                education.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.year_started`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.year_started`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <YearDropdown
                                                            label="Year Ended"
                                                            name="year_ended"
                                                            value={
                                                                education.year_ended ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleEducationChange(
                                                                    index,
                                                                    eduIndex,
                                                                    e
                                                                )
                                                            }
                                                            disabled={
                                                                education.education ===
                                                                    "no_formal_education" ||
                                                                education.education ===
                                                                    "no_education_yet"
                                                            }
                                                        />
                                                        {errors?.[
                                                            `members.${index}.educations.${eduIndex}.year_ended`
                                                        ] && (
                                                            <p className="text-red-500 text-xs">
                                                                {
                                                                    errors[
                                                                        `members.${index}.educations.${eduIndex}.year_ended`
                                                                    ]
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {education.education ===
                                                        "college" && (
                                                        <div>
                                                            <InputField
                                                                label={
                                                                    education.educational_status ===
                                                                    "graduated"
                                                                        ? "Finished Course"
                                                                        : "Current Course"
                                                                }
                                                                name="program"
                                                                type="text"
                                                                value={
                                                                    education.program ||
                                                                    ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleEducationChange(
                                                                        index,
                                                                        eduIndex,
                                                                        e
                                                                    )
                                                                }
                                                                placeholder="Enter your course"
                                                                disabled={
                                                                    education.education ===
                                                                    "no_formal_education"
                                                                }
                                                            />
                                                            {errors?.[
                                                                `members.${index}.educations.${eduIndex}.program`
                                                            ] && (
                                                                <p className="text-red-500 text-xs">
                                                                    {
                                                                        errors[
                                                                            `members.${index}.educations.${eduIndex}.program`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeEducation(
                                                            index,
                                                            eduIndex
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                                >
                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                </button>
                                            </div>
                                        );
                                    }
                                )}

                                <button
                                    type="button"
                                    onClick={() => addEducation(index)}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-4xl" />
                                    <span>Add Education History</span>
                                </button>

                                <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
                                <p className="font-bold">
                                    Occupation Background
                                </p>

                                {(member.occupations || []).map(
                                    (occupation, occIndex) => (
                                        <div
                                            key={occIndex}
                                            className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                        >
                                            <div className="grid md:grid-cols-4 gap-4">
                                                <div>
                                                    <SelectField
                                                        label="Employment Status"
                                                        name="employment_status"
                                                        value={
                                                            occupation.employment_status ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Select employment status"
                                                        items={[
                                                            {
                                                                label: "Employed",
                                                                value: "employed",
                                                            },
                                                            {
                                                                label: "Unemployed",
                                                                value: "unemployed",
                                                            },
                                                            {
                                                                label: "Underemployed",
                                                                value: "under_employed",
                                                            },
                                                            {
                                                                label: "Retired",
                                                                value: "retired",
                                                            },
                                                            {
                                                                label: "Student",
                                                                value: "student",
                                                            },
                                                        ]}
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.employment_status`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.employment_status`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <DropdownInputField
                                                        label="Occupation"
                                                        name="occupation"
                                                        value={
                                                            occupation.occupation ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Select or Enter Occupation"
                                                        items={
                                                            occupations_types
                                                        }
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.occupation`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.occupation`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <SelectField
                                                        label="Employment Type"
                                                        name="employment_type"
                                                        value={
                                                            occupation.employment_type ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Select employment type"
                                                        items={[
                                                            {
                                                                label: "Full-time",
                                                                value: "full_time",
                                                            },
                                                            {
                                                                label: "Part-time",
                                                                value: "part_time",
                                                            },
                                                            {
                                                                label: "Seasonal",
                                                                value: "seasonal",
                                                            },
                                                            {
                                                                label: "Contractual",
                                                                value: "contractual",
                                                            },
                                                            {
                                                                label: "Self-employed",
                                                                value: "self_employed",
                                                            },
                                                        ]}
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.employment_type`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.employment_type`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <SelectField
                                                        label="Occupation Status"
                                                        name="occupation_status"
                                                        value={
                                                            occupation.occupation_status ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Select occupation status"
                                                        items={[
                                                            {
                                                                label: "Active",
                                                                value: "active",
                                                            },
                                                            {
                                                                label: "Inactive",
                                                                value: "inactive",
                                                            },
                                                            {
                                                                label: "Ended",
                                                                value: "ended",
                                                            },
                                                            {
                                                                label: "Retired",
                                                                value: "retired",
                                                            },
                                                            {
                                                                label: "Terminated",
                                                                value: "terminated",
                                                            },
                                                            {
                                                                label: "Resigned",
                                                                value: "resigned",
                                                            },
                                                        ]}
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.occupation_status`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.occupation_status`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <SelectField
                                                        label="Work Arrangement"
                                                        name="work_arrangement"
                                                        items={[
                                                            {
                                                                label: "Remote",
                                                                value: "remote",
                                                            },
                                                            {
                                                                label: "Onsite",
                                                                value: "on_site",
                                                            },
                                                            {
                                                                label: "Hybrid",
                                                                value: "hybrid",
                                                            },
                                                        ]}
                                                        selectedValue={
                                                            occupation.work_arrangement ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.work_arrangement`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.work_arrangement`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <InputField
                                                        label="Employer name"
                                                        name="employer"
                                                        type="text"
                                                        value={
                                                            occupation.employer ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Enter employer name"
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.employer`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.employer`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="w-full">
                                                    <YearDropdown
                                                        label="Year Started"
                                                        name="started_at"
                                                        value={
                                                            occupation.started_at ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.started_at`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.started_at`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-full">
                                                    <YearDropdown
                                                        label="Year Ended"
                                                        name="ended_at"
                                                        value={
                                                            occupation.ended_at ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        disabled={
                                                            occupation.occupation_status ===
                                                                "active" ||
                                                            occupation.occupation_status ===
                                                                "inactive"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.ended_at`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.ended_at`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <SelectField
                                                        label="Income Frequency"
                                                        name="frequency"
                                                        value={
                                                            occupation.frequency ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        items={[
                                                            {
                                                                label: "Daily",
                                                                value: "daily",
                                                            },
                                                            {
                                                                label: "Weekly",
                                                                value: "weekly",
                                                            },
                                                            {
                                                                label: "Bi-Weekly",
                                                                value: "bi-weekly",
                                                            },
                                                            {
                                                                label: "Monthly",
                                                                value: "monthly",
                                                            },
                                                            {
                                                                label: "Annually",
                                                                value: "annually",
                                                            },
                                                        ]}
                                                        placeholder="Select Frequency"
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.frequency`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.frequency`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <InputField
                                                        type="number"
                                                        label="Income"
                                                        name="income"
                                                        value={
                                                            occupation.income ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Enter income"
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.income`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.income`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="hidden">
                                                    <InputField
                                                        type="number"
                                                        label="Monthly Income"
                                                        name="monthly_income"
                                                        value={
                                                            occupation.monthly_income ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                        placeholder="Automatically computed"
                                                        disabled={
                                                            occupation.employment_status ===
                                                            "Unemployed"
                                                        }
                                                        hidden
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.monthly_income`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.monthly_income`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <RadioGroup
                                                        label="Overseas Filipino Worker"
                                                        name="is_ofw"
                                                        selectedValue={
                                                            occupation.is_ofw ||
                                                            ""
                                                        }
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
                                                        onChange={(e) =>
                                                            handleOccupationChange(
                                                                index,
                                                                occIndex,
                                                                e
                                                            )
                                                        }
                                                    />
                                                    {errors?.[
                                                        `members.${index}.occupations.${occIndex}.is_ofw`
                                                    ] && (
                                                        <p className="text-red-500 text-xs">
                                                            {
                                                                errors[
                                                                    `members.${index}.occupations.${occIndex}.is_ofw`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeOccupation(
                                                        index,
                                                        occIndex
                                                    )
                                                }
                                                className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                            >
                                                <IoIosCloseCircleOutline className="text-2xl" />
                                            </button>
                                        </div>
                                    )
                                )}

                                {/* HIDDEN FAMILY MONTHLY INCOME + BRACKET + CATEGORY */}
                                <div className="hidden">
                                    <InputField
                                        label="Family Monthly Income"
                                        name="family_monthly_income"
                                        value={
                                            userData.family_monthly_income || ""
                                        }
                                        readOnly={true}
                                    />
                                    {errors.family_monthly_income &&
                                        console.log(
                                            errors["family_monthly_income"]
                                        )}
                                    <DropdownInputField
                                        label="Income Bracket"
                                        name="income_bracket"
                                        value={userData.income_bracket || ""}
                                        items={[userData.income_bracket || ""]}
                                        readOnly={true}
                                    />
                                    {errors.income_bracket &&
                                        console.log(errors["income_bracket"])}
                                    <DropdownInputField
                                        label="Income Category"
                                        name="income_category"
                                        value={userData.income_category || ""}
                                        items={[userData.income_category || ""]}
                                        readOnly={true}
                                    />
                                    {errors.income_category &&
                                        console.log(errors["income_category"])}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => addOccupation(index)}
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                                >
                                    <IoIosAddCircleOutline className="text-4xl" />
                                    <span>Add Occupation</span>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default EducationandOccupation;
