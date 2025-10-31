import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { toTitleCase } from "@/utils/stringFormat";

const Section1 = ({
    data,
    setData,
    handleArrayValues,
    errors,
    showMaidenMiddleName,
    barangays = [],
    existingImagePath = null,
}) => {
    const addVehicle = () => {
        setData("vehicles", [...(data.vehicles || []), {}]);
    };

    const removeVehicle = (vehicleIndex) => {
        const updated = [...(data.vehicles || [])];
        updated.splice(vehicleIndex, 1);
        setData("vehicles", updated);
    };
    const barangayList = Object.entries(barangays).map(([id, name]) => ({
        label: name,
        value: id,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col mb-6">
                {/* Header */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                    Resident Information
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Please provide the personal details of the resident. Fields
                    marked with <span className="text-red-700">*</span> are
                    required.
                </p>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-4 md:gap-x-6">
                {/* Profile Photo */}
                <div className="md:row-span-2 flex flex-col items-center space-y-3">
                    <InputLabel
                        htmlFor="resident_image"
                        value="Profile Photo"
                    />
                    <img
                        src={
                            data.resident_image instanceof File
                                ? URL.createObjectURL(data.resident_image)
                                : existingImagePath ||
                                "/images/default-avatar.jpg"
                        }
                        alt="Resident Image"
                        className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
                    />
                    <input
                        id="resident_image"
                        type="file"
                        name="resident_image"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setData("resident_image", file);
                        }}
                        className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <InputError
                        message={errors.resident_image}
                        className="mt-1"
                    />
                    <p className="text-xs text-gray-500 text-center mt-1">
                        Upload a clear profile photo (JPEG, PNG). Max size 5MB.
                    </p>
                </div>

                {/* Names and basic info */}
                <div className="md:col-span-5 space-y-4">
                    {/* Names */}
                    <div
                        className={`grid gap-3 grid-cols-1 sm:grid-cols-2 md:${showMaidenMiddleName ? "grid-cols-4" : "grid-cols-3"
                            }`}
                    >
                        <div>
                            <InputField
                                label="Last Name"
                                name="lastname"
                                value={data.lastname || ""}
                                placeholder="Enter last name"
                                onChange={(e) =>
                                    setData("lastname", toTitleCase(e.target.value))
                                }
                                required
                            />
                            <InputError
                                message={errors.lastname}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputField
                                label="First Name"
                                name="firstname"
                                value={data.firstname || ""}
                                placeholder="Enter first name"
                                onChange={(e) =>
                                    setData("firstname", toTitleCase(e.target.value))
                                }
                                required
                            />
                            <InputError
                                message={errors.firstname}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Middle Name"
                                name="middlename"
                                value={data.middlename || ""}
                                placeholder="Enter middle name"
                                onChange={(e) =>
                                    setData("middlename", toTitleCase(e.target.value))
                                }
                            />
                            <InputError
                                message={errors.middlename}
                                className="mt-1"
                            />
                        </div>
                        {showMaidenMiddleName && (
                            <div>
                                <InputField
                                    label="Maiden Middle Name"
                                    name="maiden_middle_name"
                                    value={data.maiden_middle_name || ""}
                                    placeholder="Enter maiden middle name"
                                    onChange={(e) =>
                                        setData(
                                            "maiden_middle_name",
                                            toTitleCase(e.target.value)
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.maiden_middle_name}
                                    className="mt-1"
                                />
                            </div>
                        )}
                    </div>

                    {/* Other personal info */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                            <DropdownInputField
                                label="Suffix"
                                name="suffix"
                                value={data.suffix}
                                items={["Jr.", "Sr.", "III", "IV"]}
                                placeholder="Select suffix"
                                onChange={(e) =>
                                    setData("suffix", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.suffix}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Suffix is optional.
                            </p>
                        </div>
                        <div>
                            <DropdownInputField
                                label="Civil Status"
                                name="civil_status"
                                value={data.civil_status || ""}
                                items={[
                                    "Single",
                                    "Married",
                                    "Widowed",
                                    "Divorced",
                                    "Separated",
                                    "Annulled",
                                ]}
                                placeholder="Select civil status"
                                onChange={(e) =>
                                    setData(
                                        "civil_status",
                                        e.target.value.toLowerCase()
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.civil_status}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Select the resident's current civil status.
                            </p>
                        </div>
                        <div>
                            <RadioGroup
                                label="Sex"
                                name="sex"
                                options={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                ]}
                                selectedValue={data.sex || ""}
                                onChange={(e) => setData("sex", e.target.value)}
                                required
                            />
                            <InputError message={errors.sex} className="mt-1" />
                        </div>
                        <div>
                            <DropdownInputField
                                label="Gender"
                                name="gender"
                                items={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                    { label: "LGBTQ+", value: "lgbtq" },
                                ]}
                                value={data.gender || ""}
                                onChange={(e) =>
                                    setData("gender", e.target.value)
                                }
                                placeholder={"Select gender"}
                            />
                            <InputError
                                message={errors.gender}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Gender identity (optional, can differ from sex).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* BIRTH & CITIZENSHIP */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
                <h3 className="text-lg font-semibold text-gray-700">
                    Birth & Citizenship
                </h3>
                <p className="text-sm text-gray-500">
                    Please provide the resident's birth information and
                    citizenship details.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Birth Date */}
                    <div>
                        <InputField
                            type="date"
                            label="Birth Date"
                            name="birthdate"
                            value={data.birthdate || ""}
                            required
                            onChange={(e) => {
                                setData("birthdate", e.target.value);
                                // Calculate age based on birthdate
                                const birthDate = new Date(e.target.value);
                                const today = new Date();
                                const calculatedAge =
                                    today.getFullYear() -
                                    birthDate.getFullYear();
                                if (calculatedAge >= 0)
                                    setData("age", calculatedAge);
                            }}
                        />
                        <InputError
                            message={errors.birthdate}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Select the resident's birth date. Age will be
                            calculated automatically.
                        </p>
                    </div>

                    {/* Birth Place */}
                    <div>
                        <InputField
                            label="Birth Place"
                            name="birthplace"
                            value={data.birthplace || ""}
                            placeholder="Enter birth place"
                            required
                            onChange={(e) =>
                                setData("birthplace", toTitleCase(e.target.value))
                            }
                        />
                        <InputError
                            message={errors.birthplace}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Specify the city or municipality where the resident
                            was born.
                        </p>
                    </div>

                    {/* Religion */}
                    <div>
                        <DropdownInputField
                            label="Religion"
                            name="religion"
                            value={data.religion || ""}
                            items={[
                                "Roman Catholic",
                                "Iglesia ni Cristo",
                                "Born Again",
                                "Baptists",
                            ]}
                            placeholder="Select religion"
                            required
                            onChange={(e) =>
                                setData("religion", toTitleCase(e.target.value))
                            }
                        />
                        <InputError
                            message={errors.religion}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Choose the resident's religious affiliation.
                        </p>
                    </div>

                    {/* Ethnicity */}
                    <div>
                        <DropdownInputField
                            label="Ethnicity"
                            name="ethnicity"
                            value={data.ethnicity || ""}
                            items={[
                                "Ilocano",
                                "Ibanag",
                                "Tagalog",
                                "Indigenous People",
                            ]}
                            placeholder="Select ethnicity"
                            required
                            onChange={(e) =>
                                setData("ethnicity", toTitleCase(e.target.value))
                            }
                        />
                        <InputError
                            message={errors.ethnicity}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Select the resident's ethnic group.
                        </p>
                    </div>

                    {/* Citizenship */}
                    <div>
                        <DropdownInputField
                            label="Citizenship"
                            name="citizenship"
                            value={data.citizenship || ""}
                            items={["Filipino", "Chinese", "American"]}
                            placeholder="Select citizenship"
                            required
                            onChange={(e) =>
                                setData("citizenship", toTitleCase(e.target.value))
                            }
                        />
                        <InputError
                            message={errors.citizenship}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Specify the resident's citizenship.
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTACT & RESIDENCY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Contact Info */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Contact Information
                    </h3>
                    <p className="text-sm text-gray-500">
                        Provide the resident's current contact details. Include
                        at least one method of contact.
                    </p>

                    <div className="space-y-3">
                        <div>
                            <InputField
                                label="Contact Number"
                                name="contactNumber"
                                value={data.contactNumber || ""}
                                placeholder="Enter contact number"
                                onChange={(e) =>
                                    setData("contactNumber", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.contactNumber}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Include country code if applicable (e.g., +63
                                912 345 6789).
                            </p>
                        </div>

                        <div>
                            <InputField
                                label="Email"
                                name="email"
                                value={data.email || ""}
                                placeholder="Enter email"
                                type="email"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide a valid email address for official
                                communication.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Residency Info */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Residency Information
                    </h3>
                    <p className="text-sm text-gray-500">
                        Specify the type and duration of the resident's stay.
                    </p>

                    <div className="space-y-3">
                        <div>
                            <SelectField
                                label="Residency Type"
                                name="residency_type"
                                value={data.residency_type || ""}
                                required
                                items={[
                                    { label: "Permanent", value: "permanent" },
                                    { label: "Temporary", value: "temporary" },
                                    { label: "Immigrant", value: "immigrant" },
                                ]}
                                onChange={(e) =>
                                    setData("residency_type", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.residency_type}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Permanent residents live in the area
                                indefinitely. Temporary and immigrant residents
                                may have limited stay periods.
                            </p>
                        </div>

                        <div>
                            <YearDropdown
                                label="Residency Date"
                                name="residency_date"
                                value={data.residency_date || ""}
                                required
                                placeholder="Select residency date"
                                onChange={(e) =>
                                    setData("residency_date", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.residency_date}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Specify the year the resident started living in
                                the area.
                            </p>
                        </div>

                        {/* Optional Household/Family Head Radios (commented out) */}
                        {/*
            <div className="flex flex-col sm:flex-row gap-6 mt-2">
                <div>
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
                    <InputError
                        message={errors.is_household_head}
                        className="mt-1"
                    />
                </div>
                <div>
                    <RadioGroup
                        label="Family Head?"
                        name="is_family_head"
                        selectedValue={parseInt(data.is_family_head)}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) =>
                            setData("is_family_head", e.target.value)
                        }
                    />
                    <InputError
                        message={errors.is_family_head}
                        className="mt-1"
                    />
                </div>
            </div>
            */}
                    </div>
                </div>
            </div>

            {/* GOVERNMENT PROGRAMS */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4 mt-6">
                <h3 className="text-lg font-semibold text-gray-700">
                    Government Programs
                </h3>
                <p className="text-sm text-gray-500">
                    Indicate if the resident is part of any government programs
                    or registered as a voter.
                </p>

                {/* Primary Program Fields */}
                <div
                    className={`grid grid-cols-1 sm:grid-cols-2 ${data.is_solo_parent == 1
                        ? "md:grid-cols-4"
                        : "md:grid-cols-3"
                        } gap-4`}
                >
                    {/* 4Ps Beneficiary */}
                    <div>
                        <RadioGroup
                            label="4Ps Beneficiary"
                            name="is_4ps_beneficiary"
                            selectedValue={data.is_4ps_beneficiary || ""}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("is_4ps_beneficiary", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.is_4ps_beneficiary}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Specify if the resident is a beneficiary of the
                            Pantawid Pamilyang Pilipino Program (4Ps).
                        </p>
                    </div>

                    {/* Solo Parent */}
                    <div>
                        <RadioGroup
                            label="Solo Parent"
                            name="is_solo_parent"
                            selectedValue={data.is_solo_parent || ""}
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            onChange={(e) =>
                                setData("is_solo_parent", e.target.value)
                            }
                            required
                        />
                        <InputError
                            message={errors.is_solo_parent}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Indicate if the resident is a solo parent.
                        </p>
                    </div>

                    {/* Solo Parent ID (conditional) */}
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
                                placeholder="Enter ID number"
                            />
                            <InputError
                                message={errors.solo_parent_id_number}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide the solo parent ID number issued by the
                                DSWD.
                            </p>
                        </div>
                    )}

                    {/* Registered Voter */}
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
                            required
                        />
                        <InputError
                            message={errors.registered_voter}
                            className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Specify if the resident is a registered voter.
                        </p>
                    </div>
                </div>

                {/* Voter Information (conditional) */}
                {data.registered_voter == 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        {/* Voting Status */}
                        <div>
                            <DropdownInputField
                                label="Voting Status"
                                name="voting_status"
                                value={data.voting_status || ""}
                                items={[
                                    { label: "Active", value: "active" },
                                    { label: "Inactive", value: "inactive" },
                                    {
                                        label: "Disqualified",
                                        value: "disqualified",
                                    },
                                    { label: "Medical", value: "medical" },
                                    { label: "Overseas", value: "overseas" },
                                    { label: "Detained", value: "detained" },
                                    { label: "Deceased", value: "deceased" },
                                ]}
                                placeholder="Select status"
                                onChange={(e) =>
                                    setData("voting_status", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.voting_status}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Choose the resident's current voter registration
                                status.
                            </p>
                        </div>

                        {/* Voter ID Number */}
                        <div>
                            <InputField
                                label="Voter ID Number"
                                name="voter_id_number"
                                value={data.voter_id_number || ""}
                                placeholder="Enter voter ID number"
                                onChange={(e) =>
                                    setData("voter_id_number", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.voter_id_number}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Provide the official voter ID number if
                                available.
                            </p>
                        </div>

                        {/* Registered Barangay */}
                        <div>
                            <DropdownInputField
                                label="Registered Barangay"
                                name="registered_barangay"
                                value={data.registered_barangay || ""}
                                items={barangayList}
                                placeholder="Select registered barangay"
                                onChange={(e) =>
                                    setData(
                                        "registered_barangay",
                                        e.target.value
                                    )
                                }
                            />
                            <InputError
                                message={errors.registered_barangay}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Choose the barangay where the resident is
                                officially registered to vote.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SENIOR CITIZEN (CONDITIONAL) */}
            {data.age >= 60 && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4 mt-6">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Senior Citizen Information
                    </h3>
                    <p className="text-sm text-gray-500">
                        Provide details for residents aged 60 and above. This
                        includes pension and living arrangements.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Pensioner Status */}
                        <div>
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
                            <InputError
                                message={errors.is_pensioner}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Indicate if the resident is receiving a pension.
                            </p>
                        </div>

                        {/* Conditional Pension Details */}
                        {data.is_pensioner === "yes" && (
                            <>
                                <div>
                                    <InputField
                                        label="OSCA ID Number"
                                        name="osca_id_number"
                                        type="number"
                                        value={data.osca_id_number || ""}
                                        placeholder="Enter OSCA ID number"
                                        onChange={(e) =>
                                            setData(
                                                "osca_id_number",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.osca_id_number}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter the official OSCA ID number issued
                                        to the senior citizen.
                                    </p>
                                </div>

                                <div>
                                    <DropdownInputField
                                        label="Pension Type"
                                        name="pension_type"
                                        value={data.pension_type || ""}
                                        items={[
                                            "SSS",
                                            "DSWD",
                                            "GSIS",
                                            "Private",
                                            "None",
                                        ]}
                                        placeholder="Select or enter pension type"
                                        onChange={(e) =>
                                            setData(
                                                "pension_type",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.pension_type}
                                        className="mt-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Choose the type of pension the resident
                                        is receiving.
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Living Alone */}
                        <div>
                            <RadioGroup
                                label="Living Alone"
                                name="living_alone"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.living_alone ?? ""}
                                onChange={(e) =>
                                    setData("living_alone", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.living_alone}
                                className="mt-1"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Indicate if the senior citizen lives alone or
                                with family/others.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* VEHICLE INFORMATION */}
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mt-6">
                <h3 className="text-lg font-semibold text-gray-700">
                    Vehicle Information
                </h3>
                <p className="text-sm text-gray-500">
                    Provide information about vehicles owned by the resident,
                    including type, classification, usage, and registration
                    status.
                </p>

                {/* Own Vehicle */}
                <div className="mt-3">
                    <RadioGroup
                        label="Owns Vehicle(s)?"
                        name="has_vehicle"
                        selectedValue={data.has_vehicle}
                        options={[
                            { label: "Yes", value: 1 },
                            { label: "No", value: 0 },
                        ]}
                        onChange={(e) => setData("has_vehicle", e.target.value)}
                        required
                    />
                    <InputError message={errors.has_vehicle} className="mt-1" />
                </div>

                {/* Vehicle List */}
                {data.has_vehicle == 1 && (
                    <div className="space-y-4 mt-4">
                        {(data.vehicles || []).map((vehicle, vecIndex) => (
                            <div
                                key={vecIndex}
                                className="border p-4 rounded-md relative bg-gray-50 shadow-sm"
                            >
                                <div className="grid md:grid-cols-4 gap-4">
                                    {/* Vehicle Type */}
                                    <div>
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
                                                    vecIndex,
                                                    "vehicle_type",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select type"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                `vehicles.${vecIndex}.vehicle_type`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Specify the type of vehicle.
                                        </p>
                                    </div>

                                    {/* Vehicle Classification */}
                                    <div>
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
                                                    vecIndex,
                                                    "vehicle_class",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select class"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                `vehicles.${vecIndex}.vehicle_class`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Indicate if the vehicle is for
                                            private or public use.
                                        </p>
                                    </div>

                                    {/* Usage Purpose */}
                                    <div>
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
                                                    vecIndex,
                                                    "usage_status",
                                                    "vehicles"
                                                )
                                            }
                                            placeholder="Select usage"
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                `vehicles.${vecIndex}.usage_status`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Choose how the vehicle is primarily
                                            used.
                                        </p>
                                    </div>

                                    {/* Registration Status */}
                                    <div>
                                        <RadioGroup
                                            label="Is Registered?"
                                            name="is_registered"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={
                                                vehicle.is_registered || ""
                                            }
                                            onChange={(e) =>
                                                handleArrayValues(
                                                    e,
                                                    vecIndex,
                                                    "is_registered",
                                                    "vehicles"
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                `vehicles.${vecIndex}.is_registered`
                                                ]
                                            }
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Indicate if the vehicle is
                                            officially registered.
                                        </p>
                                    </div>
                                </div>

                                {/* Remove Vehicle Button */}
                                <button
                                    type="button"
                                    onClick={() => removeVehicle(vecIndex)}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-2xl transition-colors duration-200"
                                    title="Remove Vehicle"
                                >
                                    <IoIosCloseCircleOutline />
                                </button>
                            </div>
                        ))}

                        {/* Add Vehicle Button */}
                        <button
                            type="button"
                            onClick={addVehicle}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                            title="Add Vehicle"
                        >
                            <IoIosAddCircleOutline className="text-4xl" />
                            <span className="ml-2">Add Vehicle</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Section1;
