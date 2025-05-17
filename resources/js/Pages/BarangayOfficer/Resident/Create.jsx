import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";

export default function Index() {
    const [formData, setFormData] = useState({
        lastame: "",
        firstname: "",
        middlename: "",
        suffix: "",
        birthplace: "",
        birthdate: "",
        civil_status: "",
        gender: "",
        religion: "",
        nationality: "",
        ethnicity: "",

        contactNumber: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit logic here (e.g. router.post)
        console.log("Form Submitted", formData);
    };

    return (
        <AdminLayout>
            <Head title="Resident Dashboard" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                {/* personal information */}
                <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-7">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">Personal Information</h2>
                    <p className="text-sm text-gray-600 mb-6">Please complete your personal information.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Dela Cruz"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Juan"
                                    required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Santos"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                                <input
                                    list="suffix-options"
                                    type="text"
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Jr., Sr., II"
                                />

                                <datalist id="suffix-options">
                                    <option value="Jr." />
                                    <option value="Sr." />
                                    <option value="I" />
                                    <option value="II" />
                                    <option value="III" />
                                    <option value="IV" />
                                    <option value="V" />
                                </datalist>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-4 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                <input
                                    type="text"
                                    name="birthplace"
                                    value={formData.birthplace}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Municipality/City"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                                <select
                                    name="civil_status"
                                    value={formData.civil_status}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Seperated">Seperated</option>
                                    <option value="Annulled">Annulled</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-medium text-gray-700 mb-1">Gender</legend>
                                <div className="flex gap-4 mt-2">
                                    {["Male", "Female", "LGBTQA+"].map(option => (
                                        <label key={option} className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={option}
                                                checked={formData.gender === option}
                                                onChange={handleChange}
                                                className="form-radio text-indigo-600"
                                                required
                                            />
                                            <span className="text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {formData.gender === "Female" &&
                                ["Married", "Widowed", "Separated"].includes(formData.civil_status) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Maiden Middle Name</label>
                                        <input
                                            type="text"
                                            name="maiden_middle_name"
                                            value={formData.maiden_middle_name}
                                            onChange={handleChange}
                                            className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter Maiden Middle Name"
                                        />
                                    </div>
                                )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship</label>
                                <input
                                    list="citizenship-options"
                                    type="text"
                                    name="citizenship"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="citizenship-options">
                                    <option value="Filipino" />
                                    <option value="American" />
                                    <option value="Chinese" />
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                <input
                                    list="religion-options"
                                    type="text"
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="religion-options">
                                    <option value="Roman Catholic" />
                                    <option value="Iglesia ni Cristo" />
                                    <option value="Born Again" />
                                    <option value="Islam" />
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                                <input
                                    list="ethnicity-options"
                                    type="text"
                                    name="ethnicity"
                                    value={formData.ethnicity}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="ethnicity-options">
                                    <option value="Tagalog" />
                                    <option value="Ilocano" />
                                    <option value="Indigenous People" />
                                </datalist>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="09123456789"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="juan@example.com"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* ADDRESS */}
                <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">Address</h2>
                    <p className="text-sm text-gray-600 mb-6">Please complete your address.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">House/Unit No./Lot/Blk No.</label>
                                <input
                                    type="text"
                                    name="housenumber"
                                    value={formData.housenumber}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Lot 12 Blk 7 or Unit 3A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Name</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Rizal St., Mabini Avenue"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Purok/Zone/Sitio/Cabisera</label>
                                <input
                                    type="text"
                                    name="purok"
                                    value={formData.purok}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Purok 5, Sitio Lupa"
                                />
                            </div>

                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subdivision/Village/Compound</label>
                                <input
                                    type="text"
                                    name="subdivision"
                                    value={formData.subdivision}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Villa Gloria Subdivision"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay Name</label>
                                <input
                                    type="text"
                                    name="barangay"
                                    value={formData.barangay}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., San Felipe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., City of Ilagan"
                                />
                            </div>

                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                <input
                                    type="text"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., Isabella"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                                <input
                                    type="text"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Region II"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g., 3300"
                                />
                            </div>

                        </div>
                    </form>
                </div>

                {/* education and occuaption */}
                <div className="overflow-hidden bg-white border border-gray-200 shadow-md rounded-xl p-6 mb-7">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-1">Education and Occupation</h2>
                    <p className="text-sm text-gray-600 mb-6">Please complete your personal information.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Dela Cruz"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Juan"
                                    required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Santos"
                                    required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix</label>
                                <input
                                    list="suffix-options"
                                    type="text"
                                    name="suffix"
                                    value={formData.suffix}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Jr., Sr., II"
                                />

                                <datalist id="suffix-options">
                                    <option value="Jr." />
                                    <option value="Sr." />
                                    <option value="I" />
                                    <option value="II" />
                                    <option value="III" />
                                    <option value="IV" />
                                    <option value="V" />
                                </datalist>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-4 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Place</label>
                                <input
                                    type="text"
                                    name="birthplace"
                                    value={formData.birthplace}
                                    onChange={handleChange}
                                    className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Municipality/City"
                                    required
                                />
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                                <select
                                    name="civil_status"
                                    value={formData.civil_status}
                                    onChange={handleChange}
                                    className="w-full border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Widowed">Widowed</option>
                                    <option value="Seperated">Seperated</option>
                                    <option value="Annulled">Annulled</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </div>

                            <fieldset>
                                <legend className="text-sm font-medium text-gray-700 mb-1">Gender</legend>
                                <div className="flex gap-4 mt-2">
                                    {["Male", "Female", "LGBTQA+"].map(option => (
                                        <label key={option} className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={option}
                                                checked={formData.gender === option}
                                                onChange={handleChange}
                                                className="form-radio text-indigo-600"
                                                required
                                            />
                                            <span className="text-sm text-gray-700">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {formData.gender === "Female" &&
                                ["Married", "Widowed", "Separated"].includes(formData.civil_status) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Maiden Middle Name</label>
                                        <input
                                            type="text"
                                            name="maiden_middle_name"
                                            value={formData.maiden_middle_name}
                                            onChange={handleChange}
                                            className="w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Enter Maiden Middle Name"
                                        />
                                    </div>
                                )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship</label>
                                <input
                                    list="citizenship-options"
                                    type="text"
                                    name="citizenship"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="citizenship-options">
                                    <option value="Filipino" />
                                    <option value="American" />
                                    <option value="Chinese" />
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                <input
                                    list="religion-options"
                                    type="text"
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="religion-options">
                                    <option value="Roman Catholic" />
                                    <option value="Iglesia ni Cristo" />
                                    <option value="Born Again" />
                                    <option value="Islam" />
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                                <input
                                    list="ethnicity-options"
                                    type="text"
                                    name="ethnicity"
                                    value={formData.ethnicity}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Select or input"
                                    required
                                />

                                <datalist id="ethnicity-options">
                                    <option value="Tagalog" />
                                    <option value="Ilocano" />
                                    <option value="Indigenous People" />
                                </datalist>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="09123456789"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="juan@example.com"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
