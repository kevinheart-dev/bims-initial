import InputLabel from "@/Components/InputLabel";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import RadioGroup from "@/Components/RadioGroup";
import DropdownInputField from "@/Components/DropdownInputField";
import SelectField from "@/Components/SelectField";
import YearDropdown from "@/Components/YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { Button } from "@/Components/ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import React from 'react'; // Make sure to import React

export default function AddOccupation({
    data,
    setData,
    errors,
    residentsList,
    occupationTypes,
    handleResidentChange,
    handleOccupationFieldChange,
    addOccupation,
    removeOccupation,
    handleSubmitOccupation,
    handleUpdateOccupation,
    occupationDetails,
    reset,
}) {
    return (
        <div className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-sm text-black p-4 space-y-4">
            <form onSubmit={occupationDetails ? handleUpdateOccupation : handleSubmitOccupation}>
                <h3 className="text-xl font-medium text-gray-700 mb-8">Resident's Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                    <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                        <InputLabel htmlFor={`resident_image`} value="Profile Photo" />
                        <img
                            src={
                                data.resident_image
                                    ? `/storage/${data.resident_image}`
                                    : "/images/default-avatar.jpg"
                            }
                            alt={`Resident Image`}
                            className="w-32 h-32 object-cover rounded-full border border-gray-200"
                        />
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <div className="w-full">
                            <DropdownInputField
                                label="Full Name"
                                name="resident_name"
                                value={data.resident_name || ""}
                                placeholder="Select a resident"
                                onChange={(e) => handleResidentChange(e)}
                                items={residentsList}
                                readOnly={occupationDetails}
                            />
                            <InputError message={errors.resident_id} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <InputField
                                    label="Birthdate"
                                    name="birthdate"
                                    value={data.birthdate || ""}
                                    readOnly={true}
                                />
                            </div>

                            <div>
                                <InputField
                                    label="Purok Number"
                                    name="purok_number"
                                    value={data.purok_number}
                                    readOnly={true}
                                />
                            </div>
                        </div>
                        <div className="w-[200px] mb-4">
                            <SelectField
                                label="Current Employment Status"
                                name="employment_status"
                                value={data.employment_status || ""}
                                onChange={(e) => setData("employment_status", e.target.value)}
                                items={[
                                    { label: "Employed", value: "employed" },
                                    { label: "Unemployed", value: "unemployed" },
                                    { label: "Underemployed", value: "under_employed" },
                                    { label: "Retired", value: "retired" },
                                    { label: "Student", value: "student" },
                                ]}
                            />
                            <InputError message={errors.employment_status} className="mt-2" />
                        </div>
                    </div>
                </div>
                {Array.isArray(data.occupations) &&
                    data.occupations.map((occupation, occIndex) => (
                        <div key={occIndex} className="border p-4 mb-4 rounded-md relative bg-gray-50">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <DropdownInputField
                                        label="Occupation"
                                        name="occupation"
                                        value={occupation.occupation || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "occupation")}
                                        placeholder="Select or Enter Occupation"
                                        items={occupationTypes}
                                        disabled={occupation.employment_status === "unemployed"}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.occupation`]} className="mt-2" />
                                </div>
                                <div>
                                    <SelectField
                                        label="Employment Type"
                                        name="employment_type"
                                        value={occupation.employment_type || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "employment_type")}
                                        items={[
                                            { label: "Full-time", value: "full_time" },
                                            { label: "Part-time", value: "part_time" },
                                            { label: "Seasonal", value: "seasonal" },
                                            { label: "Contractual", value: "contractual" },
                                            { label: "Self-employed", value: "self_employed" },
                                        ]}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.employment_type`]} className="mt-2" />
                                </div>
                                <div>
                                    <SelectField
                                        label="Occupation Status"
                                        name="occupation_status"
                                        value={occupation.occupation_status || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "occupation_status")}
                                        items={[
                                            { label: "Active", value: "active" },
                                            { label: "Inactive", value: "inactive" },
                                            { label: "Ended", value: "ended" },
                                            { label: "Retired", value: "retired" },
                                            { label: "Terminated", value: "terminated" },
                                            { label: "Resigned", value: "resigned" },
                                        ]}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.occupation_status`]} className="mt-2" />
                                </div>
                                <div>
                                    <SelectField
                                        label="Work Arrangement"
                                        name="work_arrangement"
                                        items={[
                                            { label: "Remote", value: "remote" },
                                            { label: "On-site", value: "on_site" },
                                            { label: "Hybrid", value: "hybrid" },
                                        ]}
                                        value={occupation.work_arrangement || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "work_arrangement")}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.work_arrangement`]} className="mt-2" />
                                </div>
                                <div>
                                    <InputField
                                        label="Employer name"
                                        name="employer"
                                        type="text"
                                        value={occupation.employer || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "employer")}
                                        placeholder="Enter employer name"
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.employer`]} className="mt-2" />
                                </div>
                                <div>
                                    <YearDropdown
                                        label="Year Started"
                                        name="started_at"
                                        value={occupation.started_at || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "started_at")}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.started_at`]} className="mt-2" />
                                </div>
                                <div>
                                    <YearDropdown
                                        label="Year Ended"
                                        name="ended_at"
                                        value={occupation.ended_at || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "ended_at")}
                                        disabled={occupation.occupation_status === "active"}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.ended_at`]} className="mt-2" />
                                </div>
                                <div>
                                    <InputField
                                        type="number"
                                        label="Income"
                                        name="income"
                                        value={occupation.income || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "income")}
                                        placeholder="Enter Income"
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.income`]} className="mt-2" />
                                </div>
                                <div>
                                    <SelectField
                                        label="Income Frequency"
                                        name="income_frequency"
                                        value={occupation.income_frequency || ""}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "income_frequency")}
                                        items={[
                                            { label: "Daily", value: "daily" },
                                            { label: "Bi-weekly", value: "bi_weekly" },
                                            { label: "Weekly", value: "weekly" },
                                            { label: "Monthly", value: "monthly" },
                                            { label: "Annually", value: "annually" },
                                        ]}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.income_frequency`]} className="mt-2" />
                                </div>
                                <div>
                                    <RadioGroup
                                        label="Overseas Filipino Worker"
                                        name="is_ofw"
                                        selectedValue={occupation.is_ofw || ""}
                                        options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "is_ofw")}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.is_ofw`]} className="mt-2" />
                                </div>
                                <div>
                                    <RadioGroup
                                        label="Is Main Livelihood"
                                        name="is_main_livelihood"
                                        selectedValue={occupation.is_main_livelihood || ""}
                                        options={[{ label: "Yes", value: 1 }, { label: "No", value: 0 }]}
                                        onChange={(e) => handleOccupationFieldChange(e, occIndex, "is_main_livelihood")}
                                    />
                                    <InputError message={errors[`occupations.${occIndex}.is_main_livelihood`]} className="mt-2" />
                                </div>
                            </div>
                            {occupationDetails === null && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeOccupation(occIndex);
                                        toast.warning("Occupation removed.", { duration: 2000 });
                                    }}
                                    className="absolute top-1 right-2 flex items-center gap-1 text-sm text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                >
                                    <IoIosCloseCircleOutline className="text-2xl" />
                                </button>
                            )}
                        </div>
                    ))}
                <div className="flex justify-between items-center p-3">
                    {occupationDetails === null ? (
                        <button
                            type="button"
                            onClick={addOccupation}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium mt-4 transition-colors duration-200"
                        >
                            <IoIosAddCircleOutline className="text-2xl" />
                            <span>Add Occupation</span>
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex justify-end items-center text-end mt-5 gap-4">
                        {occupationDetails == null && (
                            <Button type="button" onClick={() => reset()}>
                                <RotateCcw /> Reset
                            </Button>
                        )}

                        <Button className="bg-blue-700 hover:bg-blue-400 " type={"submit"}>
                            {occupationDetails ? "Update" : "Add"} <IoIosArrowForward />
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
