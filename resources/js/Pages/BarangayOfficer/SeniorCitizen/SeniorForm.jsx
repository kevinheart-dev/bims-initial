import { Button } from "@/Components/ui/button";
import InputField from "@/Components/InputField";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RadioGroup from "@/Components/RadioGroup";
import DropdownInputField from "@/Components/DropdownInputField";
import { RotateCcw } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";

export default function SeniorForm({
    data,
    errors,
    setData,
    reset,
    onSubmit,
    registerSenior,
}) {
    return (
        <form
            className="bg-white shadow-lg p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6"
            onSubmit={onSubmit}
        >
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                    Senior Citizen Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    Please review and complete the senior citizen details below.
                    Information helps us ensure proper registration and service
                    eligibility.
                </p>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-4 md:gap-x-6">
                <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-3">
                    <InputLabel
                        htmlFor="resident_image"
                        value="Profile Photo"
                    />
                    <img
                        src={
                            data.resident_image
                                ? `/storage/${data.resident_image}`
                                : "/images/default-avatar.jpg"
                        }
                        alt="Resident"
                        className="w-36 h-36 object-cover rounded-full border border-gray-300 shadow-sm"
                    />
                    <p className="text-xs text-gray-500 text-center">
                        Photo of the senior citizen (automatically loaded from
                        resident data)
                    </p>
                </div>

                <div className="md:col-span-4 space-y-3">
                    <div>
                        <InputField
                            label="Full Name"
                            name="resident_name"
                            value={data.resident_name || ""}
                            placeholder="Select a resident"
                            readOnly={true}
                        />
                        <p className="text-xs text-gray-500">
                            The registered name of the resident.
                        </p>
                        <InputError
                            message={errors.resident_id}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <InputField
                                label="Birthdate"
                                name="birthdate"
                                value={data.birthdate || ""}
                                readOnly={true}
                            />
                            <p className="text-xs text-gray-500">
                                Date of birth.
                            </p>
                        </div>
                        <div>
                            <InputField
                                label="Purok Number"
                                name="purok_number"
                                value={data.purok_number}
                                readOnly={true}
                            />
                            <p className="text-xs text-gray-500">
                                The purok or area number of the resident.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                    Living and Pension Details
                </h4>
                <p className="text-sm text-gray-500 mb-5">
                    Please specify the resident’s pension and living status.
                </p>

                <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-6">
                    <div className="w-full md:w-1/2">
                        <RadioGroup
                            label="Pensioner?"
                            name="is_pensioner"
                            selectedValue={data.is_pensioner || ""}
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "Pending", value: "pending" },
                            ]}
                            onChange={(e) =>
                                setData("is_pensioner", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.is_pensioner}
                            className="mt-2"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <RadioGroup
                            label="Living Alone?"
                            name="living_alone"
                            selectedValue={data.living_alone}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("living_alone", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.living_alone}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* Pensioner Details */}
            {data.is_pensioner === "yes" && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                    <h4 className="text-lg font-medium text-blue-800 mb-3">
                        Pension Information
                    </h4>
                    <p className="text-sm text-blue-600 mb-5">
                        Provide the official OSCA ID and specify the pension
                        type if applicable.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <InputField
                                label="OSCA ID"
                                name="osca_id_number"
                                type="number"
                                value={data.osca_id_number}
                                onChange={(e) =>
                                    setData("osca_id_number", e.target.value)
                                }
                                placeholder="Enter OSCA ID number"
                            />
                            <InputError
                                message={errors.osca_id_number}
                                className="mt-2"
                            />
                        </div>

                        <div className="w-full md:w-1/2">
                            <DropdownInputField
                                label="Pension Type"
                                name="pension_type"
                                value={data.pension_type}
                                items={[
                                    "SSS",
                                    "DSWD",
                                    "GSIS",
                                    "Private",
                                    "None",
                                ]}
                                onChange={(e) =>
                                    setData("pension_type", e.target.value)
                                }
                                placeholder="Select pension type"
                            />
                            <InputError
                                message={errors.pension_type}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Form Buttons */}
            <div className="flex justify-end items-center mt-8 gap-4">
                {registerSenior != null && (
                    <Button
                        type="button"
                        variant="outline"
                        className="border-gray-400 text-gray-600 hover:bg-gray-100"
                        onClick={() => reset()}
                    >
                        <RotateCcw className="mr-1" /> Reset
                    </Button>
                )}
                <Button
                    className="bg-blue-700 hover:bg-blue-600 text-white px-6 py-2"
                    type="submit"
                >
                    {registerSenior ? "Register" : "Update"}{" "}
                    <IoIosArrowForward className="ml-1" />
                </Button>
            </div>
        </form>
    );
}
