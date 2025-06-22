import React, { useContext, useState } from 'react';
import { StepperContext } from '@/context/StepperContext';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import YearDropdown from '../YearDropdown';
import InputField from '../InputField';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

function MedicalInfo() {
    const { userData, setUserData } = useContext(StepperContext);
    const members = userData.members || [];
    const [openIndex, setOpenIndex] = useState(null);

    const handleMedicalChange = (index, e) => {
        const { name, value, type } = e.target;
        const updatedMembers = [...members];

        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: type === 'number' ? parseFloat(value) || '' : value
        };

        setUserData((prev) => ({
            ...prev,
            members: updatedMembers,
        }));
    };

    const handlePWDChange = (memberIndex, e) => {
        const { name, value } = e.target;
        const updateMembers = [...members];
        updateMembers[memberIndex][name] = value;
        setUserData(prev => ({ ...prev, members: updateMembers }));
    };
    // disability
    const addDisability = (index) => {
        const updatedMembers = [...members];
        const disabilities = updatedMembers[index].disabilities || [];
        disabilities.push('');
        updatedMembers[index].disabilities = disabilities;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const removeDisability = (memberIndex, disabilityIndex) => {
        const updatedMembers = [...members];
        const disabilities = [...(updatedMembers[memberIndex].disabilities || [])];
        disabilities.splice(disabilityIndex, 1);
        updatedMembers[memberIndex].disabilities = disabilities;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };

    const handleDisabilityChange = (memberIndex, disabilityIndex, e) => {
        const updatedMembers = [...members];
        const disabilities = [...(updatedMembers[memberIndex].disabilities || [])];
        disabilities[disabilityIndex] = e.target.value;
        updatedMembers[memberIndex].disabilities = disabilities;
        setUserData(prev => ({ ...prev, members: updatedMembers }));
    };
    // alerergy


    //resident condition
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">Medical Information</h2>
            <p className="text-sm text-gray-600 mb-3">Kindly share your medical history and health-related details.</p>

            {members.map((member, index) => {
                const isOpen = openIndex === index;
                const displayName = `${member.firstname || ''} ${member.lastname || ''}`;

                return (
                    <div key={index} className="mb-4 border rounded shadow-sm bg-white">
                        <button
                            type="button"
                            className={`w-full text-left p-4 font-semibold flex justify-between items-center
                                ${isOpen ? 'border-t-2 border-blue-600 text-gray-900' : 'text-gray-700 hover:bg-sky-100'}
                                transition duration-300 ease-in-out`}
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            aria-expanded={isOpen}
                        >
                            {displayName.trim() || `Household Member ${index + 1}`}
                            {isOpen ? (
                                <IoIosArrowUp className="text-xl text-blue-600" />
                            ) : (
                                <IoIosArrowDown className="text-xl text-blue-600" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="p-4 space-y-4">
                                <p className="font-bold">Child Health Monitoring</p>
                                <div className="grid md:grid-cols-4 gap-4">
                                    <InputField
                                        label="Weight in Kilogram (kg)"
                                        name="weight_kg"
                                        value={member.weight_kg || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter weight in kg"
                                        type="number"
                                        step="0.01"
                                    />
                                    <InputField
                                        label="Height in centimeter (cm)"
                                        name="height_cm"
                                        value={member.height_cm || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter height in cm"
                                        type="number"
                                        step="0.01"
                                    />
                                    <InputField
                                        label="Nutrition Status"
                                        name="nutrition_status"
                                        value={member.nutrition_status || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        items={['normal', 'underweight', 'severly underweight', 'overweight', 'stunted', 'wasted']}
                                        placeholder="Select status"
                                    />


                                    {/* medical info */}
                                    <InputField
                                        label="Emergency contact number"
                                        name="emergency_contact_number"
                                        value={member.emergency_contact_number || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter contact number"
                                        type="number"
                                    />

                                    <InputField
                                        label="Emergency contact name"
                                        name="emergency_contact_name"
                                        value={member.emergency_contact_name || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter contact name"
                                    />

                                    <DropdownInputField
                                        label="Emergency Contact Relationship"
                                        name="emergency_contact_relationship"
                                        value={member.emergency_contact_relationship || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Select relationship"
                                        items={[
                                            'Mother',
                                            'Father',
                                            'Sibling',
                                            'Grandparent',
                                            'Relative',
                                            'Neighbor',
                                            'Friend',
                                            'Guardian',
                                            'Other'
                                        ]}
                                    />

                                    <DropdownInputField
                                        label="Blood Type"
                                        name="blood_type"
                                        value={member.blood_type || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Select blood type"
                                        items={[
                                            'A+',
                                            'A−',
                                            'B+',
                                            'B−',
                                            'AB+',
                                            'AB−',
                                            'O+',
                                            'O−'
                                        ]}
                                    />
                                    <RadioGroup
                                        label="Are you a PhilHealth member?"
                                        name="has_philhealth"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.has_philhealth || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                    />
                                    {member.has_philhealth == 1 && (
                                        <InputField
                                            label="PhilHealth ID number"
                                            name="philhealth_id_number"
                                            value={member.philhealth_id_number || ''}
                                            onChange={(e) => handleMedicalChange(index, e)}
                                            placeholder="Enter PhilHealth id number"
                                        />
                                    )}

                                    <RadioGroup
                                        label="Do you consume alcohol?"
                                        name="is_alcohol_user"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.is_alcohol_user || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                    />
                                    <RadioGroup
                                        label="Do you smoke?"
                                        name="is_smoker"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.is_smoker || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                    />
                                    <RadioGroup
                                        label="Are you a Person with Disability (PWD)?"
                                        name="is_pwd"
                                        options={[
                                            { label: 'Yes', value: 1 },
                                            { label: 'No', value: 0 },
                                        ]}
                                        selectedValue={member.is_pwd || ''}
                                        onChange={(e) => handlePWDChange(index, e)}
                                    />
                                </div>

                                <div className="flex flex-wrap gap-x-6 items-start">


                                    {member.is_pwd == 1 && (
                                        <div className="flex flex-col gap-4 mt-2">
                                            {/* PWD ID Number */}
                                            <InputField
                                                label="PWD ID number"
                                                name="pwd_id_number"
                                                type="number"
                                                value={member.pwd_id_number || ''}
                                                onChange={(e) => handlePWDChange(index, e)}
                                                placeholder="Enter PWD ID number"
                                            />

                                            {/* Disability Types */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                    Disability type(s)
                                                </label>

                                                <div className="flex flex-wrap items-center gap-4">
                                                    {(member.disabilities || []).map((disability, disIndex) => (
                                                        <div
                                                            key={disIndex}
                                                            className="flex items-center gap-2 bg-gray-50 p-2 rounded-md shadow-sm"
                                                        >
                                                            <InputField
                                                                type="text"
                                                                name="disability_type"
                                                                value={disability.disability_type || ''}
                                                                onChange={(e) => handleDisabilityChange(index, disIndex, e)}
                                                                placeholder="Enter disability type"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDisability(index, disIndex)}
                                                                className="text-red-500 hover:text-red-700 text-xl"
                                                                title="Remove"
                                                            >
                                                                <IoIosCloseCircleOutline />
                                                            </button>
                                                        </div>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={() => addDisability(index)}
                                                        className="text-blue-600 hover:text-blue-800 text-2xl"
                                                        title="Add disability"
                                                    >
                                                        <IoIosAddCircleOutline />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}



                                </div>



                            </div>
                        )}
                    </div>
                )

            })}
        </div>
    )
}

export default MedicalInfo
