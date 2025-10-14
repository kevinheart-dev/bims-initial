import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";

export default function BarangayProfileForm({
    className = "",
    data,
    setData,
    errors,
    submit,
    processing,
    recentlySuccessful,
}) {
    return (
        <section
            className={`${className} px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen`}
        >
            {/* Header */}
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Barangay Profile
                </h1>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                    Update your barangay's profile information, contact details,
                    and logo.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="space-y-8 w-full max-w-6xl mx-auto"
            >
                <div className="flex flex-col gap-8">
                    {/* General Info Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6 w-full">
                        <h3 className="text-xl font-semibold text-gray-800">
                            General Information
                        </h3>
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex flex-col items-center space-y-3 bg-white p-4 rounded-xl shadow-sm md:w-1/4">
                                <InputLabel
                                    htmlFor="logo_path"
                                    value="Barangay Logo"
                                />

                                <img
                                    src={
                                        data.logo_path instanceof File
                                            ? URL.createObjectURL(
                                                  data.logo_path
                                              )
                                            : data.logo_path
                                            ? `/storage/${data.logo_path}`
                                            : "/images/default-avatar.jpg"
                                    }
                                    alt="Barangay Logo"
                                    className="w-32 h-32 object-cover rounded-full border border-gray-200"
                                />

                                <input
                                    type="file"
                                    id="logo_path"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) setData("logo_path", file);
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />

                                {errors.logo_path && (
                                    <p className="text-red-500 text-xs">
                                        {errors.logo_path}
                                    </p>
                                )}

                                <p className="text-sm text-gray-500 text-center">
                                    Upload the barangay logo. Preview updates
                                    automatically.
                                </p>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:flex-1">
                                <div>
                                    <InputLabel
                                        htmlFor="barangay_name"
                                        value="Barangay Name"
                                    />
                                    <TextInput
                                        id="barangay_name"
                                        className="mt-1 block w-full"
                                        value={data.barangay_name || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_name",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Official name of the barangay.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_name}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="barangay_type"
                                        value="Barangay Type"
                                    />
                                    <select
                                        id="barangay_type"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        value={data.barangay_type || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_type",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="urban">Urban</option>
                                        <option value="rural">Rural</option>
                                    </select>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Classify as urban or rural.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_type}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="founded_year"
                                        value="Founded Year"
                                    />
                                    <TextInput
                                        id="founded_year"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.founded_year || ""}
                                        onChange={(e) =>
                                            setData(
                                                "founded_year",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Year the barangay was officially
                                        established.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.founded_year}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="area_sq_km"
                                        value="Area (sq. km)"
                                    />
                                    <TextInput
                                        id="area_sq_km"
                                        type="number"
                                        step="0.01"
                                        className="mt-1 block w-full"
                                        value={data.area_sq_km || ""}
                                        onChange={(e) =>
                                            setData(
                                                "area_sq_km",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Total land area of the barangay.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.area_sq_km}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="barangay_code"
                                        value="Barangay Code"
                                    />
                                    <TextInput
                                        id="barangay_code"
                                        className="mt-1 block w-full"
                                        value={data.barangay_code || ""}
                                        onChange={(e) =>
                                            setData(
                                                "barangay_code",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Optional internal code.
                                    </p>
                                    <InputError
                                        className="mt-2"
                                        message={errors.barangay_code}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6 w-full">
                        <h3 className="text-xl font-semibold text-gray-800">
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="city" value="City" />
                                <TextInput
                                    id="city"
                                    className="mt-1 block w-full"
                                    value={data.city || ""}
                                    onChange={(e) =>
                                        setData("city", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    City where the barangay is located.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.city}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="province"
                                    value="Province"
                                />
                                <TextInput
                                    id="province"
                                    className="mt-1 block w-full"
                                    value={data.province || ""}
                                    onChange={(e) =>
                                        setData("province", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Province of the barangay.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.province}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="zip_code"
                                    value="ZIP Code"
                                />
                                <TextInput
                                    id="zip_code"
                                    className="mt-1 block w-full"
                                    value={data.zip_code || ""}
                                    onChange={(e) =>
                                        setData("zip_code", e.target.value)
                                    }
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Postal code.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.zip_code}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="contact_number"
                                    value="Contact Number"
                                />
                                <TextInput
                                    id="contact_number"
                                    className="mt-1 block w-full"
                                    value={data.contact_number || ""}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value
                                        )
                                    }
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Phone or contact number for the barangay
                                    office.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.contact_number}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email || ""}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Official email address.
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="bg-blue-700 hover:bg-blue-600"
                    >
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
