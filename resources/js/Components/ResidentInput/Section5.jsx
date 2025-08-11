import React from "react";
import InputField from "../InputField";
import InputError from "../InputError";
import InputLabel from "../InputLabel";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import SelectField from "../SelectField";
import YearDropdown from "../YearDropdown";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const Section5 = ({
    data,
    setData,
    errors,
    handleArrayValues,
    puroks,
    households = [],
    streets,
    head = false,
}) => {
    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const streetList = streets.map((street) => ({
        label: street.street_name,
        value: street.id.toString(),
    }));

    const householdList = households?.map((house) => ({
        label:
            house.household.house_number.toString().padStart(4, "0") + // pad to 4 digits
            " || " +
            house.lastname +
            "'s Residence",
        value: house.household.id.toString(),
    }));

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

    const handleHouseholdChange = (e) => {
        const householdId = e.target.value;

        // Find the household head from the list of residents or a pre-fetched list
        const head = households.find(
            (r) =>
                r.household_id === parseInt(householdId) &&
                r.is_household_head === 1
        );

        const fullName = head
            ? `${head.firstname} ${head.middlename ?? ""} ${head.lastname}${
                  head.suffix ? " " + head.suffix : ""
              }`
            : "";
        setData("housenumber", householdId); // set the selected household
        setData("name_of_head", fullName.trim()); // set the head's name
    };

    const handleStreetChange = (e) => {
        const street_id = Number(e.target.value);
        const street = streets.find((s) => s.id == street_id);
        if (street) {
            setData("street_id", street.id);
            setData("street_name", street?.street_name || "");

            setData("purok_id", street.purok.id);
            setData("purok_number", street.purok.purok_number);
        }
    };

    // Add to dynamic field
    const addDynamicField = (field, defaultValue = {}) => {
        const currentArray = data[field] || [];
        const updatedArray = [...currentArray, defaultValue];
        setData((prev) => ({ ...prev, [field]: updatedArray }));
    };

    // Remove from dynamic field
    const removeDynamicField = (field, index) => {
        const currentArray = [...(data[field] || [])];
        currentArray.splice(index, 1);
        setData((prev) => ({ ...prev, [field]: currentArray }));
    };

    // Handle change in dynamic field
    const handleDynamicFieldChange = (field, index, e) => {
        const { name, value } = e.target;
        const currentArray = [...(data[field] || [])];
        currentArray[index] = {
            ...currentArray[index],
            [name]: value,
        };
        setData((prev) => ({ ...prev, [field]: currentArray }));
    };

    return (
        <>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                House Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Please provide the necessary house information.
            </p>

            {/* HOUSE ADDRESS */}
            {head !== true && (
                <div className="bg-gray-50 p-3 rounded space-y-2">
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <DropdownInputField
                                type="text"
                                label="House/Unit No./Lot/Blk No."
                                name="housenumber"
                                value={data.housenumber || ""}
                                onChange={(e) => handleHouseholdChange(e)}
                                placeholder="Select or enter house number"
                                items={householdList}
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
                                name="street_name"
                                value={data.street_name || ""}
                                placeholder="e.g., Rizal St., Mabini Avenue"
                                disabled={data.is_household_head != 1}
                            />
                            <InputError
                                message={errors.street_name}
                                className="mt-2"
                            />
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

                        <div>
                            <InputField
                                type="text"
                                label="Head of Household"
                                name="name_of_head"
                                value={data.name_of_head || ""}
                                placeholder="Select or enter house number"
                                disabled
                            />
                            <InputError
                                message={errors.name_of_head}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                type="text"
                                label="Relation to Head of Household"
                                name="relationship_to_head"
                                value={data.relationship_to_head || ""}
                                onChange={(e) =>
                                    setData(
                                        "relationship_to_head",
                                        e.target.value
                                    )
                                }
                                placeholder="Select or enter house number"
                                items={[
                                    { label: "Spouse", value: "spouse" },
                                    { label: "Child", value: "child" },
                                    { label: "Sibling", value: "sibling" },
                                    { label: "Parent", value: "parent" },
                                    {
                                        label: "Parent-in-law",
                                        value: "parent_in_law",
                                    },
                                    {
                                        label: "Grandparent",
                                        value: "grandparent",
                                    },
                                    {
                                        label: "Grandchild",
                                        value: "grandchild",
                                    },
                                    {
                                        label: "Other",
                                        value: "other",
                                    },
                                ]}
                                disabled={data.relationship_to_head === "self"}
                            />
                            <InputError
                                message={errors.relationship_to_head}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <DropdownInputField
                                type="text"
                                label="Household Position"
                                name="household_position"
                                value={data.household_position || ""}
                                onChange={(e) =>
                                    setData(
                                        "household_position",
                                        e.target.value
                                    )
                                }
                                placeholder="Select or enter house number"
                                items={[
                                    {
                                        label: "Primary",
                                        value: "primary",
                                    },
                                    { label: "Extended", value: "extended" },
                                    { label: "Boarder", value: "boarder" },
                                ]}
                                disabled={data.relationship_to_head === "self"}
                            />
                            <InputError
                                message={errors.household_position}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            )}

            {head !== false && (
                <>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <InputField
                                type="text"
                                label="House/Unit No./Lot/Blk No."
                                name="housenumber"
                                value={data.housenumber || ""}
                                onChange={(e) =>
                                    setData("housenumber", e.target.value)
                                }
                                placeholder="Select or enter house number"
                            />
                            <InputError
                                message={errors.housenumber}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <div>
                                <DropdownInputField
                                    label="Street Name"
                                    name="street_id"
                                    type="text"
                                    value={data.street_name}
                                    onChange={(e) => handleStreetChange(e)}
                                    placeholder="e.g., Rizal St., Mabini Avenue"
                                    items={streetList}
                                />
                                <InputError
                                    message={errors.street_id}
                                    className="mt-2"
                                />
                            </div>
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
                            <DropdownInputField
                                label="Ownership Type"
                                name="ownership_type"
                                value={data.ownership_type || ""}
                                onChange={(e) => {
                                    setData("ownership_type", e.target.value);
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
                                    setData("housing_condition", e.target.value)
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
                                value={data.house_structure || ""}
                                onChange={(e) =>
                                    setData("house_structure", e.target.value)
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
                                name="year_established"
                                value={data.year_established || ""}
                                onChange={(e) =>
                                    setData("year_established", e.target.value)
                                }
                                placeholder="Select year"
                            />
                            <InputError
                                message={errors.year_established}
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
                                    setData("number_of_rooms", e.target.value)
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
                                    setData("number_of_floors", e.target.value)
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
                                label="Internet Connection Type"
                                name="type_of_internet"
                                value={data.type_of_internet || ""}
                                onChange={(e) =>
                                    setData("type_of_internet", e.target.value)
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
                        {/* Toilets */}
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                                Type of Toilet(s)
                            </label>
                            <div className="flex flex-col gap-2">
                                {(data.toilets || []).map((toilet, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 w-full"
                                    >
                                        <div>
                                            <DropdownInputField
                                                name="toilet_type"
                                                value={toilet.toilet_type || ""}
                                                onChange={(e) =>
                                                    handleDynamicFieldChange(
                                                        "toilets",
                                                        idx,
                                                        e
                                                    )
                                                }
                                                placeholder="Select toilet type"
                                                items={[
                                                    {
                                                        label: "Water sealed",
                                                        value: "water_sealed",
                                                    },
                                                    {
                                                        label: "Compost pit toilet",
                                                        value: "compost_pit_toilet",
                                                    },
                                                    {
                                                        label: "Shared communal public toilet",
                                                        value: "shared_communal_public_toilet",
                                                    },
                                                    {
                                                        label: "Shared or communal",
                                                        value: "shared_or_communal",
                                                    },
                                                    {
                                                        label: "No latrine",
                                                        value: "no_latrine",
                                                    },
                                                ]}
                                            />
                                            <InputError
                                                message={
                                                    errors?.[
                                                        `toilets.${idx}.toilet_type`
                                                    ]
                                                }
                                                className="mt-1"
                                            />
                                        </div>

                                        {data.toilets.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeDynamicField(
                                                        "toilets",
                                                        idx
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700 text-xl"
                                            >
                                                <IoIosCloseCircleOutline />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addDynamicField("toilets", {
                                                toilet_type: "",
                                            })
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-3xl"
                                    >
                                        <IoIosAddCircleOutline />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Add type of toilet
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Electricity */}
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                                Electricity Source(s)
                            </label>
                            <div className="flex flex-col gap-2">
                                {(data.electricity_types || []).map(
                                    (entry, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <div>
                                                <DropdownInputField
                                                    name="electricity_type"
                                                    value={
                                                        entry.electricity_type ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleDynamicFieldChange(
                                                            "electricity_types",
                                                            idx,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Select electricity source"
                                                    items={[
                                                        {
                                                            label: "ISELCO II",
                                                            value: "distribution_company_iselco_ii",
                                                        },
                                                        {
                                                            label: "Generator",
                                                            value: "generator",
                                                        },
                                                        {
                                                            label: "Solar / Renewable",
                                                            value: "solar_renewable_energy_source",
                                                        },
                                                        {
                                                            label: "Battery",
                                                            value: "battery",
                                                        },
                                                        {
                                                            label: "None",
                                                            value: "none",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors?.[
                                                            `electricity_types.${idx}.electricity_type`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                            {data.electricity_types.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDynamicField(
                                                            "electricity_types",
                                                            idx
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                >
                                                    <IoIosCloseCircleOutline />
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addDynamicField(
                                                "electricity_types",
                                                {
                                                    electricity_type: "",
                                                }
                                            )
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-3xl"
                                    >
                                        <IoIosAddCircleOutline />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Add electricity source
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Water Source */}
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                                Water Source(s)
                            </label>
                            <div className="flex flex-col gap-2">
                                {(data.water_source_types || []).map(
                                    (entry, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <div>
                                                <DropdownInputField
                                                    name="water_source_type"
                                                    value={
                                                        entry.water_source_type ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleDynamicFieldChange(
                                                            "water_source_types",
                                                            idx,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Select water source"
                                                    items={[
                                                        {
                                                            label: "Level II",
                                                            value: "level_ii_water_system",
                                                        },
                                                        {
                                                            label: "Level III",
                                                            value: "level_iii_water_system",
                                                        },
                                                        {
                                                            label: "Deep Well",
                                                            value: "deep_well_level_i",
                                                        },
                                                        {
                                                            label: "Artesian Well",
                                                            value: "artesian_well_level_i",
                                                        },
                                                        {
                                                            label: "Shallow Well",
                                                            value: "shallow_well_level_i",
                                                        },
                                                        {
                                                            label: "Refill Source",
                                                            value: "commercial_water_refill_source",
                                                        },
                                                        {
                                                            label: "None",
                                                            value: "none",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors?.[
                                                            `water_source_types.${idx}.water_source_type`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                            {data.water_source_types.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDynamicField(
                                                            "water_source_types",
                                                            idx
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                >
                                                    <IoIosCloseCircleOutline />
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addDynamicField(
                                                "water_source_types",
                                                {
                                                    water_source_type: "",
                                                }
                                            )
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-3xl"
                                    >
                                        <IoIosAddCircleOutline />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Add water source
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Waste Management */}
                        <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-0 mt-4">
                                Waste Disposal Method(s)
                            </label>
                            <div className="flex flex-col gap-2">
                                {(data.waste_management_types || []).map(
                                    (entry, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <div>
                                                <DropdownInputField
                                                    name="waste_management_type"
                                                    value={
                                                        entry.waste_management_type ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleDynamicFieldChange(
                                                            "waste_management_types",
                                                            idx,
                                                            e
                                                        )
                                                    }
                                                    placeholder="Select waste disposal method"
                                                    items={[
                                                        {
                                                            label: "Open Dump",
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
                                                            label: "Material Recovery",
                                                            value: "material_recovery_facility",
                                                        },
                                                        {
                                                            label: "Garbage Collected",
                                                            value: "garbage_is_collected",
                                                        },
                                                        {
                                                            label: "None",
                                                            value: "none",
                                                        },
                                                    ]}
                                                />
                                                <InputError
                                                    message={
                                                        errors?.[
                                                            `waste_management_types.${idx}.waste_management_type`
                                                        ]
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {data.waste_management_types
                                                .length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeDynamicField(
                                                            "waste_management_types",
                                                            idx
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 text-xl"
                                                >
                                                    <IoIosCloseCircleOutline />
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addDynamicField(
                                                "waste_management_types",
                                                {
                                                    waste_management_type: "",
                                                }
                                            )
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-3xl"
                                    >
                                        <IoIosAddCircleOutline />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Add waste disposal method
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                            {data.livestocks.length === 0 && (
                                                <p className="text-sm text-gray-500 italic mt-2">
                                                    No livestock added yet.
                                                </p>
                                            )}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {data.livestocks.map(
                                                    (livestock, livIndex) => (
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
                                                                            label: "Personal Consumption",
                                                                            value: "personal_consumption",
                                                                        },
                                                                        {
                                                                            label: "Commercial",
                                                                            value: "commercial",
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
                                            setData("has_pets", e.target.value)
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
        </>
    );
};

export default Section5;
