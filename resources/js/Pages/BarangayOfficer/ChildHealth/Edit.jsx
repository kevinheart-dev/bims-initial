import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import InputLabel from "@/Components/InputLabel";
import RadioGroup from "@/Components/RadioGroup";
import PersonalInformation from "@/Components/ResidentInput/PersonalInformation";
import Section5 from "@/Components/ResidentInput/Section5";
import { Button } from "@/Components/ui/button";
import {
    BMI_STATUS,
    RESIDENT_GENDER_TEXT2,
    RESIDENT_RECIDENCY_TYPE_TEXT,
} from "@/constants";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import { RotateCcw } from "lucide-react";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import SelectField from "@/Components/SelectField";
import { href } from "react-router-dom";
import { Textarea } from "@/Components/ui/textarea";
import { Toaster, toast } from "sonner";
export default function Edit({ record }) {
    const breadcrumbs = [
        { label: "Medical Information", showOnMobile: false },
        {
            label: "Child Health Monitoring Records",
            showOnMobile: false,
            href: route("child_record.index"),
        },
        { label: "Add Child Health Record", showOnMobile: true },
    ];

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const { data, setData, post, errors, reset } = useForm({
        // Top-level monitoring record
        id: record.id,
        resident_id: record.resident_id ?? null,
        head_circumference: record.head_circumference ?? "",
        developmental_milestones: record.developmental_milestones ?? "",
        immunizations_updated: record.immunizations_updated ?? "",

        // Resident details
        resident_name: record.resident
            ? `${record.resident.firstname} ${
                  record.resident.middlename || ""
              } ${record.resident.lastname} ${
                  record.resident.suffix || ""
              }`.trim()
            : "",
        birthdate: record.resident?.birthdate ?? "",
        sex: record.resident?.sex ?? "",
        resident_image: record.resident?.resident_picture_path ?? null,

        // Medical Information (nested under resident)
        weight_kg: record.resident?.medical_information?.weight_kg ?? "",
        height_cm: record.resident?.medical_information?.height_cm ?? "",
        bmi: record.resident?.medical_information?.bmi ?? "",
        nutrition_status:
            record.nutrition_status ?? // from monitoring record
            record.resident?.medical_information?.nutrition_status ??
            "",

        // Vaccinations (array, from resident.vaccinations)
        vaccinations:
            record.resident?.vaccinations?.length > 0
                ? record.resident.vaccinations.map((v) => ({
                      id: v.id,
                      vaccine: v.vaccine,
                      vaccination_date: v.vaccination_date,
                  }))
                : [{ vaccine: "", vaccination_date: "" }],

        // Computed
        age: record.resident?.birthdate
            ? (() => {
                  const birthDate = new Date(record.resident.birthdate);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  const dayDiff = today.getDate() - birthDate.getDate();
                  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                      age--;
                  }
                  return age;
              })()
            : 0,

        age_in_months: record.resident?.birthdate
            ? (() => {
                  const birthDate = new Date(record.resident.birthdate);
                  const today = new Date();
                  let months =
                      (today.getFullYear() - birthDate.getFullYear()) * 12 +
                      (today.getMonth() - birthDate.getMonth());
                  if (today.getDate() < birthDate.getDate()) {
                      months--;
                  }
                  return months;
              })()
            : "",
        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("child_record.update", data.id), {
            onSuccess: () => {
                toast.success("Child health record updated successfully.");
            },
            onError: (errors) => {
                const errorList = Object.values(errors).map(
                    (msg, i) => `<div key=${i}> ${msg}</div>`
                );
                toast.error("Validation Error", {
                    description: (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: errorList.join(""),
                            }}
                        />
                    ),
                    duration: 4000,
                    closeButton: true,
                });
            },
        });
    };

    const calculateBMIAndStatus = (weightKg, heightCm, age, gender) => {
        if (!weightKg || !heightCm || age == null)
            return { bmi: null, status: "" };

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        let status = "";

        if (age >= 20) {
            // WHO adult BMI cutoffs
            if (bmi < 18.5) status = BMI_STATUS.underweight;
            else if (bmi <= 24.9) status = BMI_STATUS.normal;
            else if (bmi <= 29.9) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        } else if (age >= 5) {
            // School-aged children & adolescents
            if (bmi < 15) status = BMI_STATUS.severely_underweight;
            else if (bmi < 19) status = BMI_STATUS.normal;
            else if (bmi < 23) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        } else {
            // Under 5 years old (Barangay Health Worker focus)
            if (bmi < 13) status = BMI_STATUS.severely_underweight;
            else if (bmi < 14) status = BMI_STATUS.underweight;
            else if (bmi <= 18) status = BMI_STATUS.normal;
            else if (bmi <= 20) status = BMI_STATUS.overweight;
            else status = BMI_STATUS.obese;
        }

        return { bmi: parseFloat(bmi.toFixed(2)), status };
    };

    useEffect(() => {
        if (data.weight_kg && data.height_cm) {
            const { bmi, status } = calculateBMIAndStatus(
                data.weight_kg,
                data.height_cm,
                data.age,
                data.gender
            );

            setData((prev) => ({
                ...prev,
                bmi,
                nutrition_status: status,
            }));
        } else {
            setData((prev) => ({
                ...prev,
                bmi: null,
                nutrition_status: "",
            }));
        }
    }, [data.weight_kg, data.height_cm]);

    // ✅ Update BMI + nutrition automatically
    useEffect(() => {
        if (data.weight_kg && data.height_cm) {
            const heightM = data.height_cm / 100;
            const bmi = data.weight_kg / (heightM * heightM);
            setData((prev) => ({
                ...prev,
                bmi: bmi.toFixed(2),
                nutrition_status:
                    bmi < 13
                        ? "Severely Underweight"
                        : bmi < 14
                        ? "Underweight"
                        : bmi <= 18
                        ? "Normal"
                        : bmi <= 20
                        ? "Overweight"
                        : "Obese",
            }));
        }
    }, [data.weight_kg, data.height_cm]);

    // ✅ Vaccination handlers
    const handleArrayChange = (field, index, key, value) => {
        setData((prevData) => {
            const updatedArray = [...prevData[field]];
            updatedArray[index] = {
                ...updatedArray[index],
                [key]: value,
            };
            return { ...prevData, [field]: updatedArray };
        });
    };

    const addArrayItem = (field, newItem) => {
        setData((prevData) => ({
            ...prevData,
            [field]: [...prevData[field], newItem],
        }));
    };

    const removeArrayItem = (field, index) => {
        setData((prevData) => ({
            ...prevData,
            [field]: prevData[field].filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        if (success) {
            handleModalClose();
            toast.success(success, {
                description: "Operation successful!",
                duration: 3000,
                closeButton: true,
            });
        }
        props.success = null;
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
            <Head title="Medical Information" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(record, undefined, 2)}</pre> */}
                    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl sm:rounded-lg p-4 my-8">
                        <div className=" my-2 p-5">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div>
                                <form onSubmit={onSubmit}>
                                    <h2 className="text-3xl font-semibold text-gray-800 mb-1">
                                        Child Health Monitoring
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Record weight, height, and health
                                        details for the selected resident.
                                    </p>

                                    {/* Resident Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5">
                                        <div className="md:row-span-2 flex flex-col items-center space-y-2">
                                            <InputLabel
                                                htmlFor="resident_image"
                                                value="Profile Photo"
                                            />
                                            <img
                                                src={
                                                    data.resident_image
                                                        ? `/storage/${data.resident_image}`
                                                        : "/images/default-avatar.jpg"
                                                }
                                                alt="Resident Image"
                                                className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                            />
                                        </div>
                                        <div className="md:col-span-5 space-y-2">
                                            <div className="w-full">
                                                <DropdownInputField
                                                    label="Full Name"
                                                    name="fullname"
                                                    value={
                                                        data.resident_name || ""
                                                    }
                                                    placeholder="Select a resident"
                                                    onChange={(e) =>
                                                        handleResidentChange(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={errors.resident_id}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                                <InputField
                                                    label="Birthdate"
                                                    name="birthdate"
                                                    value={data.birthdate || ""}
                                                    readOnly={true}
                                                />
                                                <InputField
                                                    label="Sex"
                                                    name="sex"
                                                    value={
                                                        RESIDENT_GENDER_TEXT2[
                                                            data.sex || ""
                                                        ]
                                                    }
                                                    readOnly={true}
                                                />
                                                <InputField
                                                    label="Age"
                                                    name="age"
                                                    value={data.age || ""}
                                                    readOnly={true}
                                                />
                                                <InputField
                                                    label="Age In Months"
                                                    name="age_in_months"
                                                    value={
                                                        data.age_in_months || ""
                                                    }
                                                    readOnly={true}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Health Monitoring Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
                                        <div>
                                            <InputField
                                                label="Weight (kg)"
                                                name="weight_kg"
                                                type="number"
                                                step="0.1"
                                                value={data.weight_kg}
                                                onChange={(e) =>
                                                    setData(
                                                        "weight_kg",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.weight_kg}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Height (cm)"
                                                name="height_cm"
                                                type="number"
                                                step="0.1"
                                                value={data.height_cm}
                                                onChange={(e) =>
                                                    setData(
                                                        "height_cm",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={errors.height_cm}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Nutrition Status"
                                                name="nutrition_status"
                                                value={
                                                    data.nutrition_status || ""
                                                }
                                                placeholder="Automatically determined"
                                                disabled
                                            />
                                        </div>

                                        <div>
                                            <InputField
                                                label="Head Circumference (cm)"
                                                name="head_circumference"
                                                type="number"
                                                step="0.1"
                                                value={data.head_circumference}
                                                onChange={(e) =>
                                                    setData(
                                                        "head_circumference",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.head_circumference
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <InputLabel
                                            htmlFor="developmental_milestones"
                                            value="Developmental Milestones"
                                            className="mb-2"
                                        />
                                        <Textarea
                                            id="developmental_milestones"
                                            name="developmental_milestones"
                                            placeholder="Write observed developmental milestones here..."
                                            value={
                                                data.developmental_milestones
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "developmental_milestones",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={
                                                errors.developmental_milestones
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                            Vaccinations
                                        </h3>

                                        {data.vaccinations?.map(
                                            (vaccination, index) => (
                                                <div
                                                    key={index}
                                                    className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                                >
                                                    {/* Vaccine Name Dropdown */}
                                                    <DropdownInputField
                                                        label="Vaccine"
                                                        name={`vaccinations.${index}.vaccine`}
                                                        value={
                                                            vaccination.vaccine ||
                                                            ""
                                                        }
                                                        placeholder="Select a vaccine"
                                                        onChange={(e) =>
                                                            handleArrayChange(
                                                                "vaccinations", // field
                                                                index, // index
                                                                "vaccine", // key
                                                                e.target.value // value
                                                            )
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors[
                                                                `vaccinations.${index}.vaccine`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />

                                                    {/* Vaccination Date Input */}
                                                    <div className="mt-4">
                                                        <InputField
                                                            label="Vaccination Date"
                                                            name={`vaccinations.${index}.vaccination_date`}
                                                            type="date"
                                                            value={
                                                                vaccination.vaccination_date ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleArrayChange(
                                                                    "vaccinations", // field
                                                                    index, // index
                                                                    "vaccination_date", // key
                                                                    e.target
                                                                        .value // value
                                                                )
                                                            }
                                                        />
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `vaccinations.${index}.vaccination_date`
                                                                ]
                                                            }
                                                            className="mt-2"
                                                        />
                                                    </div>

                                                    {/* Remove Button */}
                                                    {data.vaccinations.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArrayItem(
                                                                    "vaccinations",
                                                                    index
                                                                )
                                                            }
                                                            className="absolute top-1 right-2 text-sm text-red-500 hover:text-red-800"
                                                        >
                                                            <IoIosCloseCircleOutline className="text-2xl" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}

                                        {/* Add Vaccination Button */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addArrayItem("vaccinations", {
                                                    vaccine: "",
                                                    vaccination_date: "",
                                                })
                                            }
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6"
                                        >
                                            <IoIosAddCircleOutline className="text-2xl" />
                                            <span>Add Vaccination</span>
                                        </button>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex w-full justify-end items-center mt-7 gap-4">
                                        <Button
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <RotateCcw /> Reset
                                        </Button>
                                        <Button
                                            className="w-40 bg-blue-700 hover:bg-blue-400"
                                            type="submit"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
