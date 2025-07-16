import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const Section2 = ({ data, setData, errors, handleArrayValues }) => {
    const addEducation = () => {
        setData("educational_histories", [
            ...(data.educational_histories || []),
            {},
        ]);
    };

    const removeEducation = (occIndex) => {
        const updated = [...(data.educational_histories || [])];
        updated.splice(occIndex, 1);
        setData("educational_histories", updated);
    };
    return (
        <div>
            <div className="flex flex-col mt-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                    Education and Occupation
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    Please provide the resident education background and current
                    occupation.
                </p>
            </div>

            {/* ask student if studying or not */}
            {/* <div className="grid md:grid-cols-4 gap-4 mb-4">
                <RadioGroup
                    label="Currently studying"
                    name="is_student"
                    options={[
                        { label: "Yes", value: 1 },
                        { label: "No", value: 0 },
                    ]}
                    selectedValue={data.is_student || ""}
                    onChange={(e) => setData("is_student", e.target.value)}
                />
            </div> */}

            {/* {data.is_student == 1 && (
                <div className="grid md:grid-cols-4 gap-4 my-4">
                    <div>
                        <InputField
                            label="School Name"
                            name="school_name"
                            type="text"
                            value={data.school_name || ""}
                            onChange={(e) =>
                                setData("school_name", e.target.value)
                            }
                            placeholder="Enter school name"
                        />
                        <InputError
                            message={errors.school_name}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <RadioGroup
                            label="School Type"
                            name="school_type"
                            options={[
                                { label: "Public", value: "public" },
                                { label: "Private", value: "private" },
                            ]}
                            selectedValue={data.school_type || ""}
                            onChange={(e) =>
                                setData("school_type", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.school_type}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <DropdownInputField
                            label="Current Level"
                            name="current_level"
                            value={data.current_level || ""}
                            onChange={(e) =>
                                setData("current_level", e.target.value)
                            }
                            items={[
                                {
                                    label: "Elementary",
                                    value: "elementary",
                                },
                                {
                                    label: "High School",
                                    value: "high_school",
                                },
                                { label: "College", value: "college" },
                                {
                                    label: "Vocational",
                                    value: "vocational",
                                },
                                {
                                    label: "Post Grad",
                                    value: "post_grad",
                                },
                            ]}
                            placeholder="Select school level"
                        />
                        <InputError
                            message={errors.current_level}
                            className="mt-2"
                        />
                    </div>
                </div>
            )}
            {data.is_student == 0 && (
                <>
                    <div className="grid md:grid-cols-2 gap-10 mt-4">
                        <div className="grid md:grid-cols-2 gap-2">
                            <div>
                                <DropdownInputField
                                    label="Highest Educational Attainment"
                                    name="education"
                                    value={data.education || ""}
                                    onChange={(e) =>
                                        setData("education", e.target.value)
                                    }
                                    items={[
                                        {
                                            label: "No Formal Education",
                                            value: "no_formal_education",
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
                                            label: "College",
                                            value: "college",
                                        },
                                        {
                                            label: "Post Grad",
                                            value: "post_grad",
                                        },
                                        {
                                            label: "Vocational",
                                            value: "vocational",
                                        },
                                    ]}
                                    placeholder="Select your Educational Attainment"
                                />
                                <InputError
                                    message={errors.education}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="Educational Status"
                                    name="education_status"
                                    options={[
                                        {
                                            label: "Graduate",
                                            value: "graduate",
                                        },
                                        {
                                            label: "Undergraduate",
                                            value: "undergraduate",
                                        },
                                    ]}
                                    selectedValue={data.education_status || ""}
                                    onChange={(e) =>
                                        setData(
                                            "education_status",
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        data.education === "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={errors.education_status}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {data.age >= 6 && data.age <= 14 && (
                                <div>
                                    <RadioGroup
                                        label="Out of School Children (6-14 years old)"
                                        name="osc"
                                        options={[
                                            { label: "Yes", value: 1 },
                                            { label: "No", value: 0 },
                                        ]}
                                        selectedValue={data.osc || ""}
                                        onChange={(e) =>
                                            setData("osc", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.osc}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                            {data.age >= 15 && data.age <= 24 && (
                                <div>
                                    <RadioGroup
                                        label="Out of School Youth (15-24 years old)"
                                        name="osy"
                                        options={[
                                            { label: "Yes", value: 1 },
                                            { label: "No", value: 0 },
                                        ]}
                                        selectedValue={data.osy || ""}
                                        onChange={(e) =>
                                            setData("osy", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.osy}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <InputField
                                label="School Name"
                                name="school_name"
                                type="text"
                                value={data.school_name || ""}
                                onChange={(e) =>
                                    setData("school_name", e.target.value)
                                }
                                placeholder="Enter school name"
                                disabled={
                                    data.education === "no_formal_education"
                                }
                            />
                            <InputError
                                message={errors.school_name}
                                className="mt-2"
                            />
                        </div>
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
                                selectedValue={data.school_type || ""}
                                onChange={(e) =>
                                    setData("school_type", e.target.value)
                                }
                                disabled={
                                    data.education === "no_formal_education"
                                }
                            />
                            <InputError
                                message={errors.school_type}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <YearDropdown
                                label="Year Started"
                                name="year_started"
                                value={data.year_started || ""}
                                onChange={(e) =>
                                    setData("year_started", e.target.value)
                                }
                                disabled={
                                    data.education === "no_formal_education"
                                }
                            />
                            <InputError
                                message={errors.year_started}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <YearDropdown
                                label="Year Ended"
                                name="year_ended"
                                value={data.year_ended || ""}
                                onChange={(e) =>
                                    setData("year_ended", e.target.value)
                                }
                                disabled={
                                    data.education === "no_formal_education"
                                }
                            />
                            <InputError
                                message={errors.year_ended}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 my-4">
                        {data.education === "college" &&
                            data.education_status === "graduate" && (
                                <div>
                                    <InputField
                                        label="Finised Course"
                                        name="program"
                                        type="text"
                                        value={data.program || ""}
                                        onChange={(e) =>
                                            setData("program", e.target.value)
                                        }
                                        placeholder="Enter your course"
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.program}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                        {data.education_status === "graduate" && (
                            <div>
                                <YearDropdown
                                    label="Year Graduated"
                                    name="year_graduated"
                                    value={data.year_ended || ""}
                                    onChange={(e) =>
                                        setData(
                                            "year_graduated",
                                            e.target.value
                                        )
                                    }
                                    disabled
                                />
                                <InputError
                                    message={errors.year_graduated}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                </>
            )} */}

            {Array.isArray(data.educational_histories) &&
                data.educational_histories.map((edu_history, edIndex) => (
                    <div
                        key={edIndex}
                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                    >
                        <div className="grid md:grid-cols-3 gap-10 mt-4">
                            <div>
                                <DropdownInputField
                                    label="Educational Attainment"
                                    name="education"
                                    value={edu_history.education || ""}
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "education",
                                            "educational_histories"
                                        )
                                    }
                                    items={[
                                        {
                                            label: "No Formal Education",
                                            value: "no_formal_education",
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
                                            label: "College",
                                            value: "college",
                                        },
                                        {
                                            label: "Post Grad",
                                            value: "post_graduate",
                                        },
                                        {
                                            label: "Vocational",
                                            value: "vocational",
                                        },
                                    ]}
                                    placeholder="Select your Educational Attainment"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.education`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Educational Status"
                                    name="education_status"
                                    items={[
                                        {
                                            label: "Graduate",
                                            value: "graduate",
                                        },
                                        {
                                            label: "Undergraduate",
                                            value: "undergraduate",
                                        },
                                        {
                                            label: "Currently Enrolled",
                                            value: "enrolled",
                                        },
                                        {
                                            label: "Stopped",
                                            value: "stopped",
                                        },
                                    ]}
                                    selectedValue={
                                        edu_history.education_status || ""
                                    }
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "education_status",
                                            "educational_histories"
                                        )
                                    }
                                    disabled={
                                        edu_history.education ===
                                        "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.education_status`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="School Name"
                                    name="school_name"
                                    type="text"
                                    value={edu_history.school_name || ""}
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "school_name",
                                            "educational_histories"
                                        )
                                    }
                                    placeholder="Enter school name"
                                    disabled={
                                        edu_history.education ===
                                        "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.school_name`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
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
                                        edu_history.school_type || ""
                                    }
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "school_type",
                                            "educational_histories"
                                        )
                                    }
                                    disabled={
                                        edu_history.education ===
                                        "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.school_type`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Started"
                                    name="year_started"
                                    value={edu_history.year_started || ""}
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "year_started",
                                            "educational_histories"
                                        )
                                    }
                                    disabled={
                                        edu_history.education ===
                                        "no_formal_education"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.year_started`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Ended"
                                    name="year_ended"
                                    value={edu_history.year_ended || ""}
                                    onChange={(e) =>
                                        handleArrayValues(
                                            e,
                                            edIndex,
                                            "year_ended",
                                            "educational_histories"
                                        )
                                    }
                                    disabled={
                                        edu_history.education ===
                                            "no_formal_education" ||
                                        edu_history.education_status ===
                                            "enrolled"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `educational_histories.${edIndex}.year_ended`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            {edu_history.education === "college" && (
                                <div>
                                    <InputField
                                        label={
                                            edu_history.education_status ===
                                            "graduate"
                                                ? "Finished Course"
                                                : "Current Course"
                                        }
                                        name="program"
                                        type="text"
                                        value={edu_history.program || ""}
                                        onChange={(e) =>
                                            handleArrayValues(
                                                e,
                                                edIndex,
                                                "program",
                                                "educational_histories"
                                            )
                                        }
                                        placeholder="Enter your course"
                                        disabled={
                                            edu_history.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `educational_histories.${edIndex}.program`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => removeEducation(edIndex)}
                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                        >
                            <IoIosCloseCircleOutline className="text-2xl" />
                        </button>
                    </div>
                ))}
            <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-1 text-sm mb-4 text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
            >
                <IoIosAddCircleOutline className="text-2xl" />
                <span>Add Edicational History</span>
            </button>
        </div>
    );
};

export default Section2;
