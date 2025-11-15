import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage } from "@inertiajs/react";
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
import { Progress } from "@/Components/ui/progress";
import { defaultLivelihoods, defaultInfra, defaultBuildings, defaultFacilities } from "@/Components/CRAsteps/defaults";

export default function Index({ progress }) {
    const breadcrumbs = [
        { label: "Community Risk Assessment (CRA)", showOnMobile: false },
    ];

    const [currentStep, setCurrentStep] = useState(1);
    const { props } = usePage();
    // const { success, error } = props;
    const { success, error, craData: craDataFromServer } = props;


    // ✅ Get year from URL
    const searchParams = new URLSearchParams(window.location.search);
    const yearFromUrl = searchParams.get("year") || "default";
    const [year, setYear] = useState(yearFromUrl);

    // const [craData, setCraData] = useState(() => {
    //     try {
    //         const saved = localStorage.getItem(`craDataDraft_${yearFromUrl}`);

    //         if (saved) {
    //             const parsed = JSON.parse(saved);

    //             // ✅ Ensure defaults always exist even in old saved data
    //             return {
    //                 population: parsed.population ?? [],
    //                 livelihood: parsed.livelihood?.length
    //                     ? parsed.livelihood
    //                     : (defaultLivelihoods ?? []).map(type => ({
    //                         type,
    //                         male_no_dis: "",
    //                         male_dis: "",
    //                         female_no_dis: "",
    //                         female_dis: "",
    //                         lgbtq_no_dis: "",
    //                         lgbtq_dis: "",
    //                     })),
    //                 infrastructure: parsed.infrastructure ?? (defaultInfra ?? []),
    //                 institutions: parsed.institutions ?? [],
    //                 hazards: parsed.hazards ?? [],
    //                 evacuation: parsed.evacuation ?? [],
    //                 buildings: parsed.buildings ?? JSON.parse(JSON.stringify(defaultBuildings)),
    //                 facilities: parsed.facilities ?? JSON.parse(JSON.stringify(defaultFacilities)),
    //                 year: parsed.year ?? yearFromUrl,
    //             };
    //         }
    //         return {
    //             population: [],
    //             livelihood: (defaultLivelihoods ?? []).map(type => ({
    //                 type,
    //                 male_no_dis: "",
    //                 male_dis: "",
    //                 female_no_dis: "",
    //                 female_dis: "",
    //                 lgbtq_no_dis: "",
    //                 lgbtq_dis: "",
    //             })),

    //             infrastructure: defaultInfra ?? [],
    //             institutions: [],
    //             hazards: [],
    //             evacuation: [],
    //             buildings: JSON.parse(JSON.stringify(defaultBuildings)),
    //             facilities: JSON.parse(JSON.stringify(defaultFacilities)),
    //             year: yearFromUrl,
    //         };
    //     } catch (err) {
    //         console.error("Error loading draft:", err);
    //         return {
    //             population: [],
    //             livelihood: (defaultLivelihoods ?? []).map(type => ({
    //                 type,
    //                 male_no_dis: "",
    //                 male_dis: "",
    //                 female_no_dis: "",
    //                 female_dis: "",
    //                 lgbtq_no_dis: "",
    //                 lgbtq_dis: "",
    //             })),

    //             infrastructure: defaultInfra ?? [],
    //             institutions: [],
    //             hazards: [],
    //             evacuation: [],
    //             buildings: JSON.parse(JSON.stringify(defaultBuildings)),
    //             facilities: JSON.parse(JSON.stringify(defaultFacilities)),
    //             year: yearFromUrl,
    //         };
    //     }
    // });


    const [craData, setCraData] = useState(() => {
        try {
            const saved = localStorage.getItem(`craDataDraft_${yearFromUrl}`);
            return saved
                ? JSON.parse(saved)
                : {
                    population: [],
                    livelihood: (defaultLivelihoods ?? []).map(type => ({
                        type,
                        male_no_dis: "",
                        male_dis: "",
                        female_no_dis: "",
                        female_dis: "",
                        lgbtq_no_dis: "",
                        lgbtq_dis: "",
                    })),
                    infrastructure: defaultInfra ?? [],
                    institutions: [],
                    hazards: [],
                    evacuation: [],
                    buildings: JSON.parse(JSON.stringify(defaultBuildings)),
                    facilities: JSON.parse(JSON.stringify(defaultFacilities)),
                    year: yearFromUrl,
                };
        } catch (err) {
            console.error("Error loading draft:", err);
            return {
                population: [],
                livelihood: (defaultLivelihoods ?? []).map(type => ({
                    type,
                    male_no_dis: "",
                    male_dis: "",
                    female_no_dis: "",
                    female_dis: "",
                    lgbtq_no_dis: "",
                    lgbtq_dis: "",
                })),
                infrastructure: defaultInfra ?? [],
                institutions: [],
                hazards: [],
                evacuation: [],
                buildings: JSON.parse(JSON.stringify(defaultBuildings)),
                facilities: JSON.parse(JSON.stringify(defaultFacilities)),
                year: yearFromUrl,
            };
        }
    });

    useEffect(() => {
        if (year) {
            localStorage.setItem(`craDataDraft_${year}`, JSON.stringify(craData));
        }
    }, [craData, year]);

    useEffect(() => {
        if (!year) return;

        try {
            const saved = localStorage.getItem(`craDataDraft_${year}`);

            if (saved) {
                setCraData(JSON.parse(saved));
            } else {
                setCraData({
                    population: parsed.population ?? [],
                    livelihood: (defaultLivelihoods ?? []).map((type) => ({
                        type,
                        male_no_dis: "",
                        male_dis: "",
                        female_no_dis: "",
                        female_dis: "",
                        lgbtq_no_dis: "",
                        lgbtq_dis: "",
                    })),
                    infrastructure: defaultInfra ?? [],
                    institutions: [],
                    hazards: [],
                    evacuation: [],
                    buildings: JSON.parse(JSON.stringify(defaultBuildings)),
                    facilities: JSON.parse(JSON.stringify(defaultFacilities)),
                    year,
                });
            }
        } catch (error) {
            console.error("Error reloading draft:", error);
        }
    }, [year]);


    const [finalData, setFinalData] = useState([]);
    const [errors, setErrors] = useState({});

    const steps = [
        "Barangay Resource Profile ",
        "Community Disaster History",
        "Barangay Risk Assessment",
        "Inventory & Evacuations",
        "Disaster Readiness",
    ];

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
                return null;
        }
    };

    // ✅ Step navigation and submission
    const handleClick = (direction) => {
        let newStep = currentStep;

        if (direction === "next") {
            if (currentStep === steps.length) {
                // ✅ Submit to backend
                router.post(route("cra.store"), craData, {
                    onSuccess: () => {
                        // // ✅ Remove local draft after successful submission
                        // localStorage.removeItem(`craDataDraft_${year}`);
                        toast.success("CRA submitted successfully!");
                    },
                    onError: (errors) => {
                        setErrors(errors);
                        console.error("Validation Errors:", errors);

                        // ✅ Rehydrate data from local storage in case Inertia wiped it
                        const saved = localStorage.getItem(`craDataDraft_${year}`);
                        if (saved) {
                            setCraData(JSON.parse(saved));
                        }

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

    // ✅ Handle print CRA PDF
    const handlePrint = () => {
        if (!year) {
            toast.error("Year not set for CRA.");
            return;
        }
        const url = route("cra.pdf", { id: year });
        window.open(url, "_blank");
    };

    // useEffect(() => {
    //     if (success) {
    //         window.location.reload(); // <-- call the function
    //     }
    //     props.success = null;
    // }, [success]);

    useEffect(() => {
        if (success) {
            toast.success(success, {
                description: "Your CRA has been successfully submitted!",
                duration: 3000,
                closeButton: true,
            });
        }
    }, [success]);


    useEffect(() => {
        if (error) {
            toast.error(error, {
                description: "Operation failed!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Toaster richColors />
            <Head title="CRA" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />

            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-6">
                <div className="text-left mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Community Risk Assessment {year} (CRA)
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Step-by-step process for evaluating barangay
                                resources, hazards, and disaster readiness
                            </p>
                        </div>

                        {/* Compact Progress Section */}
                        <div className="bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 w-full sm:w-64">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="text-xs font-medium text-gray-700">
                                    Overall Progress
                                </h2>
                                <span className="text-xs font-semibold text-gray-900">
                                    {progress?.percentage ?? 0}%
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-in-out"
                                    style={{
                                        width: `${progress?.percentage ?? 0}%`,
                                        background:
                                            progress?.percentage >= 100
                                                ? "linear-gradient(to right, #16a34a, #22c55e)"
                                                : "linear-gradient(to right, #3b82f6, #60a5fa)",
                                    }}
                                ></div>
                            </div>

                            <div className="flex justify-between items-center gap-2 mt-2">
                                <div className="mt-1 text-[10px] text-gray-600">
                                    <p>
                                        <span className="font-medium">Status:</span>{" "}
                                        {progress?.status ?? "Not started"}
                                    </p>
                                    {progress?.submitted_at && (
                                        <p className="text-gray-500">
                                            Submitted: {progress.submitted_at}
                                        </p>
                                    )}
                                    {progress?.last_updated && (
                                        <p className="text-gray-500">
                                            Updated: {progress.last_updated}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handlePrint}
                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap"
                                >
                                    Print CRA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-100 rounded-t-xl px-2 sm:px-6 lg:px-8 py-2 border-gray-200 shadow-lg flex justify-between items-center">
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
                                year,
                                setYear,
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
