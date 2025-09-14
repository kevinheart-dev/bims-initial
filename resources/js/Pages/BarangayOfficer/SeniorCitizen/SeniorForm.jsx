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
            className="bg-gray-50 p-4 rounded-lg"
            onSubmit={onSubmit}
        >
            <h3 className="text-xl font-medium text-gray-700 mb-8">
                Senior Citizen Information
            </h3>

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
                        <InputField
                            label="Full Name"
                            name="resident_name"
                            value={data.resident_name || ""}
                            placeholder="Select a resident"
                            readOnly={true}
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
                </div>
            </div>

            <div className="flex justify-center items-center gap-4">
                <div className="w-full">
                    <RadioGroup
                        label="Pensioner?"
                        name="is_pensioner"
                        selectedValue={data.is_pensioner || ""}
                        options={[
                            { label: "Yes", value: "yes" },
                            { label: "No", value: "no" },
                            { label: "Pending", value: "pending" },
                        ]}
                        onChange={(e) => setData("is_pensioner", e.target.value)}
                    />
                    <InputError message={errors.is_pensioner} className="mt-2" />
                </div>
                <div className="w-full">
                    <RadioGroup
                        label="Living Alone?"
                        name="living_alone"
                        selectedValue={data.living_alone}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) => setData("living_alone", e.target.value)}
                    />
                    <InputError message={errors.living_alone} className="mt-2" />
                </div>
            </div>

            {data.is_pensioner === "yes" && (
                <div className="flex justify-between col-span-2 gap-4">
                    <div className="w-full">
                        <InputField
                            label="OSCA ID"
                            name="osca_id_number"
                            type="number"
                            value={data.osca_id_number}
                            onChange={(e) => setData("osca_id_number", e.target.value)}
                            placeholder="OSCA ID number"
                        />
                        <InputError
                            message={errors.osca_id_number}
                            className="mt-2"
                        />
                    </div>
                    <div className="w-full">
                        <DropdownInputField
                            label="Pension Type"
                            name="pension_type"
                            value={data.pension_type}
                            items={["SSS", "DSWD", "GSIS", "private", "none"]}
                            onChange={(e) => setData("pension_type", e.target.value)}
                            placeholder="Select type"
                        />
                        <InputError message={errors.pension_type} className="mt-2" />
                    </div>
                </div>
            )}

            <div className="flex justify-end items-center text-end mt-5 gap-4">
                {registerSenior != null && (
                    <Button type="button" onClick={() => reset()}>
                        <RotateCcw /> Reset
                    </Button>
                )}
                <Button className="bg-blue-700 hover:bg-blue-400" type="submit">
                    {registerSenior ? "Register" : "Update"} <IoIosArrowForward />
                </Button>
            </div>
        </form>
    );
}
