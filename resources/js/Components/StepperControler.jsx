import React from 'react';
import { Button } from './ui/button'; // Make sure this is the correct path

const StepperController = ({ handleClick, currentStep, steps }) => {
    return (
        <div>
            <div className="flex justify-between gap-4">
                <Button
                    variant="outline"
                    size="default"
                    onClick={() => handleClick("back")}
                    className={`px-9 py-2 border-2 shadow-md border-gray-400 ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={currentStep === 1}
                >
                    Back
                </Button>

                <Button
                    onClick={() => handleClick("next")}
                    size="default"
                    className="bg-blue-800 hover:bg-blue-900 text-white px-9 py-2 shadow-md"
                >
                    {currentStep === steps.length ? "Confirm" : "Next"}
                </Button>
            </div>
        </div>
    );
};

export default StepperController;
