import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import BreadCrumbsHeader from "@/Components/BreadcrumbsHeader";
import DropdownInputField from "@/Components/DropdownInputField";
import InputField from "@/Components/InputField";
import { Switch } from "@/Components/ui/switch";
import { toast, Toaster } from "sonner";
import SelectField from "@/Components/SelectField";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";

export default function BasicInformation({ details, puroks, streets }) {
    const breadcrumbs = [{ label: "Basic Information", showOnMobile: true }];
    const props = usePage().props;
    const success = props?.success ?? null;
    const error = props?.error ?? null;

    const { data, setData, post, errors, processing } = useForm({
        resident_id: details.id || null,
        firstname: details.firstname || "",
        middlename: details.middlename || "",
        lastname: details.lastname || "",
        maiden_name: details.maiden_name || "",
        suffix: details.suffix || "",
        birthdate: details.birthdate || "",
        birthplace: details.birthplace || "",
        sex: details.sex || "",
        civil_status: details.civil_status || "",
        registered_voter: !!details.registered_voter,
        contact_number: details.contact_number || "",
        email: details.email || "",
        citizenship: details.citizenship || "",
        religion: details.religion || "",
        residency_type: details.residency_type || "",
        residency_date: details.residency_date || "",
        purok_number: details.purok_number?.toString() || "",
        street_id: details.street_id?.toString() || "",
        street_name: details.street?.street_name || "",
        ethnicity: details.ethnicity || "",
        resident_id: details.id,
        _method: "PUT",
    });

    const existingImagePath = details?.resident_picture_path
        ? "/storage/" + details.resident_picture_path
        : null;

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const streetList = streets.map((street) => ({
        label: street.street_name,
        value: street.id.toString(),
    }));

    const submit = (e) => {
        e.preventDefault();
        post(route("resident_account.update.info", data.resident_id), {
            onError: (error) => {
                console.log(error);
            },
        });
    };

    const handleStreetChange = (e) => {
        const street_id = Number(e.target.value);
        const street = streets.find((s) => s.id == street_id);
        if (street) {
            setData("street_id", street.id);
            setData("street_name", street?.street_name || "");

            setData("purok_id", street.purok.id);
            setData("purok_number", street.purok.purok_number);
        }
    };

    useEffect(() => {
        if (success) {
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
            <Head title="Resident Basic Information" />
            <BreadCrumbsHeader breadcrumbs={breadcrumbs} />
            <div className="p-2 md:p-4">
                <div className="mx-auto max-w-8xl px-2 sm:px-4 lg:px-6">
                    {/* <pre>{JSON.stringify(streets, undefined, 3)}</pre> */}
                    <form onSubmit={submit} className="space-y-10">
                        <div className="max-w-7xl mx-auto space-y-12">
                            {/* Personal Information Card */}
                            <div className="bg-white border rounded-2xl shadow-sm p-8 space-y-8">
                                <div className="space-y-1 border-b pb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Personal Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Provide accurate resident information
                                        for barangay records.
                                    </p>
                                </div>

                                {/* ✅ Profile Photo Section */}
                                <div className="w-full flex justify-center">
                                    <div className="md:row-span-2 flex flex-col items-center space-y-3">
                                        <InputLabel
                                            htmlFor="resident_image"
                                            value="Profile Photo"
                                        />
                                        <img
                                            src={
                                                data.resident_image instanceof
                                                File
                                                    ? URL.createObjectURL(
                                                          data.resident_image
                                                      )
                                                    : existingImagePath ||
                                                      "/images/default-avatar.jpg"
                                            }
                                            alt="Resident Image"
                                            className="w-32 h-32 object-cover rounded-full border border-gray-200 shadow-sm"
                                        />
                                        <input
                                            id="resident_image"
                                            type="file"
                                            name="resident_image"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file)
                                                    setData(
                                                        "resident_image",
                                                        file
                                                    );
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <InputError
                                            message={errors.resident_image}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-1">
                                            Upload a clear profile photo (JPEG,
                                            PNG). Max size 5MB.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <InputField
                                            label="First Name"
                                            value={data.firstname}
                                            onChange={(e) =>
                                                setData(
                                                    "firstname",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.firstname}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Resident's legal first name
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Middle Name"
                                            value={data.middlename}
                                            onChange={(e) =>
                                                setData(
                                                    "middlename",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.middlename}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Leave blank if none
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Last Name"
                                            value={data.lastname}
                                            onChange={(e) =>
                                                setData(
                                                    "lastname",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={errors.lastname} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Resident's family name
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Maiden Name"
                                            value={data.maiden_name}
                                            onChange={(e) =>
                                                setData(
                                                    "maiden_name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.maiden_name}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            For married women only
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Suffix"
                                            value={data.suffix}
                                            onChange={(e) =>
                                                setData(
                                                    "suffix",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={errors.suffix} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            e.g. Jr., Sr., III
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            type="date"
                                            label="Birthdate"
                                            value={data.birthdate}
                                            onChange={(e) =>
                                                setData(
                                                    "birthdate",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.birthdate}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select date of birth
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Birthplace"
                                            value={data.birthplace}
                                            onChange={(e) =>
                                                setData(
                                                    "birthplace",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.birthplace}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            City / Province
                                        </p>
                                    </div>

                                    <div>
                                        <DropdownInputField
                                            label="Sex"
                                            value={data.sex}
                                            options={[
                                                {
                                                    value: "male",
                                                    label: "Male",
                                                },
                                                {
                                                    value: "female",
                                                    label: "Female",
                                                },
                                            ]}
                                            onChange={(v) => setData("sex", v)}
                                        />
                                        <InputError message={errors.sex} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Biological sex
                                        </p>
                                    </div>

                                    <div>
                                        <DropdownInputField
                                            label="Civil Status"
                                            value={data.civil_status}
                                            options={[
                                                {
                                                    value: "single",
                                                    label: "Single",
                                                },
                                                {
                                                    value: "married",
                                                    label: "Married",
                                                },
                                                {
                                                    value: "widowed",
                                                    label: "Widowed",
                                                },
                                                {
                                                    value: "annulled",
                                                    label: "Annulled",
                                                },
                                            ]}
                                            onChange={(v) =>
                                                setData("civil_status", v)
                                            }
                                        />
                                        <InputError
                                            message={errors.civil_status}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Current marital status
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Contact Number"
                                            value={data.contact_number}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.contact_number}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Format: 09xxxxxxxxx
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.email} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Citizenship"
                                            value={data.citizenship}
                                            onChange={(e) =>
                                                setData(
                                                    "citizenship",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.citizenship}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            e.g. Filipino
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Religion"
                                            value={data.religion}
                                            onChange={(e) =>
                                                setData(
                                                    "religion",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError message={errors.religion} />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            label="Ethnicity"
                                            value={data.ethnicity}
                                            onChange={(e) =>
                                                setData(
                                                    "ethnicity",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.ethnicity}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Optional
                                        </p>
                                    </div>

                                    <div>
                                        <DropdownInputField
                                            label="Residency Type"
                                            value={data.residency_type}
                                            options={[
                                                {
                                                    value: "permanent",
                                                    label: "Permanent",
                                                },
                                                {
                                                    value: "temporary",
                                                    label: "Temporary",
                                                },
                                            ]}
                                            onChange={(v) =>
                                                setData("residency_type", v)
                                            }
                                        />
                                        <InputError
                                            message={errors.residency_type}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Permanent = living indefinitely
                                        </p>
                                    </div>

                                    <div>
                                        <InputField
                                            type="number"
                                            label="Residency Year"
                                            value={data.residency_date || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "residency_date",
                                                    e.target.value
                                                )
                                            }
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                        <InputError
                                            message={errors.residency_date}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Year resident moved in (e.g., 1970)
                                        </p>
                                    </div>

                                    <div>
                                        <SelectField
                                            label="Purok Number"
                                            name="purok_number"
                                            value={data.purok_number || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "purok_number",
                                                    e.target.value
                                                )
                                            }
                                            items={purok_numbers}
                                        />
                                        <InputError
                                            message={errors.purok_number}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select the purok
                                        </p>
                                    </div>
                                    <div>
                                        <DropdownInputField
                                            label="Street Name"
                                            name="street_id"
                                            type="text"
                                            value={data.street_name}
                                            onChange={(e) =>
                                                handleStreetChange(e)
                                            }
                                            placeholder="e.g., Rizal St., Mabini Avenue"
                                            items={streetList}
                                        />
                                        <InputError
                                            message={errors.street_id}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Resident's street
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button disabled={processing} className="px-6">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
