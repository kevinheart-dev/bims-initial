import React, { useEffect, useState, useRef } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

const Stepper = ({ steps, currentStep }) => {
    const [newStep, setNewStep] = useState([]);
    const stepRef = useRef();

    const updateStep = (stepNumber, steps) => {
        const updatedSteps = [...steps];

        for (let i = 0; i < updatedSteps.length; i++) {
            if (i === stepNumber) {
                // Current step
                updatedSteps[i] = {
                    ...updatedSteps[i],
                    highlighted: true,
                    selected: true,
                    completed: false,
                };
            } else if (i < stepNumber) {
                // Completed steps
                updatedSteps[i] = {
                    ...updatedSteps[i],
                    highlighted: false,
                    selected: true,
                    completed: true,
                };
            } else {
                // Upcoming steps
                updatedSteps[i] = {
                    ...updatedSteps[i],
                    highlighted: false,
                    selected: false,
                    completed: false,
                };
            }
        }

        return updatedSteps;
    };

    useEffect(() => {
        const stepState = steps.map((step, index) => ({
            description: step,
            completed: false,
            highlighted: index === 0,
            selected: index === 0,
        }));

        stepRef.current = stepState;
        const current = updateStep(currentStep - 1, stepRef.current);
        setNewStep(current);
    }, [steps, currentStep]);

    const elementsToRender = [];

    newStep.forEach((step, index) => {
        // Add the step (circle + description)
        elementsToRender.push(
            <div key={`step-${index}`} className="flex flex-col items-center flex-shrink-0">
                {/* Step Circle */}
                <div
                    className={`rounded-full transition duration-300 ease-in-out border-2 h-9 w-9 md:h-12 md:w-12 flex items-center justify-center text-sm md:text-base font-semibold
                            ${step.highlighted ? 'text-blue-600 border-blue-600 shadow-md' :
                            step.selected ? 'bg-blue-600 text-white border-blue-600 shadow-md' :
                                'border-gray-300 text-gray-500 bg-white'}
                    `}
                >
                    {step.completed ? <IoMdCheckmark className="text-white  text-base md:text-xl" /> : index + 1}
                </div>
                {/* Step Description */}
                <div
                    className={`
                        text-center mt-2 w-20 sm:w-24 md:w-28 text-xs sm:text-sm uppercase leading-tight
                        ${step.highlighted ? 'font-light' : step.selected || step.completed ? 'font-bold' : 'font-normal'}
                        ${step.selected || step.completed ? 'text-blue-700' : 'text-gray-500'}
                    `}
                >
                    {step.description}
                </div>
            </div>
        );

        // Add the connector line if it's not the last step
        if (index < newStep.length - 1) {
            elementsToRender.push(
                <div
                    key={`line-${index}`}
                    className={`
                        flex-grow border-t-2 transition duration-300 ease-in-out h-px
                        ${step.completed ? 'border-blue-600' : 'border-gray-300'}
                    `}
                    style={{ marginTop: '18px', minWidth: '40px' }} // Default min-width for very small screens
                ></div>
            );
        }
    });

    return (
        <div className="flex items-start justify-between px-2 sm:px-4 md:px-6 pt-4 pb-4 md:pt-6 md:pb-6 w-full">
            {elementsToRender}
        </div>
    );
};

export default Stepper;
