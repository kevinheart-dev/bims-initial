import { useState, useEffect, useContext } from "react";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { useForm } from "@inertiajs/react";
import InputError from "../InputError";
import { Button } from "../ui/button";
import InputLabel from "../InputLabel";
import RadioGroup from "../RadioGroup";
import YearDropdown from "../YearDropdown";
import SelectField from "../SelectField";

const PersonalInformation = ({
    puroks,
    occupationTypes = null,
    streets = null,
    households = null,
}) => {
    const { data, setData, post, errors } = useForm({
        resident_image: null,
        lastname: "",
        firstname: "",
        middlename: "",
        suffix: "",
        birthdate: "",
        age: 0,
        birthplace: "",
        civil_status: "",
        gender: "",
        maiden_middle_name: "",
        citizenship: "",
        religion: "",
        ethnicity: "",
        contactNumber: "",
        email: "",
        residency_type: "",
        residency_date: "",
        is_household_head: null,
        purok_number: null,
        purok_id: null,
        street_id: null,
        street_name: "",
        subdivision: "",
        housenumber: null,
        household_id: null,
        is_4ps_benificiary: null,
        is_solo_parent: null,
        solo_parent_id_number: "",
        voter_id_number: "",
        voting_status: "",
        registered_voter: 0,
        has_vehicle: null,
        vehicles: [],
        is_student: null,
        school_name: "",
        school_type: "",
        current_level: "",
        education: "",
        education_status: "",
        osc: null,
        osy: null,
        year_started: "",
        year_ended: "",
        program: "",
        year_graduated: "",
        occupations: [],
        is_pensioner: "",
        osca_id_number: "",
        pension_type: "",
        living_alone: null,
        weight: 0,
        height: 0,
        bmi: 0,
        nutrition_status: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_contact_relationship: "",
        blood_type: "",
        has_philhealth: null,
        philhealth_number: "",
        is_pwd: null,
        pwd_id_number: "",
        is_alcohol_user: null,
        is_smoker: null,
        disabilities: [],
        ownership_type: "",
        housing_condition: "",
        house_structure: "",
        year_established: "",
        number_of_rooms: "",
        number_of_floors: "",
        bath_and_wash_area: "",
        toilet_type: "",
        electricity_type: "",
        water_source_type: "",
        waste_management_type: "",
        type_of_internet: "",
        has_livestock: null,
        livestocks: [],
        has_pets: null,
        pets: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("resident.store"));
    };

    const showMaidenMiddleName =
        ["female", "LGBTQ"].includes(data.gender) &&
        ["married", "widowed", "Separated"].includes(data.civil_status);

    const addOccupation = () => {
        setData("occupations", [...(data.occupations || []), {}]);
    };

    const removeOccupation = (occIndex) => {
        const updated = [...(data.occupations || [])];
        updated.splice(occIndex, 1);
        setData("occupations", updated);
    };

    const addDisability = () => {
        setData("disabilities", [...(data.disabilities || []), {}]);
    };

    const removeDisability = (disAbIndex) => {
        const updated = [...(data.disabilities || [])];
        updated.splice(disAbIndex, 1);
        setData("disabilities", updated);
    };

    const addLivestock = () => {
        setData("livestocks", [...(data.livestocks || []), {}]);
    };

    const removeLivestock = (livestockIndex) => {
        const updated = [...(data.livestocks || [])];
        updated.splice(livestockIndex, 1);
        setData("livestocks", updated);
    };

    const addPet = () => {
        setData("pets", [...(data.pets || []), {}]);
    };

    const removePet = (petIndex) => {
        const updated = [...(data.pets || [])];
        updated.splice(petIndex, 1);
        setData("pets", updated);
    };

    const addVehicle = () => {
        setData("vehicles", [...(data.vehicles || []), {}]);
    };

    const removeVehicle = (vehicleIndex) => {
        const updated = [...(data.vehicles || [])];
        updated.splice(vehicleIndex, 1);
        setData("vehicles", updated);
    };

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const streetList = streets.map((street) => ({
        label: street.street_name,
        value: street.id.toString(),
    }));

    const householdList = households.map((house) => ({
        label:
            house.household.house_number.toString().padStart(4, "0") + // pad to 4 digits
            " || " +
            house.lastname +
            "'s Residence",
        value: house.household.id.toString(),
    }));

    useEffect(() => {
        if (data.weight_kg > 0 && data.height_cm > 0) {
            const heightInMeters = data.height_cm / 100;
            const bmi = data.weight_kg / (heightInMeters * heightInMeters);
            const roundedBmi = bmi.toFixed(2);

            let status = "";

            if (bmi < 16) {
                status = "severly_underweight";
            } else if (bmi >= 16 && bmi < 18.5) {
                status = "underweight";
            } else if (bmi >= 18.5 && bmi < 25) {
                status = "normal";
            } else if (bmi >= 25 && bmi < 30) {
                status = "overweight";
            } else {
                status = "obese";
            }

            setData("bmi", roundedBmi);
            setData("nutrition_status", status);
        } else {
            setData("bmi", 0);
            setData("nutrition_status", "");
        }
    }, [data.weight_kg, data.height_cm]);

    useEffect(() => {
        if (data.housenumber) {
            const selectedHousehold = households.find(
                (house) => house.household.id === Number(data.housenumber)
            );

            if (selectedHousehold) {
                const { household } = selectedHousehold;
                const updates = {
                    household_id: household.household_id,
                    street_id: household.street_id,
                    street_name: household.street?.street_name || "",
                    purok_id: household.purok_id,
                    purok_number: household.purok?.purok_number || "",
                };

                // Apply all updates
                Object.entries(updates).forEach(([key, value]) =>
                    setData(key, value)
                );
            }
        }
    }, [data.housenumber, households]);

    return (
        <div>
            <form onSubmit={onSubmit}>
                {/* Section 1 */}
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                            Resident Information
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Kindly provide the personal information of the
                            resident.
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
                                        ? URL.createObjectURL(
                                              data.resident_image
                                          )
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
                                    showMaidenMiddleName
                                        ? "grid-cols-4"
                                        : "grid-cols-3"
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
                                            setData(
                                                "firstname",
                                                e.target.value
                                            );
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
                                            setData(
                                                "middlename",
                                                e.target.value
                                            );
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
                                        const birthDate = new Date(
                                            e.target.value
                                        );
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
                                            setData(
                                                "contactNumber",
                                                e.target.value
                                            );
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
                                            setData(
                                                "residency_type",
                                                e.target.value
                                            )
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
                                            setData(
                                                "residency_date",
                                                e.target.value
                                            )
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
                                    selectedValue={parseInt(
                                        data.is_household_head
                                    )}
                                    options={[
                                        { label: "Yes", value: 1 },
                                        { label: "No", value: 0 },
                                    ]}
                                    onChange={(e) =>
                                        setData(
                                            "is_household_head",
                                            e.target.value
                                        )
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
                                    setData(
                                        "is_4ps_benificiary",
                                        e.target.value
                                    )
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
                                        setData(
                                            "registered_voter",
                                            e.target.value
                                        )
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
                                                setData(
                                                    "voting_status",
                                                    e.target.value
                                                )
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
                                                setData(
                                                    "pension_type",
                                                    e.target.value
                                                )
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
                                            selectedValue={
                                                data.living_alone || null
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "living_alone",
                                                    e.target.value
                                                )
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
                                onChange={(e) =>
                                    setData("has_vehicle", e.target.value)
                                }
                            />
                            {data.has_vehicle == 1 && (
                                <div className="space-y-4 mt-4">
                                    {(data.vehicles || []).map(
                                        (vehicle, vecIndex) => (
                                            <div
                                                key={vecIndex}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                {/* Left: input fields */}
                                                <div className="grid md:grid-cols-4 gap-4">
                                                    <DropdownInputField
                                                        label="Vehicle Type"
                                                        name="vehicle_type"
                                                        value={
                                                            vehicle.vehicle_type ||
                                                            ""
                                                        }
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
                                                        value={
                                                            vehicle.vehicle_class ||
                                                            ""
                                                        }
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
                                                        value={
                                                            vehicle.usage_status ||
                                                            ""
                                                        }
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
                                                        value={
                                                            vehicle.quantity ||
                                                            ""
                                                        }
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
                                                    onClick={() =>
                                                        removeVehicle(vecIndex)
                                                    }
                                                    className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                    title="Remove"
                                                >
                                                    <IoIosCloseCircleOutline />
                                                </button>
                                            </div>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => addVehicle()}
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                        title="Add vehicle"
                                    >
                                        <IoIosAddCircleOutline className="text-4xl" />
                                        <span className="ml-1">
                                            Add Vehicle
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* <Section1
                    data={data}
                    setData={setData}
                    handleArrayValues={handleArrayValues}
                    errors={errors}
                    showMaidenMiddleName={showMaidenMiddleName}
                /> */}

                {/* image, firstname, lastname, middlename, maidenname, suffix */}
                {/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="flex flex-col items-center">
                        <InputLabel
                            htmlFor="resident-image-path"
                            value="Resident Image"
                        />

                        <img
                            src={
                                data.resident_image instanceof File
                                    ? URL.createObjectURL(data.resident_image)
                                    : data.resident_image ||
                                      "/images/default-avatar.jpg"
                            }
                            alt="Resident"
                            className="w-40 h-40 object-cover rounded-full mb-4"
                        />

                        <TextInput
                            id="resident-image-path"
                            type="file"
                            name="resident_image"
                            className="mt-1"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData("resident_image", file);
                                }
                            }}
                        />

                        <InputError
                            message={errors.resident_image}
                            className="mt-2"
                        />
                    </div>
                    <div className="flex flex-col w-full items-stretch">
                        <div className="grid md:grid-cols-2 gap-4">
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
                        </div>
                        <div
                            className={`grid gap-4 ${
                                showMaidenMiddleName
                                    ? "grid-cols-3"
                                    : "grid-cols-2"
                            } md:${
                                showMaidenMiddleName
                                    ? "grid-cols-3"
                                    : "grid-cols-2"
                            }`}
                        >
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
                    </div>
                </div> */}

                {/* birthday, birthplace, civil_status, gender */}
                {/* <div className="grid md:grid-cols-4 gap-4">
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
                                { label: "Female", value: "female" },
                                { label: "LGBTQIA+", value: "LGBTQ" },
                            ]}
                            selectedValue={data.gender || ""}
                            onChange={(e) => setData("gender", e.target.value)}
                        />

                        <InputError message={errors.gender} className="mt-2" />
                    </div>
                </div> */}

                {/* religion, ethnicity, citizenship, contact number */}
                {/* <div className="grid md:grid-cols-4 gap-4">
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
                </div> */}

                {/* email, residency type, residency date, purok, registered voter */}
                {/* <div className="grid md:grid-cols-5 gap-4">
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
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div>
                        <SelectField
                            label="Residency type"
                            name="residency_type"
                            value={data.residency_type}
                            onChange={(e) =>
                                setData("residency_type", e.target.value)
                            }
                            items={[
                                { label: "Permanent", value: "permanent" },
                                { label: "Temporary", value: "temporary" },
                                { label: "Migrant", value: "migrant" },
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
                    <div>
                        <SelectField
                            label="Purok Number"
                            name="purok_number"
                            value={data.purok_number || ""}
                            onChange={(e) =>
                                setData("purok_number", e.target.value)
                            }
                            items={purok_numbers}
                        />
                        <InputError
                            message={errors.purok_number}
                            className="mt-2"
                        />
                    </div>
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
                </div> */}

                {/* <div className="grid md:grid-cols-4 gap-4">
                    <div>
                        <InputField
                            type="text"
                            label="House/Unit No./Lot/Blk No."
                            name="housenumber"
                            value={data.housenumber || ""}
                            onChange={(e) =>
                                setData("housenumber", e.target.value)
                            }
                            placeholder="e.g., Lot 12 Blk 7 or Unit 3A"
                        />
                        <InputError
                            message={errors.housenumber}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputField
                            type="text"
                            label="Street Name"
                            name="street"
                            value={data.street || ""}
                            onChange={(e) => setData("street", e.target.value)}
                            placeholder="e.g., Rizal St., Mabini Avenue"
                        />
                        <InputError message={errors.street} className="mt-2" />
                    </div>

                    <div>
                        <InputField
                            type="text"
                            label="Subdivision/Village/Compound"
                            name="subdivision"
                            value={data.subdivision || ""}
                            onChange={(e) =>
                                setData("subdivision", e.target.value)
                            }
                            placeholder="e.g., Villa Gloria Subdivision"
                        />
                        <InputError
                            message={errors.subdivision}
                            className="mt-2"
                        />
                    </div>

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
                </div> */}

                {/* <div className="grid md:grid-cols-4 gap-4">
                    {data.age >= 60 && (
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
                    )}

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
                </div> */}

                {/* Section 2 */}
                <div>
                    <div className="flex flex-col mt-12">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                            Education and Occupation
                        </h2>
                        <p className="text-sm text-gray-600 mb-3">
                            Please provide the resident education background and
                            current occupation.
                        </p>
                    </div>

                    {/* ask student if studying or not */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <RadioGroup
                            label="Currently studying"
                            name="is_student"
                            options={[
                                { label: "Yes", value: 1 },
                                { label: "No", value: 0 },
                            ]}
                            selectedValue={data.is_student || ""}
                            onChange={(e) =>
                                setData("is_student", e.target.value)
                            }
                        />
                    </div>

                    {data.is_student == 1 && (
                        <div className="grid md:grid-cols-4 gap-4 my-4">
                            <div>
                                <InputField
                                    label="School Name"
                                    name="school_name"
                                    type="text"
                                    value={data.school_name || ""}
                                    onChange={(e) =>
                                        setData("school_name", e.target.value)
                                    }
                                    placeholder="Enter school name"
                                />
                                <InputError
                                    message={errors.school_name}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <RadioGroup
                                    label="School Type"
                                    name="school_type"
                                    options={[
                                        { label: "Public", value: "public" },
                                        { label: "Private", value: "private" },
                                    ]}
                                    selectedValue={data.school_type || ""}
                                    onChange={(e) =>
                                        setData("school_type", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.school_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Current Level"
                                    name="current_level"
                                    value={data.current_level || ""}
                                    onChange={(e) =>
                                        setData("current_level", e.target.value)
                                    }
                                    items={[
                                        {
                                            label: "Elementary",
                                            value: "elementary",
                                        },
                                        {
                                            label: "High School",
                                            value: "high_school",
                                        },
                                        { label: "College", value: "college" },
                                        {
                                            label: "Vocational",
                                            value: "vocational",
                                        },
                                        {
                                            label: "Post Grad",
                                            value: "post_grad",
                                        },
                                    ]}
                                    placeholder="Select school level"
                                />
                                <InputError
                                    message={errors.current_level}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    )}
                    {data.is_student == 0 && (
                        <>
                            <div className="grid md:grid-cols-2 gap-10 mt-4">
                                <div className="grid md:grid-cols-2 gap-2">
                                    <div>
                                        <DropdownInputField
                                            label="Highest Educational Attainment"
                                            name="education"
                                            value={data.education || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "education",
                                                    e.target.value
                                                )
                                            }
                                            items={[
                                                {
                                                    label: "No Formal Education",
                                                    value: "no_formal_education",
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
                                                    label: "College",
                                                    value: "college",
                                                },
                                                {
                                                    label: "Post Grad",
                                                    value: "post_grad",
                                                },
                                                {
                                                    label: "Vocational",
                                                    value: "vocational",
                                                },
                                            ]}
                                            placeholder="Select your Educational Attainment"
                                        />
                                        <InputError
                                            message={errors.education}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <RadioGroup
                                            label="Educational Status"
                                            name="education_status"
                                            options={[
                                                {
                                                    label: "Graduate",
                                                    value: "graduate",
                                                },
                                                {
                                                    label: "Undergraduate",
                                                    value: "undergraduate",
                                                },
                                            ]}
                                            selectedValue={
                                                data.education_status || ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "education_status",
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                data.education ===
                                                "no_formal_education"
                                            }
                                        />
                                        <InputError
                                            message={errors.education_status}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {data.age >= 6 && data.age <= 14 && (
                                        <div>
                                            <RadioGroup
                                                label="Out of School Children (6-14 years old)"
                                                name="osc"
                                                options={[
                                                    { label: "Yes", value: 1 },
                                                    { label: "No", value: 0 },
                                                ]}
                                                selectedValue={data.osc || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "osc",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.osc}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                    {data.age >= 15 && data.age <= 24 && (
                                        <div>
                                            <RadioGroup
                                                label="Out of School Youth (15-24 years old)"
                                                name="osy"
                                                options={[
                                                    { label: "Yes", value: 1 },
                                                    { label: "No", value: 0 },
                                                ]}
                                                selectedValue={data.osy || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "osy",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.osy}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <InputField
                                        label="School Name"
                                        name="school_name"
                                        type="text"
                                        value={data.school_name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "school_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter school name"
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.school_name}
                                        className="mt-2"
                                    />
                                </div>
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
                                        selectedValue={data.school_type || ""}
                                        onChange={(e) =>
                                            setData(
                                                "school_type",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.school_type}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <YearDropdown
                                        label="Year Started"
                                        name="year_started"
                                        value={data.year_started || ""}
                                        onChange={(e) =>
                                            setData(
                                                "year_started",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.year_started}
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <YearDropdown
                                        label="Year Ended"
                                        name="year_ended"
                                        value={data.year_ended || ""}
                                        onChange={(e) =>
                                            setData(
                                                "year_ended",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            data.education ===
                                            "no_formal_education"
                                        }
                                    />
                                    <InputError
                                        message={errors.year_ended}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4 my-4">
                                {data.education === "college" &&
                                    data.education_status === "graduate" && (
                                        <div>
                                            <InputField
                                                label="Finised Course"
                                                name="program"
                                                type="text"
                                                value={data.program || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "program",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter your course"
                                                disabled={
                                                    data.education ===
                                                    "no_formal_education"
                                                }
                                            />
                                            <InputError
                                                message={errors.program}
                                                className="mt-2"
                                            />
                                        </div>
                                    )}

                                {data.education_status === "graduate" && (
                                    <div>
                                        <YearDropdown
                                            label="Year Graduated"
                                            name="year_graduated"
                                            value={data.year_ended || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "year_graduated",
                                                    e.target.value
                                                )
                                            }
                                            disabled
                                        />
                                        <InputError
                                            message={errors.year_graduated}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Section 3 */}
                {/* occupations */}
                <div>
                    <hr className="h-px bg-sky-500 border-0 transform scale-y-100 origin-center" />
                    <p className="font-bold my-2 text-lg">
                        Occupation Background
                    </p>

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
                                            value={
                                                occupation.employment_status ||
                                                ""
                                            }
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    employment_status:
                                                        e.target.value,
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
                                            value={
                                                occupation.employment_type || ""
                                            }
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    employment_type:
                                                        e.target.value,
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
                                            value={
                                                occupation.occupation_status ||
                                                ""
                                            }
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    occupation_status:
                                                        e.target.value,
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
                                                occupation.work_arrangement ||
                                                ""
                                            }
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    work_arrangement:
                                                        e.target.value,
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
                                                value={
                                                    occupation.started_at || ""
                                                }
                                                onChange={(e) => {
                                                    const updated = [
                                                        ...(data.occupations ||
                                                            []),
                                                    ];
                                                    updated[occIndex] = {
                                                        ...updated[occIndex],
                                                        started_at:
                                                            e.target.value,
                                                    };
                                                    setData(
                                                        "occupations",
                                                        updated
                                                    );
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
                                                value={
                                                    occupation.ended_at || ""
                                                }
                                                onChange={(e) => {
                                                    const updated = [
                                                        ...(data.occupations ||
                                                            []),
                                                    ];
                                                    updated[occIndex] = {
                                                        ...updated[occIndex],
                                                        ended_at:
                                                            e.target.value,
                                                    };
                                                    setData(
                                                        "occupations",
                                                        updated
                                                    );
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
                                                errors[
                                                    `occupations.${occIndex}.income`
                                                ]
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Income Frequency"
                                            name="income_frequency"
                                            value={
                                                occupation.income_frequency ||
                                                ""
                                            }
                                            onChange={(e) => {
                                                const updated = [
                                                    ...(data.occupations || []),
                                                ];
                                                updated[occIndex] = {
                                                    ...updated[occIndex],
                                                    income_frequency:
                                                        e.target.value,
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

                {/* Section 4 */}
                {/* Medical Information */}
                <div>
                    <h2 className="text-3xl font-semibold text-gray-800 mt-10 mb-1">
                        Medical Information
                    </h2>
                    <p className="text-sm text-gray-600 mb-3">
                        Kindly share your medical history and health-related
                        details.
                    </p>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <InputField
                                label="Weight in Kilograms (KG)"
                                name="weight_kg"
                                value={data.weight_kg || ""}
                                onChange={(e) =>
                                    setData("weight_kg", e.target.value)
                                }
                                placeholder="Enter weight in kg"
                                type="number"
                                step="0.01"
                            />
                            <InputError
                                message={errors.weight_kg}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Height in Centimeters (CM)"
                                name="height_cm"
                                value={data.height_cm || ""}
                                onChange={(e) =>
                                    setData("height_cm", e.target.value)
                                }
                                placeholder="Enter height in cm"
                                type="number"
                                step="0.01"
                            />
                            <InputError
                                message={errors.height_cm}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="BMI"
                                name="bmi"
                                placeholder="BMI is Calculated Automatically"
                                value={data.bmi || ""}
                                disabled={true}
                            />
                            <InputError
                                message={errors.nutrition_status}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Nutrition Status"
                                name="nutrition_status"
                                value={data.nutrition_status || ""}
                                items={[
                                    "normal",
                                    "underweight",
                                    "severly underweight",
                                    "overweight",
                                    "obese",
                                ]}
                                placeholder="Select status"
                                onChange={(e) =>
                                    setData("nutrition_status", e.target.value)
                                }
                                disabled={true}
                            />
                            <InputError
                                message={errors.nutrition_status}
                                className="mt-2"
                            />
                        </div>

                        {/* medical info */}
                        <div>
                            <InputField
                                label="Emergency contact number"
                                name="emergency_contact_number"
                                value={data.emergency_contact_number || ""}
                                onChange={(e) =>
                                    setData(
                                        "emergency_contact_number",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter contact number"
                                type="number"
                            />
                            <InputError
                                message={errors.emergency_contact_number}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Emergency contact name"
                                name="emergency_contact_name"
                                value={data.emergency_contact_name || ""}
                                onChange={(e) =>
                                    setData(
                                        "emergency_contact_name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter contact name"
                            />
                            <InputError
                                message={errors.emergency_contact_name}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                label="Emergency Contact Relationship"
                                name="emergency_contact_relationship"
                                value={
                                    data.emergency_contact_relationship || ""
                                }
                                onChange={(e) =>
                                    setData(
                                        "emergency_contact_relationship",
                                        e.target.value
                                    )
                                }
                                placeholder="Select relationship"
                                items={[
                                    "Mother",
                                    "Father",
                                    "Sibling",
                                    "Grandparent",
                                    "Relative",
                                    "Neighbor",
                                    "Friend",
                                    "Guardian",
                                    "Other",
                                ]}
                            />
                            <InputError
                                message={errors.emergency_contact_relationship}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                label="Blood Type"
                                name="blood_type"
                                value={data.blood_type || ""}
                                onChange={(e) =>
                                    setData("blood_type", e.target.value)
                                }
                                placeholder="Select blood type"
                                items={[
                                    "A+",
                                    "A−",
                                    "B+",
                                    "B−",
                                    "AB+",
                                    "AB−",
                                    "O+",
                                    "O−",
                                ]}
                            />
                            <InputError
                                message={errors.blood_type}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <RadioGroup
                                label="Are you a PhilHealth data?"
                                name="has_philhealth"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.has_philhealth || ""}
                                onChange={(e) =>
                                    setData("has_philhealth", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.has_philhealth}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <RadioGroup
                                label="Do you consume alcohol?"
                                name="is_alcohol_user"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.is_alcohol_user || ""}
                                onChange={(e) =>
                                    setData("is_alcohol_user", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.is_alcohol_user}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <RadioGroup
                                label="Do you smoke?"
                                name="is_smoker"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.is_smoker || ""}
                                onChange={(e) =>
                                    setData("is_smoker", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.is_smoker}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <RadioGroup
                                label="Are you a Person with Disability (PWD)?"
                                name="is_pwd"
                                options={[
                                    { label: "Yes", value: 1 },
                                    { label: "No", value: 0 },
                                ]}
                                selectedValue={data.is_pwd || ""}
                                onChange={(e) =>
                                    setData("is_pwd", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.is_pwd}
                                className="mt-2"
                            />
                        </div>

                        {data.has_philhealth == 1 && (
                            <>
                                <InputField
                                    label="PhilHealth ID number"
                                    name="philhealth_id_number"
                                    value={data.philhealth_id_number || ""}
                                    onChange={(e) =>
                                        setData(
                                            "philhealth_id_number",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter PhilHealth id number"
                                />
                                <InputError
                                    message={errors.philhealth_id_number}
                                    className="mt-2"
                                />
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        {data.is_pwd == 1 && (
                            <div className="flex flex-wrap gap-4 items-start">
                                {/* PWD ID input */}
                                <div>
                                    <InputField
                                        label="PWD ID number"
                                        name="pwd_id_number"
                                        type="number"
                                        value={data.pwd_id_number || ""}
                                        onChange={(e) =>
                                            setData(
                                                "pwd_id_number",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter PWD ID number"
                                    />
                                    <InputError
                                        message={errors.pwd_id_number}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Disability Types */}
                                <div className="mt-3">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Disability type(s)
                                    </label>

                                    <div className="flex flex-wrap items-center gap-4">
                                        {(data.disabilities || []).map(
                                            (disability, disIndex) => (
                                                <div
                                                    key={disIndex}
                                                    className="flex items-center gap-1"
                                                >
                                                    <div>
                                                        <InputField
                                                            type="text"
                                                            name={`disability_type`}
                                                            value={
                                                                disability.disability_type ||
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const updated =
                                                                    [
                                                                        ...(data.disabilities ||
                                                                            []),
                                                                    ];
                                                                updated[
                                                                    disIndex
                                                                ] = {
                                                                    ...updated[
                                                                        disIndex
                                                                    ],
                                                                    disability_type:
                                                                        e.target
                                                                            .value,
                                                                };
                                                                setData(
                                                                    "disabilities",
                                                                    updated
                                                                );
                                                            }}
                                                            placeholder="Enter disability type"
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `disabilities.${disIndex}.disability_type`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeDisability(
                                                                disIndex
                                                            )
                                                        }
                                                        className="text-red-200 text-2xl hover:text-red-500 active:text-red-600"
                                                    >
                                                        <IoIosCloseCircleOutline />
                                                    </button>
                                                </div>
                                            )
                                        )}

                                        {/* Add disability button */}
                                        <button
                                            type="button"
                                            onClick={() => addDisability()}
                                            className="text-blue-500 text-3xl mt-5 hover:text-blue-700"
                                        >
                                            <IoIosAddCircleOutline />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 5 */}
                {/* House Information */}
                <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                    House Information
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                    Please provide the necessary house information.
                </p>

                {/* HOUSE ADDRESS */}
                <div className="bg-gray-50 p-3 rounded space-y-2">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <DropdownInputField
                                type="text"
                                label="House/Unit No./Lot/Blk No."
                                name="housenumber"
                                value={data.housenumber || ""}
                                onChange={(e) =>
                                    setData("housenumber", e.target.value)
                                }
                                placeholder="Select or enter house number"
                                items={householdList}
                            />
                            <InputError
                                message={errors.housenumber}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            {data.is_household_head == 1 ? (
                                <div>
                                    <DropdownInputField
                                        label="Street Name"
                                        name="street_id"
                                        value={data.street_id || ""}
                                        onChange={(e) =>
                                            setData("street_id", e.target.value)
                                        }
                                        placeholder="e.g., Rizal St., Mabini Avenue"
                                        items={streetList}
                                        disabled={data.is_household_head != 1}
                                    />
                                    <InputError
                                        message={errors.street}
                                        className="mt-2"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <InputField
                                        type="text"
                                        label="Street Name"
                                        name="street_name"
                                        value={data.street_name || ""}
                                        placeholder="e.g., Rizal St., Mabini Avenue"
                                        disabled={data.is_household_head != 1}
                                    />
                                    <InputError
                                        message={errors.street}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <InputField
                                type="text"
                                label="Subdivision/Village/Compound"
                                name="subdivision"
                                value={data.subdivision || ""}
                                onChange={(e) =>
                                    setData("subdivision", e.target.value)
                                }
                                placeholder="e.g., Villa Gloria Subdivision"
                                disabled={data.is_household_head != 1}
                            />
                            <InputError
                                message={errors.subdivision}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <SelectField
                                label="Purok Number"
                                name="purok_number"
                                value={data.purok_number || ""}
                                onChange={(e) =>
                                    setData("purok_number", e.target.value)
                                }
                                items={purok_numbers}
                                disabled={data.is_household_head != 1}
                            />
                            <InputError
                                message={errors.purok_number}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                {/* house */}
                {data.is_household_head == 1 && (
                    <>
                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <DropdownInputField
                                    label="Ownership Type"
                                    name="ownership_type"
                                    value={data.ownership_type || ""}
                                    onChange={(e) => {
                                        setData(
                                            "ownership_type",
                                            e.target.value
                                        );
                                    }}
                                    placeholder="Select or enter ownership type"
                                    items={[
                                        "owned",
                                        "rented",
                                        "shared",
                                        "goverment-provided",
                                        "inherited",
                                    ]}
                                />
                                <InputError
                                    message={errors.ownership_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="Housing Condition"
                                    name="housing_condition"
                                    value={data.housing_condition || ""}
                                    onChange={(e) =>
                                        setData(
                                            "housing_condition",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select house condition"
                                    items={[
                                        { label: "Good", value: "good" },
                                        {
                                            label: "Needs Repair",
                                            value: "needs_repair",
                                        },
                                        {
                                            label: "Dilapidated",
                                            value: "dilapidated",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={errors.housing_condition}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <SelectField
                                    label="House Structure"
                                    name="house_structure"
                                    value={data.house_structure}
                                    onChange={(e) =>
                                        setData(
                                            "house_structure",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select or Enter house structure"
                                    items={[
                                        {
                                            label: "Concrete",
                                            value: "concrete",
                                        },
                                        {
                                            label: "Semi-Concrete",
                                            value: "semi_concrete",
                                        },
                                        {
                                            label: "Wood",
                                            value: "wood",
                                        },
                                        {
                                            label: "Makeshift",
                                            value: "makeshift",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={errors.house_structure}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <YearDropdown
                                    label="Year Establish"
                                    name="year_establish"
                                    value={data.year_establish}
                                    onChange={(e) =>
                                        setData(
                                            "year_establish",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select year"
                                />
                                <InputError
                                    message={errors.year_establish}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    type="number"
                                    label="Number of Rooms"
                                    name="number_of_rooms"
                                    value={data.number_of_rooms || ""}
                                    onChange={(e) =>
                                        setData(
                                            "number_of_rooms",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter number of rooms"
                                />
                                <InputError
                                    message={errors.number_of_rooms}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <InputField
                                    type="number"
                                    label="Number of Floors"
                                    name="number_of_floors"
                                    value={data.number_of_floors || ""}
                                    onChange={(e) =>
                                        setData(
                                            "number_of_floors",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter number of floors"
                                />
                                <InputError
                                    message={errors.number_of_floors}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Bath and Wash Area"
                                    name="bath_and_wash_area"
                                    value={data.bath_and_wash_area || ""}
                                    onChange={(e) =>
                                        setData(
                                            "bath_and_wash_area",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select or Enter"
                                    items={[
                                        {
                                            label: "with own sink and bath",
                                            value: "with_own_sink_and_bath",
                                        },
                                        {
                                            label: "with own sink only",
                                            value: "with_own_sink_only",
                                        },
                                        {
                                            label: "with own bath only",
                                            value: "with_own_bath_only",
                                        },
                                        {
                                            label: "shared or communal",
                                            value: "shared_or_communal",
                                        },
                                        { label: "none", value: "none" },
                                    ]}
                                />
                                <InputError
                                    message={errors.bath_and_wash_area}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Type of Toilet"
                                    name="toilet_type"
                                    value={data.toilet_type || ""}
                                    onChange={(e) =>
                                        setData("toilet_type", e.target.value)
                                    }
                                    placeholder="Select or enter toilet type"
                                    items={[
                                        {
                                            label: "water sealed",
                                            value: "water_sealed",
                                        },
                                        {
                                            label: "compost pit toilet",
                                            value: "compost_pit_toilet",
                                        },
                                        {
                                            label: "shared communal public toilet",
                                            value: "shared_communal_public_toilet",
                                        },
                                        {
                                            label: "shared or communal",
                                            value: "shared_or_communal",
                                        },
                                        {
                                            label: "no latrine",
                                            value: "no_latrine",
                                        },
                                    ]}
                                />
                                <InputError
                                    message={errors.toilet_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Source of Electricity"
                                    name="electricity_type"
                                    value={data.electricity_type || ""}
                                    onChange={(e) =>
                                        setData(
                                            "electricity_type",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select or enter electricity source"
                                    items={[
                                        {
                                            label: "ISELCO II (Distribution Company)",
                                            value: "distribution_company_iselco_ii",
                                        },
                                        {
                                            label: "Generator",
                                            value: "generator",
                                        },
                                        {
                                            label: "Solar / Renewable Energy Source",
                                            value: "solar_renewable_energy_source",
                                        },
                                        { label: "Battery", value: "battery" },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                <InputError
                                    message={errors.electricity_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Water Source Type"
                                    name="water_source_type"
                                    value={data.water_source_type || ""}
                                    onChange={(e) =>
                                        setData(
                                            "water_source_type",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select water source type"
                                    items={[
                                        {
                                            label: "Level II Water System",
                                            value: "level_ii_water_system",
                                        },
                                        {
                                            label: "Level III Water System",
                                            value: "level_iii_water_system",
                                        },
                                        {
                                            label: "Deep Well Level I",
                                            value: "deep_well_level_i",
                                        },
                                        {
                                            label: "Artesian Well Level I",
                                            value: "artesian_well_level_i",
                                        },
                                        {
                                            label: "Shallow Well Level I",
                                            value: "shallow_well_level_i",
                                        },
                                        {
                                            label: "Commercial Water Refill Source",
                                            value: "commercial_water_refill_source",
                                        },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                <InputError
                                    message={errors.water_source_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Waste Disposal Method"
                                    name="waste_management_type"
                                    value={data.waste_management_type || ""}
                                    onChange={(e) =>
                                        setData(
                                            "waste_management_type",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select waste disposal method"
                                    items={[
                                        {
                                            label: "Open Dump Site",
                                            value: "open_dump_site",
                                        },
                                        {
                                            label: "Sanitary Landfill",
                                            value: "sanitary_landfill",
                                        },
                                        {
                                            label: "Compost Pits",
                                            value: "compost_pits",
                                        },
                                        {
                                            label: "Material Recovery Facility",
                                            value: "material_recovery_facility",
                                        },
                                        {
                                            label: "Garbage is Collected",
                                            value: "garbage_is_collected",
                                        },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                <InputError
                                    message={errors.waste_management_type}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <DropdownInputField
                                    label="Internet Connection Type"
                                    name="type_of_internet"
                                    value={data.type_of_internet || ""}
                                    onChange={(e) =>
                                        setData(
                                            "type_of_internet",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select internet connection type"
                                    items={[
                                        {
                                            label: "Mobile Data",
                                            value: "mobile_data",
                                        },
                                        {
                                            label: "Wireless Fidelity (Wi-Fi)",
                                            value: "wireless_fidelity",
                                        },
                                        { label: "None", value: "none" },
                                    ]}
                                />
                                <InputError
                                    message={errors.type_of_internet}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* livestock */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div>
                                    <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                    <p className="font-bold text-lg mt-3 text-gray-800">
                                        Livestock Ownership Details
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-1 gap-4">
                                    <div>
                                        <RadioGroup
                                            label="Do you have a livestock?"
                                            name="has_livestock"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={
                                                data.has_livestock || null
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "has_livestock",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        {data.has_livestock == 1 ? (
                                            <>
                                                {data.livestocks.length ===
                                                    0 && (
                                                    <p className="text-sm text-gray-500 italic mt-2">
                                                        No livestock added yet.
                                                    </p>
                                                )}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {data.livestocks.map(
                                                        (
                                                            livestock,
                                                            livIndex
                                                        ) => (
                                                            <div
                                                                key={livIndex}
                                                                className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                            >
                                                                <div>
                                                                    <DropdownInputField
                                                                        label="Livestock animal"
                                                                        name="livestock_type"
                                                                        value={
                                                                            livestock.livestock_type ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                livIndex,
                                                                                "livestock_type",
                                                                                "livestocks"
                                                                            )
                                                                        }
                                                                        placeholder="Select or enter type of animal"
                                                                        items={[
                                                                            "cattle",
                                                                            "carabao",
                                                                            "goat",
                                                                            "pig",
                                                                            "chicken",
                                                                            "duck",
                                                                            "sheep",
                                                                            "horse",
                                                                        ]}
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `livestocks.${livIndex}.livestock_type`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <InputField
                                                                        label="Quantity"
                                                                        name="quantity"
                                                                        value={
                                                                            livestock.quantity ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                livIndex,
                                                                                "quantity",
                                                                                "livestocks"
                                                                            )
                                                                        }
                                                                        placeholder="Enter quantity"
                                                                        type="number"
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `livestocks.${livIndex}.quantity`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <SelectField
                                                                        label="Purpose"
                                                                        name="purpose"
                                                                        value={
                                                                            livestock.purpose ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                livIndex,
                                                                                "purpose",
                                                                                "livestocks"
                                                                            )
                                                                        }
                                                                        placeholder="Select purpose"
                                                                        items={[
                                                                            {
                                                                                label: "Personal",
                                                                                value: "personal",
                                                                            },
                                                                            {
                                                                                label: "Consumption",
                                                                                value: "consumption",
                                                                            },
                                                                            {
                                                                                label: "Both",
                                                                                value: "both",
                                                                            },
                                                                        ]}
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `livestocks.${livIndex}.purpose`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeLivestock(
                                                                            livIndex
                                                                        )
                                                                    }
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                    title="Remove livestock"
                                                                >
                                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={addLivestock}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                    title="Add livestock"
                                                >
                                                    <IoIosAddCircleOutline className="text-2xl" />
                                                    Add Livestock
                                                </button>
                                            </>
                                        ) : data.has_livestock == 0 ? (
                                            <p className="text-sm text-gray-500 italic mt-2">
                                                No livestock declared.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                    <p className="font-bold text-md mt-3 text-gray-800">
                                        Pet Ownership Details
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-1 gap-4">
                                    <div>
                                        <RadioGroup
                                            label="Do you have a Pets?"
                                            name="has_pets"
                                            options={[
                                                { label: "Yes", value: 1 },
                                                { label: "No", value: 0 },
                                            ]}
                                            selectedValue={data.has_pets || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "has_pets",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        {data.has_pets == 1 ? (
                                            <>
                                                {data.pets.length === 0 && (
                                                    <p className="text-sm text-gray-500 italic mt-2">
                                                        No pet added yet.
                                                    </p>
                                                )}
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {data.pets.map(
                                                        (pet, petIndex) => (
                                                            <div
                                                                key={petIndex}
                                                                className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                            >
                                                                <div>
                                                                    <DropdownInputField
                                                                        label="Type of Pet"
                                                                        name="pet_type"
                                                                        value={
                                                                            pet.pet_type ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                petIndex,
                                                                                "pet_type",
                                                                                "pets"
                                                                            )
                                                                        }
                                                                        placeholder="Select or enter type of pet"
                                                                        items={[
                                                                            "dog",
                                                                            "cat",
                                                                            "rabbit",
                                                                        ]}
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `pets.${petIndex}.pet_type`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <RadioGroup
                                                                        label="Is the pet vaccinated for rabies?"
                                                                        name="is_vaccinated"
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
                                                                        selectedValue={
                                                                            pet.is_vaccinated ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleArrayValues(
                                                                                e,
                                                                                petIndex,
                                                                                "is_vaccinated",
                                                                                "pets"
                                                                            )
                                                                        }
                                                                    />
                                                                    <InputError
                                                                        message={
                                                                            errors[
                                                                                `pets.${petIndex}.is_vaccinated`
                                                                            ]
                                                                        }
                                                                        className="mt-2"
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removePet(
                                                                            petIndex
                                                                        )
                                                                    }
                                                                    className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                    title="Remove pet"
                                                                >
                                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                                </button>
                                                            </div>
                                                        )
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={addPet}
                                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                        title="Add pet"
                                                    >
                                                        <IoIosAddCircleOutline className="text-2xl" />
                                                        Add Pet
                                                    </button>
                                                </div>
                                            </>
                                        ) : data.has_pets == 0 ? (
                                            <p className="text-sm text-gray-500 italic mt-2">
                                                No pet declared.
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Submit Button */}
                <div className="flex w-full justify-center items-center mt-7">
                    <Button className="w-40" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInformation;
