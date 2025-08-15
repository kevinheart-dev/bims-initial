// Components/AddOfficialForm.jsx
import { useState } from "react";
import InputField from "@/Components/InputField";
import DropdownInputField from "@/Components/DropdownInputField";
import YearDropdown from "@/Components/YearDropdown";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SelectField from "@/Components/SelectField";
import { BARANGAY_OFFICIAL_POSITIONS_TEXT } from "@/constants";
import { router, useForm } from "@inertiajs/react";
import useResidentChangeHandler from "@/hooks/handleResidentChange";

const AddOfficialForm = ({ onSubmit, residents, puroks }) => {
    const { data, setData, post, processing, reset } = useForm({
        resident_name: "",
        position: "",
        purok_number: "",
        termStart: "",
        termEnd: "",
        contact_number: "",
        email: "",
        resident_image_path: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };
    const handleResidentChange = useResidentChangeHandler(residents, setData);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file); // store file directly for backend upload
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("barangay_official.store"));
    };

    const officialPositionsList = Object.entries(
        BARANGAY_OFFICIAL_POSITIONS_TEXT
    ).map(([key, label]) => ({
        label: label,
        value: key.toString(),
    }));

    const purok_numbers = puroks.map((purok) => ({
        label: "Purok " + purok,
        value: purok.toString(),
    }));

    const residentsList = residents.map((res) => ({
        label: `${res.firstname} ${res.middlename} ${res.lastname} ${
            res.suffix ?? ""
        }`,
        value: res.id.toString(),
    }));

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
                        {data.resident_image_path &&
                        typeof data.resident_image_path !== "string" ? (
                            <img
                                src={URL.createObjectURL(
                                    data.resident_image_path
                                )}
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
                </div>

                {/* Name & Position */}
                <div className="flex flex-col gap-4 flex-1">
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="resident_name"
                        >
                            Full Name
                        </label>
                        <DropdownInputField
                            id="resident_name"
                            name="resident_name"
                            placeholder="Enter full name"
                            value={data.resident_name || ""}
                            onChange={(e) => handleResidentChange(e)}
                            items={residentsList}
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="position"
                        >
                            Position
                        </label>
                        <SelectField
                            id="position"
                            name="position"
                            value={data.position}
                            onChange={handleChange}
                            items={officialPositionsList}
                        >
                            <option value="" disabled>
                                Select barangay position
                            </option>
                        </SelectField>
                    </div>
                </div>
            </div>

            {/* Designated Purok */}
            <div>
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="purok_number"
                >
                    Designated Purok
                </label>
                <DropdownInputField
                    id="purok_number"
                    name="purok_number"
                    placeholder="Enter purok number or name"
                    value={data.purok_number.toString()}
                    onChange={handleChange}
                    items={purok_numbers}
                />
            </div>

            {/* Term Start / Term End */}
            <div className="grid grid-cols-2 gap-4">
                <YearDropdown
                    id="termStart"
                    name="termStart"
                    value={data.termStart}
                    onChange={handleChange}
                />
                <YearDropdown
                    id="termEnd"
                    name="termEnd"
                    value={data.termEnd}
                    onChange={handleChange}
                />
            </div>

            {/* Phone Number / Email */}
            <div className="grid grid-cols-2 gap-4">
                <InputField
                    id="contact_number"
                    name="contact_number"
                    type="text"
                    placeholder="phone number"
                    value={data.contact_number || ""}
                    onChange={handleChange}
                    disabled
                />
                <InputField
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email"
                    value={data.email || ""}
                    onChange={handleChange}
                    disabled
                />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    disabled={processing}
                >
                    {processing ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};

export default AddOfficialForm;
