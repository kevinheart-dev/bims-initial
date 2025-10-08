import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { toast } from "sonner";

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    residentId,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this record? This action cannot be undone.",
    buttonLabel = "I UNDERSTAND, DELETE",
}) {
    const [confirmationText, setConfirmationText] = useState("");

    const { data, setData, post, reset, setError } = useForm({
        password: "",
        id: residentId || null,
    });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(route("user.confirm"), {
                id: residentId,
                password: data.password,
            });
            if (res.data.status === "success") {
                onConfirm(); // will call router.delete(...)
                reset();
                onClose();
            }
        } catch (err) {
            toast.error("Password Incorrect", {
                description: err.message,
                duration: 3000,
                closeButton: true,
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <X size={20} />
                </button>

                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                        <svg
                            className="w-6 h-6 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zM9 4h2v6H9V4zm0 8h2v2H9v-2z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-center mb-2">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-600 text-center mb-4">
                    {message}
                </p>

                {/* Input */}
                <form onSubmit={onSubmit}>
                    <label className="block text-sm text-gray-500 mb-1">
                        Please type your{" "}
                        <span className="font-semibold">
                            "Account Password"
                        </span>{" "}
                        to confirm.
                    </label>
                    <input
                        type="password"
                        className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="Confirm Password"
                        autoComplete="off"
                    />

                    {/* Confirm Button */}
                    <button
                        type="submit"
                        className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                    >
                        {buttonLabel}
                    </button>
                </form>
            </div>
        </div>
    );
}
