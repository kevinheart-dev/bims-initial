import { useState, useEffect, useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import InputField from '@/Components/InputField';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import YearDropdown from '../YearDropdown';
import InputLabel from '../InputLabel';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

const defaultMember = {
    lastname: '',
    firstname: '',
    middlename: '',
    suffix: '',
    birthdate: '',
    birthplace: '',
    civil_status: '',
    gender: '',
    maiden_middle_name: '',
    citizenship: '',
    religion: '',
    ethnicity: '',
    contactNumber: '',
    email: '',
    age: '',
    is_pensioner: '',
    osca_id_number: '',
    pension_type: '',
    living_alone: '',
    residency_type: '',
    residency_date: '',
    registered_voter: '',
    voter_id_number: '',
    voting_status: '',
    resident_image: '',
    is_household_head: '',
    is_4ps_benificiary: '',
    is_solo_parent: '',
    solo_parent_id_number: '',
    has_vehicle: '',
};

const HouseholdPersonalInfo = () => {
    const { userData, setUserData } = useContext(StepperContext);
    const [members, setMembers] = useState([]);


    const [sharedFields, setSharedFields] = useState({
        lastname: '',
        religion: '',
        ethnicity: '',
        citizenship: '',
    });
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const count = parseInt(userData.householdCount || 0);
        const existingMembers = userData.members || [];

        const updatedMembers = Array.from({ length: count }, (_, i) => {
            const member = existingMembers[i] || { ...defaultMember };

            // If new member (not in existing) and not first index, apply shared fields
            if (!existingMembers[i] && i !== 0) {
                return {
                    ...member,
                    lastname: sharedFields.lastname,
                    religion: sharedFields.religion,
                    ethnicity: sharedFields.ethnicity,
                    citizenship: sharedFields.citizenship,
                };
            }

            return member;
        });

        // If there’s at least one member, sync shared fields from first member
        if (updatedMembers[0]) {
            setSharedFields({
                lastname: updatedMembers[0].lastname,
                religion: updatedMembers[0].religion,
                ethnicity: updatedMembers[0].ethnicity,
                citizenship: updatedMembers[0].citizenship,
            });
        }

        setMembers(updatedMembers);
    }, [userData.householdCount]);


    // Sync userData.members whenever members state changes
    useEffect(() => {
        if (members.length) {
            setUserData((prev) => ({ ...prev, members }));
        }
    }, [members, setUserData]);

    const handleSharedChange = (e) => {
        const { name, value } = e.target;
        setSharedFields((prev) => ({ ...prev, [name]: value }));

        // Update members state with new shared field value
        setMembers((prevMembers) => {
            const oldLastname = prevMembers[0]?.lastname || '';

            const updatedMembers = prevMembers.map((member, index) => {
                // Update first member and all members sharing the first member's old last name
                if (index === 0 || member.lastname === oldLastname) {
                    return { ...member, [name]: value };
                }
                return member;
            });

            return updatedMembers;
        });
    };

    const handleMemberChange = (index, e) => {
        let { name, value } = e.target;

        if (name.startsWith('gender')) name = 'gender';

        if (name === 'is_household_head') {
            value = parseInt(value);
        }

        setMembers((prev) => {
            const updated = [...prev];
            const oldLastname = prev[0]?.lastname || '';
            const member = { ...updated[index] };

            member[name] = value;

            if (name === 'birthdate') {
                member.age = calculateAge(value);
            }

            if (name === 'is_household_head' && value === 1) {
                return updated.map((m, i) => ({
                    ...m,
                    is_household_head: i === index ? 1 : 0,
                }));
            }

            if (
                index === 0 &&
                ['lastname', 'religion', 'ethnicity', 'citizenship',].includes(name)
            ) {
                const updatedShared = { ...sharedFields, [name]: value };
                setSharedFields(updatedShared);

                for (let i = 1; i < updated.length; i++) {
                    if (updated[i].lastname === oldLastname) {
                        updated[i][name] = value;
                    }
                }
            }

            updated[index] = member;
            return updated;
        });
    };


    const calculateAge = (birthdate) => {
        if (!birthdate) return '';
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleVehicleChange = (memberIndex, vehicleIndex, e) => {
        const { name, value } = e.target;
        const updatedMembers = [...members];
        const vehicles = [...(updatedMembers[memberIndex].vehicles || [])];
        vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], [name]: value };
        updatedMembers[memberIndex].vehicles = vehicles;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const addVehicle = (index) => {
        const updatedMembers = [...members];
        const vehicles = updatedMembers[index].vehicles || [];
        vehicles.push({}); // Add empty vehicle object
        updatedMembers[index].vehicles = vehicles;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const removeVehicle = (memberIndex, vehicleIndex) => {
        const updatedMembers = [...members];
        const vehicles = [...(updatedMembers[memberIndex].vehicles || [])];
        vehicles.splice(vehicleIndex, 1);
        updatedMembers[memberIndex].vehicles = vehicles;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };



    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">
                Household Members Information
            </h2>
            <p className="text-sm text-gray-600 mb-3">
                Kindly provide the personal information of all household members.
            </p>

            <div className="grid md:grid-cols-5 gap-4 mb-6 sm:grid-cols-2 ">
                <InputField
                    type="number"
                    label="Number of Household Members"
                    name="householdCount"
                    value={userData.householdCount || ''}
                    onChange={(e) => setUserData({ ...userData, householdCount: e.target.value })}
                    placeholder="Enter number of members"
                />

                <InputField
                    label="Family Name"
                    name="family_name"
                    value={userData.family_name || ''}
                    onChange={(e) => setUserData({ ...userData, family_name: e.target.value })}
                    placeholder="Enter family name"
                />

                <DropdownInputField
                    label="Family Type"
                    name="family_type"
                    value={userData.family_type || ''}
                    items={[
                        { label: "Nuclear", value: "nuclear" },
                        { label: "Single-parent", value: "single_parent" },
                        { label: "Extended", value: "extended" },
                        { label: "Stepfamilies", value: "stepfamilies" },
                        { label: "Grandparent", value: "grandparent" },
                        { label: "Childless", value: "childless" },
                        { label: "Cohabiting Partners", value: "cohabiting_partners" },
                        { label: "One-person Household", value: "one_person_household" },
                        { label: "Roommates", value: "roommates" },
                    ]}

                    placeholder="Enter family type"
                    onChange={(e) => setUserData({ ...userData, family_type: e.target.value })}
                />
            </div>

            {members.map((member, index) => {
                const isFirst = index === 0;
                const isOpen = openIndex === index;
                const showMaidenMiddleName = (['female', 'LGBTQ'].includes(member.gender) &&
                    ['married', 'widowed', 'separated'].includes(member.civil_status));
                const sharedLastname = isFirst
                    ? sharedFields.lastname
                    : member.lastname === members[0]?.lastname
                        ? sharedFields.lastname
                        : member.lastname;

                return (
                    <div key={index} className="mb-4 border rounded shadow-sm bg-white">
                        <button
                            type="button"
                            className={`w-full text-left p-4 font-semibold flex justify-between items-center
                            ${openIndex === index ? 'border-t-2 border-blue-600 text-gray-900' : 'text-gray-700 hover:bg-sky-100'}
                            transition duration-300 ease-in-out`}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`member-panel-${index}`}
                            id={`member-header-${index}`}
                        >
                            <span>Household Member {index + 1}</span>
                            {openIndex === index ? (
                                <IoIosArrowUp className="text-xl text-blue-600" />
                            ) : (
                                <IoIosArrowDown className="text-xl text-blue-600" />
                            )}
                        </button>

                        {isOpen && (
                            <div id={`member-panel-${index}`} role="region" aria-labelledby={`member-header-${index}`} className="p-4 space-y-4">
                                {/* PERSONAL INFORMATION */}
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4">
                                    <div className="md:row-span-2 flex flex-col items-center space-y-2">
                                        <InputLabel htmlFor={`resident-image-${index}`} value="Profile Photo" />
                                        <img src={member.resident_image instanceof File ? URL.createObjectURL(member.resident_image) : member.resident_image || "/images/default-avatar.jpg"}
                                            alt={`Resident ${index + 1}`} className="w-32 h-32 object-cover rounded-full border border-gray-200" />
                                        <input id={`resident-image-${index}`} type="file" name="resident_image" accept="image/*" onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) setMembers(prev => prev.map((m, i) => i === index ? { ...m, resident_image: file } : m));
                                        }} className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                    </div>

                                    <div className="md:col-span-5 space-y-2">
                                        <div className={`grid gap-2 grid-cols-1 sm:grid-cols-2 md:${showMaidenMiddleName ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                            <InputField label="Last Name" name="lastname" value={sharedLastname}
                                                onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                                disabled={!isFirst && member.lastname !== members[0]?.lastname} placeholder="Family name" />
                                            <InputField label="First Name" name="firstname" value={member.firstname}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Given name" />
                                            <InputField label="Middle Name" name="middlename" value={member.middlename}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Middle name" />
                                            {showMaidenMiddleName && <InputField label="Maiden Name" name="maiden_middle_name" value={member.maiden_middle_name}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Mother's name" />}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <DropdownInputField label="Suffix" name="suffix" value={member.suffix} items={['Jr.', 'Sr.', 'III', 'IV']}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Select suffix" />
                                            <DropdownInputField label="Civil Status" name="civil_status" value={member.civil_status}
                                                items={[
                                                    { label: 'Single', value: 'single' },
                                                    { label: 'Married', value: 'married' },
                                                    { label: 'Widowed', value: 'widowed' },
                                                    { label: 'Divorced', value: 'divorced' },
                                                    { label: 'Separated', value: 'separated' },
                                                    { label: 'Annulled', value: 'annulled' },
                                                ]}

                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Select status" />
                                            <RadioGroup label="Gender" name="gender" selectedValue={member.gender || ''}
                                                options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'LGBTQIA+', value: 'LGBTQ' }]}
                                                onChange={(e) => handleMemberChange(index, e)} />
                                        </div>
                                    </div>
                                </div>

                                {/* BIRTH & CITIZENSHIP */}
                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                    <h3 className="text-md font-medium text-gray-700">Birth & Citizenship</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                        <InputField type="date" label="Birth Date" name="birthdate" value={member.birthdate} onChange={(e) => handleMemberChange(index, e)} />
                                        <InputField label="Birth Place" name="birthplace" value={member.birthplace} onChange={(e) => handleMemberChange(index, e)} placeholder="City/Municipality" />
                                        <DropdownInputField label="Religion" name="religion" value={isFirst ? sharedFields.religion : member.religion}
                                            items={['Roman Catholic', 'Iglesia ni Cristo', 'Born Again', 'Baptists']}
                                            onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)} placeholder="Select religion" />
                                        <DropdownInputField label="Ethnicity" name="ethnicity" value={isFirst ? sharedFields.ethnicity : member.ethnicity}
                                            items={['Ilocano', 'Ibanag', 'Tagalog', 'Indigenous People']}
                                            onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)} placeholder="Select ethnicity" />
                                        <DropdownInputField label="Citizenship" name="citizenship" value={isFirst ? sharedFields.citizenship : member.citizenship}
                                            items={['Filipino', 'Chinese', 'American']}
                                            onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)} placeholder="Select citizenship" />
                                    </div>
                                </div>

                                {/* CONTACT & RESIDENCY */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                        <h3 className="text-md font-medium text-gray-700">Contact Info</h3>
                                        <div className="space-y-2">
                                            <InputField label="Contact Number" name="contactNumber" value={member.contactNumber}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="09XX XXXX XXX" />
                                            <InputField label="Email" name="email" value={member.email}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="your@email.com" />
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                        <h3 className="text-md font-medium text-gray-700">Residency Info</h3>
                                        <div className="space-y-2">
                                            <DropdownInputField
                                                label="Residency Type"
                                                name="residency_type"
                                                value={member.residency_type}
                                                items={[
                                                    { label: 'Permanent', value: 'permanent' },
                                                    { label: 'Temporary', value: 'temporary' },
                                                    { label: 'Migrant', value: 'migrant' },]}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Select type" />
                                            <YearDropdown label="Residency Date" name="residency_date" value={member.residency_date}
                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Select year" />
                                            <RadioGroup label="Household Head?" name="is_household_head" selectedValue={parseInt(member.is_household_head)}
                                                options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                onChange={(e) => handleMemberChange(index, { target: { name: 'is_household_head', value: parseInt(e.target.value) } })}
                                                disabled={members.some((m, i) => m.is_household_head === 1 && i !== index)} />
                                        </div>
                                    </div>
                                </div>

                                {/* GOVERNMENT PROGRAMS */}
                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                    <h3 className="text-md font-medium text-gray-700">Government Programs</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                        <RadioGroup
                                            label="4Ps Beneficiary?"
                                            name="is_4ps_benificiary"
                                            selectedValue={member.is_4ps_benificiary || ''}
                                            options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                            onChange={(e) => handleMemberChange(index, e)} />
                                        <RadioGroup
                                            label="Solo Parent?"
                                            name="is_solo_parent"
                                            selectedValue={member.is_solo_parent || ''}
                                            options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                            onChange={(e) => handleMemberChange(index, e)} />
                                        {member.is_solo_parent == 1 &&
                                            <InputField
                                                label="Solo Parent ID"
                                                name="solo_parent_id_number"
                                                value={member.solo_parent_id_number || ''}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="ID number"
                                            />}
                                        <RadioGroup
                                            label="Registered Voter?"
                                            name="registered_voter"
                                            selectedValue={member.registered_voter}
                                            options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                            onChange={(e) => handleMemberChange(index, e)} />
                                        {member.registered_voter == 1 && <>
                                            <InputField
                                                label="Voter ID"
                                                name="voter_id_number"
                                                value={member.voter_id_number}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Voter ID number" />
                                            <DropdownInputField
                                                label="Voting Status"
                                                name="voting_status"
                                                value={member.voting_status}
                                                items={[
                                                    { label: 'Active', value: 'active' },
                                                    { label: 'Inactive', value: 'inactive' },
                                                    { label: 'Disqualified', value: 'disqualified' },
                                                    { label: 'Medical', value: 'medical' },
                                                    { label: 'Overseas', value: 'overseas' },
                                                    { label: 'Detained', value: 'detained' },
                                                    { label: 'Deceased', value: 'deceased' },
                                                ]}

                                                onChange={(e) => handleMemberChange(index, e)} placeholder="Select status" />
                                        </>}
                                    </div>
                                </div>

                                {/* SENIOR CITIZEN (CONDITIONAL) */}
                                {member.age >= 60 && (
                                    <div className="bg-gray-50 p-3 rounded space-y-2">
                                        <h3 className="text-md font-medium text-gray-700">Senior Citizen Info</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                            <RadioGroup label="Pensioner?" name="is_pensioner" selectedValue={member.is_pensioner || ''}
                                                options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }, { label: 'Pending', value: 'pending' }]}
                                                onChange={(e) => handleMemberChange(index, e)} />
                                            {member.is_pensioner === 'yes' && <>
                                                <InputField label="OSCA ID" name="osca_id_number" type="number" value={member.osca_id_number}
                                                    onChange={(e) => handleMemberChange(index, e)} placeholder="OSCA ID number" />
                                                <DropdownInputField label="Pension Type" name="pension_type" value={member.pension_type}
                                                    items={['SSS', 'DSWD', 'GSIS', 'private', 'none']}
                                                    onChange={(e) => handleMemberChange(index, e)} placeholder="Select type" />
                                                <RadioGroup label="Living Alone?" name="living_alone" selectedValue={member.living_alone}
                                                    options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                                    onChange={(e) => handleMemberChange(index, e)} />
                                            </>}
                                        </div>
                                    </div>)}

                                <div className="bg-gray-50 p-3 rounded">
                                    <h3 className="text-md font-medium text-gray-700">Vehicle Info</h3>
                                    <div>
                                        <RadioGroup
                                            label="Owns Vehicle(s)?"
                                            name="has_vehicle"
                                            selectedValue={member.has_vehicle}
                                            options={[{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }]}
                                            onChange={(e) => handleMemberChange(index, e)}
                                        />
                                        {member.has_vehicle == 1 && (
                                            <div className="space-y-4 mt-4">
                                                {(member.vehicles || []).map((vehicle, vecIndex) => (
                                                    <div
                                                        key={vecIndex}
                                                        className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                                    >
                                                        {/* Left: input fields */}
                                                        <div className="grid md:grid-cols-4 gap-4">
                                                            <DropdownInputField
                                                                label="Vehicle Type"
                                                                name="vehicle_type"
                                                                value={vehicle.vehicle_type || ''}
                                                                items={['Motorcycle', 'Tricycle', 'Car', 'Jeep', 'Truck', 'Bicycle']}
                                                                onChange={(e) => handleVehicleChange(index, vecIndex, e)}
                                                                placeholder="Select type"
                                                            />
                                                            <DropdownInputField
                                                                label="Classification"
                                                                name="vehicle_class"
                                                                value={vehicle.vehicle_class || ''}
                                                                items={[
                                                                    { label: 'Private', value: 'private' },
                                                                    { label: 'Public', value: 'public' },
                                                                ]}
                                                                onChange={(e) => handleVehicleChange(index, vecIndex, e)}
                                                                placeholder="Select class"
                                                            />

                                                            <DropdownInputField
                                                                label="Usage Purpose"
                                                                name="usage_status"
                                                                value={vehicle.usage_status || ''}
                                                                items={[
                                                                    { label: 'Personal', value: 'personal' },
                                                                    { label: 'Public Transport', value: 'public_transport' },
                                                                    { label: 'Business Use', value: 'business_use' },
                                                                ]}
                                                                onChange={(e) => handleVehicleChange(index, vecIndex, e)}
                                                                placeholder="Select usage"
                                                            />

                                                            <InputField
                                                                label="Quantity"
                                                                name="quantity"
                                                                type="number"
                                                                value={vehicle.quantity || ''}
                                                                onChange={(e) => handleVehicleChange(index, vecIndex, e)}
                                                                placeholder="Number"
                                                            />
                                                        </div>

                                                        {/* Right: remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeVehicle(index, vecIndex)}
                                                            className="absolute top-1 right-2 flex items-center gap-1 text-2xl text-red-400 hover:text-red-800 font-medium mt-1 mb-5 transition-colors duration-200"
                                                            title="Remove"
                                                        >
                                                            <IoIosCloseCircleOutline />
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => addVehicle(index)}
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
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default HouseholdPersonalInfo;
