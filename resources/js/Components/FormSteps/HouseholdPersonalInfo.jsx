import { useState, useEffect, useContext } from 'react';
import { StepperContext } from '@/context/StepperContext';
import InputField from '@/Components/InputField';
import DropdownInputField from '../DropdownInputField';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

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

        setMembers((prev) => {
            const updated = [...prev];
            const oldLastname = prev[0]?.lastname || '';

            updated[index] = { ...updated[index], [name]: value };

            // If first member updates a shared field, update sharedFields and reflect changes
            if (index === 0 && ['lastname', 'religion', 'ethnicity', 'citizenship'].includes(name)) {
                const updatedShared = { ...sharedFields, [name]: value };
                setSharedFields(updatedShared);

                updated.forEach((member, i) => {
                    if (i !== 0 && member.lastname === oldLastname) {
                        updated[i][name] = value;
                    }
                });
            }

            return updated;
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-5">
                Household Members Information
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Kindly provide the personal information of all household members.
            </p>

            <div className="grid md:grid-cols-5 gap-4 mb-6">
                <InputField
                    type="number"
                    label="Number of Household Members"
                    name="householdCount"
                    value={userData.householdCount || ''}
                    onChange={(e) => setUserData({ ...userData, householdCount: e.target.value })}
                    placeholder="Enter number of members"
                />
            </div>

            {members.map((member, index) => {
                const isFirst = index === 0;
                const isOpen = openIndex === index;
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
                            ${openIndex === index ? 'border-t-2 border-blue-600 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}
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
                                <div className="grid md:grid-cols-4 gap-4 mb-4">
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
                                    <DropdownInputField
                                        label="Suffix"
                                        name="suffix"
                                        value={member.suffix}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        items={['Jr.', 'Sr.', 'III', 'IV']}
                                        placeholder="Enter or select suffix"
                                    />
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <InputField
                                        type="date"
                                        label="Birth Date"
                                        name="birthdate"
                                        value={member.birthdate}
                                        onChange={(e) => handleMemberChange(index, e)}
                                    />
                                    <InputField
                                        label="Birth Place"
                                        name="birthplace"
                                        value={member.birthplace}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        placeholder="Enter birth place"
                                    />
                                    <DropdownInputField
                                        label="Civil Status"
                                        name="civil_status"
                                        value={member.civil_status}
                                        onChange={(e) => handleMemberChange(index, e)}
                                        items={['Single', 'Married', 'Widowed', 'Divorced', 'Separated', 'Annulled']}
                                        placeholder="Select civil status"
                                    />

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
                                            Gender
                                        </label>
                                        <div className="flex gap-4">
                                            {['Male', 'Female', 'LGBTQIA+'].map((option) => (
                                                <label
                                                    key={option}
                                                    className="flex items-center gap-1 text-sm text-gray-700"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`gender-${index}`}
                                                        value={option}
                                                        checked={member.gender === option}
                                                        onChange={(e) => handleMemberChange(index, e)}
                                                        className="form-radio text-indigo-600"
                                                        required
                                                    />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    {['Female', 'LGBTQIA+'].includes(member.gender) &&
                                        ['Married', 'Widowed', 'Separated'].includes(member.civil_status) && (
                                            <InputField
                                                label="Maiden Middle Name"
                                                name="maiden_middle_name"
                                                value={member.maiden_middle_name}
                                                onChange={(e) => handleMemberChange(index, e)}
                                                placeholder="Enter maiden middle name"
                                            />
                                        )}

                                    <DropdownInputField
                                        label="Religion"
                                        name="religion"
                                        value={isFirst ? sharedFields.religion : member.religion}
                                        onChange={isFirst ? handleSharedChange : (e) => handleMemberChange(index, e)}
                                        items={['Roman Catholic', 'Iglesia ni Cristo', 'Born Again', 'Baptists']}
                                        placeholder="Enter or select religion"
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
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
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
