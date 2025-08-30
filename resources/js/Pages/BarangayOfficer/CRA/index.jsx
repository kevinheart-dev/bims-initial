import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Stepper from "@/Components/Stepper";
import StepperController from "@/Components/StepperControler";
import { StepperContext } from "@/context/StepperContext";
import Population from "@/Components/CRAsteps/Population";
import { Toaster, toast } from "sonner";

export default function Index() {
    const breadcrumbs = [
        { label: "Community Risk Assessment (CRA)", showOnMobile: false },
    ];

    const [currentStep, setCurrentStep] = useState(1);

    // initial CRA data object
    const [craData, setCraData] = useState({
        population: {},
        livelihood: {},
        infrastructure: {},
        institutions: {},
        hazards: {},
        evacuation: {},
    });

    const [finalData, setFinalData] = useState([]);
    const [errors, setErrors] = useState({});

    const steps = [
        "Population & Residence",
        "Livelihood",
        "Infrastructure & Services",
        "Institutions & Human Resources",
        "Hazards & Disasters",
        "Evacuation & Response",
        "Summary",
    ];

    // display CRA step forms
    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Population />;
            // case 2:
            //     return <Livelihood />;
            // case 3:
            //     return <Infrastructure />;
            // ... add more steps
            case 7:
                return <div>Summary Review Here</div>;
            default:
        }
    };

    //  handle step navigation & submission
    const handleClick = (direction) => {
        let newStep = currentStep;

        if (direction === "next") {
            if (currentStep === steps.length) {
                // Submit CRA data to backend
                router.post(route("cra.store"), craData, {
                    onError: (errors) => {
                        setErrors(errors);
                        const allErrors = Object.values(errors).join("<br />");
                        toast.error("Validation Errors", {
                            description: (
                                <div
                                    dangerouslySetInnerHTML={{ __html: allErrors }}
                                />
                            ),
                            duration: 5000,
                            closeButton: true,
                        });
                    },
                    onSuccess: () => {
                        toast.success("CRA submitted successfully!", {
                            duration: 3000,
                            closeButton: true,
                        });
                    },
                });

                return;
            }
            newStep++;
        } else {
            newStep--;
        }

        if (newStep > 0 && newStep <= steps.length) {
            setCurrentStep(newStep);
        }
    };

    return (
        <AdminLayout>
            <Toaster richColors />
            <Head title="CRA" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-6">
                <div className="bg-blue-100 rounded-t-xl px-2 sm:px-6 lg:px-8 py-2 border-gray-200 shadow-lg">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                <div className="overflow-hidden bg-white border border-gray-200 rounded-b-xl p-2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                    <div className="my-2 pb-5 pr-5 pl-5 pt-0">
                        <StepperContext.Provider
                            value={{
                                craData,
                                setCraData,
                                finalData,
                                setFinalData,
                                errors,
                                setErrors,
                            }}
                        >
                            {displayStep(currentStep)}
                        </StepperContext.Provider>
                    </div>
                </div>

                <div className="mt-5">
                    <StepperController
                        handleClick={handleClick}
                        currentStep={currentStep}
                        steps={steps}
                        craData={craData}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
