import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const LivelihoodSection = ({ data, setData, errors }) => {
    const addLivelihood = () => {
        setData("livelihoods", [...(data.livelihoods || []), {}]);
    };

    const removeLivelihood = (lvlhdIdx) => {
        const updated = [...(data.livelihoods || [])];
        updated.splice(lvlhdIdx, 1);
        setData("livelihoods", updated);
        toast.warning("Livelihood removed.", {
            duration: 2000,
        });
    };

    const handleLivelihoodFieldChange = (e, lvlhdIdx, fieldName) => {
        const updated = [...(data.livelihoods || [])];

        updated[lvlhdIdx] = {
            ...updated[lvlhdIdx],
            [fieldName]: e.target.value,
        };

        setData("livelihoods", updated);
    };
    return (
        <div>
            <div className="flex flex-col mt-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                    Livelihood Information
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    Please provide the resident's livelihood background.
                </p>
            </div>

            {Array.isArray(data.livelihoods) &&
                data.livelihoods.map((livelihood, lvlhdIdx) => (
                    <div
                        key={lvlhdIdx}
                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                    >
                        <div className={`grid md:grid-cols-4 gap-4`}>
                            <div>
                                <DropdownInputField
                                    label="Livelihood"
                                    name="livelihood_type"
                                    value={livelihood.livelihood_type || ""}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "livelihood_type"
                                        )
                                    }
                                    placeholder="Select or Enter Livelihood"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `livelihoods.${lvlhdIdx}.livelihood_type`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Livelihood Status"
                                    name="status"
                                    value={livelihood.status || ""}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "status"
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
                                            label: "Seasonal",
                                            value: "seasonal",
                                        },
                                        {
                                            label: "Ended",
                                            value: "ended",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={
                                        errors[`livelihoods.${lvlhdIdx}.status`]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="Is Main Livelihood"
                                    name="is_main_livelihood"
                                    selectedValue={(() => {
                                        try {
                                            return (
                                                livelihood?.is_main_livelihood?.toString() ??
                                                ""
                                            );
                                        } catch (error) {
                                            console.error(
                                                "Error converting is_main_livelihood to string:",
                                                error
                                            );
                                            return livelihood.is_main_livelihood;
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
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "is_main_livelihood"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `livelihoods.${lvlhdIdx}.is_main_livelihood`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="Description"
                                    name="description"
                                    type="text"
                                    value={livelihood.description || ""}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "description"
                                        )
                                    }
                                    placeholder="Enter livelihood description"
                                />
                                <InputError
                                    message={
                                        errors[
                                            `livelihoods.${lvlhdIdx}.description`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputField
                                    label="Date Started"
                                    name="started_at"
                                    type="date"
                                    value={livelihood.started_at || ""}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "started_at"
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `livelihoods.${lvlhdIdx}.started_at`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="Date Ended"
                                    name="ended_at"
                                    type="date"
                                    value={livelihood.ended_at || ""}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "ended_at"
                                        )
                                    }
                                    disabled={
                                        livelihood.occupation_status ===
                                        "active"
                                    }
                                />
                                <InputError
                                    message={
                                        errors[
                                            `livelihoods.${lvlhdIdx}.ended_at`
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
                                        livelihood.income
                                            ? livelihood.income || ""
                                            : livelihood.monthly_income || ""
                                    }
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
                                            "income"
                                        )
                                    }
                                    placeholder="Enter Income"
                                />
                                <InputError
                                    message={
                                        errors[`livelihoods.${lvlhdIdx}.income`]
                                    }
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Income Frequency"
                                    name="income_frequency"
                                    value={livelihood.income_frequency}
                                    onChange={(e) =>
                                        handleLivelihoodFieldChange(
                                            e,
                                            lvlhdIdx,
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
                                            `livelihoods.${lvlhdIdx}.income_frequency`
                                        ]
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeLivelihood(lvlhdIdx)}
                            className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                        >
                            <IoIosCloseCircleOutline className="text-2xl" />
                        </button>
                    </div>
                ))}

            <button
                type="button"
                onClick={addLivelihood}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
            >
                <IoIosAddCircleOutline className="text-2xl" />
                <span>Add Livelihood</span>
            </button>
        </div>
    );
};

export default LivelihoodSection;
