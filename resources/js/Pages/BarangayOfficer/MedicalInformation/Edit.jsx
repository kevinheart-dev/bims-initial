import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    SquarePen,
    Trash2,
    SquarePlus,
    MoveRight,
    RotateCcw,
    Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import { Toaster, toast } from "sonner";
import { BMI_STATUS, RESIDENT_GENDER_TEXT2 } from "@/constants";
import axios from "axios";
import useAppUrl from "@/hooks/useAppUrl";
import useResidentChangeHandler from "@/hooks/handleResidentChange";
import InputLabel from "@/Components/InputLabel";
import DropdownInputField from "@/Components/DropdownInputField";
import InputError from "@/Components/InputError";
import InputField from "@/Components/InputField";
import Section4 from "@/Components/ResidentInput/Section4";
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import RadioGroup from "@/Components/RadioGroup";
import SelectField from "@/Components/SelectField";
import { Textarea } from "@/Components/ui/textarea";

export default function Index({ res_med_info }) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Medical Information",
            href: route("medical.index"),
            showOnMobile: false,
        },
        { label: "Update Medical Information", showOnMobile: true },
    ];
    const APP_URL = useAppUrl();

    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const { data, setData, post, errors, reset, clearErrors } = useForm({
        // Resident-level fields
        resident_id: "",
        resident_name: "",
        resident_image: null,
        birthdate: null,
        civil_status: "",
        sex: "",
        purok_number: "",

        // Medical information fields
        medical_information_id: "",
        weight_kg: "",
        height_cm: "",
        bmi: "",
        nutrition_status: "",
        blood_type: "",
        emergency_contact_number: "",
        emergency_contact_name: "",
        emergency_contact_relationship: "",
        is_smoker: "0",
        is_alcohol_user: "0",
        has_philhealth: "0",
        philhealth_id_number: "",
        pwd_id_number: "",
        is_pwd: false,
        disabilities: [],
        has_allergies: false,
        allergies: [],
        has_medication: false,
        medications: [],
        has_medical_condition: false,
        medical_conditions: [],
        has_vaccination: false,
        vaccinations: [],
    });

    useEffect(() => {
        if (res_med_info) {
            setData({
                resident_id: res_med_info.resident_id ?? "",
                resident_name: `${res_med_info.resident.firstname} ${
                    res_med_info.resident.middlename ?? ""
                } ${res_med_info.resident.lastname}`.trim(),
                resident_image: res_med_info.resident.image ?? null,
                birthdate: res_med_info.resident.birthdate ?? null,
                civil_status: res_med_info.resident.civil_status ?? "",
                sex: res_med_info.resident.sex ?? "",
                purok_number: res_med_info.resident.purok_number ?? "",
                medical_information_id: res_med_info.id,
                weight_kg: res_med_info.weight_kg ?? "",
                height_cm: res_med_info.height_cm ?? "",
                bmi: res_med_info.bmi ?? "",
                nutrition_status: res_med_info.nutrition_status ?? "",
                blood_type: res_med_info.blood_type ?? "",
                emergency_contact_number:
                    res_med_info.emergency_contact_number ?? "",
                emergency_contact_name:
                    res_med_info.emergency_contact_name ?? "",
                emergency_contact_relationship:
                    res_med_info.emergency_contact_relationship ?? "",
                is_smoker: res_med_info.is_smoker ? "1" : "0",
                is_alcohol_user: res_med_info.is_alcohol_user ? "1" : "0",
                has_philhealth: res_med_info.has_philhealth ? "1" : "0",
                philhealth_id_number: res_med_info.philhealth_id_number ?? "",
                pwd_id_number: res_med_info.pwd_id_number ?? null,
                is_pwd: res_med_info.pwd_id_number ? "1" : "0",
                disabilities: res_med_info.resident.disabilities ?? [],
                has_allergies:
                    res_med_info.resident.allergies?.length > 0 ? "1" : "0",
                allergies: res_med_info.resident.allergies ?? [],
                has_medication:
                    res_med_info.resident.medications?.length > 0 ? "1" : "0",
                medications: res_med_info.resident.medications ?? [],
                has_medical_condition:
                    res_med_info.resident.medical_conditions?.length > 0
                        ? "1"
                        : "0",
                medical_conditions:
                    res_med_info.resident.medical_conditions ?? [],
                has_vaccination:
                    res_med_info.resident.vaccinations?.length > 0 ? "1" : "0",
                vaccinations: res_med_info.resident.vaccinations ?? [],
                _method: "PUT",
            });
        }
    }, [res_med_info]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("medical.update", data.medical_information_id), {
            // onFinish: () => reset(),
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleArrayValues = (e, index, column, array) => {
        const updated = [...(data[array] || [])];
        updated[index] = {
            ...updated[index],
            [column]: e.target.value,
        };
        setData(array, updated);
    };

    useEffect(() => {
        if (data.weight_kg > 0 && data.height_cm > 0) {
            const heightInMeters = data.height_cm / 100;
            const bmi = data.weight_kg / (heightInMeters * heightInMeters);
            const roundedBmi = bmi.toFixed(2);

            let status = "";

            if (bmi < 16) {
                status = "severly_underweight";
            } else if (bmi >= 16 && bmi < 18.5) {
                status = "underweight";
            } else if (bmi >= 18.5 && bmi < 25) {
                status = "normal";
            } else if (bmi >= 25 && bmi < 30) {
                status = "overweight";
            } else {
                status = "obese";
            }

            setData("bmi", roundedBmi);
            setData("nutrition_status", status);
        } else {
            setData("bmi", 0);
            setData("nutrition_status", "");
        }
    }, [data.weight_kg, data.height_cm]);

    // Add new item to any array field
    const addItem = (field, newItem = {}) => {
        setData((prev) => ({
            ...prev,
            [field]: [...(prev[field] || []), newItem],
        }));
    };

    // Remove item from any array field
    const removeItem = (field, index) => {
        setData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
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
                duration: 10000,
                closeButton: true,
            });
        }
        props.error = null;
    }, [error]);

    return (
        <AdminLayout>
            <Head title="Medical Information" />
            <div>
                <Toaster richColors />
                <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(res_med_info, undefined, 2)}</pre> */}
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
                                        Resident Information
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Search/Select the resident to add the
                                        medical information.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-x-4 mb-5">
                                        <div className="md:row-span-2 flex flex-col items-center space-y-2">
                                            <InputLabel
                                                htmlFor={`resident_image`}
                                                value="Profile Photo"
                                            />
                                            <img
                                                src={
                                                    data.resident_image
                                                        ? `/storage/${data.resident_image}`
                                                        : "/images/default-avatar.jpg"
                                                }
                                                alt={`Resident Image`}
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
                                                />
                                                <InputError
                                                    message={errors.resident_id}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div>
                                                    <InputField
                                                        label="Birthdate"
                                                        name="birthdate"
                                                        value={
                                                            data.birthdate || ""
                                                        }
                                                        placeholder="Select a resident"
                                                        readOnly={true}
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Sex"
                                                        name="sex"
                                                        value={
                                                            RESIDENT_GENDER_TEXT2[
                                                                data.sex || ""
                                                            ]
                                                        }
                                                        placeholder="Select a resident"
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div>
                                                    <InputField
                                                        label="Purok"
                                                        name="purok_number"
                                                        value={
                                                            data.purok_number ||
                                                            ""
                                                        }
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Section4
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                    />

                                    <h2 className="text-3xl font-semibold text-gray-800 mb-1 mt-8">
                                        Related Medical Information
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Form below are options depending on the
                                        residents medical information.
                                    </p>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div className="flex flex-col w-full">
                                            <div>
                                                <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                                <p className="font-bold text-lg mt-3 text-gray-800">
                                                    Allergies
                                                </p>
                                            </div>
                                            <div className="grid md:grid-cols-1 gap-4 mx-4">
                                                <div>
                                                    <RadioGroup
                                                        label="Do you any allergies?"
                                                        name="has_medication"
                                                        options={[
                                                            {
                                                                label: "Yes",
                                                                value: 1,
                                                            },
                                                            {
                                                                label: "No",
                                                                value: 0,
                                                            },
                                                        ]}
                                                        selectedValue={
                                                            data.has_allergies ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "has_allergies",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    {data.has_allergies == 1 ? (
                                                        <>
                                                            {data.allergies
                                                                .length ===
                                                                0 && (
                                                                <p className="text-sm text-gray-500 italic mt-2">
                                                                    No allergy
                                                                    added yet.
                                                                </p>
                                                            )}
                                                            <div className="grid md:grid-cols-1 gap-4">
                                                                {data.allergies.map(
                                                                    (
                                                                        allergy,
                                                                        aleridx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                aleridx
                                                                            }
                                                                            className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                                        >
                                                                            <div>
                                                                                <DropdownInputField
                                                                                    label="Name of Allergy"
                                                                                    name="allergy_name"
                                                                                    value={
                                                                                        allergy.allergy_name ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            aleridx,
                                                                                            "allergy_name",
                                                                                            "allergies"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Select or enter allergy"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `allergies.${aleridx}.allergy_name`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <label
                                                                                    className={`block text-sm font-semibold mb-3 mt-4 `}
                                                                                >
                                                                                    Allergy
                                                                                    Reaction
                                                                                    Description
                                                                                </label>
                                                                                <Textarea
                                                                                    name="reaction_description"
                                                                                    className="bg-white border border-gray-400"
                                                                                    value={
                                                                                        allergy.reaction_description ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            aleridx,
                                                                                            "reaction_description",
                                                                                            "allergies"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Enter description"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `allergies.${aleridx}.reaction_description`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeItem(
                                                                                        "allergies",
                                                                                        aleridx
                                                                                    )
                                                                                }
                                                                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                                title="Remove Allergy"
                                                                            >
                                                                                <IoIosCloseCircleOutline className="text-2xl" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addItem(
                                                                        "allergies"
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                                title="Add Medication"
                                                            >
                                                                <IoIosAddCircleOutline className="text-2xl" />
                                                                Add Allergy
                                                            </button>
                                                        </>
                                                    ) : data.has_medication ==
                                                      0 ? (
                                                        <p className="text-sm text-gray-500 italic mt-2">
                                                            No allergies
                                                            declared.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <div>
                                                <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                                <p className="font-bold text-lg mt-3 text-gray-800">
                                                    Resident Medication
                                                </p>
                                            </div>
                                            <div className="grid md:grid-cols-1 gap-4 mx-4">
                                                <div>
                                                    <RadioGroup
                                                        label="Do you any medications?"
                                                        name="has_medication"
                                                        options={[
                                                            {
                                                                label: "Yes",
                                                                value: 1,
                                                            },
                                                            {
                                                                label: "No",
                                                                value: 0,
                                                            },
                                                        ]}
                                                        selectedValue={
                                                            data.has_medication ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "has_medication",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    {data.has_medication ==
                                                    1 ? (
                                                        <>
                                                            {data.medications
                                                                .length ===
                                                                0 && (
                                                                <p className="text-sm text-gray-500 italic mt-2">
                                                                    No
                                                                    medication
                                                                    added yet.
                                                                </p>
                                                            )}
                                                            <div className="grid md:grid-cols-1 gap-4">
                                                                {data.medications.map(
                                                                    (
                                                                        medication,
                                                                        medIdx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                medIdx
                                                                            }
                                                                            className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                                        >
                                                                            <div>
                                                                                <DropdownInputField
                                                                                    label="Medication Type"
                                                                                    name="medication"
                                                                                    value={
                                                                                        medication.medication ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            medIdx,
                                                                                            "medication",
                                                                                            "medications"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Select or enter medication"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medications.${medIdx}.medication`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputField
                                                                                    label="Date Started"
                                                                                    name="start_date"
                                                                                    type="date"
                                                                                    value={
                                                                                        medication.start_date ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            medIdx,
                                                                                            "start_date",
                                                                                            "medications"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Enter quantity"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medications.${medIdx}.start_date`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputField
                                                                                    label="Date Ended"
                                                                                    name="end_date"
                                                                                    type="date"
                                                                                    value={
                                                                                        medication.end_date ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            medIdx,
                                                                                            "end_date",
                                                                                            "medications"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Enter quantity"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medications.${medIdx}.end_date`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeItem(
                                                                                        "medications",
                                                                                        medIdx
                                                                                    )
                                                                                }
                                                                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                                title="Remove Medicaton"
                                                                            >
                                                                                <IoIosCloseCircleOutline className="text-2xl" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addItem(
                                                                        "medications"
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                                title="Add Medication"
                                                            >
                                                                <IoIosAddCircleOutline className="text-2xl" />
                                                                Add Medicaiton
                                                            </button>
                                                        </>
                                                    ) : data.has_medication ==
                                                      0 ? (
                                                        <p className="text-sm text-gray-500 italic mt-2">
                                                            No medication
                                                            declared.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <div>
                                                <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                                <p className="font-bold text-lg mt-3 text-gray-800">
                                                    Resident Medical Condition
                                                </p>
                                            </div>
                                            <div className="grid md:grid-cols-1 gap-4 mx-4">
                                                <div>
                                                    <RadioGroup
                                                        label="Do you any Medical Conditions?"
                                                        name="has_medical_condition"
                                                        options={[
                                                            {
                                                                label: "Yes",
                                                                value: 1,
                                                            },
                                                            {
                                                                label: "No",
                                                                value: 0,
                                                            },
                                                        ]}
                                                        selectedValue={
                                                            data.has_medical_condition ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "has_medical_condition",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    {data.has_medical_condition ==
                                                    1 ? (
                                                        <>
                                                            {data
                                                                .medical_conditions
                                                                .length ===
                                                                0 && (
                                                                <p className="text-sm text-gray-500 italic mt-2">
                                                                    No medical
                                                                    condition
                                                                    added yet.
                                                                </p>
                                                            )}
                                                            <div className="grid md:grid-cols-1 gap-4">
                                                                {data.medical_conditions.map(
                                                                    (
                                                                        condition,
                                                                        conIdx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                conIdx
                                                                            }
                                                                            className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                                        >
                                                                            <div>
                                                                                <DropdownInputField
                                                                                    label="Medical Condition"
                                                                                    name="condition"
                                                                                    value={
                                                                                        condition.condition ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            conIdx,
                                                                                            "condition",
                                                                                            "medical_conditions"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Select or enter condition"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medical_conditions.${conIdx}.condition`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <SelectField
                                                                                    label="Condition Status"
                                                                                    name="status"
                                                                                    value={
                                                                                        condition.status ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            conIdx,
                                                                                            "status",
                                                                                            "medical_conditions"
                                                                                        )
                                                                                    }
                                                                                    items={[
                                                                                        {
                                                                                            label: "Active",
                                                                                            value: "active",
                                                                                        },
                                                                                        {
                                                                                            label: "Resolved",
                                                                                            value: "resolved",
                                                                                        },
                                                                                        {
                                                                                            label: "Chronic",
                                                                                            value: "chronic",
                                                                                        },
                                                                                    ]}
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medical_conditions.${conIdx}.status`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputField
                                                                                    label="Diagnosed Date"
                                                                                    name="diagnosed_date"
                                                                                    type="date"
                                                                                    value={
                                                                                        condition.diagnosed_date ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            conIdx,
                                                                                            "diagnosed_date",
                                                                                            "medical_conditions"
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medical_conditions.${conIdx}.diagnosed_date`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputField
                                                                                    label="Resolved Date"
                                                                                    name="resolved_date"
                                                                                    type="date"
                                                                                    value={
                                                                                        condition.resolved_date ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            conIdx,
                                                                                            "resolved_date",
                                                                                            "medical_conditions"
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `medical_conditions.${conIdx}.resolved_date`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeItem(
                                                                                        "medical_conditions",
                                                                                        conIdx
                                                                                    )
                                                                                }
                                                                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                                title="Remove Medicaton"
                                                                            >
                                                                                <IoIosCloseCircleOutline className="text-2xl" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addItem(
                                                                        "medical_conditions"
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                                title="Add Medical Condition"
                                                            >
                                                                <IoIosAddCircleOutline className="text-2xl" />
                                                                Add Medical
                                                                Condition
                                                            </button>
                                                        </>
                                                    ) : data.has_medical_condition ==
                                                      0 ? (
                                                        <p className="text-sm text-gray-500 italic mt-2">
                                                            No medical condition
                                                            declared.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <div>
                                                <hr className="h-[2px] bg-sky-500 border-0 mt-7" />
                                                <p className="font-bold text-lg mt-3 text-gray-800">
                                                    Vaccinations
                                                </p>
                                            </div>
                                            <div className="grid md:grid-cols-1 gap-4 mx-4">
                                                <div>
                                                    <RadioGroup
                                                        label="Do you any Vaccinations?"
                                                        name="has_vaccination"
                                                        options={[
                                                            {
                                                                label: "Yes",
                                                                value: 1,
                                                            },
                                                            {
                                                                label: "No",
                                                                value: 0,
                                                            },
                                                        ]}
                                                        selectedValue={
                                                            data.has_vaccination ||
                                                            null
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "has_vaccination",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    {data.has_vaccination ==
                                                    1 ? (
                                                        <>
                                                            {data.vaccinations
                                                                .length ===
                                                                0 && (
                                                                <p className="text-sm text-gray-500 italic mt-2">
                                                                    No
                                                                    vaccinations
                                                                    added yet.
                                                                </p>
                                                            )}
                                                            <div className="grid md:grid-cols-1 gap-4">
                                                                {data.vaccinations.map(
                                                                    (
                                                                        vaccination,
                                                                        vacIdx
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                vacIdx
                                                                            }
                                                                            className="relative mb-4 p-4 bg-sky-100 border rounded-md"
                                                                        >
                                                                            <div>
                                                                                <DropdownInputField
                                                                                    label="Vaccine"
                                                                                    name="vaccine"
                                                                                    value={
                                                                                        vaccination.vaccine ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            vacIdx,
                                                                                            "vaccine",
                                                                                            "vaccinations"
                                                                                        )
                                                                                    }
                                                                                    placeholder="Select or enter vaccine"
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `vaccinations.${vacIdx}.vaccine`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <InputField
                                                                                    label="Vaccination Date"
                                                                                    name="vaccination_date"
                                                                                    type="date"
                                                                                    value={
                                                                                        vaccination.vaccination_date ||
                                                                                        ""
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleArrayValues(
                                                                                            e,
                                                                                            vacIdx,
                                                                                            "vaccination_date",
                                                                                            "vaccinations"
                                                                                        )
                                                                                    }
                                                                                />
                                                                                <InputError
                                                                                    message={
                                                                                        errors[
                                                                                            `vaccinations.${vacIdx}.vaccination_date`
                                                                                        ]
                                                                                    }
                                                                                    className="mt-2"
                                                                                />
                                                                            </div>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    removeItem(
                                                                                        "vaccinations",
                                                                                        vacIdx
                                                                                    )
                                                                                }
                                                                                className="absolute top-2 right-2 text-red-400 hover:text-red-700 text-xl"
                                                                                title="Remove Vaccination"
                                                                            >
                                                                                <IoIosCloseCircleOutline className="text-2xl" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    addItem(
                                                                        "vaccinations"
                                                                    )
                                                                }
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-base mt-2 font-medium"
                                                                title="Add Vaccination"
                                                            >
                                                                <IoIosAddCircleOutline className="text-2xl" />
                                                                Add Vaccination
                                                            </button>
                                                        </>
                                                    ) : data.has_medical_condition ==
                                                      0 ? (
                                                        <p className="text-sm text-gray-500 italic mt-2">
                                                            No vaccination
                                                            declared.
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
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
