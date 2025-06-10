import React, { useContext, useState } from 'react';
import { StepperContext } from '@/context/StepperContext';
import DropdownInputField from '../DropdownInputField';
import RadioGroup from '../RadioGroup';
import YearDropdown from '../YearDropdown';
import InputField from '../InputField';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";

function MedicalInfo() {
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-1">Medical Information</h2>
            <p className="text-sm text-gray-600 mb-3">Kindly share your medical history and health-related details.</p>
        </div>
    )
}

export default MedicalInfo
