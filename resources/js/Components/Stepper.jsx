import React, { useEffect, useState, useRef } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

const Stepper = ({ steps, currentStep }) => {
    const [newStep, setNewStep] = useState([]);
    const stepRef = useRef();

    const updateStep = (stepNumber, steps) => {
        const updatedSteps = [...steps];

        for (let i = 0; i < updatedSteps.length; i++) {
            if (i === stepNumber) {
                updatedSteps[i] = {
                    ...updatedSteps[i],
                    highlighted: true,
                    selected: true,
                    completed: false,
                };
            } else if (i < stepNumber) {
                updatedSteps[i] = {
                    ...updatedSteps[i],
                    highlighted: false,
                    selected: true,
                    completed: true,
                };
            } else {
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

    const displaySteps = newStep.map((step, index) => {
        return (
            <div key={index} className="flex items-center w-full">
                <div className="flex flex-col items-center text-blue-400 relative">
                    <div
                        className={`
                            rounded-full transition duration-500 ease-in-out border-2 h-10 w-10 flex items-center justify-center text-lg font-bold
                            ${step.selected ? 'bg-blue-500 text-white border-blue-500' : 'border-blue-300 text-blue-300'}
                        `}
                    >
                        {step.completed ? <IoMdCheckmark className="text-white text-xl" /> : index + 1}
                    </div>
                    <div
                        className={`absolute text-center mt-14 w-32 uppercase
                            ${step.selected || step.completed ? 'font-bold text-blue-500' : 'text-blue-400'}
                            text-xs
                        `}
                    >
                        {step.description}
                    </div>

                </div>
                {index !== newStep.length - 1 && (
                    <div
                        className={`
                            flex-auto border-t transition duration-500 ease-in-out mx-2
                            ${step.completed ? 'border-blue-600' : 'border-blue-300'}
                        `}
                    ></div>
                )}
            </div>
        );
    });

    return <div className="flex justify-between px-10 py-4">{displaySteps}</div>;
};

export default Stepper;
