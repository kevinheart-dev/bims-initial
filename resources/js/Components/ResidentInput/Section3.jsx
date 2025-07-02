import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const Section3 = ({
    data,
    setData,
    handleArrayValues,
    errors,
    occupationTypes = null,
}) => {
    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
    };
    return (
        <div>
            <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
            <p className="font-bold my-2 text-lg">Occupation Background</p>

            {Array.isArray(data.occupations) &&
                data.occupations.map((occupation, occIndex) => (
                    <div
                        key={occIndex}
                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <SelectField
                                    label="Employment Status"
                                    name="employment_status"
                                    value={occupation.employment_status || ""}
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            employment_status: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                            label: "Uderemployed",
                                            value: "underemployed",
                                        },
                                        {
                                            label: "Student",
                                            value: "student",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={
                                        errors[
                                            `occupations.${occIndex}.employment_status`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Occupation"
                                    name="occupation"
                                    value={occupation.occupation || ""}
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            occupation: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            employment_type: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                    label="Status"
                                    name="occupation_status"
                                    value={occupation.occupation_status || ""}
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            occupation_status: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                <RadioGroup
                                    label="Work Arrangement"
                                    name="work_arrangement"
                                    options={[
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
                                    selectedValue={
                                        occupation.work_arrangement || ""
                                    }
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            work_arrangement: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            employer: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <YearDropdown
                                        label="Year Started"
                                        name="started_at"
                                        value={occupation.started_at || ""}
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                started_at: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
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
                                        onChange={(e) => {
                                            const updated = [
                                                ...(data.occupations || []),
                                            ];
                                            updated[occIndex] = {
                                                ...updated[occIndex],
                                                ended_at: e.target.value,
                                            };
                                            setData("occupations", updated);
                                        }}
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
                            </div>
                            <div>
                                <InputField
                                    type="number"
                                    label="Income"
                                    name="income"
                                    value={occupation.income || ""}
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            income: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
                                    value={occupation.income_frequency || ""}
                                    onChange={(e) => {
                                        const updated = [
                                            ...(data.occupations || []),
                                        ];
                                        updated[occIndex] = {
                                            ...updated[occIndex],
                                            income_frequency: e.target.value,
                                        };
                                        setData("occupations", updated);
                                    }}
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
