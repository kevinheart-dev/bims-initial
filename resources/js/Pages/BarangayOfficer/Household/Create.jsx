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

export default function Create({
    auth,
    puroks,
    streets,
    barangays,
    residents,
}) {
    const breadcrumbs = [
        { label: "Residents Information", showOnMobile: false },
        {
            label: "Households",
            href: route("resident.index"),
            showOnMobile: false,
        },
        { label: "Create a Household", showOnMobile: true },
    ];
    const { error } = usePage().props.errors;
    const { data, setData, post, errors } = useForm({
        resident_id: null,
        fullname: "",
        birthdate: "",
        gender: "",
        resident_image: null,
        purok_id: null,
        street_id: null,
        street_name: null,
        residency_date: null,
        residency_type: null,
        subdivision: "",
        housenumber: null,
        ownership_type: "",
        housing_condition: "",
        house_structure: null,
        year_established: null,
        number_of_rooms: null,
        number_of_floors: null,
        bath_and_wash_area: null,
        waste_management_types: [{ waste_management_type: "" }],
        toilets: [{ toilet_type: "" }],
        electricity_types: [{ electricity_types: "" }],
        water_source_types: [{ water_source_type: "" }],
        type_of_internet: null,
        relationship_to_head: "",
        household_position: "",
        name_of_head: "",
        has_livestock: null,
        livestocks: [],
        has_pets: null,
        pets: [],
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("household.store"), {
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

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

    const handleResidentChange = (e) => {
        const resident_id = Number(e.target.value);
        const resident = residents.find((r) => r.id == resident_id);
        if (resident) {
            setData("resident_id", resident.id);
            setData(
                "fullname",
                `${resident.firstname} ${resident.middlename} ${
                    resident.lastname
                } ${resident.suffix ?? ""}`
            );
            setData("gender", resident.gender);
            setData("birthdate", resident.birthdate);
            setData("residency_date", resident.residency_date);
            setData("residency_type", resident.residency_type);
            setData("resident_image", resident.resident_picture_path);
        }
    };

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
                                        Resident Information
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Search/Select the resident that owns the
                                        household.
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
                                            <input
                                                id="resident_image"
                                                type="file"
                                                name="resident_image"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        setData(
                                                            "resident_image",
                                                            file
                                                        );
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <div className="md:col-span-5 space-y-2">
                                            <div className="w-full">
                                                <DropdownInputField
                                                    label="Full Name"
                                                    name="fullname"
                                                    value={data.fullname || ""}
                                                    placeholder="Select a resident"
                                                    onChange={(e) =>
                                                        handleResidentChange(e)
                                                    }
                                                    items={residentsList}
                                                />
                                                <InputError
                                                    message={errors.resident_id}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
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
                                                        label="Gender"
                                                        name="gender"
                                                        value={
                                                            RESIDENT_GENDER_TEXT2[
                                                                data.gender ||
                                                                    ""
                                                            ]
                                                        }
                                                        placeholder="Select a resident"
                                                        readOnly={true}
                                                    />
                                                </div>
                                                <div>
                                                    <InputField
                                                        label="Residentcy Date"
                                                        name="residency_date"
                                                        value={
                                                            data.residency_date ||
                                                            ""
                                                        }
                                                        placeholder="Select a resident"
                                                        readOnly={true}
                                                    />
                                                </div>

                                                <div>
                                                    <InputField
                                                        label="Residentcy Type"
                                                        name="residency_type"
                                                        value={
                                                            RESIDENT_RECIDENCY_TYPE_TEXT[
                                                                data.residency_type ||
                                                                    ""
                                                            ]
                                                        }
                                                        placeholder="Select a resident"
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Section5
                                        data={data}
                                        setData={setData}
                                        handleArrayValues={handleArrayValues}
                                        errors={errors}
                                        puroks={puroks}
                                        streets={streets}
                                        head={true}
                                    />
                                    {/* Submit Button */}
                                    <div className="flex w-full justify-center items-center mt-7">
                                        <Button className="w-40" type="submit">
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
