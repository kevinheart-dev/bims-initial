// Components/AddOfficialForm.jsx
import { useState } from "react";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import YearDropdown from "@/Components/YearDropdown";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

const AddOfficialForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        position: "",
        purok: "",
        termStart: "",
        termEnd: "",
        phone: "",
        email: "",
        image: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, image: url });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            {/* Image and Name + Position */}
            <div className="flex gap-4 items-start">
                {/* Image Upload */}
                <div className="flex flex-col items-center">
                    <label
                        htmlFor="imageUpload"
                        className="w-32 h-32 border rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                    >
                        {formData.image ? (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm text-center px-2">
                                Click to Upload
                            </span>
                        )}
                    </label>
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    {formData.image && (
                        <p className="text-xs text-gray-500 mt-1 break-all w-32 text-center">
                            {formData.image}
                        </p>
                    )}
                </div>

                {/* Name & Position */}
                <div className="flex flex-col gap-4 flex-1">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="position">
                            Position
                        </label>
                        <select
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select barangay position
                            </option>
                            {/* Populate options here */}
                        </select>
                    </div>
                </div>
            </div>

            {/* Designated Purok */}
            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="purok">
                    Designated Purok
                </label>
                <input
                    id="purok"
                    name="purok"
                    type="text"
                    placeholder="Enter purok number or name"
                    value={formData.purok}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Term Start / Term End */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="termStart">
                        Term Start
                    </label>
                    <YearDropdown
                        id="termStart"
                        name="termStart"
                        value={formData.termStart}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="termEnd">
                        Term End
                    </label>
                    <YearDropdown
                        id="termEnd"
                        name="termEnd"
                        value={formData.termEnd}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Phone Number / Email Address */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="text"
                        placeholder="phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </form>

    );
};

export default AddOfficialForm;
