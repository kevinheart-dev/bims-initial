// resources/js/Components/VehicleForm.jsx
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { MoveRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import RadioGroup from "@/Components/RadioGroup";

export default function VehicleForm({
    data,
    errors,
    vehicleDetails,
    residentsList,
    handleResidentChange,
    handleArrayValues,
    addVehicle,
    removeVehicle,
    reset,
    onSubmit,
}) {
    return (
        <form onSubmit={onSubmit}>
            <h3 className="text-xl font-medium text-gray-700 mb-8">
                Vehicle Info
            </h3>
            {/* Resident Info */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5 w-full">
                <div className="md:row-span-2 md:col-span-2 flex flex-col items-center space-y-2">
                    <InputLabel htmlFor={`resident_image`} value="Profile Photo" />
                    <img
                        src={
                            data.resident_image
                                ? `/storage/${data.resident_image}`
                                : "/images/default-avatar.jpg"
                        }
                        alt="Resident Image"
                        className="w-32 h-32 object-cover rounded-full border border-gray-200"
                    />
                </div>
                <div className="md:col-span-4 space-y-2">
                    <DropdownInputField
                        label="Full Name"
                        name="resident_name"
                        value={data.resident_name || ""}
                        placeholder="Select a resident"
                        onChange={(e) => handleResidentChange(e)}
                        items={residentsList}
                        readOnly={vehicleDetails}
                    />
                    <InputError message={errors.resident_id} className="mt-2" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <InputField
                            label="Birthdate"
                            name="birthdate"
                            value={data.birthdate || ""}
                            readOnly={true}
                        />
                        <InputField
                            label="Purok Number"
                            name="purok_number"
                            value={data.purok_number}
                            readOnly={true}
                        />
                    </div>
                </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4 mt-4">
                {(data.vehicles || []).map((vehicle, vecIndex) => (
                    <div
                        key={vecIndex}
                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                    >
                        <div className="grid md:grid-cols-4 gap-4">
                            {/* Vehicle Type */}
                            <DropdownInputField
                                label="Vehicle Type"
                                name="vehicle_type"
                                value={vehicle.vehicle_type || ""}
                                items={[
                                    "Motorcycle",
                                    "Tricycle",
                                    "Car",
                                    "Jeep",
                                    "Truck",
                                    "Bicycle",
                                ]}
                                onChange={(e) =>
                                    handleArrayValues(e, vecIndex, "vehicle_type", "vehicles")
                                }
                                placeholder="Select type"
                            />
                            <InputError
                                message={errors[`vehicles.${vecIndex}.vehicle_type`]}
                                className="mt-2"
                            />

                            {/* Classification */}
                            <DropdownInputField
                                label="Classification"
                                name="vehicle_class"
                                value={vehicle.vehicle_class || ""}
                                items={[
                                    { label: "Private", value: "private" },
                                    { label: "Public", value: "public" },
                                ]}
                                onChange={(e) =>
                                    handleArrayValues(e, vecIndex, "vehicle_class", "vehicles")
                                }
                                placeholder="Select class"
                            />
                            <InputError
                                message={errors[`vehicles.${vecIndex}.vehicle_class`]}
                                className="mt-2"
                            />

                            {/* Usage Purpose */}
                            <DropdownInputField
                                label="Usage Purpose"
                                name="usage_status"
                                value={vehicle.usage_status || ""}
                                items={[
                                    { label: "Personal", value: "personal" },
                                    { label: "Public Transport", value: "public_transport" },
                                    { label: "Business Use", value: "business_use" },
                                ]}
                                onChange={(e) =>
                                    handleArrayValues(e, vecIndex, "usage_status", "vehicles")
                                }
                                placeholder="Select usage"
                            />
                            <InputError
                                message={errors[`vehicles.${vecIndex}.usage_status`]}
                                className="mt-2"
                            />

                            {/* Registered */}
                            <RadioGroup
                                label="Is Registered?"
                                name="is_registered"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={vehicle.is_registered || ""}
                                onChange={(e) =>
                                    handleArrayValues(e, vecIndex, "is_registered", "vehicles")
                                }
                            />
                            <InputError
                                message={errors[`vehicles.${vecIndex}.is_registered`]}
                                className="mt-2"
                            />
                        </div>

                        {/* Remove Button */}
                        {!vehicleDetails && (
                            <button
                                type="button"
                                onClick={() => removeVehicle(vecIndex)}
                                className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800"
                                title="Remove"
                            >
                                <IoIosCloseCircleOutline />
                            </button>
                        )}
                    </div>
                ))}

                {/* Add + Submit */}
                <div className="flex justify-between items-center p-3">
                    {!vehicleDetails && (
                        <button
                            type="button"
                            onClick={() => addVehicle()}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                            title="Add vehicle"
                        >
                            <IoIosAddCircleOutline className="text-4xl" />
                            <span className="ml-1">Add Vehicle</span>
                        </button>
                    )}

                    <div className="flex justify-end items-center gap-2">
                        <Button type="button" onClick={() => reset()}>
                            <RotateCcw /> Reset
                        </Button>
                        <Button className="bg-blue-700 hover:bg-blue-400 " type="submit">
                            {vehicleDetails ? "Update" : "Add"} <MoveRight />
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
