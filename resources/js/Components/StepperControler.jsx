import React from 'react';
import { Button } from './ui/button';
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const StepperController = ({ handleClick, currentStep, steps, userData }) => {
    // Determine if the Next/Submit button should be disabled
    const isNextDisabled = userData ? (currentStep === steps.length && userData?.verified !== 1) : false;

    return (
        <div>
            <div className="flex justify-between gap-4">
                {/* Back Button */}
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => handleClick("back")}
                    className={`px-5 py-2 border-2 shadow-md bg-gray-300 border-gray-300 hover:bg-gray-200 active:bg-gray-300
                        ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentStep === 1}
                >
                    <MdArrowBackIosNew />Back
                </Button>

                {/* Next / Submit Button */}
                <Button
                    onClick={() => handleClick("next")}
                    size="default"
                    disabled={isNextDisabled}
                    className={`border-2 bg-blue-600 border-blue-300 hover:bg-blue-700 active:bg-blue-900 text-white px-5 py-2 shadow-md
                        ${isNextDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    {currentStep === steps.length ? (
                        <span className="inline-flex items-center gap-1">
                            Submit <MdArrowForwardIos />
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1">
                            Next <MdArrowForwardIos />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default StepperController;
