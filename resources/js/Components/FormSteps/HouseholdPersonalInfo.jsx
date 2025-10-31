import { useState, useEffect, useContext } from "react";
import { StepperContext } from "@/context/StepperContext";
import InputField from "@/Components/InputField";
import DropdownInputField from "../DropdownInputField";
import RadioGroup from "../RadioGroup";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import YearDropdown from "../YearDropdown";
import InputLabel from "../InputLabel";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import SelectField from "../SelectField";
import { v4 as uuidv4 } from "uuid";
import { toTitleCase } from "@/utils/stringFormat";

// Default member structure
const defaultMember = {
    lastname: "",
    firstname: "",
    middlename: "",
    suffix: "",
    birthdate: "",
    birthplace: "",
    civil_status: "",
    gender: "",
    sex: "",
    maiden_middle_name: "",
    citizenship: "",
    religion: "",
    ethnicity: "",
    contactNumber: "",
    email: "",
    age: "",
    is_pensioner: "",
    osca_id_number: "",
    pension_type: "",
    living_alone: "",
    residency_type: "",
    residency_date: "",
    registered_voter: "",
    voter_id_number: "",
    voting_status: "",
    resident_image: "",
    is_household_head: 0,
    is_4ps_benificiary: "",
    is_solo_parent: "",
    solo_parent_id_number: "",
    has_vehicle: "",
};

const HouseholdPersonalInfo = ({ barangays }) => {
    const { userData, setUserData, errors } = useContext(StepperContext);

    // Initialize household state
    const household = userData.household || {
        household_type: "",
        household_count: 0,
        families: [],
    };

    const [openFamilyIndex, setOpenFamilyIndex] = useState(null);
    const [openMemberIndex, setOpenMemberIndex] = useState({});

    // Utility: calculate age
    const calculateAge = (birthdate) => {
        if (!birthdate) return "";
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    const barangayList = Object.entries(barangays).map(([id, name]) => ({
        label: name,
        value: id,
    }));

    // -------------------------------
    // Handlers
    // -------------------------------

    // Number of families
    const handleFamilyCountChange = (e) => {
        const count = parseInt(e.target.value || 0);
        let families = [...(household.families || [])];

        if (count > families.length) {
            for (let i = families.length; i < count; i++) {
                families.push({ memberCount: 0, members: [] });
            }
        } else if (count < families.length) {
            families = families.slice(0, count);
        }

        setUserData({ ...userData, household: { ...household, families } });
    };

    // Number of members per family
    const handleMemberCountChange = (familyIndex, value) => {
        const count = parseInt(value || 0);
        const families = [...household.families];
        const existingMembers = families[familyIndex].members || [];

        families[familyIndex].memberCount = count;
        families[familyIndex].members = Array.from(
            { length: count },
            (_, i) => {
                return existingMembers[i] || { ...defaultMember };
            }
        );

        setUserData({ ...userData, household: { ...household, families } });
    };

    // Change household family field
    const handleFamilyChange = (familyIndex, field, value) => {
        const families = [...household.families];
        families[familyIndex][field] = value;
        setUserData({ ...userData, household: { ...household, families } });
    };

    // Change member field
    const handleMemberChange = (familyIndex, memberIndex, field, value) => {
        const families = [...household.families];
        const member = { ...families[familyIndex].members[memberIndex] };
        member[field] = value;

        if (field === "birthdate") {
            member.age = calculateAge(value);
        }

        if (field === "relation_to_household_head") {
            switch (value) {
                case "sibling":
                case "sibling-of-spouse":
                    if (!member.siblingGroupKey)
                        member.siblingGroupKey = uuidv4();
                    break;
                case "spouse-of-sibling-of-spouse":
                case "spouse-sibling":
                    const relatedSibling = families[familyIndex].members.find(
                        (m) =>
                            ["sibling", "sibling-of-spouse"].includes(
                                m.relation_to_household_head
                            )
                    );
                    if (relatedSibling) {
                        member.siblingGroupKey =
                            relatedSibling.siblingGroupKey || uuidv4();
                        relatedSibling.siblingGroupKey = member.siblingGroupKey;
                    } else if (!member.siblingGroupKey) {
                        member.siblingGroupKey = uuidv4();
                    }
                    break;
                case "niblings":
                    const parent = families[familyIndex].members.find(
                        (m) =>
                            [
                                "sibling",
                                "sibling-of-spouse",
                                "spouse-sibling",
                            ].includes(m.relation_to_household_head) &&
                            m.siblingGroupKey
                    );
                    member.siblingGroupKey =
                        parent?.siblingGroupKey || uuidv4();
                    break;
                default:
                    break;
            }
        }

        families[familyIndex].members[memberIndex] = member;
        setUserData({ ...userData, household: { ...household, families } });
    };

    // Derived state
    const totalMembers = household.families?.reduce(
        (sum, f) => sum + (f.memberCount || 0),
        0
    );

    // Sync household_count
    useEffect(() => {
        const count =
            household.families?.reduce(
                (sum, f) => sum + (f.memberCount || 0),
                0
            ) || 0;

        if ((household.household_count || 0) !== count) {
            setUserData((prev) => ({
                ...prev,
                household: { ...prev.household, household_count: count },
            }));
        }
    }, [household.families, household.household_count, setUserData]);

    // Vehicle handlers
    const handleVehicleChange = (fIndex, mIndex, vehicleIndex, name, value) => {
        const updatedHousehold = { ...userData.household };
        const member = updatedHousehold.families[fIndex].members[mIndex];
        const vehicles = [...(member.vehicles || [])];
        vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], [name]: value };
        member.vehicles = vehicles;

        setUserData({ ...userData, household: updatedHousehold });
    };

    const addVehicle = (fIndex, mIndex) => {
        const updatedHousehold = { ...userData.household };
        const member = updatedHousehold.families[fIndex].members[mIndex];
        member.vehicles = [...(member.vehicles || []), {}];
        setUserData({ ...userData, household: updatedHousehold });
    };

    const removeVehicle = (fIndex, mIndex, vehicleIndex) => {
        const updatedHousehold = { ...userData.household };
        const member = updatedHousehold.families[fIndex].members[mIndex];
        const vehicles = [...(member.vehicles || [])];
        vehicles.splice(vehicleIndex, 1);
        member.vehicles = vehicles;

        setUserData({ ...userData, household: updatedHousehold });
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Household Members Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Kindly provide the personal information of all household
                members.
            </p>

            <div className="grid md:grid-cols-4 gap-4 mb-6 sm:grid-cols-1">
                <InputField
                    type="number"
                    label="Number of Families in Household"
                    value={household.families?.length || ""}
                    onChange={handleFamilyCountChange}
                    placeholder="Enter number of families"
                    required
                />

                <DropdownInputField
                    label="Household Type"
                    value={household.household_type}
                    items={[
                        { label: "Nuclear", value: "nuclear" },
                        { label: "Extended", value: "extended" },
                        { label: "Single Parent", value: "single_parent" },
                        { label: "Grandparent", value: "grandparent" },
                        { label: "Childless", value: "childless" },
                        {
                            label: "Cohabiting Partners",
                            value: "cohabiting_partners",
                        },
                        {
                            label: "One-person Household",
                            value: "one_person_household",
                        },
                        { label: "Roommates", value: "roommates" },
                    ]}
                    onChange={(e) =>
                        setUserData({
                            ...userData,
                            household: {
                                ...household,
                                household_type: e.target.value,
                            },
                        })
                    }
                    placeholder="Select household type"
                    required
                />

                <InputField
                    type="number"
                    label="Total Household Members"
                    value={household.household_count || 0}
                    readOnly
                />
            </div>

            {/* ------------------------------- */}
            {/* Families and Members Accordion */}
            {household.families?.map((family, fIndex) => (
                <div
                    key={fIndex}
                    className="mb-4 border rounded shadow-sm bg-white"
                >
                    {/* Family Accordion Header */}
                    <button
                        type="button"
                        className={`w-full text-left p-4 font-semibold flex justify-between items-center
                        ${openFamilyIndex === fIndex
                                ? "border-t-2 border-blue-600 text-gray-900"
                                : "text-gray-700 hover:bg-sky-100"
                            }
                        transition duration-300 ease-in-out`}
                        onClick={() =>
                            setOpenFamilyIndex(
                                openFamilyIndex === fIndex ? null : fIndex
                            )
                        }
                    >
                        <span>Family {fIndex + 1}</span>
                        {openFamilyIndex === fIndex ? (
                            <IoIosArrowUp className="text-xl text-blue-600" />
                        ) : (
                            <IoIosArrowDown className="text-xl text-blue-600" />
                        )}
                    </button>

                    {/* Family Panel */}
                    {openFamilyIndex === fIndex && (
                        <div className="mt-0 p-4 space-y-4">
                            {/* Family Info */}
                            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
                                <InputField
                                    type="number"
                                    label="Number of Family Members"
                                    value={family.memberCount || ""}
                                    onChange={(e) =>
                                        handleMemberCountChange(
                                            fIndex,
                                            e.target.value
                                        )
                                    }
                                />

                                <DropdownInputField
                                    label="Family Type"
                                    value={family.family_type || ""}
                                    items={[
                                        { label: "Nuclear", value: "nuclear" },
                                        {
                                            label: "Extended",
                                            value: "extended",
                                        },
                                        {
                                            label: "Single Parent",
                                            value: "single_parent",
                                        },
                                        {
                                            label: "Grandparent",
                                            value: "grandparent",
                                        },
                                        {
                                            label: "Childless",
                                            value: "childless",
                                        },
                                        {
                                            label: "Cohabiting Partners",
                                            value: "cohabiting_partners",
                                        },
                                        {
                                            label: "One-person Household",
                                            value: "one_person_household",
                                        },
                                        {
                                            label: "Roommates",
                                            value: "roommates",
                                        },
                                    ]}
                                    onChange={(e) =>
                                        handleFamilyChange(
                                            fIndex,
                                            "family_type",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Select family type"
                                    required
                                />
                            </div>

                            {/* Members */}
                            {family.members?.map((member, mIndex) => {
                                const isOpen =
                                    openMemberIndex[fIndex] === mIndex;
                                const showMaidenMiddleName =
                                    ["female"].includes(member.sex) &&
                                    [
                                        "married",
                                        "widowed",
                                        "separated",
                                    ].includes(member.civil_status);

                                return (
                                    <div
                                        key={mIndex}
                                        className="mt-3 border rounded bg-white"
                                    >
                                        {/* Member Header */}
                                        <button
                                            type="button"
                                            className={`w-full text-left p-4 font-semibold flex justify-between items-center
                                            ${isOpen
                                                    ? "border-t-2 border-blue-600 text-gray-900"
                                                    : "text-gray-700 hover:bg-sky-100"
                                                }
                                            transition duration-300 ease-in-out`}
                                            onClick={() =>
                                                setOpenMemberIndex((prev) => ({
                                                    ...prev,
                                                    [fIndex]:
                                                        prev[fIndex] === mIndex
                                                            ? null
                                                            : mIndex,
                                                }))
                                            }
                                        >
                                            <span>Member {mIndex + 1}</span>
                                            {isOpen ? (
                                                <IoIosArrowUp className="text-xl text-blue-600" />
                                            ) : (
                                                <IoIosArrowDown className="text-xl text-blue-600" />
                                            )}
                                        </button>

                                        {/* Member Panel */}
                                        {isOpen && (
                                            <div
                                                id={`member-panel-${mIndex}`}
                                                role="region"
                                                aria-labelledby={`member-header-${mIndex}`}
                                                className="p-4 space-y-4"
                                            >
                                                {/* PERSONAL INFORMATION */}
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4">
                                                    {/* Profile Photo */}
                                                    <div className="md:row-span-2 flex flex-col items-center space-y-2">
                                                        <InputLabel
                                                            htmlFor={`resident-image-${mIndex}`}
                                                            value="Profile Photo"
                                                        />
                                                        <img
                                                            src={
                                                                member.resident_image instanceof
                                                                    File
                                                                    ? URL.createObjectURL(
                                                                        member.resident_image
                                                                    )
                                                                    : member.resident_image ||
                                                                    "/images/default-avatar.jpg"
                                                            }
                                                            alt={`Resident ${mIndex + 1
                                                                }`}
                                                            className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                                        />
                                                        <input
                                                            id={`resident-image-${mIndex}`}
                                                            type="file"
                                                            name="resident_image"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files[0];
                                                                if (file) {
                                                                    const updatedFamilies =
                                                                        [
                                                                            ...household.families,
                                                                        ];
                                                                    updatedFamilies[
                                                                        fIndex
                                                                    ].members[
                                                                        mIndex
                                                                    ].resident_image =
                                                                        file;

                                                                    setUserData(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            household:
                                                                            {
                                                                                ...prev.household,
                                                                                families:
                                                                                    updatedFamilies,
                                                                            },
                                                                        })
                                                                    );
                                                                }
                                                            }}
                                                            className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        />

                                                        {errors?.[
                                                            `members.${mIndex}.resident_image`
                                                        ] && (
                                                                <p className="text-red-500 text-xs">
                                                                    {
                                                                        errors[
                                                                        `members.${mIndex}.resident_image`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Right Side Fields */}
                                                    <div className="md:col-span-5 space-y-2">
                                                        {/* Name Fields */}
                                                        <div
                                                            className={`grid gap-2 grid-cols-1 sm:grid-cols-2 md:${showMaidenMiddleName
                                                                ? "grid-cols-4"
                                                                : "grid-cols-3"
                                                                }`}
                                                        >
                                                            <div>
                                                                <InputField
                                                                    label="Last Name"
                                                                    name="lastname"
                                                                    value={
                                                                        member.lastname
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "lastname",
                                                                            toTitleCase(e.target.value)
                                                                        )
                                                                    }
                                                                    placeholder="Last name"
                                                                    required
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.lastname`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.lastname`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <InputField
                                                                    label="First Name"
                                                                    name="firstname"
                                                                    value={
                                                                        member.firstname
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "firstname",
                                                                            toTitleCase(e.target.value)
                                                                        )
                                                                    }
                                                                    placeholder="Given name"
                                                                    required
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.firstname`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.firstname`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <InputField
                                                                    label="Middle Name"
                                                                    name="middlename"
                                                                    value={
                                                                        member.middlename
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "middlename",
                                                                            toTitleCase(e.target.value)
                                                                        )
                                                                    }
                                                                    placeholder="Middle name"
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.middlename`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.middlename`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                {showMaidenMiddleName && (
                                                                    <InputField
                                                                        label="Maiden Name"
                                                                        name="maiden_middle_name"
                                                                        value={
                                                                            member.maiden_middle_name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMemberChange(
                                                                                fIndex,
                                                                                mIndex,
                                                                                "maiden_middle_name",
                                                                                toTitleCase(e.target.value)
                                                                            )
                                                                        }
                                                                        placeholder="Mother's name"
                                                                    />
                                                                )}
                                                                {errors?.[
                                                                    `members.${mIndex}.maiden_middle_name`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.maiden_middle_name`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        {/* Extra Info */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                                            <div>
                                                                <DropdownInputField
                                                                    label="Suffix"
                                                                    name="suffix"
                                                                    value={
                                                                        member.suffix
                                                                    }
                                                                    items={[
                                                                        "Jr.",
                                                                        "Sr.",
                                                                        "I",
                                                                        "II",
                                                                        "III",
                                                                        "IV",
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "suffix",
                                                                            toTitleCase(e.target.value)
                                                                        )
                                                                    }
                                                                    placeholder="Select suffix"
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.suffix`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.suffix`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <SelectField
                                                                    label="Civil Status"
                                                                    name="civil_status"
                                                                    value={
                                                                        member.civil_status
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: "Single",
                                                                            value: "single",
                                                                        },
                                                                        {
                                                                            label: "Married",
                                                                            value: "married",
                                                                        },
                                                                        {
                                                                            label: "Widowed",
                                                                            value: "widowed",
                                                                        },
                                                                        {
                                                                            label: "Divorced",
                                                                            value: "divorced",
                                                                        },
                                                                        {
                                                                            label: "Separated",
                                                                            value: "separated",
                                                                        },
                                                                        {
                                                                            label: "Annulled",
                                                                            value: "annulled",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "civil_status",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="Select status"
                                                                    required
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.civil_status`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.civil_status`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <RadioGroup
                                                                    label="Sex"
                                                                    name="sex"
                                                                    selectedValue={
                                                                        member.sex ||
                                                                        ""
                                                                    }
                                                                    options={[
                                                                        {
                                                                            label: "Male",
                                                                            value: "male",
                                                                        },
                                                                        {
                                                                            label: "Female",
                                                                            value: "female",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "sex",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    required
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.sex`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.sex`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <DropdownInputField
                                                                    label="Gender"
                                                                    name="gender"
                                                                    value={
                                                                        member.gender
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: "Male",
                                                                            value: "male",
                                                                        },
                                                                        {
                                                                            label: "Female",
                                                                            value: "female",
                                                                        },
                                                                        {
                                                                            label: "LGBTQ+",
                                                                            value: "LGBTQ",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "gender",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Select gender"
                                                                    required
                                                                />
                                                                {errors?.[
                                                                    `members.${mIndex}.gender`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `members.${mIndex}.gender`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
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
                                                        {/* Birthdate */}
                                                        <InputField
                                                            type="date"
                                                            label="Birth Date"
                                                            name="birthdate"
                                                            value={
                                                                member.birthdate
                                                            }
                                                            onChange={(e) =>
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "birthdate",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                        />

                                                        {/* Birthplace */}
                                                        <InputField
                                                            label="Birth Place"
                                                            name="birthplace"
                                                            value={
                                                                member.birthplace
                                                            }
                                                            onChange={(e) =>
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "birthplace",
                                                                    toTitleCase(e.target.value)
                                                                )
                                                            }
                                                            placeholder="City/Municipality"
                                                            required
                                                        />

                                                        {/* Religion */}
                                                        <DropdownInputField
                                                            label="Religion"
                                                            name="religion"
                                                            value={
                                                                member.religion
                                                            }
                                                            items={[
                                                                "Roman Catholic",
                                                                "Iglesia ni Cristo",
                                                                "Born Again",
                                                                "Baptists",
                                                            ]}
                                                            onChange={(e) =>
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "religion",
                                                                    toTitleCase(e.target.value)
                                                                )
                                                            }
                                                            placeholder="Select religion"
                                                            required
                                                        />

                                                        {/* Ethnicity */}
                                                        <DropdownInputField
                                                            label="Ethnicity"
                                                            name="ethnicity"
                                                            value={
                                                                member.ethnicity
                                                            }
                                                            items={[
                                                                "Ilocano",
                                                                "Ibanag",
                                                                "Tagalog",
                                                                "Indigenous People",
                                                            ]}
                                                            onChange={(e) =>
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "ethnicity",
                                                                    toTitleCase(e.target.value)
                                                                )
                                                            }
                                                            placeholder="Select ethnicity"
                                                        />

                                                        {/* Citizenship */}
                                                        <DropdownInputField
                                                            label="Citizenship"
                                                            name="citizenship"
                                                            value={
                                                                member.citizenship
                                                            }
                                                            items={[
                                                                "Filipino",
                                                                "Chinese",
                                                                "American",
                                                            ]}
                                                            onChange={(e) =>
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "citizenship",
                                                                    toTitleCase(e.target.value)
                                                                )
                                                            }
                                                            placeholder="Select citizenship"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* CONTACT & RESIDENCY */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {/* Contact Info */}
                                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                                        <h3 className="text-md font-medium text-gray-700">
                                                            Contact Info
                                                        </h3>
                                                        <div className="space-y-2">
                                                            <InputField
                                                                label="Contact Number"
                                                                name="contactNumber"
                                                                value={
                                                                    member.contactNumber
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        e.target
                                                                            .value;

                                                                    // ✅ Allow only numbers and limit to 11 digits
                                                                    if (
                                                                        /^\d{0,11}$/.test(
                                                                            value
                                                                        )
                                                                    ) {
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "contactNumber",
                                                                            value
                                                                        );
                                                                    }
                                                                }}
                                                                placeholder="09XX XXXX XXX"
                                                            />

                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.contactNumber`
                                                            ] && (
                                                                    <p className="text-red-500 text-sm">
                                                                        {
                                                                            errors[
                                                                            `families.${fIndex}.members.${mIndex}.contactNumber`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}

                                                            <InputField
                                                                label="Email"
                                                                name="email"
                                                                value={
                                                                    member.email
                                                                }
                                                                onChange={(e) =>
                                                                    handleMemberChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        "email",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="your@email.com"
                                                            />
                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.email`
                                                            ] && (
                                                                    <p className="text-red-500 text-sm">
                                                                        {
                                                                            errors[
                                                                            `families.${fIndex}.members.${mIndex}.email`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Residency Info */}
                                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                                        <h3 className="text-md font-medium text-gray-700">
                                                            Residency Info
                                                        </h3>
                                                        <div className="space-y-4">
                                                            {/* First row (3 fields) */}
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <DropdownInputField
                                                                    label="Residency Type"
                                                                    name="residency_type"
                                                                    value={
                                                                        member.residency_type
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
                                                                            label: "Immigrant",
                                                                            value: "immigrant",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "residency_type",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Select type"
                                                                    required
                                                                />
                                                                <YearDropdown
                                                                    label="Residency Date"
                                                                    name="residency_date"
                                                                    value={
                                                                        member.residency_date
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "residency_date",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Select year"
                                                                    required
                                                                />
                                                                <DropdownInputField
                                                                    label="Household Position"
                                                                    name="household_position"
                                                                    value={
                                                                        member.household_position
                                                                    }
                                                                    items={[
                                                                        {
                                                                            label: "Primary/Nuclear",
                                                                            value: "primary",
                                                                        },
                                                                        {
                                                                            label: "Extended",
                                                                            value: "extended",
                                                                        },
                                                                        {
                                                                            label: "Boarder",
                                                                            value: "boarder",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "household_position",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Select type"
                                                                    required
                                                                />
                                                            </div>

                                                            {/* Second row (2 fields, but still aligned in grid) */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <RadioGroup
                                                                    label="Household Head?"
                                                                    name={`is_household_head_${member.id}`}
                                                                    selectedValue={
                                                                        parseInt(
                                                                            member.is_household_head
                                                                        ) ?? 0
                                                                    }
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
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "is_household_head",
                                                                            value
                                                                        );

                                                                        if (
                                                                            value ===
                                                                            1
                                                                        ) {
                                                                            // Automatically mark relation as self if head
                                                                            handleMemberChange(
                                                                                fIndex,
                                                                                mIndex,
                                                                                "relation_to_household_head",
                                                                                "self"
                                                                            );
                                                                        } else {
                                                                            handleMemberChange(
                                                                                fIndex,
                                                                                mIndex,
                                                                                "relation_to_household_head",
                                                                                ""
                                                                            );
                                                                        }
                                                                    }}
                                                                    required
                                                                    disabled={
                                                                        household.families.some(
                                                                            (
                                                                                family
                                                                            ) =>
                                                                                family.members.some(
                                                                                    (
                                                                                        m
                                                                                    ) =>
                                                                                        m.is_household_head ===
                                                                                        1 &&
                                                                                        m !==
                                                                                        member
                                                                                )
                                                                        ) &&
                                                                        member.is_household_head !==
                                                                        1
                                                                    }
                                                                />

                                                                <RadioGroup
                                                                    label="Family Head?"
                                                                    name={`is_family_head_${member.id}`}
                                                                    selectedValue={
                                                                        household.families[
                                                                            fIndex
                                                                        ].members.some(
                                                                            (
                                                                                m
                                                                            ) =>
                                                                                m.is_family_head ===
                                                                                1
                                                                        )
                                                                            ? member.is_family_head ===
                                                                                1
                                                                                ? 1
                                                                                : 0
                                                                            : member.is_family_head ??
                                                                            0
                                                                    }
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
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const value =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            );
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "is_family_head",
                                                                            value
                                                                        );
                                                                    }}
                                                                    required
                                                                    disabled={
                                                                        household.families[
                                                                            fIndex
                                                                        ].members.some(
                                                                            (
                                                                                m
                                                                            ) =>
                                                                                m.is_family_head ===
                                                                                1 &&
                                                                                m !==
                                                                                member
                                                                        ) &&
                                                                        member.is_family_head !==
                                                                        1
                                                                    }
                                                                />
                                                                <div className="grid col-span-2 w-full">
                                                                    <SelectField
                                                                        label="Relationship to Household Head"
                                                                        name="relation_to_household_head"
                                                                        value={
                                                                            member.relation_to_household_head
                                                                        }
                                                                        items={[
                                                                            {
                                                                                label: "Self/Head",
                                                                                value: "self",
                                                                                subtitle:
                                                                                    "The main resident of the household",
                                                                            },
                                                                            {
                                                                                label: "Spouse",
                                                                                value: "spouse",
                                                                                subtitle:
                                                                                    "Legally married partner of the head",
                                                                            },
                                                                            {
                                                                                label: "Child",
                                                                                value: "child",
                                                                                subtitle:
                                                                                    "Son or daughter of the head",
                                                                            },
                                                                            {
                                                                                label: "Sibling",
                                                                                value: "sibling",
                                                                                subtitle:
                                                                                    "Brother or sister of the head",
                                                                            },
                                                                            {
                                                                                label: "Parent",
                                                                                value: "parent",
                                                                                subtitle:
                                                                                    "Father or mother of the head",
                                                                            },
                                                                            {
                                                                                label: "Parent-in-law",
                                                                                value: "parent_in_law",
                                                                                subtitle:
                                                                                    "Parent of the head’s spouse",
                                                                            },
                                                                            {
                                                                                label: "Sibling of Spouse",
                                                                                value: "sibling-of-spouse",
                                                                                subtitle:
                                                                                    "Brother or sister of the spouse",
                                                                            },
                                                                            {
                                                                                label: "Spouse of (Sibling of Spouse)",
                                                                                value: "spouse-of-sibling-of-spouse",
                                                                                subtitle:
                                                                                    "Spouse of your sibling-in-law",
                                                                            },
                                                                            {
                                                                                label: "Spouse of Sibling",
                                                                                value: "spouse-sibling",
                                                                                subtitle:
                                                                                    "Spouse of your sibling",
                                                                            },
                                                                            {
                                                                                label: "Niece/Nephew",
                                                                                value: "niblings",
                                                                                subtitle:
                                                                                    "Child of your sibling or sibling in law",
                                                                            },
                                                                            {
                                                                                label: "Grandparent",
                                                                                value: "grandparent",
                                                                                subtitle:
                                                                                    "Grandfather or grandmother of the head",
                                                                            },
                                                                        ]}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMemberChange(
                                                                                fIndex,
                                                                                mIndex,
                                                                                "relation_to_household_head",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Select type"
                                                                        required
                                                                        disabled={
                                                                            member.is_household_head ===
                                                                            1
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* GOVERNMENT PROGRAMS */}
                                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                                    <h3 className="text-md font-medium text-gray-700">
                                                        Government Programs
                                                    </h3>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                        {/* 4Ps Beneficiary */}
                                                        <div>
                                                            <RadioGroup
                                                                label="4Ps Beneficiary?"
                                                                // make name unique per member to avoid cross-member grouping
                                                                name={`is_4ps_benificiary_${fIndex}_${mIndex}`}
                                                                // don't use || — allow 0; use ?? to keep 0
                                                                selectedValue={
                                                                    member.is_4ps_benificiary ??
                                                                    ""
                                                                }
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
                                                                    handleMemberChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        "is_4ps_benificiary",
                                                                        // keep stored type as number
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        )
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.is_4ps_benificiary`
                                                            ] && (
                                                                    <p className="text-red-500 text-xs">
                                                                        {
                                                                            errors[
                                                                            `families.${fIndex}.members.${mIndex}.is_4ps_benificiary`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>

                                                        {/* Solo Parent */}
                                                        <div>
                                                            <RadioGroup
                                                                label="Solo Parent?"
                                                                name={`is_solo_parent_${fIndex}_${mIndex}`}
                                                                selectedValue={
                                                                    member.is_solo_parent ??
                                                                    ""
                                                                }
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
                                                                    handleMemberChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        "is_solo_parent",
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        )
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.is_solo_parent`
                                                            ] && (
                                                                    <p className="text-red-500 text-xs">
                                                                        {
                                                                            errors[
                                                                            `families.${fIndex}.members.${mIndex}.is_solo_parent`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>

                                                        {/* Solo Parent ID (conditional) */}
                                                        {Number(
                                                            member.is_solo_parent
                                                        ) === 1 && (
                                                                <div>
                                                                    <InputField
                                                                        label="Solo Parent ID"
                                                                        name="solo_parent_id_number"
                                                                        value={
                                                                            member.solo_parent_id_number ??
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleMemberChange(
                                                                                fIndex,
                                                                                mIndex,
                                                                                "solo_parent_id_number",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="ID number"
                                                                    />
                                                                    {errors?.[
                                                                        `families.${fIndex}.members.${mIndex}.solo_parent_id_number`
                                                                    ] && (
                                                                            <p className="text-red-500 text-xs">
                                                                                {
                                                                                    errors[
                                                                                    `families.${fIndex}.members.${mIndex}.solo_parent_id_number`
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            )}

                                                        {/* Registered Voter */}
                                                        <div>
                                                            <RadioGroup
                                                                label="Registered Voter?"
                                                                name={`registered_voter_${fIndex}_${mIndex}`}
                                                                selectedValue={
                                                                    member.registered_voter ??
                                                                    ""
                                                                }
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
                                                                    handleMemberChange(
                                                                        fIndex,
                                                                        mIndex,
                                                                        "registered_voter",
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                            10
                                                                        )
                                                                    )
                                                                }
                                                                required
                                                            />
                                                            {errors?.[
                                                                `families.${fIndex}.members.${mIndex}.registered_voter`
                                                            ] && (
                                                                    <p className="text-red-500 text-xs">
                                                                        {
                                                                            errors[
                                                                            `families.${fIndex}.members.${mIndex}.registered_voter`
                                                                            ]
                                                                        }
                                                                    </p>
                                                                )}
                                                        </div>

                                                        {/* Conditional Voter Details */}
                                                        {Number(
                                                            member.registered_voter
                                                        ) === 1 && (
                                                                <>
                                                                    <div>
                                                                        <InputField
                                                                            label="Voter ID"
                                                                            name="voter_id_number"
                                                                            value={
                                                                                member.voter_id_number ??
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleMemberChange(
                                                                                    fIndex,
                                                                                    mIndex,
                                                                                    "voter_id_number",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Voter ID number"
                                                                        />
                                                                        {errors?.[
                                                                            `families.${fIndex}.members.${mIndex}.voter_id_number`
                                                                        ] && (
                                                                                <p className="text-red-500 text-xs">
                                                                                    {
                                                                                        errors[
                                                                                        `families.${fIndex}.members.${mIndex}.voter_id_number`
                                                                                        ]
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>

                                                                    <div>
                                                                        <DropdownInputField
                                                                            label="Voting Status"
                                                                            name="voting_status"
                                                                            value={
                                                                                member.voting_status ??
                                                                                ""
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
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleMemberChange(
                                                                                    fIndex,
                                                                                    mIndex,
                                                                                    "voting_status",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Select status"
                                                                        />
                                                                        {errors?.[
                                                                            `families.${fIndex}.members.${mIndex}.voting_status`
                                                                        ] && (
                                                                                <p className="text-red-500 text-xs">
                                                                                    {
                                                                                        errors[
                                                                                        `families.${fIndex}.members.${mIndex}.voting_status`
                                                                                        ]
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>

                                                                    <div>
                                                                        <DropdownInputField
                                                                            label="Votes In?"
                                                                            name="registered_barangay"
                                                                            value={
                                                                                member.registered_barangay ??
                                                                                ""
                                                                            }
                                                                            items={
                                                                                barangayList
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleMemberChange(
                                                                                    fIndex,
                                                                                    mIndex,
                                                                                    "registered_barangay",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Select registered barangay"
                                                                        />
                                                                        {errors?.[
                                                                            `families.${fIndex}.members.${mIndex}.registered_barangay`
                                                                        ] && (
                                                                                <p className="text-red-500 text-xs">
                                                                                    {
                                                                                        errors[
                                                                                        `families.${fIndex}.members.${mIndex}.registered_barangay`
                                                                                        ]
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>
                                                                </>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* SENIOR CITIZEN (CONDITIONAL) */}
                                                {member.age >= 60 && (
                                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                                        <h3 className="text-md font-medium text-gray-700">
                                                            Senior Citizen Info
                                                        </h3>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                                            {/* Pensioner */}
                                                            <div>
                                                                <RadioGroup
                                                                    label="Pensioner?"
                                                                    name="is_pensioner"
                                                                    selectedValue={
                                                                        member.is_pensioner ||
                                                                        ""
                                                                    }
                                                                    options={[
                                                                        {
                                                                            label: "Yes",
                                                                            value: "yes",
                                                                        },
                                                                        {
                                                                            label: "No",
                                                                            value: "no",
                                                                        },
                                                                        {
                                                                            label: "Pending",
                                                                            value: "pending",
                                                                        },
                                                                    ]}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "is_pensioner",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                {errors?.[
                                                                    `families.${fIndex}.members.${mIndex}.is_pensioner`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `families.${fIndex}.members.${mIndex}.is_pensioner`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>

                                                            {/* OSCA ID & Pension Type (conditional if pensioner = yes) */}
                                                            {member.is_pensioner ===
                                                                "yes" && (
                                                                    <div className="flex flex-col sm:flex-row col-span-2 gap-4">
                                                                        <div className="w-full">
                                                                            <InputField
                                                                                label="OSCA ID"
                                                                                name="osca_id_number"
                                                                                type="number"
                                                                                value={
                                                                                    member.osca_id_number ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleMemberChange(
                                                                                        fIndex,
                                                                                        mIndex,
                                                                                        "osca_id_number",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                placeholder="OSCA ID number"
                                                                            />
                                                                            {errors?.[
                                                                                `families.${fIndex}.members.${mIndex}.osca_id_number`
                                                                            ] && (
                                                                                    <p className="text-red-500 text-xs">
                                                                                        {
                                                                                            errors[
                                                                                            `families.${fIndex}.members.${mIndex}.osca_id_number`
                                                                                            ]
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                        </div>
                                                                        <div className="w-full">
                                                                            <DropdownInputField
                                                                                label="Pension Type"
                                                                                name="pension_type"
                                                                                value={
                                                                                    member.pension_type ||
                                                                                    ""
                                                                                }
                                                                                items={[
                                                                                    "SSS",
                                                                                    "DSWD",
                                                                                    "GSIS",
                                                                                    "Private",
                                                                                    "None",
                                                                                ]}
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleMemberChange(
                                                                                        fIndex,
                                                                                        mIndex,
                                                                                        "pension_type",
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                placeholder="Select type"
                                                                            />
                                                                            {errors?.[
                                                                                `families.${fIndex}.members.${mIndex}.pension_type`
                                                                            ] && (
                                                                                    <p className="text-red-500 text-xs">
                                                                                        {
                                                                                            errors[
                                                                                            `families.${fIndex}.members.${mIndex}.pension_type`
                                                                                            ]
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* Living Alone */}
                                                            <div>
                                                                <RadioGroup
                                                                    label="Living Alone?"
                                                                    name="living_alone"
                                                                    selectedValue={
                                                                        member.living_alone
                                                                    }
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
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleMemberChange(
                                                                            fIndex,
                                                                            mIndex,
                                                                            "living_alone",
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        )
                                                                    }
                                                                />
                                                                {errors?.[
                                                                    `families.${fIndex}.members.${mIndex}.living_alone`
                                                                ] && (
                                                                        <p className="text-red-500 text-xs">
                                                                            {
                                                                                errors[
                                                                                `families.${fIndex}.members.${mIndex}.living_alone`
                                                                                ]
                                                                            }
                                                                        </p>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                {/* VEHICLE INFO */}
                                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                                    <h3 className="text-md font-medium text-gray-700">
                                                        Vehicle Info
                                                    </h3>

                                                    {/* Owns Vehicle */}
                                                    <div>
                                                        <RadioGroup
                                                            label="Owns Vehicle(s)?"
                                                            name="has_vehicle"
                                                            selectedValue={
                                                                member.has_vehicle
                                                            }
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
                                                                handleMemberChange(
                                                                    fIndex,
                                                                    mIndex,
                                                                    "has_vehicle",
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            required
                                                        />
                                                        {errors?.[
                                                            `families.${fIndex}.members.${mIndex}.has_vehicle`
                                                        ] && (
                                                                <p className="text-red-500 text-xs">
                                                                    {
                                                                        errors[
                                                                        `families.${fIndex}.members.${mIndex}.has_vehicle`
                                                                        ]
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* Vehicle Details (conditional) */}
                                                    {member.has_vehicle ===
                                                        1 && (
                                                            <div className="space-y-4 mt-4">
                                                                {(
                                                                    member.vehicles ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        vehicle,
                                                                        vecIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                vecIndex
                                                                            }
                                                                            className="border p-4 rounded-md relative bg-gray-50"
                                                                        >
                                                                            {/* Vehicle Fields */}
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleVehicleChange(
                                                                                            fIndex,
                                                                                            mIndex,
                                                                                            vecIndex,
                                                                                            "vehicle_type",
                                                                                            e
                                                                                                .target
                                                                                                .value
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleVehicleChange(
                                                                                            fIndex,
                                                                                            mIndex,
                                                                                            vecIndex,
                                                                                            "vehicle_class",
                                                                                            e
                                                                                                .target
                                                                                                .value
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleVehicleChange(
                                                                                            fIndex,
                                                                                            mIndex,
                                                                                            vecIndex,
                                                                                            "usage_status",
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        )
                                                                                    }
                                                                                    placeholder="Select usage"
                                                                                />
                                                                                <RadioGroup
                                                                                    label="Is Registered?"
                                                                                    name="is_registered"
                                                                                    selectedValue={
                                                                                        vehicle.is_registered ===
                                                                                            0 ||
                                                                                            vehicle.is_registered ===
                                                                                            1
                                                                                            ? vehicle.is_registered
                                                                                            : ""
                                                                                    }
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
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleVehicleChange(
                                                                                            fIndex,
                                                                                            mIndex,
                                                                                            vecIndex,
                                                                                            "is_registered",
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            {/* Remove Vehicle Button */}
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeVehicle(
                                                                                        fIndex,
                                                                                        mIndex,
                                                                                        vecIndex
                                                                                    )
                                                                                }
                                                                                className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 transition-colors duration-200"
                                                                                title="Remove Vehicle"
                                                                            >
                                                                                <IoIosCloseCircleOutline />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}

                                                                {/* Add Vehicle Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        addVehicle(
                                                                            fIndex,
                                                                            mIndex
                                                                        )
                                                                    }
                                                                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                                                                    title="Add Vehicle"
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
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default HouseholdPersonalInfo;
