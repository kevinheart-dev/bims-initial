import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Stepper from "@/Components/Stepper";
import StepperController from "@/Components/StepperControler";
import Address from "@/Components/FormSteps/Address";
import HouseholdPersonalInfo from "@/Components/FormSteps/HouseholdPersonalInfo";
import { StepperContext } from "@/context/StepperContext";
import Summary from "@/Components/FormSteps/Summary";
import EducationandOccupation from "@/Components/FormSteps/EducationandOccupation";
import HouseInformation from "@/Components/FormSteps/HouseInformation";
import MedicalInfo from "@/Components/FormSteps/MedicalInfo";
import { router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
export default function Index() {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Residents Table",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Add Resident", showOnMobile: true },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState({
        toilets: [{ toilet_type: "" }],
        electricity_types: [{ electricity_type: "" }],
        water_source_types: [{ water_source_type: "" }],
        waste_management_types: [{ waste_management_type: "" }]
    });
    const [finalData, setFinalData] = useState([]);

    const steps = [
        "Address Information",
        "Household Information",
        "Education & Occupation",
        "Medical Information",
        "House Information",
        "Summary",
    ];

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Address />;
            case 2:
                return <HouseholdPersonalInfo />;
            case 3:
                return <EducationandOccupation />;
            case 4:
                return <MedicalInfo />;
            case 5:
                return <HouseInformation />;
            case 6:
                return <Summary />;
            default:
        }
    };

    const handleClick = (direction) => {
        let newStep = currentStep;

        if (direction === "next") {
            if (currentStep === steps.length) {
                console.log("DATA BEING SENT:", userData);

                router.post(route("resident.storehousehold"), userData, {
                    onSuccess: () => {
                        toast.success("Household data submitted successfully!");
                    },
                    onError: (errors) => {
                        console.error(errors);
                        toast.error(
                            "Failed to submit household data. Please check the form."
                        );
                    },
                    onFinish: () => {
                        console.log("Submission attempt finished.");
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
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-6">
                <div className="bg-blue-100 rounded-t-xl px-2 sm:px-6 lg:px-8 py-2 border-gray-200 shadow-lg">
                    <Stepper steps={steps} currentStep={currentStep} />
                </div>

                <div className="overflow-hidden bg-white border border-gray-200 rounded-b-xl p-2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                    <div className="my-2 pb-5 pr-5 pl-5 pt-0">
                        <StepperContext.Provider
                            value={{
                                userData,
                                setUserData,
                                finalData,
                                setFinalData,
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
                        userData={userData}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
