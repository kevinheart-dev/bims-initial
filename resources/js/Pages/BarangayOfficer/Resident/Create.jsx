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
    const [userData, setUserData] = useState({});
    // const [userData, setUserData] = useState('');
    const [finalData, setFinalData] = useState([]);


    const steps = [
        "Address Information",
        "Household Information",
        "Education & Occupation",
        "House Information",
        "Summary"
    ]

    const displayStep = (step) => {
        switch (step) {
            case 1:
                return <Address />
            case 2:
                return <HouseholdPersonalInfo />
            case 3:
                return <EducationandOccupation />
            case 4:
                return <HouseInformation />
            case 5:
                return <Summary />
            default:
        }
    }

    const handleClick = (direction) => {
        let newStep = currentStep;

        direction === "next" ? newStep++ : newStep--;

        if (newStep > 0 && newStep <= steps.length) {
            setCurrentStep(newStep);
        }
    };


    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl p-2 mb-5">
                    <Stepper steps={steps} currentStep={currentStep} />

                    <div className=" my-7 p-5">
                        <StepperContext.Provider value={{
                            userData,
                            setUserData,
                            finalData,
                            setFinalData
                        }}>
                            {displayStep(currentStep)}
                        </StepperContext.Provider>
                    </div>
                </div>

                <StepperController
                    handleClick={handleClick}
                    currentStep={currentStep}
                    steps={steps}
                />
            </div>
        </AdminLayout>
    );
}
