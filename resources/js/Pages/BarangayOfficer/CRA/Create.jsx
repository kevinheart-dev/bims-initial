import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Stepper from "@/Components/Stepper";
import StepperController from "@/Components/StepperControler";
import { StepperContext } from "@/context/StepperContext";
import Population from "@/Components/CRAsteps/Population";
import { Toaster, toast } from "sonner";
import Hazard from "@/Components/CRAsteps/Step3/Hazard";
import Calamities from "@/Components/CRAsteps/Step2/Calamities";
import InventoryEvacuation from "@/Components/CRAsteps/Step4/InventoryEvacuation";
import DisasterReadiness from "@/Components/CRAsteps/Step5/DisasterReadiness";
export default function Index() {
    const breadcrumbs = [
        { label: "Community Risk Assessment (CRA)", showOnMobile: false },
    ];

    const [currentStep, setCurrentStep] = useState(1);

    // ✅ Load from localStorage first
    const [craData, setCraData] = useState(() => {
        try {
            const saved = localStorage.getItem("craDataDraft");
            return saved
                ? JSON.parse(saved)
                : {
                      population: [],
                      livelihood: [],
                      infrastructure: [],
                      institutions: [],
                      hazards: [],
                      evacuation: [],
                  };
        } catch (err) {
            console.error("Error loading draft:", err);
            return {
                population: [],
                livelihood: [],
                infrastructure: [],
                institutions: [],
                hazards: [],
                evacuation: [],
            };
        }
    });

    // ✅ Auto-save whenever craData changes
    useEffect(() => {
        localStorage.setItem("craDataDraft", JSON.stringify(craData));
    }, [craData]);

    const [finalData, setFinalData] = useState([]);
    const [errors, setErrors] = useState({});

    const steps = [
        "Barangay Resource Profile ",
        "Community Disaster History",
        "Barangay Risk Assessment",
        "Inventory & Evacuations",
        "Disaster Readiness",
    ];

    // Display CRA step forms
    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Population />;
            case 2:
                return <Calamities />;
            case 3:
                return <Hazard />;
            case 4:
                return <InventoryEvacuation />;
            case 5:
                return <DisasterReadiness />;
            default:
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;

        if (direction === "next") {
            if (currentStep === steps.length) {
                // ✅ submit to backend
                router.post(route("cra.store"), craData, {
                    onError: (errors) => {
                        setErrors(errors);
                        console.error("Validation Errors:", errors);
                        const allErrors = Object.values(errors).join("<br />");
                        toast.error("Validation Errors", {
                            description: (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: allErrors,
                                    }}
                                />
                            ),
                            duration: 5000,
                            closeButton: true,
                        });
                    },
                    // onSuccess: () => {
                    //     toast.success("CRA submitted successfully!", {
                    //         duration: 3000,
                    //         closeButton: true,
                    //     });
                    //     // ✅ Clear draft after successful submit
                    //     localStorage.removeItem("craDataDraft");
                    // },
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
                <div className="text-left mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Community Risk Assessment (CRA) JOHN XEDRIC B ALEJO
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Step-by-step process for evaluating barangay resources,
                        hazards, and disaster readiness
                    </p>
                </div>
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
