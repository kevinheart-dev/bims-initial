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
import { Textarea } from "@/Components/ui/textarea";

export default function Create({ residents }) {
    const breadcrumbs = [
        { label: "Katarungang Pambarangay", showOnMobile: false },
        {
            label: "Blotter Reports",
            href: route("blotter_report.index"),
            showOnMobile: false,
        },
        { label: "Create a Blotter Report", showOnMobile: true },
    ];
    const { error } = usePage().props.errors;
    const { data, setData, post, errors, reset } = useForm({
        type_of_incident: "",
        narrative_details: "",
        actions_taken: "",
        report_status: "pending",
        location: "",
        resolution: "",
        recommendations: "",
        incident_date: "",

        recorded_by: null,
        complainants: [{ resident_id: "" }],
        respondents: [{ resident_id: "" }],
        witnesses: [{ resident_id: "" }],
        attachments: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("blotter_report.store"), {
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleResidentArrayChange = (residentId, index, arrayKey) => {
        const resident = residents.find((r) => r.id === Number(residentId));

        if (!resident) {
            const updated = [...(data[arrayKey] || [])];
            updated[index] = {
                ...updated[index],
                resident_id: "",
                resident_name: "",
            };
            setData(arrayKey, updated);
            return;
        }

        const updated = [...(data[arrayKey] || [])];
        updated[index] = {
            ...updated[index],
            resident_id: resident.id,
            resident_name: `${resident.firstname} ${resident.middlename} ${
                resident.lastname
            } ${resident.suffix ?? ""}`.trim(),
            purok_number: resident.purok_number,
            birthdate: resident.birthdate,
            resident_image: resident.resident_picture_path,
            sex: resident.sex,
            contact_number: resident.contact_number,
            email: resident.email,
        };

        setData(arrayKey, updated);
    };

    const addArrayItem = (field, newItem) => {
        setData(field, [...data[field], newItem]);
    };

    const removeArrayItem = (field, index) => {
        setData(
            field,
            data[field].filter((_, i) => i !== index)
        );
    };

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    {/* <pre>{JSON.stringify(residents, undefined, 2)}</pre> */}
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
                                        Blotter Report
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Please provide details about the
                                        incident and its participants.
                                    </p>

                                    {/* Report Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* Type of Incident */}
                                        <InputField
                                            label="Type of Incident"
                                            name="type_of_incident"
                                            value={data.type_of_incident}
                                            onChange={(e) =>
                                                setData(
                                                    "type_of_incident",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Ex: Theft, Violence"
                                        />
                                        <InputError
                                            message={errors.type_of_incident}
                                            className="mt-1"
                                        />

                                        <div className="grid col-span-2 grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Incident Date */}
                                            <div>
                                                <InputField
                                                    type="date"
                                                    label="Incident Date"
                                                    name="incident_date"
                                                    value={data.incident_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "incident_date",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.incident_date
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <InputField
                                                    label="Location"
                                                    name="location"
                                                    value={data.location}
                                                    onChange={(e) =>
                                                        setData(
                                                            "location",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Incident Location"
                                                />
                                                <InputError
                                                    message={errors.location}
                                                    className="mt-1"
                                                />
                                            </div>

                                            {/* Report Status */}
                                            <div>
                                                <SelectField
                                                    label="Report Status"
                                                    name="report_status"
                                                    value={
                                                        data.report_status || ""
                                                    }
                                                    onChange={(value) =>
                                                        setData(
                                                            "report_status",
                                                            value
                                                        )
                                                    }
                                                    items={[
                                                        {
                                                            label: "Pending",
                                                            value: "pending",
                                                        },
                                                        {
                                                            label: "On Going",
                                                            value: "on_going",
                                                        },
                                                        {
                                                            label: "Resolved",
                                                            value: "resolved",
                                                        },
                                                        {
                                                            label: "Elevated",
                                                            value: "elevated",
                                                        },
                                                    ]}
                                                    placeholder="Select Status"
                                                />
                                                <InputError
                                                    message={
                                                        errors.report_status
                                                    }
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Narrative */}
                                    <div className="mb-6">
                                        <InputLabel value="Narrative Details" />
                                        <textarea
                                            name="narrative_details"
                                            value={data.narrative_details}
                                            onChange={(e) =>
                                                setData(
                                                    "narrative_details",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                            rows="4"
                                            placeholder="Describe what happened..."
                                        />
                                        <InputError
                                            message={errors.narrative_details}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Actions Taken */}
                                    <div className="mb-6">
                                        <InputLabel value="Actions Taken" />
                                        <textarea
                                            name="actions_taken"
                                            value={data.actions_taken}
                                            onChange={(e) =>
                                                setData(
                                                    "actions_taken",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                            rows="3"
                                            placeholder="What actions were taken?"
                                        />
                                        <InputError
                                            message={errors.actions_taken}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Resolution */}
                                    <div className="mb-6">
                                        <InputLabel value="Resolution" />
                                        <textarea
                                            name="resolution"
                                            value={data.resolution}
                                            onChange={(e) =>
                                                setData(
                                                    "resolution",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                            rows="3"
                                            placeholder="Resolution or settlement details..."
                                        />
                                        <InputError
                                            message={errors.resolution}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Recommendations */}
                                    <div className="mb-6">
                                        <InputLabel value="Recommendations" />
                                        <textarea
                                            name="recommendations"
                                            value={data.recommendations}
                                            onChange={(e) =>
                                                setData(
                                                    "recommendations",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                            rows="3"
                                            placeholder="Any recommendations for next steps..."
                                        />
                                        <InputError
                                            message={errors.recommendations}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Participants: Complainants */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        Complainants
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Select the complainants involved in this
                                        incident. You may choose from existing
                                        residents or enter names manually if not
                                        registered.
                                    </p>
                                    {data.complainants.map(
                                        (complainant, index) => (
                                            <div
                                                key={index}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                <DropdownInputField
                                                    label="Complainant"
                                                    name={`complainants.${index}.resident_id`}
                                                    value={
                                                        complainant.resident_name ||
                                                        ""
                                                    } // dropdown expects {label, value}
                                                    placeholder="Select a resident"
                                                    onChange={(e) =>
                                                        handleResidentArrayChange(
                                                            e.target.value,
                                                            index,
                                                            "complainants"
                                                        )
                                                    }
                                                    items={residentsList}
                                                />

                                                <InputError
                                                    message={
                                                        errors[
                                                            `complainants.${index}.resident_id`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />

                                                {complainant.resident_name && (
                                                    <div className="mt-3 rounded-lg border bg-white shadow-sm p-4">
                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                            Complainant Details
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-6">
                                                            {/* Resident Picture */}
                                                            <div className="flex flex-col items-center">
                                                                <InputLabel
                                                                    htmlFor="complainant_resident_image"
                                                                    value="Profile Photo"
                                                                />
                                                                <img
                                                                    src={
                                                                        complainant.resident_image
                                                                            ? `/storage/${complainant.resident_image}`
                                                                            : "/images/default-avatar.jpg"
                                                                    }
                                                                    alt="Resident"
                                                                    className="w-24 h-24 object-cover rounded-full border border-gray-200 mt-2"
                                                                />
                                                            </div>

                                                            {/* Details */}
                                                            <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Name:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.resident_name
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Purok:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.purok_number
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Birthdate:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.birthdate
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Gender:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.gender
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Contact:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.contact_number
                                                                    }
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="font-medium">
                                                                        Email:
                                                                    </span>{" "}
                                                                    {
                                                                        complainant.email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-6">
                                                    <InputLabel value="Notes" />
                                                    <Textarea
                                                        name="notes"
                                                        value={
                                                            complainant.notes
                                                        }
                                                        onChange={(e) =>
                                                            handleResidentArrayChange(
                                                                e.target.value,
                                                                index,
                                                                "notes"
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                                        rows="3"
                                                        placeholder="Notes for the Complainant..."
                                                    />
                                                    <InputError
                                                        message={errors.notes}
                                                        className="mt-1"
                                                    />
                                                </div>

                                                {data.complainants.length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "complainants",
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
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("complainants", {
                                                resident_id: null,
                                            })
                                        }
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Complainant</span>
                                    </button>

                                    {/* Participants: Respondents */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        Respondents
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Select the respondents involved in this
                                        incident. You may choose from existing
                                        residents or enter names manually if not
                                        registered.
                                    </p>

                                    {data.respondents.map(
                                        (respondent, index) => (
                                            <div
                                                key={index}
                                                className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                            >
                                                <DropdownInputField
                                                    label="Respondent"
                                                    name={`respondents.${index}.resident_id`}
                                                    value={
                                                        respondent.resident_name ||
                                                        ""
                                                    }
                                                    placeholder="Select a resident"
                                                    onChange={(e) =>
                                                        handleResidentArrayChange(
                                                            e.target.value,
                                                            index,
                                                            "respondents"
                                                        )
                                                    }
                                                    items={residentsList}
                                                />

                                                <InputError
                                                    message={
                                                        errors[
                                                            `respondents.${index}.resident_id`
                                                        ]
                                                    }
                                                    className="mt-2"
                                                />

                                                {respondent.resident_name && (
                                                    <div className="mt-3 rounded-lg border bg-white shadow-sm p-4">
                                                        <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                            Respondent Details
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-6">
                                                            {/* Resident Picture */}
                                                            <div className="flex flex-col items-center">
                                                                <InputLabel
                                                                    htmlFor="respondent_resident_image"
                                                                    value="Profile Photo"
                                                                />
                                                                <img
                                                                    src={
                                                                        respondent.resident_image
                                                                            ? `/storage/${respondent.resident_image}`
                                                                            : "/images/default-avatar.jpg"
                                                                    }
                                                                    alt="Resident"
                                                                    className="w-24 h-24 object-cover rounded-full border border-gray-200 mt-2"
                                                                />
                                                            </div>

                                                            {/* Details */}
                                                            <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Name:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.resident_name
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Purok:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.purok_number
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Birthdate:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.birthdate
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Gender:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.gender
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium">
                                                                        Contact:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.contact_number
                                                                    }
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="font-medium">
                                                                        Email:
                                                                    </span>{" "}
                                                                    {
                                                                        respondent.email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="mt-6">
                                                    <InputLabel value="Notes" />
                                                    <Textarea
                                                        name="notes"
                                                        value={respondent.notes}
                                                        onChange={(e) =>
                                                            handleResidentArrayChange(
                                                                e.target.value,
                                                                index,
                                                                "notes"
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                                        rows="3"
                                                        placeholder="Notes for the Respondent..."
                                                    />
                                                    <InputError
                                                        message={errors.notes}
                                                        className="mt-1"
                                                    />
                                                </div>

                                                {data.respondents.length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "respondents",
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
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("respondents", {
                                                resident_id: null,
                                            })
                                        }
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Respondent</span>
                                    </button>

                                    {/* Participants: Witnesses */}
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                        Witnesses
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Select the witnesses for this incident.
                                        You may choose from existing residents
                                        or enter names manually if not
                                        registered.
                                    </p>
                                    {data.witnesses.map((witness, index) => (
                                        <div
                                            key={index}
                                            className="border p-4 mb-4 rounded-md relative bg-gray-50"
                                        >
                                            <DropdownInputField
                                                label="Witness"
                                                name={`witnesses.${index}.resident_id`}
                                                value={
                                                    witness.resident_name || ""
                                                }
                                                placeholder="Select a resident"
                                                onChange={(e) =>
                                                    handleResidentArrayChange(
                                                        e.target.value,
                                                        index,
                                                        "witnesses"
                                                    )
                                                }
                                                items={residentsList}
                                            />

                                            <InputError
                                                message={
                                                    errors[
                                                        `witnesses.${index}.resident_id`
                                                    ]
                                                }
                                                className="mt-2"
                                            />

                                            {witness.resident_name && (
                                                <div className="mt-3 rounded-lg border bg-white shadow-sm p-4">
                                                    <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                                        Witness Details
                                                    </h4>
                                                    <div className="grid grid-cols-3 gap-6">
                                                        {/* Resident Picture */}
                                                        <div className="flex flex-col items-center">
                                                            <InputLabel
                                                                htmlFor="witness_resident_image"
                                                                value="Profile Photo"
                                                            />
                                                            <img
                                                                src={
                                                                    witness.resident_image
                                                                        ? `/storage/${witness.resident_image}`
                                                                        : "/images/default-avatar.jpg"
                                                                }
                                                                alt="Resident"
                                                                className="w-24 h-24 object-cover rounded-full border border-gray-200 mt-2"
                                                            />
                                                        </div>

                                                        {/* Details */}
                                                        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                            <div>
                                                                <span className="font-medium">
                                                                    Name:
                                                                </span>{" "}
                                                                {
                                                                    witness.resident_name
                                                                }
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Purok:
                                                                </span>{" "}
                                                                {
                                                                    witness.purok_number
                                                                }
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Birthdate:
                                                                </span>{" "}
                                                                {
                                                                    witness.birthdate
                                                                }
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Gender:
                                                                </span>{" "}
                                                                {witness.gender}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    Contact:
                                                                </span>{" "}
                                                                {
                                                                    witness.contact_number
                                                                }
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="font-medium">
                                                                    Email:
                                                                </span>{" "}
                                                                {witness.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-6">
                                                <InputLabel value="Notes" />
                                                <Textarea
                                                    name="notes"
                                                    value={witness.notes}
                                                    onChange={(e) =>
                                                        handleResidentArrayChange(
                                                            e.target.value,
                                                            index,
                                                            "notes"
                                                        )
                                                    }
                                                    className="w-full rounded-lg border-gray-300 shadow-sm
                   focus:border-indigo-500 focus:ring focus:ring-indigo-200
                   focus:ring-opacity-50 text-sm"
                                                    rows="3"
                                                    placeholder="Notes for the Witness..."
                                                />
                                                <InputError
                                                    message={errors.notes}
                                                    className="mt-1"
                                                />
                                            </div>

                                            {data.witnesses.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeArrayItem(
                                                            "witnesses",
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-1 right-2 text-sm text-red-500 hover:text-red-800"
                                                >
                                                    <IoIosCloseCircleOutline className="text-2xl" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addArrayItem("witnesses", {
                                                resident_id: null,
                                            })
                                        }
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6"
                                    >
                                        <IoIosAddCircleOutline className="text-2xl" />
                                        <span>Add Witness</span>
                                    </button>

                                    {/* Submit Buttons */}
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
