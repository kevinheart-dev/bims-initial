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
                                        { label: "College", value: "college" },
                                        {
                                            label: "ALS (Alternative Learning System)",
                                            value: "als",
                                        },
                                        { label: "TESDA", value: "tesda" },
                                        {
                                            label: "Vocational",
                                            value: "vocational",
                                        },
                                        {
                                            label: "Post Graduate",
                                            value: "post_graduate",
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
                                            "no_formal_education" ||
                                        edu_history.education ===
                                            "no_education_yet"
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
                                            "no_formal_education" ||
                                        edu_history.education ===
                                            "no_education_yet"
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
                                            "no_formal_education" ||
                                        edu_history.education ===
                                            "no_education_yet"
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
                                            "no_formal_education" ||
                                        edu_history.education ===
                                            "no_education_yet"
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
                                            "graduated"
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
