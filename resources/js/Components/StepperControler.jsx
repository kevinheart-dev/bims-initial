import React from 'react';
import { Button } from './ui/button';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const StepperController = ({ handleClick, currentStep, steps }) => {
    return (
        <div>
            <div className="flex justify-between gap-4">
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => handleClick("back")}
                    className={`px-5 py-2 border-2 shadow-md bg-gray-300 border-gray-300 hover:bg-gray-200 active:bg-gray-300
                        ${currentStep === 1 ? "opacity-500 cursor-not-allowed" : ""}`}
                    disabled={currentStep === 1}
                >
                    <MdArrowBackIosNew />Back
                </Button>

                <Button
                    onClick={() => handleClick("next")}
                    size="default"
                    className="border-2 bg-blue-600 border-blue-300 hover:bg-blue-700 active:bg-blue-900 text-white px-5 py-2 shadow-md"
                >
                    {currentStep === steps.length ? ("Confirm") : (<span className="inline-flex items-center gap-1"> Next <MdArrowForwardIos /> </span>)}

                </Button>
            </div>
        </div>
    );
};

export default StepperController;
