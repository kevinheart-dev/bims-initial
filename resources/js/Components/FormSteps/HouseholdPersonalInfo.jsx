import { useState, useEffect, useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import InputField from '@/Components/InputField';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import YearDropdown from '../YearDropdown';
import InputLabel from '../InputLabel';

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

    // Sync members when householdCount changes
    useEffect(() => {
        const count = parseInt(userData.householdCount || 0);

        const existingMembers = userData.members || [];
        const newMembers = Array.from({ length: count }, (_, i) => {
            return existingMembers[i] || { ...defaultMember };
        });

        if (newMembers[0]) {
            setSharedFields({
                lastname: newMembers[0].lastname,
                religion: newMembers[0].religion,
                ethnicity: newMembers[0].ethnicity,
                citizenship: newMembers[0].citizenship,
            });
        }

        setMembers(newMembers);
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
                ['lastname', 'religion', 'ethnicity', 'citizenship'].includes(name)
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

                <DropdownInputField
                    label="Family Type"
                    name="family_type"
                    value={userData.family_type || ''}
                    items={['Nuclear', 'Single-parent', 'Extended', 'Stepfamilies', 'Grandparent', 'Childess', 'Cohabiting Partners', 'One-person Household', 'Roomates']}
                    placeholder="Enter family type"
                    onChange={(e) => setUserData({ ...userData, family_type: e.target.value })}
                />
            </div>

            {members.map((member, index) => {
                const isFirst = index === 0;
                const isOpen = openIndex === index;
                const showMaidenMiddleName = (['female', 'LGBTQIA+'].includes(member.gender) &&
                    ['Married', 'Widowed', 'Separated'].includes(member.civil_status));
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
                            <div
                                id={`member-panel-${index}`}
                                role="region"
                                aria-labelledby={`member-header-${index}`}
                                className="p-4 space-y-4"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-y-4 md:gap-x-8">
                                    {/* Resident Image on the left */}
                                    <div className="md:row-span-2 flex flex-col items-center">
                                        <InputLabel htmlFor={`resident-image-${index}`} value="Resident Image" />

                                        <img
                                            src={
                                                member.resident_image instanceof File
                                                    ? URL.createObjectURL(member.resident_image)
                                                    : member.resident_image || "/images/default-avatar.jpg"
                                            }
                                            alt={`Resident ${index + 1}`}
                                            className="w-40 h-40 object-cover rounded-full mb-4"
                                        />

                                        <input
                                            id={`resident-image-${index}`}
                                            type="file"
                                            name="resident_image"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setMembers((prev) => {
                                                        const updated = [...prev];
                                                        updated[index] = {
                                                            ...updated[index],
                                                            resident_image: file,
                                                        };
                                                        return updated;
                                                    });
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-blue-50 file:text-blue-700
                                            hover:file:bg-blue-100"
                                        />
                                    </div>

                                    {/* First row of input fields */}
                                    <div className={`md:col-span-5 grid gap-4 grid-cols-1 sm:grid-cols-2 md:${showMaidenMiddleName ? 'grid-cols-4' : 'grid-cols-3'}`}>
                                        <InputField
                                            label="Last Name"
                                            name="lastname"
                                            value={sharedLastname}
                                            onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                            disabled={!isFirst && member.lastname !== members[0]?.lastname}
                                            placeholder="Enter last name"
                                        />
                                        <InputField
                                            label="First Name"
                                            name="firstname"
                                            value={member.firstname}
                                            onChange={(e) => handleMemberChange(index, e)}
                                            placeholder="Enter first name"
                                        />
                                        <InputField
                                            label="Middle Name"
                                            name="middlename"
                                            value={member.middlename}
                                            onChange={(e) => handleMemberChange(index, e)}
                                            placeholder="Enter middle name"
                                        />
                                        {showMaidenMiddleName && (
                                            <InputField
                                                label="Maiden Middle Name"
                                                name="maiden_middle_name"
                                                value={member.maiden_middle_name}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Enter maiden middle name"
                                            />
                                        )}
                                    </div>

                                    {/* Second row of suffix input */}
                                    <div className="md:col-start-2 md:col-span-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <DropdownInputField
                                                label="Suffix"
                                                name="suffix"
                                                value={member.suffix}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                items={['Jr.', 'Sr.', 'III', 'IV']}
                                                placeholder="Enter or select suffix"
                                            />

                                            <DropdownInputField
                                                label="Civil Status"
                                                name="civil_status"
                                                value={member.civil_status}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                items={['Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled']}
                                                placeholder="Select civil status"
                                            />

                                            <RadioGroup
                                                label="Gender"
                                                name="gender"
                                                options={[
                                                    { label: 'Male', value: 'male' },
                                                    { label: 'Female', value: 'female' },
                                                    { label: 'LGBTQIA+', value: 'LGBTQIA+' },
                                                ]}
                                                selectedValue={member.gender || ''}
                                                onChange={(e) => handleMemberChange(index, e)}
                                            />

                                        </div>
                                    </div>

                                </div>

                                <div className="grid md:grid-cols-4 gap-4 sm:grid-cols-2 ">
                                    <div className="col-span-1">
                                        <InputField
                                            type="date"
                                            label="Birth Date"
                                            name="birthdate"
                                            value={member.birthdate}
                                            onChange={(e) => handleMemberChange(index, e)}
                                        />
                                    </div>

                                    <InputField
                                        label="Birth Place"
                                        name="birthplace"
                                        value={member.birthplace}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Enter birth place"
                                    />

                                    <DropdownInputField
                                        label="Religion"
                                        name="religion"
                                        value={isFirst ? sharedFields.religion : member.religion}
                                        onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                        items={['Roman Catholic', 'Iglesia ni Cristo', 'Born Again', 'Baptists']}
                                        placeholder="Enter or select religion"
                                    />

                                    <RadioGroup
                                        label="Are you the household head?"
                                        name="is_household_head"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={parseInt(member.is_household_head)}
                                        onChange={(e) =>
                                            handleMemberChange(index, {
                                                target: {
                                                    name: 'is_household_head',
                                                    value: parseInt(e.target.value),
                                                },
                                            })
                                        }
                                        disabled={
                                            members.some((m, i) => m.is_household_head === 1 && i !== index)
                                        }
                                    />

                                    <DropdownInputField
                                        label="Ethnicity"
                                        name="ethnicity"
                                        value={isFirst ? sharedFields.ethnicity : member.ethnicity}
                                        onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                        items={['Ilocano', 'Ibanag', 'Tagalog', 'Indigenous People']}
                                        placeholder="Enter or select ethnicity"
                                    />
                                    <DropdownInputField
                                        label="Citizenship"
                                        name="citizenship"
                                        value={isFirst ? sharedFields.citizenship : member.citizenship}
                                        onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                        items={['Filipino', 'Chinese', 'American ']}
                                        placeholder="Enter or select citizenship"
                                    />

                                    <InputField
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={member.contactNumber}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Enter contact number"
                                    />
                                    <InputField
                                        label="Email"
                                        name="email"
                                        value={member.email}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Enter email"
                                    />

                                    <DropdownInputField
                                        label="Residency type"
                                        name="residency_type"
                                        value={member.residency_type}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Select residency type"
                                        items={['permanent', 'temporary', 'migrant']}

                                    />

                                    <YearDropdown
                                        label="Residency date"
                                        name="residency_date"
                                        value={member.residency_date}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Select residency date"
                                    />

                                    <RadioGroup
                                        label="Registered Voter"
                                        name="registered_voter"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.registered_voter}
                                        onChange={(e) => handleMemberChange(index, e)}

                                    />

                                    {member.registered_voter == 1 && (
                                        <>
                                            <InputField
                                                label="Voter ID number"
                                                name="voter_id_number"
                                                value={member.voter_id_number}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Enter your Voter Id"
                                            />

                                            <DropdownInputField
                                                label="Voting Status"
                                                name="voting_status"
                                                value={member.voting_status}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Select voting status"
                                                items={['active', 'inactive', 'disqualified', 'medical', 'overseas', 'detained', 'deceased']}
                                            />
                                        </>
                                    )}
                                    {member.age >= 60 && (

                                        <RadioGroup
                                            label="Pensioner"
                                            name="is_pensioner"
                                            options={[
                                                { label: 'Yes', value: 'yes' },
                                                { label: 'No', value: 'no' },
                                                { label: 'Pending', value: 'pending' },
                                            ]}
                                            selectedValue={member.is_pensioner || ''}
                                            onChange={(e) => handleMemberChange(index, e)}
                                        />
                                    )}

                                    {member.is_pensioner === 'yes' && (
                                        <>
                                            <InputField
                                                label="OSCA id number"
                                                name="osca_id_number"
                                                type="number"
                                                value={member.osca_id_number}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Enter OSCA ID number"
                                            />

                                            <DropdownInputField
                                                label="Pension Type"
                                                name="pension_type"
                                                value={member.pension_type}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                items={['SSS', 'DSWD', 'GSIS', 'private', 'none']}
                                                placeholder="Select or enter pension type"
                                            />

                                            <RadioGroup
                                                label="Living alone"
                                                name="living_alone"
                                                options={[
                                                    { label: 'Yes', value: 'yes' },
                                                    { label: 'No', value: 'no' },
                                                ]}
                                                selectedValue={member.living_alone}
                                                onChange={(e) => handleMemberChange(index, e)}
                                            />
                                        </>
                                    )}
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
