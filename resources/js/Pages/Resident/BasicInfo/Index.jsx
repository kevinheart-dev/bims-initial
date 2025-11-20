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

    const FormItem = ({ label, value, onChange, error, helper, ...rest }) => (
        <div>
            <InputField
                label={label}
                value={value}
                onChange={onChange}
                {...rest}
            />
            <InputError message={error} />
            <p className="text-xs text-gray-500 mt-1">{helper}</p>
        </div>
    );

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
            <div className="p-3 md:p-6 bg-gray-50 min-h-screen">
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
                    <form onSubmit={submit} className="space-y-12">
                        {/* CARD: Personal Information */}
                        <div className="bg-white border rounded-2xl shadow-md p-6 md:p-10 space-y-10">
                            {/* Header */}
                            <div className="space-y-2 border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                                    Personal Information
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Kindly provide accurate and updated
                                    information for barangay documentation.
                                </p>
                            </div>

                            {/* Avatar Upload */}
                            <div className="flex justify-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
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
                                            className="w-32 h-32 object-cover rounded-full border shadow-sm ring-2 ring-gray-100"
                                        />
                                        <label
                                            htmlFor="resident_image"
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition"
                                        >
                                            Upload
                                        </label>
                                    </div>

                                    <input
                                        id="resident_image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file)
                                                setData("resident_image", file);
                                        }}
                                        className="hidden"
                                    />

                                    <InputError
                                        message={errors.resident_image}
                                    />
                                    <p className="text-xs text-gray-500 text-center max-w-xs">
                                        Preferred formats: JPG/PNG • Maximum
                                        size: 5MB
                                    </p>
                                </div>
                            </div>

                            {/* Inputs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* First Name */}
                                <FormItem
                                    label="First Name"
                                    value={data.firstname}
                                    error={errors.firstname}
                                    helper="Resident's legal first name"
                                    onChange={(e) =>
                                        setData("firstname", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Middle Name"
                                    value={data.middlename}
                                    error={errors.middlename}
                                    helper="Leave blank if none"
                                    onChange={(e) =>
                                        setData("middlename", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Last Name"
                                    value={data.lastname}
                                    error={errors.lastname}
                                    helper="Resident's family name"
                                    onChange={(e) =>
                                        setData("lastname", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Maiden Name"
                                    value={data.maiden_name}
                                    error={errors.maiden_name}
                                    helper="For married women only"
                                    onChange={(e) =>
                                        setData("maiden_name", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Suffix"
                                    value={data.suffix}
                                    error={errors.suffix}
                                    helper="Ex: Jr., Sr., III"
                                    onChange={(e) =>
                                        setData("suffix", e.target.value)
                                    }
                                />

                                <FormItem
                                    type="date"
                                    label="Birthdate"
                                    value={data.birthdate}
                                    error={errors.birthdate}
                                    helper="Select date of birth"
                                    onChange={(e) =>
                                        setData("birthdate", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Birthplace"
                                    value={data.birthplace}
                                    error={errors.birthplace}
                                    helper="City / Province"
                                    onChange={(e) =>
                                        setData("birthplace", e.target.value)
                                    }
                                />

                                {/* Sex */}
                                <DropdownInputField
                                    label="Sex"
                                    value={data.sex}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                    ]}
                                    onChange={(v) => setData("sex", v)}
                                />
                                <InputError message={errors.sex} />

                                {/* Civil Status */}
                                <DropdownInputField
                                    label="Civil Status"
                                    value={data.civil_status}
                                    options={[
                                        { value: "single", label: "Single" },
                                        { value: "married", label: "Married" },
                                        { value: "widowed", label: "Widowed" },
                                        {
                                            value: "annulled",
                                            label: "Annulled",
                                        },
                                    ]}
                                    onChange={(v) => setData("civil_status", v)}
                                />
                                <InputError message={errors.civil_status} />

                                <FormItem
                                    label="Contact Number"
                                    value={data.contact_number}
                                    error={errors.contact_number}
                                    helper="Format: 09xxxxxxxxx"
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value
                                        )
                                    }
                                />

                                <FormItem
                                    label="Email"
                                    value={data.email}
                                    error={errors.email}
                                    helper="Optional"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Citizenship"
                                    value={data.citizenship}
                                    error={errors.citizenship}
                                    helper="Ex: Filipino"
                                    onChange={(e) =>
                                        setData("citizenship", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Religion"
                                    value={data.religion}
                                    error={errors.religion}
                                    helper="Optional"
                                    onChange={(e) =>
                                        setData("religion", e.target.value)
                                    }
                                />

                                <FormItem
                                    label="Ethnicity"
                                    value={data.ethnicity}
                                    error={errors.ethnicity}
                                    helper="Optional"
                                    onChange={(e) =>
                                        setData("ethnicity", e.target.value)
                                    }
                                />

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
                                <InputError message={errors.residency_type} />

                                <FormItem
                                    type="number"
                                    label="Residency Year"
                                    value={data.residency_date || ""}
                                    error={errors.residency_date}
                                    helper="Year resident moved in (ex: 1970)"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    onChange={(e) =>
                                        setData(
                                            "residency_date",
                                            e.target.value
                                        )
                                    }
                                />

                                <SelectField
                                    label="Purok Number"
                                    name="purok_number"
                                    value={data.purok_number || ""}
                                    onChange={(e) =>
                                        setData("purok_number", e.target.value)
                                    }
                                    items={purok_numbers}
                                />
                                <InputError message={errors.purok_number} />

                                <DropdownInputField
                                    label="Street Name"
                                    name="street_id"
                                    value={data.street_name}
                                    placeholder="Ex: Rizal St., Mabini Avenue"
                                    items={streetList}
                                    onChange={(e) => handleStreetChange(e)}
                                />
                                <InputError message={errors.street_id} />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end">
                            <Button
                                disabled={processing}
                                className="px-6 py-3 text-base"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
