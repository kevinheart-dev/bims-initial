import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";

const Section1 = ({
    data,
    setData,
    handleArrayValues,
    errors,
    showMaidenMiddleName,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                    Resident Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Kindly provide the personal information of the resident.
                </p>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4">
                <div className="md:row-span-2 flex flex-col items-center space-y-2">
                    <InputLabel
                        htmlFor={`resident-image`}
                        value="Profile Photo"
                    />
                    <img
                        src={
                            data.resident_image instanceof File
                                ? URL.createObjectURL(data.resident_image)
                                : data.resident_image ||
                                  "/images/default-avatar.jpg"
                        }
                        alt={`Resident Image`}
                        className="w-32 h-32 object-cover rounded-full border border-gray-200"
                    />
                    <input
                        id="resident-image-path"
                        type="file"
                        name="resident_image"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                setData("resident_image", file);
                            }
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <InputError
                        message={errors.resident_image}
                        className="mt-2"
                    />
                </div>

                <div className="md:col-span-5 space-y-2">
                    <div
                        className={`grid gap-2 grid-cols-1 sm:grid-cols-2 md:${
                            showMaidenMiddleName ? "grid-cols-4" : "grid-cols-3"
                        }`}
                    >
                        <div>
                            <InputField
                                label="Last Name"
                                name="lastname"
                                value={data.lastname || ""}
                                placeholder="Enter last name"
                                onChange={(e) => {
                                    setData("lastname", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.lastname}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="First Name"
                                name="firstname"
                                value={data.firstname}
                                placeholder="Enter first name"
                                onChange={(e) => {
                                    setData("firstname", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.firstname}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Middle Name"
                                name="middlename"
                                value={data.middlename}
                                placeholder="Enter middle name"
                                onChange={(e) => {
                                    setData("middlename", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.middlename}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            {showMaidenMiddleName && (
                                <InputField
                                    label="Maiden Middle Name"
                                    name="maiden_middle_name"
                                    value={data.maiden_middle_name}
                                    placeholder="Enter maiden middle name"
                                    onChange={(e) => {
                                        setData(
                                            "maiden_middle_name",
                                            e.target.value
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                            <DropdownInputField
                                label="Suffix"
                                name="suffix"
                                value={data.suffix}
                                items={["Jr.", "Sr.", "III", "IV"]}
                                placeholder="Enter or select suffix"
                                onChange={(e) => {
                                    setData("suffix", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.suffix}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                label="Civil Status"
                                name="civil_status"
                                value={data.civil_status}
                                items={[
                                    "Single",
                                    "Married",
                                    "Widowed",
                                    "Divorced",
                                    "Separated",
                                    "Annulled",
                                ]}
                                placeholder="Select civil status"
                                onChange={(e) => {
                                    setData(
                                        "civil_status",
                                        e.target.value.toLowerCase()
                                    );
                                }}
                            />
                            <InputError
                                message={errors.civil_status}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <RadioGroup
                                label="Gender"
                                name="gender"
                                options={[
                                    { label: "Male", value: "male" },
                                    {
                                        label: "Female",
                                        value: "female",
                                    },
                                    {
                                        label: "LGBTQIA+",
                                        value: "LGBTQ",
                                    },
                                ]}
                                selectedValue={data.gender || ""}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.gender}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* BIRTH & CITIZENSHIP */}
            <div className="bg-gray-50 p-3 rounded space-y-2">
                <h3 className="text-md font-medium text-gray-700">
                    Birth & Citizenship
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div>
                        <InputField
                            type="date"
                            label="Birth Date"
                            name="birthdate"
                            value={data.birthdate}
                            onChange={(e) => {
                                setData("birthdate", e.target.value);
                                // Calculate age based on birthdate
                                const birthDate = new Date(e.target.value);
                                const today = new Date();
                                const calculatedAge =
                                    today.getFullYear() -
                                    birthDate.getFullYear();
                                if (calculatedAge >= 0) {
                                    setData("age", calculatedAge);
                                }
                            }}
                        />
                        <InputError
                            message={errors.birthdate}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <InputField
                            label="Birth Place"
                            name="birthplace"
                            value={data.birthplace}
                            placeholder="Enter birth place"
                            onChange={(e) => {
                                setData("birthplace", e.target.value);
                            }}
                        />
                        <InputError
                            message={errors.birthplace}
                            className="mt-2"
                        />
                    </div>
                    <DropdownInputField
                        label="Religion"
                        name="religion"
                        value={data.religion}
                        items={[
                            "Roman Catholic",
                            "Iglesia ni Cristo",
                            "Born Again",
                            "Baptists",
                        ]}
                        placeholder="Enter or select religion"
                        onChange={(e) => {
                            setData("religion", e.target.value);
                        }}
                    />

                    <DropdownInputField
                        label="Ethnicity"
                        name="ethnicity"
                        value={data.ethnicity}
                        items={[
                            "Ilocano",
                            "Ibanag",
                            "Tagalog",
                            "Indigenous People",
                        ]}
                        placeholder="Enter or select ethnicity"
                        onChange={(e) => {
                            setData("ethnicity", e.target.value);
                        }}
                    />
                    <div>
                        <DropdownInputField
                            label="Citizenship"
                            name="citizenship"
                            value={data.citizenship}
                            items={["Filipino", "Chinese", "American "]}
                            placeholder="Enter or select citizenship"
                            onChange={(e) => {
                                setData("citizenship", e.target.value);
                            }}
                        />
                        <InputError
                            message={errors.citizenship}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>

            {/* CONTACT & RESIDENCY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded space-y-2">
                    <h3 className="text-md font-medium text-gray-700">
                        Contact Info
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <InputField
                                label="Contact Number"
                                name="contactNumber"
                                value={data.contactNumber}
                                placeholder="Enter contact number"
                                onChange={(e) => {
                                    setData("contactNumber", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.contactNumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Email"
                                name="email"
                                value={data.email}
                                placeholder="Enter email"
                                onChange={(e) => {
                                    setData("email", e.target.value);
                                }}
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded space-y-2">
                    <h3 className="text-md font-medium text-gray-700">
                        Residency Info
                    </h3>
                    <div className="space-y-2">
                        <div>
                            <SelectField
                                label="Residency type"
                                name="residency_type"
                                value={data.residency_type}
                                onChange={(e) =>
                                    setData("residency_type", e.target.value)
                                }
                                items={[
                                    {
                                        label: "Permanent",
                                        value: "permanent",
                                    },
                                    {
                                        label: "Temporary",
                                        value: "temporary",
                                    },
                                    {
                                        label: "Migrant",
                                        value: "migrant",
                                    },
                                ]}
                            />
                            <InputError
                                message={errors.residency_type}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <YearDropdown
                                label="Residency date"
                                name="residency_date"
                                value={data.residency_date}
                                onChange={(e) =>
                                    setData("residency_date", e.target.value)
                                }
                                placeholder="Select residency date"
                            />
                            <InputError
                                message={errors.residency_date}
                                className="mt-2"
                            />
                        </div>
                        <RadioGroup
                            label="Household Head?"
                            name="is_household_head"
                            selectedValue={parseInt(data.is_household_head)}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("is_household_head", e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>

            {/* GOVERNMENT PROGRAMS */}
            <div className="bg-gray-50 p-3 rounded space-y-2">
                <h3 className="text-md font-medium text-gray-700">
                    Government Programs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                    <RadioGroup
                        label="4Ps Beneficiary?"
                        name="is_4ps_benificiary"
                        selectedValue={data.is_4ps_benificiary || ""}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) =>
                            setData("is_4ps_benificiary", e.target.value)
                        }
                    />
                    <RadioGroup
                        label="Solo Parent?"
                        name="is_solo_parent"
                        selectedValue={data.is_solo_parent || ""}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) =>
                            setData("is_solo_parent", e.target.value)
                        }
                    />
                    {data.is_solo_parent == 1 && (
                        <div>
                            <InputField
                                label="Solo Parent ID"
                                name="solo_parent_id_number"
                                value={data.solo_parent_id_number || ""}
                                onChange={(e) =>
                                    setData(
                                        "solo_parent_id_number",
                                        e.target.value
                                    )
                                }
                                placeholder="ID number"
                            />
                            <InputError
                                message={errors.solo_parent_id_number}
                                className="mt-2"
                            />
                        </div>
                    )}
                    <div>
                        <RadioGroup
                            label="Registered Voter"
                            name="registered_voter"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.registered_voter || ""}
                            onChange={(e) =>
                                setData("registered_voter", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.registered_voter}
                            className="mt-2"
                        />
                    </div>
                    {data.registered_voter == 1 && (
                        <>
                            <div>
                                <DropdownInputField
                                    label="Voting Status"
                                    name="voting_status"
                                    value={data.voting_status}
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
                                            label: "Disqualified",
                                            value: "disqualified",
                                        },
                                        {
                                            label: "Medical",
                                            value: "medical",
                                        },
                                        {
                                            label: "Overseas",
                                            value: "overseas",
                                        },
                                        {
                                            label: "Detained",
                                            value: "detained",
                                        },
                                        {
                                            label: "Deceased",
                                            value: "deceased",
                                        },
                                    ]}
                                    onChange={(e) =>
                                        setData("voting_status", e.target.value)
                                    }
                                    placeholder="Select status"
                                />
                                <InputError
                                    message={errors.voting_status}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    label="Voter ID Number"
                                    name="voter_id_number"
                                    value={data.voter_id_number || ""}
                                    onChange={(e) =>
                                        setData(
                                            "voter_id_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter voter ID number"
                                />
                                <InputError
                                    message={errors.voter_id_number}
                                    className="mt-2"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* SENIOR CITIZEN (CONDITIONAL) */}
            {data.age >= 60 && (
                <div className="bg-gray-50 p-3 rounded space-y-2">
                    <h3 className="text-md font-medium text-gray-700">
                        Senior Citizen Info
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        <RadioGroup
                            label="Pensioner"
                            name="is_pensioner"
                            options={[
                                { label: "Yes", value: "yes" },
                                { label: "No", value: "no" },
                                { label: "Pending", value: "pending" },
                            ]}
                            selectedValue={data.is_pensioner || ""}
                            onChange={(e) =>
                                setData("is_pensioner", e.target.value)
                            }
                        />
                        {data.is_pensioner === "yes" && (
                            <>
                                <InputField
                                    label="OSCA ID Number"
                                    name="osca_id_number"
                                    type="number"
                                    value={data.osca_id_number}
                                    onChange={(e) => setData(index, e)}
                                    placeholder="Enter OSCA ID number"
                                />

                                <DropdownInputField
                                    label="Pension Type"
                                    name="pension_type"
                                    value={data.pension_type}
                                    onChange={(e) =>
                                        setData("pension_type", e.target.value)
                                    }
                                    items={[
                                        "SSS",
                                        "DSWD",
                                        "GSIS",
                                        "private",
                                        "none",
                                    ]}
                                    placeholder="Select or enter pension type"
                                />

                                <RadioGroup
                                    label="Living alone"
                                    name="living_alone"
                                    options={[
                                        { label: "Yes", value: 1 },
                                        { label: "No", value: 0 },
                                    ]}
                                    selectedValue={data.living_alone || null}
                                    onChange={(e) =>
                                        setData("living_alone", e.target.value)
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="bg-gray-50 p-3 rounded">
                <h3 className="text-md font-medium text-gray-700">
                    Vehicle Info
                </h3>
                <div>
                    <RadioGroup
                        label="Owns Vehicle(s)?"
                        name="has_vehicle"
                        selectedValue={data.has_vehicle}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) => setData("has_vehicle", e.target.value)}
                    />
                    {data.has_vehicle == 1 && (
                        <div className="space-y-4 mt-4">
                            {(data.vehicles || []).map((vehicle, vecIndex) => (
                                <div
                                    key={vecIndex}
                                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                >
                                    {/* Left: input fields */}
                                    <div className="grid md:grid-cols-4 gap-4">
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
                                                handleArrayValues(
                                                    e,
                                                    livIndex,
                                                    "vehicle_type",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select type"
                                        />
                                        <DropdownInputField
                                            label="Classification"
                                            name="vehicle_class"
                                            value={vehicle.vehicle_class || ""}
                                            items={[
                                                {
                                                    label: "Private",
                                                    value: "private",
                                                },
                                                {
                                                    label: "Public",
                                                    value: "public",
                                                },
                                            ]}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    livIndex,
                                                    "vehicle_class",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select class"
                                        />

                                        <DropdownInputField
                                            label="Usage Purpose"
                                            name="usage_status"
                                            value={vehicle.usage_status || ""}
                                            items={[
                                                {
                                                    label: "Personal",
                                                    value: "personal",
                                                },
                                                {
                                                    label: "Public Transport",
                                                    value: "public_transport",
                                                },
                                                {
                                                    label: "Business Use",
                                                    value: "business_use",
                                                },
                                            ]}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    livIndex,
                                                    "usage_status",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select usage"
                                        />

                                        <InputField
                                            label="Quantity"
                                            name="quantity"
                                            type="number"
                                            value={vehicle.quantity || ""}
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    livIndex,
                                                    "usage_status",
                                                    "quantity"
                                                )
                                            }
                                            placeholder="Number"
                                        />
                                    </div>

                                    {/* Right: remove button */}
                                    <button
                                        type="button"
                                        onClick={() => removeVehicle(vecIndex)}
                                        className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                        title="Remove"
                                    >
                                        <IoIosCloseCircleOutline />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addVehicle()}
                                className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                title="Add vehicle"
                            >
                                <IoIosAddCircleOutline className="text-4xl" />
                                <span className="ml-1">Add Vehicle</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Section1;
