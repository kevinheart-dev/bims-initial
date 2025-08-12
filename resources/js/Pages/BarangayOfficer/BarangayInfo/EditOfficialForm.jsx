// Components/EditOfficialForm.jsx
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";

const EditOfficialForm = ({ initialData, onSuccess }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: "",
        position: "",
        purok: "",
        termStart: "",
        termEnd: "",
        phone: "",
        email: "",
        image: null, // could be string or File object
        _method: "PUT",
    });

    useEffect(() => {
        if (initialData) {
            setData({
                name: initialData.name || "",
                position: initialData.position || "",
                purok: initialData.purok || "",
                termStart: initialData.termStart || "",
                termEnd: initialData.termEnd || "",
                phone: initialData.phone || "",
                email: initialData.email || "",
                image: initialData.image || null,
                _method: "PUT",
            });
        }
    }, [initialData, setData]);

    // Handle regular input changes
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    // Handle image file upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Assuming you have official id inside initialData or elsewhere
        const officialId = initialData?.id;
        if (!officialId) {
            console.error("No official ID provided");
            return;
        }

        // Use FormData for file upload
        const formData = new FormData();
        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined) {
                if (key === "image" && data.image instanceof File) {
                    formData.append("image", data.image);
                } else {
                    formData.append(key, data[key]);
                }
            }
        }
        formData.append("_method", "PUT");

        put(route("officials.update", officialId), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                if (onSuccess) onSuccess();
            },
            onError: (err) => {
                console.error("Validation errors:", err);
            },
        });
    };

    // For image preview
    const previewUrl =
        data.image instanceof File ? URL.createObjectURL(data.image) : data.image;

    return (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
            {/* Image and Name + Position */}
            <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                    <label
                        htmlFor="imageUpload"
                        className="w-32 h-32 border rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
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
                    {data.image && !previewUrl && (
                        <p className="text-xs text-gray-500 mt-1 break-all w-32 text-center">
                            {typeof data.image === "string" ? data.image : data.image.name}
                        </p>
                    )}
                    {errors.image && (
                        <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                    )}
                </div>

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
                            value={data.name}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="position">
                            Position
                        </label>
                        <select
                            id="position"
                            name="position"
                            value={data.position}
                            onChange={handleChange}
                            className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select barangay position
                            </option>
                            {/* TODO: Replace below with actual position options */}
                            <option value="Chairman">Chairman</option>
                            <option value="Secretary">Secretary</option>
                            <option value="Treasurer">Treasurer</option>
                        </select>
                        {errors.position && (
                            <p className="text-red-600 text-sm mt-1">{errors.position}</p>
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1" htmlFor="purok">
                    Designated Purok
                </label>
                <input
                    id="purok"
                    name="purok"
                    type="text"
                    placeholder="Enter purok number or name"
                    value={data.purok}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.purok && (
                    <p className="text-red-600 text-sm mt-1">{errors.purok}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="termStart">
                        Term Start
                    </label>
                    <input
                        id="termStart"
                        name="termStart"
                        type="text"
                        placeholder="Year"
                        value={data.termStart}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.termStart && (
                        <p className="text-red-600 text-sm mt-1">{errors.termStart}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="termEnd">
                        Term End
                    </label>
                    <input
                        id="termEnd"
                        name="termEnd"
                        type="text"
                        placeholder="Year"
                        value={data.termEnd}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.termEnd && (
                        <p className="text-red-600 text-sm mt-1">{errors.termEnd}</p>
                    )}
                </div>
            </div>

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
                        value={data.phone}
                        onChange={handleChange}
                        disabled
                        className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
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
                        value={data.email}
                        onChange={handleChange}
                        disabled
                        className="w-full rounded border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Update
                </button>
            </div>
        </form>
    );
};

export default EditOfficialForm;
