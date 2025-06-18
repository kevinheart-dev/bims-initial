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
        const { name, value } = e.target;
        const updatedMembers = [...members];

        updatedMembers[index] = {
            ...updatedMembers[index],
            [name]: parseFloat(value) || ''
        };

        setUserData((prev) => ({
            ...prev,
            members: updatedMembers,
        }));
    };

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
                                    <DropdownInputField
                                        label="Weight"
                                        name="weight_kg"
                                        value={member.weight_kg || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter weight in kg"
                                        type="number"
                                        step="0.01"
                                    />
                                    <DropdownInputField
                                        label="Height"
                                        name="height_cm"
                                        value={member.height_cm || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter height in cm"
                                        type="number"
                                        step="0.01"
                                    />
                                    <DropdownInputField
                                        label="Head Circumference"
                                        name="head_circumference"
                                        value={member.head_circumference || ''}
                                        onChange={(e) => handleMedicalChange(index, e)}
                                        placeholder="Enter head circumference in cm"
                                        type="number"
                                        step="0.01"
                                    />
                                    <DropdownInputField
                                        label="Nutrition Status"
                                        name="nutrition_status"
                                        value={member.nutrition_status || ''}
                                        items={['normal', 'underweight', 'severly underweight', 'overweight', 'stunted', 'wasted']}
                                        placeholder="Select status"
                                    />
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
