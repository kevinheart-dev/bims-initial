import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const Section3 = ({ data, setData, errors, occupationTypes = null }) => {
    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
    };

    const handleOccupationFieldChange = (e, occIndex, fieldName) => {
        const updated = [...(data.occupations || [])];

        updated[occIndex] = {
            ...updated[occIndex],
            [fieldName]: e.target.value,
        };

        setData("occupations", updated);
    };
    return (
        <div>
            <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
            <p className="font-bold my-2 text-lg">Occupation Background</p>
            <div className="w-[200px] mb-4">
                <SelectField
                    label="Current Employment Status"
                    name="employment_status"
                    value={data.employment_status || ""}
                    onChange={(e) =>
                        setData("employment_status", e.target.value)
                    }
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
                <InputError
                    message={errors.employment_status}
                    className="mt-2"
                />
            </div>

            {Array.isArray(data.occupations) &&
                data.occupations.map((occupation, occIndex) => (
                    <div
                        key={occIndex}
                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                    >
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <DropdownInputField
                                    label="Occupation"
                                    name="occupation"
                                    value={occupation.occupation || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "occupation"
                                        )
                                    }
                                    placeholder="Select or Enter Occupation"
                                    items={occupationTypes}
                                    disabled={
                                        occupation.employment_status ===
                                        "unemployed"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.occupation`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Employment Type"
                                    name="employment_type"
                                    value={occupation.employment_type || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "employment_type"
                                        )
                                    }
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
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.employment_type`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Occupation Status"
                                    name="occupation_status"
                                    value={occupation.occupation_status || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "occupation_status"
                                        )
                                    }
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
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.occupation_status`
                                        ]
                                    }
                                    className="mt-2"
                                />
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
                                            label: "On-site",
                                            value: "on_site",
                                        },
                                        {
                                            label: "Hybrid",
                                            value: "hybrid",
                                        },
                                    ]}
                                    value={occupation.work_arrangement || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "work_arrangement"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.work_arrangement`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="Employer name"
                                    name="employer"
                                    type="text"
                                    value={occupation.employer || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "employer"
                                        )
                                    }
                                    placeholder="Enter employer name"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.employer`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <YearDropdown
                                    label="Year Started"
                                    name="started_at"
                                    value={occupation.started_at || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "started_at"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.started_at`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Ended"
                                    name="ended_at"
                                    value={occupation.ended_at || ""}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "ended_at"
                                        )
                                    }
                                    disabled={
                                        occupation.occupation_status ===
                                        "active"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.ended_at`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputField
                                    type="number"
                                    label="Income"
                                    name="income"
                                    value={
                                        occupation.income
                                            ? occupation.income || ""
                                            : occupation.monthly_income || ""
                                    }
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "income"
                                        )
                                    }
                                    placeholder="Enter Income"
                                />
                                <InputError
                                    message={
                                        errors[`occupations.${occIndex}.income`]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Income Frequency"
                                    name="income_frequency"
                                    value={occupation.income_frequency}
                                    onChange={(e) =>
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "income_frequency"
                                        )
                                    }
                                    items={[
                                        {
                                            label: "Daily",
                                            value: "daily",
                                        },
                                        {
                                            label: "Bi-weekly",
                                            value: "bi_weekly",
                                        },
                                        {
                                            label: "Weekly",
                                            value: "weekly",
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
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.income_frequency`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="Overseas Filipino Worker"
                                    name="is_ofw"
                                    selectedValue={(() => {
                                        try {
                                            return (
                                                occupation?.is_ofw?.toString() ??
                                                ""
                                            );
                                        } catch (error) {
                                            console.error(
                                                "Error converting is_ofw to string:",
                                                error
                                            );
                                            return occupation.is_ofw;
                                        }
                                    })()}
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
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "is_ofw"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[`occupations.${occIndex}.is_ofw`]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="Is Main Livelihood"
                                    name="is_main_livelihood"
                                    selectedValue={
                                        occupation?.is_main_livelihood?.toString() ||
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
                                        handleOccupationFieldChange(
                                            e,
                                            occIndex,
                                            "is_main_livelihood"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.is_main_livelihood`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeOccupation(occIndex)}
                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                        >
                            <IoIosCloseCircleOutline className="text-2xl" />
                        </button>
                    </div>
                ))}

            <button
                type="button"
                onClick={addOccupation}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
            >
                <IoIosAddCircleOutline className="text-2xl" />
                <span>Add Occupation</span>
            </button>
        </div>
    );
};

export default Section3;
